// anims.js
import { muscles } from './500muscles.js';
import { fullSkeletonNodes } from './bones.js';
import * as THREE from 'three';

// Force-Directed Graph Class
class Graph {
    constructor() {
        this.nodes = {};
        this.edges = [];
        this.groundContactPoints = ['left_ankle', 'right_ankle'];
        this.initializeGraph();
    }

    initializeGraph() {
        for (const [boneName, data] of Object.entries(fullSkeletonNodes)) {
            this.nodes[boneName] = {
                position: [...data.pos],
                rotation: new THREE.Quaternion(0, 0, 0, 1),
                mass: 1,
                velocity: [0, 0, 0],
                forces: [0, 0, 0],
                name: boneName
            };
        }

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
        for (const node of Object.values(this.nodes)) {
            node.forces = [0, 0, -9.81]; // Gravity (m/s²)
        }

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

            sourceNode.forces[0] -= forceVector[0];
            sourceNode.forces[1] -= forceVector[1];
            sourceNode.forces[2] -= forceVector[2];
            targetNode.forces[0] += forceVector[0];
            targetNode.forces[1] += forceVector[1];
            targetNode.forces[2] += forceVector[2];

            totalEnergy += edge.forceAmplitude * edge.energyPerContraction;
        });

        this.groundContactPoints.forEach(point => {
            const node = this.nodes[point];
            if (!node) return;
            if (node.position[2] <= 0.1) {
                const upwardForce = 9.81 * node.mass;
                node.forces[2] += upwardForce;
                totalEnergy += upwardForce * dt;
            }
        });

        for (const node of Object.values(this.nodes)) {
            const accel = node.forces.map(f => f / node.mass);
            const newPos = node.position.map((pos, i) => {
                const vel = node.velocity[i] + accel[i] * dt;
                return pos + vel * dt + 0.5 * accel[i] * dt * dt;
            });
            if (this.groundContactPoints.includes(node.name) && newPos[2] < 0) {
                newPos[2] = 0;
                node.velocity[2] = 0;
            }
            node.velocity = node.velocity.map((v, i) => v + accel[i] * dt * 0.98);
            node.position = newPos;
        }

        return totalEnergy;
    }
}

// Sinusoidal Wave Generator
function fap(t, freqRange = [2, 7], currFreq = 4) {
    return Math.sin(2 * Math.PI * currFreq * t); // -1 to 1
}

// Compute Action Patterns with Differentials
function computeActionPatterns3Df(hap, duration, fps = 30, context = 'healthy') {
    const frameCount = Math.floor(duration * fps);
    const dt = 1 / fps;
    const times = Array.from({ length: frameCount }, (_, i) => i * dt);

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
    let prevPattern = {};
    let prevPrevPattern = {};

    for (let frame = 0; frame < frameCount; frame++) {
        const t = frame * dt;
        const pattern = {};

        muscleSets[hap].forEach((muscleSet, setIndex) => {
            const offset = setIndex * 0.5;
            let baseAmplitude = fap(t, [2, 7], 4);

            if (context === 'impaired') baseAmplitude *= 0.5;
            else if (context === 'trained') baseAmplitude = Math.max(0.3, baseAmplitude * 1.2);

            if (hap === 'idle') baseAmplitude = Math.max(0.3, Math.abs(baseAmplitude));
            else if (hap === 'walk') {
                baseAmplitude = 0.5 + 0.5 * Math.sin(2 * Math.PI * (t / duration + offset));
                pattern['forwardVelocity'] = (setIndex === 0 ? 2 : -2) * baseAmplitude;
            }

            muscleSet.forEach(muscleName => {
                pattern[muscleName] = baseAmplitude;
            });
        });

        // Compute differentials
        if (frame > 0) {
            for (const muscleName in pattern) {
                const prevValue = prevPattern[muscleName] || 0;
                const currValue = pattern[muscleName];
                const velocity = (currValue - prevValue) / dt;
                let acceleration = 0;
                let jerk = 0;

                if (frame > 1) {
                    const prevVelocity = (prevValue - (prevPrevPattern[muscleName] || 0)) / dt;
                    acceleration = (velocity - prevVelocity) / dt;
                    if (frame > 2) {
                        const prevAcceleration = (prevVelocity - ((prevPrevPattern[muscleName] || 0) - (actionPatterns[frame - 3][muscleName] || 0)) / dt) / dt;
                        jerk = (acceleration - prevAcceleration) / dt;
                    }
                }

                pattern[`${muscleName}_velocity`] = velocity;
                pattern[`${muscleName}_acceleration`] = acceleration;
                pattern[`${muscleName}_jerk`] = jerk;
            }
        }

        actionPatterns.push(pattern);
        prevPrevPattern = { ...prevPattern };
        prevPattern = { ...pattern };
    }

    return actionPatterns;
}

