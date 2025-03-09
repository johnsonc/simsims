// anims.js
import * as THREE from 'three';
import { muscles } from './500muscles.js';
import { fullSkeletonNodes } from './bones.js';

const SCALE_FACTOR = 0.01;

// Force-Directed Graph Class
class Graph {
    constructor(bones, muscles) {
        this.nodes = {};
        this.edges = [];
        this.groundContactPoints = ['left_ankle', 'right_ankle'];
        this.bones = bones;
        this.muscles = muscles;
        this.initializeGraph();
    }

    initializeGraph() {
        for (const [boneName, data] of Object.entries(fullSkeletonNodes)) {
            this.nodes[boneName] = {
                position: data.pos.map(p => p * SCALE_FACTOR), // Apply scaling
                rotation: new THREE.Quaternion(0, 0, 0, 1),
                mass: 1,
                velocity: [0, 0, 0],
                forces: [0, 0, 0],
                name: boneName
            };
        }

        muscles.forEach(muscle => {
            // Scale attachment points to match bone scaling
            const scaledAttachPoints = muscle.attachPoints.map(point => 
                point.map(p => p * SCALE_FACTOR)
            );
            
            this.edges.push({
                source: muscle.origin,
                target: muscle.insertion,
                attachPoints: scaledAttachPoints,
                forceAmplitude: 0,
                maxForce: 1 * (muscle.geomRelaxed.length - muscle.geomContracted.length) * SCALE_FACTOR, // Scale force
                energyPerContraction: muscle.energyPerContraction,
                name: muscle.name
            });
        });
    }

