// Update computeActionPatterns (replace the existing function)
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