function computeActionPatterns(hap, duration, fps = 30, context = 'healthy') {
    const frameCount = Math.floor(duration * fps);
    const dt = 1 / fps;
    const times = Array.from({ length: frameCount }, (_, i) => i * dt);

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
    let prevPattern = {};

    for (let frame = 0; frame < frameCount; frame++) {
        const t = frame * dt;
        const pattern = {};

        muscleSets[hap].forEach((muscleSet, setIndex) => {
            const offset = setIndex * 0.5;
            let baseAmplitude = fap(t, [2, 7], 4);

            // Modulate amplitude based on context
            if (context === 'impaired') {
                baseAmplitude *= 0.5; // Reduced amplitude for impaired movement
            } else if (context === 'trained') {
                baseAmplitude = Math.max(0.3, baseAmplitude * 1.2); // Enhanced control for trained
            }

            if (hap === 'idle') {
                baseAmplitude = Math.max(0.3, Math.abs(baseAmplitude)); // Minimum for stability
            } else if (hap === 'walk') {
                baseAmplitude = 0.5 + 0.5 * Math.sin(2 * Math.PI * (t / duration + offset));
                pattern['forwardVelocity'] = (setIndex === 0 ? 2 : -2) * baseAmplitude;
            }

            muscleSet.forEach(muscleName => {
                pattern[muscleName] = baseAmplitude;
            });
        });

        // Compute differentials
        if (frame > 0) {
            for (const muscleName in pattern) {
                const prevValue = prevPattern[muscleName] || 0;
                const currValue = pattern[muscleName];
                const velocity = (currValue - prevValue) / dt; // First-order differential
                let acceleration = 0;
                if (frame > 1) {
                    const prevVelocity = (prevPattern[muscleName] - (actionPatterns[frame - 2][muscleName] || 0)) / dt;
                    acceleration = (velocity - prevVelocity) / dt; // Second-order differential
                }
                pattern[`${muscleName}_velocity`] = velocity;
                pattern[`${muscleName}_acceleration`] = acceleration;
            }
        }

        actionPatterns.push(pattern);
        prevPattern = { ...pattern };
    }

    return actionPatterns;
}

// Mock Database for Action Patterns and Grammar
const actionPatternDB = {
    walk: { patterns: [], totalEnergy: 0, grammar: {} },
    idle: { patterns: [], totalEnergy: 0, grammar: {} }
};

// Simulate Animation and Generate Keyframe Tracks
function simulateAnimation(hap, duration, fps = 30, context = 'healthy') {
    const graph = new Graph();
    const frameCount = Math.floor(duration * fps);
    const dt = 1 / fps;
    const times = Array.from({ length: frameCount }, (_, i) => i * dt);

    const actionPatterns = computeActionPatterns(hap, duration, fps, context);
    let totalEnergy = 0;

    const bonePositions = {};
    const boneRotations = {};

    for (const boneName of Object.keys(graph.nodes)) {
        bonePositions[boneName] = { x: [], y: [], z: [] };
        boneRotations[boneName] = { x: [], y: [], z: [], w: [] };
        graph.nodes[boneName].name = boneName;
    }

    for (let frame = 0; frame < frameCount; frame++) {
        const pattern = actionPatterns[frame];

        graph.edges.forEach(edge => {
            const muscle = muscles.find(m => m.origin === edge.source && m.insertion === edge.target);
            if (!muscle) return;
            edge.forceAmplitude = pattern[muscle.name] || 0;
        });

        if (hap === 'walk' && pattern.forwardVelocity) {
            ['left_ankle', 'right_ankle'].forEach(ankle => {
                const node = graph.nodes[ankle];
                if (node) node.forces[0] += pattern.forwardVelocity;
            });
        }

        const frameEnergy = graph.applyForces(dt);
        totalEnergy += frameEnergy;

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

    // Build grammar based on differentials
    const grammar = {};
    for (const pattern of actionPatterns) {
        for (const muscleName in pattern) {
            if (muscleName.endsWith('_velocity') || muscleName.endsWith('_acceleration')) {
                const baseName = muscleName.replace(/_velocity|_acceleration/, '');
                if (!grammar[baseName]) grammar[baseName] = { velocities: [], accelerations: [] };
                if (muscleName.endsWith('_velocity')) grammar[baseName].velocities.push(pattern[muscleName]);
                if (muscleName.endsWith('_acceleration')) grammar[baseName].accelerations.push(pattern[muscleName]);
            }
        }
    }

    actionPatternDB[hap] = { patterns: actionPatterns, totalEnergy, grammar };

    const tracks = [];
    for (const boneName in graph.nodes) {
        const trackName = boneName; // Adjust with boneMapping if needed
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
    const animations = [
        simulateAnimation('idle', 3, 30, 'healthy'),
        simulateAnimation('walk', 2, 30, 'healthy'),
        simulateAnimation('idle', 3, 30, 'impaired'), // Example for comparison
        simulateAnimation('walk', 2, 30, 'trained')    // Example for comparison
    ];

    console.log('Action Patterns and Grammar:', actionPatternDB);
    return animations;
}

export { createAnimations };