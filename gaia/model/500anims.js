// anims.js
import { muscles } from './muscles.js';
import { fullSkeletonNodes } from './bones.js';

// Force-Directed Graph Class
class Graph {
    constructor() {
        this.nodes = {};
        this.edges = [];
        this.groundContactPoints = ['left_ankle', 'right_ankle'];
        this.initializeGraph();
    }

    initializeGraph() {
        // Initialize nodes from fullSkeletonNodes
        for (const [boneName, data] of Object.entries(fullSkeletonNodes)) {
            this.nodes[boneName] = {
                position: [...data.pos],
                rotation: new THREE.Quaternion(0, 0, 0, 1),
                mass: 1,
                velocity: [0, 0, 0],
                forces: [0, 0, 0]
            };
        }

        // Initialize edges from muscles
        muscles.forEach(muscle => {
            this.edges.push({
                source: muscle.origin,
                target: muscle.insertion,
                attachPoints: muscle.attachPoints,
                forceAmplitude: 0,
                maxForce: 1 * (muscle.geomRelaxed.length - muscle.geomContracted.length),
                energyPerContraction: muscle.energyPerContraction
            });
        });
    }

    applyForces(dt) {
        // Reset forces
        for (const node of Object.values(this.nodes)) {
            node.forces = [0, 0, -9.81]; // Gravity (m/s²)
        }

        // Apply muscle forces
        let totalEnergy = 0;
        this.edges.forEach(edge => {
            const sourceNode = this.nodes[edge.source];
            const targetNode = this.nodes[edge.target];
            if (!sourceNode || !targetNode) return;

            const force = edge.forceAmplitude * edge.maxForce;
            const dx = edge.attachPoints[1][0] - edge.attachPoints[0][0];
            const dy = edge.attachPoints[1][1] - edge.attachPoints[0][1];
            const dz = edge.attachPoints[1][2] - edge.attachPoints[0][2];
            const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (length === 0) return;
            const forceVector = [
                (force * dx) / length,
                (force * dy) / length,
                (force * dz) / length
            ];

            // Apply force to source (negative) and target (positive)
            sourceNode.forces[0] -= forceVector[0];
            sourceNode.forces[1] -= forceVector[1];
            sourceNode.forces[2] -= forceVector[2];
            targetNode.forces[0] += forceVector[0];
            targetNode.forces[1] += forceVector[1];
            targetNode.forces[2] += forceVector[2];

            // Accumulate energy
            totalEnergy += edge.forceAmplitude * edge.energyPerContraction;
        });

        // Counter gravity at ground contact points
        this.groundContactPoints.forEach(point => {
            const node = this.nodes[point];
            if (!node) return;

            // If the node is near the ground (z ≈ 0), apply an upward force to counter gravity
            if (node.position[2] <= 0.1) {
                const upwardForce = 9.81 * node.mass; // Counteract gravity
                node.forces[2] += upwardForce;
                totalEnergy += upwardForce * dt; // Energy to maintain balance
            }
        });

        // Update positions using Verlet integration
        for (const node of Object.values(this.nodes)) {
            const accel = node.forces.map(f => f / node.mass);
            const newPos = node.position.map((pos, i) => {
                const vel = node.velocity[i] + accel[i] * dt;
                return pos + vel * dt + 0.5 * accel[i] * dt * dt;
            });

            // Prevent sinking below ground (z = 0)
            if (this.groundContactPoints.includes(node.name) && newPos[2] < 0) {
                newPos[2] = 0;
                node.velocity[2] = 0; // Stop downward movement
            }

            node.velocity = node.velocity.map((v, i) => v + accel[i] * dt * 0.98); // Damping
            node.position = newPos;
        };

        return totalEnergy;
    }
}

// Sinusoidal Wave Generator
function fap(t, freqRange = [2, 7], currFreq = 4) {
    return Math.sin(2 * Math.PI * currFreq * t); // -1 to 1
}

// Compute Action Patterns
function computeActionPatterns(hap, duration, fps = 30) {
    const frameCount = Math.floor(duration * fps);
    const dt = 1 / fps;
    const times = Array.from({ length: frameCount }, (_, i) => i * dt);
    const setIndex = 0;

    // Define muscle sets
    const muscleSets = {
        walk: [
            ["left_quad_upper", "left_quad_lower", "left_hamstring", "left_calf", "left_hip_adductor_1"],
            ["right_quad_upper", "right_quad_lower", "right_hamstring", "right_calf", "right_hip_adductor_1"]
        ],
        idle: [
            ["left_rectus_abdominis_upper", "right_rectus_abdominis_upper", "left_erector_spinae_1", "right_erector_spinae_1"],
            ["left_gluteus_maximus", "right_gluteus_maximus", "left_hip_adductor_1", "right_hip_adductor_1"]
        ]
    };

    const actionPatterns = [];
    for (let frame = 0; frame < frameCount; frame++) {
        const t = frame * dt;
        const pattern = {};

        // Compute muscle force amplitudes with smooth transitions
        muscleSets[hap].forEach((muscleSet, setIndex) => {
            const offset = setIndex * 0.5; // Phase offset for alternating legs
            let amplitude = fap(t, [2, 7], 4);

            // Adjust amplitude for balance
            if (hap === 'idle') {
                // Constant contraction to maintain stance
                amplitude = Math.max(0.3, Math.abs(amplitude)); // Minimum contraction for stability
            } else if (hap === 'walk') {
                // Cyclic contraction with forward velocity
                amplitude = 0.5 + 0.5 * Math.sin(2 * Math.PI * (t / duration + offset));
                // Add forward velocity component
                const forwardForce = setIndex === 0 ? 2 : -2; // Left leg forward, right leg back
                pattern['forwardVelocity'] = forwardForce * amplitude;
            }

            muscleSet.forEach(muscleName => {
                pattern[muscleName] = amplitude;
            });
        });

        actionPatterns.push(pattern);
    }

    return actionPatterns;
}

