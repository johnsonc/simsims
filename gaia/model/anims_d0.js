// anims.js
function createAnimations(boneMap, muscles) {
    const animations = [];

    // IDLE Animation
    const idleTracks = [];
    const idleTimes = [0, 1, 2, 3];
    const idleBones = ['spine_t5', 'spine_t1']; // These should match fullSkeletonNodes keys

    idleBones.forEach(boneName => {
        const bone = boneMap[boneName];
        if (!bone) {
            return; // Skip if bone is not found in boneMap
        }
        const xAxis = new THREE.Vector3(1, 0, 0);
        const values = [
            new THREE.Quaternion().setFromAxisAngle(xAxis, 0),
            new THREE.Quaternion().setFromAxisAngle(xAxis, 0.05),
            new THREE.Quaternion().setFromAxisAngle(xAxis, 0),
            new THREE.Quaternion().setFromAxisAngle(xAxis, -0.02)
        ].flatMap(q => [q.x, q.y, q.z, q.w]);
        const track = new THREE.QuaternionKeyframeTrack(
            `${bone.name}.quaternion`,
            idleTimes,
            values
        );
        idleTracks.push(track);
    });

    // Ensure at least one track exists to create a valid clip
    if (idleTracks.length > 0) {
        const idleClip = new THREE.AnimationClip('idle', 3, idleTracks);
        animations.push(idleClip);
    } else {
        // Fallback: Create a dummy clip to avoid breaking animation setup
        const dummyTrack = new THREE.QuaternionKeyframeTrack(
            'dummy.quaternion',
            [0, 1],
            [0, 0, 0, 1, 0, 0, 0, 1]
        );
        const idleClip = new THREE.AnimationClip('idle', 1, [dummyTrack]);
        animations.push(idleClip);
    }

    // WALK Animation
    const walkTracks = [];
    const walkTimes = [0, 0.5, 1, 1.5, 2];
    const walkParts = [
        { bone: 'left_hip', axis: new THREE.Vector3(1, 0, 0), angles: [0, 0.3, 0, -0.3, 0] },
        { bone: 'right_hip', axis: new THREE.Vector3(1, 0, 0), angles: [0, -0.3, 0, 0.3, 0] },
        { bone: 'left_knee', axis: new THREE.Vector3(1, 0, 0), angles: [0, -0.2, 0, 0, 0] },
        { bone: 'right_knee', axis: new THREE.Vector3(1, 0, 0), angles: [0, 0, 0, -0.2, 0] },
        { bone: 'left_shoulder', axis: new THREE.Vector3(1, 0, 0), angles: [0, -0.2, 0, 0.2, 0] },
        { bone: 'right_shoulder', axis: new THREE.Vector3(1, 0, 0), angles: [0, 0.2, 0, -0.2, 0] }
    ];

    walkParts.forEach(part => {
        const bone = boneMap[part.bone];
        if (!bone) {
            return; // Skip if bone is not found in boneMap
        }
        const values = part.angles.map(angle => {
            const q = new THREE.Quaternion().setFromAxisAngle(part.axis, angle);
            return [q.x, q.y, q.z, q.w];
        }).flat();
        const track = new THREE.QuaternionKeyframeTrack(
            `${bone.name}.quaternion`,
            walkTimes,
            values
        );
        walkTracks.push(track);
    });

    // Muscle animations for walk (quad, calf, hamstring)
    muscles.forEach(muscle => {
        if (muscle.name.includes('quad') || muscle.name.includes('calf') || muscle.name.includes('hamstring')) {
            const morphValues = muscle.name.includes('left') ? [0, 0.8, 0, 0.2, 0] : [0, 0.2, 0, 0.8, 0];
            const track = new THREE.NumberKeyframeTrack(
                `${muscle.name}.morphTargetInfluences[0]`,
                walkTimes,
                morphValues
            );
            walkTracks.push(track);
        }
    });

    // Ensure at least one track exists for the walk clip
    if (walkTracks.length > 0) {
        const walkClip = new THREE.AnimationClip('walk', 2, walkTracks);
        animations.push(walkClip);
    } else {
        // Fallback: Create a dummy clip
        const dummyTrack = new THREE.QuaternionKeyframeTrack(
            'dummy.quaternion',
            [0, 1],
            [0, 0, 0, 1, 0, 0, 0, 1]
        );
        const walkClip = new THREE.AnimationClip('walk', 1, [dummyTrack]);
        animations.push(walkClip);
    }

    return animations;
}

export { createAnimations };