    applyForces(dt) {
        // Reset forces
        for (const node of Object.values(this.nodes)) {
            node.forces = [0, 0, -9.81 * SCALE_FACTOR]; // Scale gravity
        }

        let totalEnergy = 0;
        this.edges.forEach(edge => {
            const sourceNode = this.nodes[edge.source];
            const targetNode = this.nodes[edge.target];
            if (!sourceNode || !targetNode) return;

            // Calculate muscle force direction using attachment points
            const sourcePos = edge.attachPoints[0];
            const targetPos = edge.attachPoints[1];
            
            const dx = targetPos[0] - sourcePos[0];
            const dy = targetPos[1] - sourcePos[1];
            const dz = targetPos[2] - sourcePos[2];
            const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (length === 0) return;
            
            const force = edge.forceAmplitude * edge.maxForce;
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

        // Apply ground contact
        this.groundContactPoints.forEach(point => {
            const node = this.nodes[point];
            if (!node) return;
            if (node.position[1] <= 0.1 * SCALE_FACTOR) { // Scale ground threshold
                const upwardForce = 9.81 * node.mass * SCALE_FACTOR; // Scale force
                node.forces[1] += upwardForce;
                totalEnergy += upwardForce * dt;
            }
        });

        // Update positions based on forces
        for (const node of Object.values(this.nodes)) {
            const accel = node.forces.map(f => f / node.mass);
            node.velocity = node.velocity.map((v, i) => v + accel[i] * dt * 0.98); // Damping factor

            const newPos = node.position.map((pos, i) => 
                pos + node.velocity[i] * dt + 0.5 * accel[i] * dt * dt);
            
            // Ground collision
            if (this.groundContactPoints.includes(node.name) && newPos[1] < 0) {
                newPos[1] = 0;
                node.velocity[1] = 0;
            }
            
            node.position = newPos;
        }

        return totalEnergy;
    }
}

// Sinusoidal Wave Generator
function fap(t, freqRange = [2, 7], currFreq = 4) {
    return Math.sin(2 * Math.PI * currFreq * t); // -1 to 1
}

// Compute Action Patterns
function computeActionPatterns(hap, duration, fps = 30, context = 'healthy', muscles) {
    const frameCount = Math.floor(duration * fps);
    const dt = 1 / fps;
    const times = Array.from({ length: frameCount }, (_, i) => i * dt);

    // Define muscle groups for animations
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

    // Ensure we're using available muscles
    const availableMuscleNames = muscles.map(m => m.name);
    console.log("Available muscles:", availableMuscleNames);
    
    // Filter to only use muscles that exist in our data
    const filteredMuscleSets = {};
    for (const [action, muscleGroups] of Object.entries(muscleSets)) {
        filteredMuscleSets[action] = muscleGroups.map(group => 
            group.filter(muscleName => availableMuscleNames.includes(muscleName))
        );
    }
    
    // Fallback to basic muscle groups if specified ones aren't available
    const allMuscleGroups = filteredMuscleSets[hap] || [
        availableMuscleNames.slice(0, Math.min(5, availableMuscleNames.length)), 
        availableMuscleNames.slice(Math.min(5, availableMuscleNames.length), Math.min(10, availableMuscleNames.length))
    ];

    const actionPatterns = [];
    let prevPattern = {};

    for (let frame = 0; frame < frameCount; frame++) {
        const t = frame * dt;
        const pattern = {};

        allMuscleGroups.forEach((muscleSet, setIndex) => {
            const offset = setIndex * 0.5;
            let baseAmplitude = fap(t, [2, 7], 4);

            // Modulate amplitude based on context
            if (context === 'impaired') baseAmplitude *= 0.5;
            else if (context === 'trained') baseAmplitude = Math.max(0.3, baseAmplitude * 1.2);

            if (hap === 'idle') {
                baseAmplitude = Math.max(0.3, Math.abs(baseAmplitude)); 
            } else if (hap === 'walk') {
                baseAmplitude = 0.5 + 0.5 * Math.sin(2 * Math.PI * (t / duration + offset));
                pattern['forwardVelocity'] = (setIndex === 0 ? 2 : -2) * baseAmplitude * SCALE_FACTOR; // Scale velocity
            }

            muscleSet.forEach(muscleName => {
                if (availableMuscleNames.includes(muscleName)) {
                    pattern[muscleName] = baseAmplitude;
                }
            });
        });

        // Compute differentials
        if (frame > 0) {
            for (const muscleName in pattern) {
                const prevValue = prevPattern[muscleName] || 0;
                const currValue = pattern[muscleName];
                pattern[`${muscleName}_velocity`] = (currValue - prevValue) / dt;
            }
        }

        actionPatterns.push(pattern);
        prevPattern = { ...pattern };
    }

    return actionPatterns;
}

// Simulate Animation and Generate Keyframe Tracks
function simulateAnimation(hap, duration, fps = 30, context = 'healthy', bones, muscles) {
    const graph = new Graph(bones, muscles);
    const frameCount = Math.floor(duration * fps);
    const dt = 1 / fps;
    const times = Array.from({ length: frameCount }, (_, i) => i * dt);

    const actionPatterns = computeActionPatterns(hap, duration, fps, context, muscles);
    let totalEnergy = 0;

    const tracks = [];
    const bonePositions = {};
    const boneRotations = {};

    // Initialize arrays for keyframe data
    for (const boneName in graph.nodes) {
        bonePositions[boneName] = [];
        boneRotations[boneName] = [];
    }

    // Debug
    console.log(`Simulating ${hap}_${context} animation with ${frameCount} frames`);
    console.log("Action patterns sample:", Object.keys(actionPatterns[0] || {}));

    // Simulation loop
    for (let frame = 0; frame < frameCount; frame++) {
        const pattern = actionPatterns[frame];

        // Apply muscle activations
        graph.edges.forEach(edge => {
            edge.forceAmplitude = pattern[edge.name] || 0;
        });

        // Apply walking impulse if needed
        if (hap === 'walk' && pattern.forwardVelocity) {
            ['left_ankle', 'right_ankle'].forEach(ankle => {
                const node = graph.nodes[ankle];
                if (node) node.forces[0] += pattern.forwardVelocity;
            });
        }

        // Step physics simulation
        const frameEnergy = graph.applyForces(dt);
        totalEnergy += frameEnergy;

        // Record bone positions and rotations
        for (const boneName in graph.nodes) {
            const node = graph.nodes[boneName];
            
            // Store position
            bonePositions[boneName].push(
                node.position[0], 
                node.position[1], 
                node.position[2]
            );
            
            // Store rotation (quaternion)
            boneRotations[boneName].push(
                node.rotation.x,
                node.rotation.y,
                node.rotation.z,
                node.rotation.w
            );
        }
    }

    // Create animation tracks
    for (const boneName in graph.nodes) {
        // Position track
        tracks.push(new THREE.VectorKeyframeTrack(
            `${boneName}.position`,
            times,
            bonePositions[boneName]
        ));
        
        // Rotation track
        tracks.push(new THREE.QuaternionKeyframeTrack(
            `${boneName}.quaternion`,
            times,
            boneRotations[boneName]
        ));
    }

    // Store action pattern data for UI
    if (!window.actionPatternDB) window.actionPatternDB = {};
    window.actionPatternDB[`${hap}_${context}`] = { 
        patterns: actionPatterns.map((p, i) => ({ phase: i/frameCount, muscleActivation: Object.entries(p).map(([id, activation]) => ({ id, activation })) })),
        totalEnergy, 
        grammar: {
            syntax: hap === 'walk' ? "Bipedal locomotion pattern" : "Idle position with minimal movement",
            rules: hap === 'walk' ? ["Forward momentum", "Weight transfer", "Balance maintenance"] : ["Maintain balance", "Reduce energy expenditure"]
        }
    };

    console.log(`Created animation: ${hap}_${context} with ${tracks.length} tracks`);
    return new THREE.AnimationClip(`${hap}_${context}`, duration, tracks);
}

// Main export function
export function createAnimations(boneMap, muscles) {
    // Get raw bone data
    let bones = {};
    for (const nodeName in boneMap) {
        const bone = boneMap[nodeName];
        bones[nodeName] = {
            pos: bone.position ? [bone.position.x, bone.position.y, bone.position.z].map(p => p / SCALE_FACTOR) : [0, 0, 0],
            parent: bone.parent ? bone.parent.name : null
        };
    }

    console.log("Creating animations with bones:", Object.keys(bones).length);
    console.log("Creating animations with muscles:", muscles.length);

    const animations = [
        simulateAnimation('idle', 3, 30, 'healthy', bones, muscles),
        simulateAnimation('walk', 2, 30, 'healthy', bones, muscles),
        simulateAnimation('idle', 3, 30, 'impaired', bones, muscles),
        simulateAnimation('walk', 2, 30, 'trained', bones, muscles)
    ];

    return animations;
}