// Mock Database for Action Patterns
const actionPatternDB = {
    walk: { patterns: [], totalEnergy: 0 },
    idle: { patterns: [], totalEnergy: 0 }
};

// Simulate Animation and Generate Keyframe Tracks
function simulateAnimation(hap, duration, fps = 30) {
    const graph = new Graph();
    const frameCount = Math.floor(duration * fps);
    const dt = 1 / fps;
    const times = Array.from({ length: frameCount }, (_, i) => i * dt);

    // Compute action patterns
    const actionPatterns = computeActionPatterns(hap, duration, fps);
    let totalEnergy = 0;

    // Simulate physics and collect data
    const bonePositions = {};
    const boneRotations = {};

    // Initialize storage for each bone
    for (const boneName of Object.keys(graph.nodes)) {
        bonePositions[boneName] = { x: [], y: [], z: [] };
        boneRotations[boneName] = { x: [], y: [], z: [], w: [] };
        graph.nodes[boneName].name = boneName; // For ground contact checks
    }

    // Simulate over time
    for (let frame = 0; frame < frameCount; frame++) {
        const pattern = actionPatterns[frame];

        // Apply muscle force amplitudes
        graph.edges.forEach(edge => {
            const muscle = muscles.find(m => m.origin === edge.source && m.insertion === edge.target);
            if (!muscle) return;
            edge.forceAmplitude = pattern[muscle.name] || 0;
        });

        // Add forward velocity for walk
        if (hap === 'walk' && pattern.forwardVelocity) {
            const forwardForce = pattern.forwardVelocity;
            ['left_ankle', 'right_ankle'].forEach(ankle => {
                const node = graph.nodes[ankle];
                if (node) node.forces[0] += forwardForce; // Forward direction (x-axis)
            });
        }

        // Apply forces and update graph
        const frameEnergy = graph.applyForces(dt);
        totalEnergy += frameEnergy;

        // Store bone positions and rotations
        for (const boneName in graph.nodes) {
            const node = graph.nodes[boneName];
            bonePositions[boneName].x.push(node.position[0]);
            bonePositions[boneName].y.push(node.position[1]);
            bonePositions[boneName].z.push(node.position[2]);
            boneRotations[boneName].x.push(node.rotation.x);
            boneRotations[boneName].y.push(node.rotation.y);
            boneRotations[boneName].z.push(node.rotation.z);
            boneRotations[boneName].w.push(node.rotation.w);
        }
    }

    // Store action patterns and energy in the mock DB
    actionPatternDB[hap] = { patterns: actionPatterns, totalEnergy };

    // Generate keyframe tracks
    const tracks = [];
    for (const boneName in graph.nodes) {
        // Ensure bone names match GLTF model (prefix adjustment if needed)
        const trackName = boneName; // Adjust if GLTF uses a different naming convention
        const posTrack = new THREE.VectorKeyframeTrack(
            `${trackName}.position`,
            times,
            [].concat(
                bonePositions[boneName].x,
                bonePositions[boneName].y,
                bonePositions[boneName].z
            )
        );
        const rotTrack = new THREE.QuaternionKeyframeTrack(
            `${trackName}.quaternion`,
            times,
            [].concat(
                boneRotations[boneName].x,
                boneRotations[boneName].y,
                boneRotations[boneName].z,
                boneRotations[boneName].w
            )
        );
        tracks.push(posTrack, rotTrack);
    }

    return new THREE.AnimationClip(hap, duration, tracks);
}

// Create Animations Function
function createAnimations(boneMap, muscles) {
    const animations = [];

    // Idle Animation (3 seconds)
    const idleClip = simulateAnimation('idle', 3);
    animations.push(idleClip);

    // Walk Animation (2 seconds)
    const walkClip = simulateAnimation('walk', 2);
    animations.push(walkClip);

    // Log action patterns for debugging
    console.log('Action Patterns:', actionPatternDB);

    return animations;
}

export { createAnimations };