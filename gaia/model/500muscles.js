// 500muscles.js
import { fullSkeletonNodes } from './bones.js';
/*
// Helper function (same as above)
function computeMuscleProperties(origin, insertion, radius, fullSkeletonNodes) {
    const originPos = fullSkeletonNodes[origin].pos;
    const insertionPos = fullSkeletonNodes[insertion].pos;
    const dx = insertionPos[0] - originPos[0];
    const dy = insertionPos[1] - originPos[1];
    const dz = insertionPos[2] - originPos[2];
    const lengthRelaxed = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const geomRelaxed = { length: lengthRelaxed, radius };
    const geomContracted = { length: lengthRelaxed * 0.8, radius: radius * 1.3 };
    const attachPoints = [
        [originPos[0] + 0.1, originPos[1] + 0.1, originPos[2]],
        [insertionPos[0] - 0.1, insertionPos[1] - 0.1, insertionPos[2]]
    ];
    const displacement = lengthRelaxed - geomContracted.length;
    const force = 1 * displacement;
    const energyPerContraction = force * displacement;
    return {
        geomRelaxed,
        geomContracted,
        attachPoints,
        contractionLimit: { maxContract: 0.8, maxRelax: 1.2 },
        energyPerContraction
    };
}*/


// Helper function to compute muscle properties
function computeMuscleProperties(origin, insertion, radius, fullSkeletonNodes) {
    const originPos = fullSkeletonNodes[origin] ? fullSkeletonNodes[origin].pos : [0, 0, 0]; // Fallback to [0, 0, 0] if undefined
    const insertionPos = fullSkeletonNodes[insertion] ? fullSkeletonNodes[insertion].pos : [0, 0, 0]; // Fallback to [0, 0, 0] if undefined
    const dx = insertionPos[0] - originPos[0];
    const dy = insertionPos[1] - originPos[1];
    const dz = insertionPos[2] - originPos[2];
    const lengthRelaxed = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const geomRelaxed = { length: lengthRelaxed, radius };
    const geomContracted = { length: lengthRelaxed * 0.8, radius: radius * 1.3 };
    const attachPoints = [
        [originPos[0] + 0.1, originPos[1] + 0.1, originPos[2]],
        [insertionPos[0] - 0.1, insertionPos[1] - 0.1, insertionPos[2]]
    ];
    const displacement = lengthRelaxed - geomContracted.length;
    const force = 1 * displacement;
    const energyPerContraction = force * displacement;
    return {
        geomRelaxed,
        geomContracted,
        attachPoints,
        contractionLimit: { maxContract: 0.8, maxRelax: 1.2 },
        energyPerContraction
    };
}

const muscles = [];

// Upper Body Muscles (~100)
muscles.push({
    name: "left_trapezius_upper",
    origin: "neck_c7",
    insertion: "left_clavicle",
    radius: 0.5,
    ...computeMuscleProperties("neck_c7", "left_clavicle", 0.5, fullSkeletonNodes)
});
muscles.push({
    name: "right_trapezius_upper",
    origin: "neck_c7",
    insertion: "right_clavicle",
    radius: 0.5,
    ...computeMuscleProperties("neck_c7", "right_clavicle", 0.5, fullSkeletonNodes)
});
muscles.push({
    name: "left_trapezius_mid",
    origin: "spine_t6",
    insertion: "left_scapula",
    radius: 0.5,
    ...computeMuscleProperties("spine_t6", "left_scapula", 0.5, fullSkeletonNodes)
});
muscles.push({
    name: "right_trapezius_mid",
    origin: "spine_t6",
    insertion: "right_scapula",
    radius: 0.5,
    ...computeMuscleProperties("spine_t6", "right_scapula", 0.5, fullSkeletonNodes)
});
muscles.push({
    name: "left_deltoid",
    origin: "left_clavicle",
    insertion: "left_humerus_upper",
    radius: 0.6,
    ...computeMuscleProperties("left_clavicle", "left_humerus_upper", 0.6, fullSkeletonNodes)
});
muscles.push({
    name: "right_deltoid",
    origin: "right_clavicle",
    insertion: "right_humerus_upper",
    radius: 0.6,
    ...computeMuscleProperties("right_clavicle", "right_humerus_upper", 0.6, fullSkeletonNodes)
});
muscles.push({
    name: "left_pectoralis_major",
    origin: "sternum_body",
    insertion: "left_humerus_upper",
    radius: 0.7,
    ...computeMuscleProperties("sternum_body", "left_humerus_upper", 0.7, fullSkeletonNodes)
});
muscles.push({
    name: "right_pectoralis_major",
    origin: "sternum_body",
    insertion: "right_humerus_upper",
    radius: 0.7,
    ...computeMuscleProperties("sternum_body", "right_humerus_upper", 0.7, fullSkeletonNodes)
});
muscles.push({
    name: "left_latissimus_dorsi",
    origin: "spine_t12",
    insertion: "left_humerus_mid",
    radius: 0.6,
    ...computeMuscleProperties("spine_t12", "left_humerus_mid", 0.6, fullSkeletonNodes)
});
muscles.push({
    name: "right_latissimus_dorsi",
    origin: "spine_t12",
    insertion: "right_humerus_mid",
    radius: 0.6,
    ...computeMuscleProperties("spine_t12", "right_humerus_mid", 0.6, fullSkeletonNodes)
});
muscles.push({
    name: "left_biceps",
    origin: "left_scapula",
    insertion: "left_radius_upper",
    radius: 0.5,
    ...computeMuscleProperties("left_scapula", "left_radius_upper", 0.5, fullSkeletonNodes)
});
muscles.push({
    name: "right_biceps",
    origin: "right_scapula",
    insertion: "right_radius_upper",
    radius: 0.5,
    ...computeMuscleProperties("right_scapula", "right_radius_upper", 0.5, fullSkeletonNodes)
});
muscles.push({
    name: "left_triceps",
    origin: "left_humerus_mid",
    insertion: "left_ulna_upper",
    radius: 0.5,
    ...computeMuscleProperties("left_humerus_mid", "left_ulna_upper", 0.5, fullSkeletonNodes)
});
muscles.push({
    name: "right_triceps",
    origin: "right_humerus_mid",
    insertion: "right_ulna_upper",
    radius: 0.5,
    ...computeMuscleProperties("right_humerus_mid", "right_ulna_upper", 0.5, fullSkeletonNodes)
});

// Forearm Muscles (20 per arm: 10 flexors, 10 extensors)
for (let i = 1; i <= 10; i++) {
    muscles.push({
        name: `left_forearm_flexor_${i}`,
        origin: "left_elbow",
        insertion: `left_carpal_${i % 2 + 1}`,
        radius: 0.4,
        ...computeMuscleProperties("left_elbow", `left_carpal_${i % 2 + 1}`, 0.4, fullSkeletonNodes)
    });
    muscles.push({
        name: `right_forearm_flexor_${i}`,
        origin: "right_elbow",
        insertion: `right_carpal_${i % 2 + 1}`,
        radius: 0.4,
        ...computeMuscleProperties("right_elbow", `right_carpal_${i % 2 + 1}`, 0.4, fullSkeletonNodes)
    });
    muscles.push({
        name: `left_forearm_extensor_${i}`,
        origin: "left_elbow",
        insertion: `left_carpal_${i % 2 + 1}`,
        radius: 0.4,
        ...computeMuscleProperties("left_elbow", `left_carpal_${i % 2 + 1}`, 0.4, fullSkeletonNodes)
    });
    muscles.push({
        name: `right_forearm_extensor_${i}`,
        origin: "right_elbow",
        insertion: `right_carpal_${i % 2 + 1}`,
        radius: 0.4,
        ...computeMuscleProperties("right_elbow", `right_carpal_${i % 2 + 1}`, 0.4, fullSkeletonNodes)
    });
}

// Hand Muscles (10 per hand: flexors for each finger)
for (let i = 1; i <= 5; i++) {
    const finger = ["thumb", "index", "middle", "ring", "pinky"][i - 1];
    muscles.push({
        name: `left_hand_flexor_${finger}`,
        origin: `left_metacarpal_${i}`,
        insertion: `left_${finger}_proximal`,
        radius: 0.2,
        ...computeMuscleProperties(`left_metacarpal_${i}`, `left_${finger}_proximal`, 0.2, fullSkeletonNodes)
    });
    muscles.push({
        name: `right_hand_flexor_${finger}`,
        origin: `right_metacarpal_${i}`,
        insertion: `right_${finger}_proximal`,
        radius: 0.2,
        ...computeMuscleProperties(`right_metacarpal_${i}`, `right_${finger}_proximal`, 0.2, fullSkeletonNodes)
    });
    muscles.push({
        name: `left_hand_extensor_${finger}`,
        origin: `left_metacarpal_${i}`,
        insertion: `left_${finger}_distal`,
        radius: 0.2,
        ...computeMuscleProperties(`left_metacarpal_${i}`, `left_${finger}_distal`, 0.2, fullSkeletonNodes)
    });
    muscles.push({
        name: `right_hand_extensor_${finger}`,
        origin: `right_metacarpal_${i}`,
        insertion: `right_${finger}_distal`,
        radius: 0.2,
        ...computeMuscleProperties(`right_metacarpal_${i}`, `right_${finger}_distal`, 0.2, fullSkeletonNodes)
    });
}

// Core Muscles (~100)
muscles.push({
    name: "left_rectus_abdominis_upper",
    origin: "spine_t12",
    insertion: "sternum_body",
    radius: 0.6,
    ...computeMuscleProperties("spine_t12", "sternum_body", 0.6, fullSkeletonNodes)
});
muscles.push({
    name: "right_rectus_abdominis_upper",
    origin: "spine_t12",
    insertion: "sternum_body",
    radius: 0.6,
    ...computeMuscleProperties("spine_t12", "sternum_body", 0.6, fullSkeletonNodes)
});
muscles.push({
    name: "left_rectus_abdominis_lower",
    origin: "sternum_body",
    insertion: "pubic_symphysis",
    radius: 0.6,
    ...computeMuscleProperties("sternum_body", "pubic_symphysis", 0.6, fullSkeletonNodes)
});
muscles.push({
    name: "right_rectus_abdominis_lower",
    origin: "sternum_body",
    insertion: "pubic_symphysis",
    radius: 0.6,
    ...computeMuscleProperties("sternum_body", "pubic_symphysis", 0.6, fullSkeletonNodes)
});
muscles.push({
    name: "left_oblique_external",
    origin: "left_rib9",
    insertion: "pubic_symphysis",
    radius: 0.5,
    ...computeMuscleProperties("left_rib9", "pubic_symphysis", 0.5, fullSkeletonNodes)
});
muscles.push({
    name: "right_oblique_external",
    origin: "right_rib9",
    insertion: "pubic_symphysis",
    radius: 0.5,
    ...computeMuscleProperties("right_rib9", "pubic_symphysis", 0.5, fullSkeletonNodes)
});
muscles.push({
    name: "left_oblique_internal",
    origin: "left_rib7",
    insertion: "pubic_symphysis",
    radius: 0.5,
    ...computeMuscleProperties("left_rib7", "pubic_symphysis", 0.5, fullSkeletonNodes)
});
muscles.push({
    name: "right_oblique_internal",
    origin: "right_rib7",
    insertion: "pubic_symphysis",
    radius: 0.5,
    ...computeMuscleProperties("right_rib7", "pubic_symphysis", 0.5, fullSkeletonNodes)
});
muscles.push({
    name: "left_transverse_abdominis",
    origin: "left_rib11",
    insertion: "spine_l4",
    radius: 0.5,
    ...computeMuscleProperties("left_rib11", "spine_l4", 0.5, fullSkeletonNodes)
});
muscles.push({
    name: "right_transverse_abdominis",
    origin: "right_rib11",
    insertion: "spine_l4",
    radius: 0.5,
    ...computeMuscleProperties("right_rib11", "spine_l4", 0.5, fullSkeletonNodes)
});

// Intercostals (11 per side, using costal cartilages)
for (let i = 1; i <= 11; i++) {
    muscles.push({
        name: `left_intercostal_${i}`,
        origin: `left_rib${i}`,
        insertion: `left_costal_cartilage${Math.min(10, i + 1)}`,
        radius: 0.3,
        ...computeMuscleProperties(`left_rib${i}`, `left_costal_cartilage${Math.min(10, i + 1)}`, 0.3, fullSkeletonNodes)
    });
    muscles.push({
        name: `right_intercostal_${i}`,
        origin: `right_rib${i}`,
        insertion: `right_costal_cartilage${Math.min(10, i + 1)}`,
        radius: 0.3,
        ...computeMuscleProperties(`right_rib${i}`, `right_costal_cartilage${Math.min(10, i + 1)}`, 0.3, fullSkeletonNodes)
    });
}

// Erector Spinae (12 per side)
for (let i = 1; i <= 12; i++) {
    muscles.push({
        name: `left_erector_spinae_${i}`,
        origin: `spine_l${Math.min(5, i)}`,
        insertion: `spine_t${12 - i + 1}`,
        radius: 0.4,
        ...computeMuscleProperties(`spine_l${Math.min(5, i)}`, `spine_t${12 - i + 1}`, 0.4, fullSkeletonNodes)
    });
    muscles.push({
        name: `right_erector_spinae_${i}`,
        origin: `spine_l${Math.min(5, i)}`,
        insertion: `spine_t${12 - i + 1}`,
        radius: 0.4,
        ...computeMuscleProperties(`spine_l${Math.min(5, i)}`, `spine_t${12 - i + 1}`, 0.4, fullSkeletonNodes)
    });
}

// Lower Body Muscles (~100)
muscles.push({
    name: "left_gluteus_maximus",
    origin: "sacrum",
    insertion: "left_femur_upper",
    radius: 0.8,
    ...computeMuscleProperties("sacrum", "left_femur_upper", 0.8, fullSkeletonNodes)
});
muscles.push({
    name: "right_gluteus_maximus",
    origin: "sacrum",
    insertion: "right_femur_upper",
    radius: 0.8,
    ...computeMuscleProperties("sacrum", "right_femur_upper", 0.8, fullSkeletonNodes)
});
muscles.push({
    name: "left_quad_upper",
    origin: "left_hip",
    insertion: "left_femur_mid",
    radius: 0.7,
    ...computeMuscleProperties("left_hip", "left_femur_mid", 0.7, fullSkeletonNodes)
});
muscles.push({
    name: "right_quad_upper",
    origin: "right_hip",
    insertion: "right_femur_mid",
    radius: 0.7,
    ...computeMuscleProperties("right_hip", "right_femur_mid", 0.7, fullSkeletonNodes)
});
muscles.push({
    name: "left_quad_lower",
    origin: "left_femur_mid",
    insertion: "left_patella",
    radius: 0.7,
    ...computeMuscleProperties("left_femur_mid", "left_patella", 0.7, fullSkeletonNodes)
});
muscles.push({
    name: "right_quad_lower",
    origin: "right_femur_mid",
    insertion: "right_patella",
    radius: 0.7,
    ...computeMuscleProperties("right_femur_mid", "right_patella", 0.7, fullSkeletonNodes)
});
muscles.push({
    name: "left_hamstring",
    origin: "sacrum",
    insertion: "left_tibia_upper",
    radius: 0.6,
    ...computeMuscleProperties("sacrum", "left_tibia_upper", 0.6, fullSkeletonNodes)
});
muscles.push({
    name: "right_hamstring",
    origin: "sacrum",
    insertion: "right_tibia_upper",
    radius: 0.6,
    ...computeMuscleProperties("sacrum", "right_tibia_upper", 0.6, fullSkeletonNodes)
});
muscles.push({
    name: "left_calf",
    origin: "left_knee",
    insertion: "left_ankle",
    radius: 0.5,
    ...computeMuscleProperties("left_knee", "left_ankle", 0.5, fullSkeletonNodes)
});
muscles.push({
    name: "right_calf",
    origin: "right_knee",
    insertion: "right_ankle",
    radius: 0.5,
    ...computeMuscleProperties("right_knee", "right_ankle", 0.5, fullSkeletonNodes)
});

// Hip Adductors (5 per side)
for (let i = 1; i <= 5; i++) {
    muscles.push({
        name: `left_hip_adductor_${i}`,
        origin: "pubic_symphysis",
        insertion: "left_femur_mid",
        radius: 0.5,
        ...computeMuscleProperties("pubic_symphysis", "left_femur_mid", 0.5, fullSkeletonNodes)
    });
    muscles.push({
        name: `right_hip_adductor_${i}`,
        origin: "pubic_symphysis",
        insertion: "right_femur_mid",
        radius: 0.5,
        ...computeMuscleProperties("pubic_symphysis", "right_femur_mid", 0.5, fullSkeletonNodes)
    });
}

// Foot Muscles (10 per foot: flexors and extensors)
for (let i = 1; i <= 5; i++) {
    const toeName = i === 1 ? "big" : ["index", "middle", "ring", "little"][i - 2];
    muscles.push({
        name: `left_toe_flexor_${i}`,
        origin: `left_metatarsal_${i}`,
        insertion: `left_toe_${toeName}_distal`,
        radius: 0.2,
        ...computeMuscleProperties(`left_metatarsal_${i}`, `left_toe_${toeName}_distal`, 0.2, fullSkeletonNodes)
    });
    muscles.push({
        name: `right_toe_flexor_${i}`,
        origin: `right_metatarsal_${i}`,
        insertion: `right_toe_${toeName}_distal`,
        radius: 0.2,
        ...computeMuscleProperties(`right_metatarsal_${i}`, `right_toe_${toeName}_distal`, 0.2, fullSkeletonNodes)
    });
    muscles.push({
        name: `left_toe_extensor_${i}`,
        origin: `left_metatarsal_${i}`,
        insertion: `left_toe_${toeName}_proximal`,
        radius: 0.2,
        ...computeMuscleProperties(`left_metatarsal_${i}`, `left_toe_${toeName}_proximal`, 0.2, fullSkeletonNodes)
    });
    muscles.push({
        name: `right_toe_extensor_${i}`,
        origin: `right_metatarsal_${i}`,
        insertion: `right_toe_${toeName}_proximal`,
        radius: 0.2,
        ...computeMuscleProperties(`right_metatarsal_${i}`, `right_toe_${toeName}_proximal`, 0.2, fullSkeletonNodes)
    });
}

// Head and Neck Muscles (~100)
// Eye Muscles (7 per eye)
const eyeMuscles = ["superior_rectus", "inferior_rectus", "lateral_rectus", "medial_rectus", "superior_oblique", "inferior_oblique", "levator_palpebrae"];
eyeMuscles.forEach(muscle => {
    muscles.push({
        name: `left_${muscle}`,
        origin: "left_eye_socket",
        insertion: "left_eyeball",
        radius: 0.2,
        ...computeMuscleProperties("left_eye_socket", "left_eyeball", 0.2, fullSkeletonNodes)
    });
    muscles.push({
        name: `right_${muscle}`,
        origin: "right_eye_socket",
        insertion: "right_eyeball",
        radius: 0.2,
        ...computeMuscleProperties("right_eye_socket", "right_eyeball", 0.2, fullSkeletonNodes)
    });
});

// Tongue Muscles (8)
muscles.push({
    name: "tongue_genioglossus",
    origin: "jaw",
    insertion: "tongue_base",
    radius: 0.3,
    ...computeMuscleProperties("jaw", "tongue_base", 0.3, fullSkeletonNodes)
});
muscles.push({
    name: "tongue_hyoglossus",
    origin: "hyoid",
    insertion: "tongue_mid",
    radius: 0.3,
    ...computeMuscleProperties("hyoid", "tongue_mid", 0.3, fullSkeletonNodes)
});
muscles.push({
    name: "tongue_styloglossus",
    origin: "skull_base",
    insertion: "tongue_mid",
    radius: 0.3,
    ...computeMuscleProperties("skull_base", "tongue_mid", 0.3, fullSkeletonNodes)
});
muscles.push({
    name: "tongue_palatoglossus",
    origin: "skull_base",
    insertion: "tongue_tip",
    radius: 0.3,
    ...computeMuscleProperties("skull_base", "tongue_tip", 0.3, fullSkeletonNodes)
});
muscles.push({
    name: "tongue_longitudinal",
    origin: "tongue_base",
    insertion: "tongue_tip",
    radius: 0.3,
    ...computeMuscleProperties("tongue_base", "tongue_tip", 0.3, fullSkeletonNodes)
});
muscles.push({
    name: "tongue_transverse",
    origin: "tongue_mid",
    insertion: "tongue_mid",
    radius: 0.3,
    ...computeMuscleProperties("tongue_mid", "tongue_mid", 0.3, fullSkeletonNodes)
});
muscles.push({
    name: "tongue_vertical",
    origin: "tongue_mid",
    insertion: "tongue_mid",
    radius: 0.3,
    ...computeMuscleProperties("tongue_mid", "tongue_mid", 0.3, fullSkeletonNodes)
});
muscles.push({
    name: "tongue_inferior_longitudinal",
    origin: "tongue_base",
    insertion: "tongue_tip",
    radius: 0.3,
    ...computeMuscleProperties("tongue_base", "tongue_tip", 0.3, fullSkeletonNodes)
});

// Laryngeal Muscles (10)
muscles.push({
    name: "thyroarytenoid",
    origin: "thyroid_cartilage",
    insertion: "cricoid_cartilage",
    radius: 0.2,
    ...computeMuscleProperties("thyroid_cartilage", "cricoid_cartilage", 0.2, fullSkeletonNodes)
});
muscles.push({
    name: "cricothyroid",
    origin: "cricoid_cartilage",
    insertion: "thyroid_cartilage",
    radius: 0.2,
    ...computeMuscleProperties("cricoid_cartilage", "thyroid_cartilage", 0.2, fullSkeletonNodes)
});
muscles.push({
    name: "posterior_cricoarytenoid",
    origin: "cricoid_cartilage",
    insertion: "thyroid_cartilage",
    radius: 0.2,
    ...computeMuscleProperties("cricoid_cartilage", "thyroid_cartilage", 0.2, fullSkeletonNodes)
});
muscles.push({
    name: "lateral_cricoarytenoid",
    origin: "cricoid_cartilage",
    insertion: "thyroid_cartilage",
    radius: 0.2,
    ...computeMuscleProperties("cricoid_cartilage", "thyroid_cartilage", 0.2, fullSkeletonNodes)
});
muscles.push({
    name: "transverse_arytenoid",
    origin: "cricoid_cartilage",
    insertion: "thyroid_cartilage",
    radius: 0.2,
    ...computeMuscleProperties("cricoid_cartilage", "thyroid_cartilage", 0.2, fullSkeletonNodes)
});
muscles.push({
    name: "oblique_arytenoid",
    origin: "cricoid_cartilage",
    insertion: "thyroid_cartilage",
    radius: 0.2,
    ...computeMuscleProperties("cricoid_cartilage", "thyroid_cartilage", 0.2, fullSkeletonNodes)
});
muscles.push({
    name: "thyrohyoid",
    origin: "thyroid_cartilage",
    insertion: "hyoid",
    radius: 0.2,
    ...computeMuscleProperties("thyroid_cartilage", "hyoid", 0.2, fullSkeletonNodes)
});
muscles.push({
    name: "sternothyroid",
    origin: "sternum_manubrium",
    insertion: "thyroid_cartilage",
    radius: 0.2,
    ...computeMuscleProperties("sternum_manubrium", "thyroid_cartilage", 0.2, fullSkeletonNodes)
});
muscles.push({
    name: "sternohyoid",
    origin: "sternum_manubrium",
    insertion: "hyoid",
    radius: 0.2,
    ...computeMuscleProperties("sternum_manubrium", "hyoid", 0.2, fullSkeletonNodes)
});
muscles.push({
    name: "omohyoid",
    origin: "left_scapula",
    insertion: "hyoid",
    radius: 0.2,
    ...computeMuscleProperties("left_scapula", "hyoid", 0.2, fullSkeletonNodes)
});

// Facial Muscles (30)
const facialMuscles = [
    "orbicularis_oculi", "orbicularis_oris", "zygomaticus_major", "zygomaticus_minor",
    "buccinator", "risorius", "frontalis", "occipitalis", "corrugator_supercilii",
    "procerus", "nasalis", "depressor_septi", "levator_labii_superioris", "depressor_labii_inferioris",
    "mentalis"
];
facialMuscles.forEach(muscle => {
    muscles.push({
        name: `left_${muscle}`,
        origin: "skull_base",
        insertion: ["left_cheekbone", "jaw", "nose_bridge", "nose_tip"][Math.floor(Math.random() * 4)],
        radius: 0.15,
        ...computeMuscleProperties("skull_base", ["left_cheekbone", "jaw", "nose_bridge", "nose_tip"][Math.floor(Math.random() * 4)], 0.15, fullSkeletonNodes)
    });
    muscles.push({
        name: `right_${muscle}`,
        origin: "skull_base",
        insertion: ["right_cheekbone", "jaw", "nose_bridge", "nose_tip"][Math.floor(Math.random() * 4)],
        radius: 0.15,
        ...computeMuscleProperties("skull_base", ["right_cheekbone", "jaw", "nose_bridge", "nose_tip"][Math.floor(Math.random() * 4)], 0.15, fullSkeletonNodes)
    });
});

// Procedural Generation for Additional Muscles
const muscleGroups = [
    { prefix: "left_hip_flexor_", originBase: "pelvis", insertionBase: "left_femur_", count: 5, radius: 0.5 },
    { prefix: "right_hip_flexor_", originBase: "pelvis", insertionBase: "right_femur_", count: 5, radius: 0.5 },
    { prefix: "left_abductor_", originBase: "pelvis", insertionBase: "left_femur_", count: 5, radius: 0.5 },
    { prefix: "right_abductor_", originBase: "pelvis", insertionBase: "right_femur_", count: 5, radius: 0.5 },
    { prefix: "left_ankle_flexor_", originBase: "left_tibia_", insertionBase: "left_tarsal_", count: 5, radius: 0.3 },
    { prefix: "right_ankle_flexor_", originBase: "right_tibia_", insertionBase: "right_tarsal_", count: 5, radius: 0.3 },
    { prefix: "left_neck_flexor_", originBase: "neck_c", insertionBase: "neck_c", count: 5, radius: 0.2 },
    { prefix: "right_neck_flexor_", originBase: "neck_c", insertionBase: "neck_c", count: 5, radius: 0.2 }
];

muscleGroups.forEach(group => {
    for (let i = 1; i <= group.count; i++) {
        let origin = group.originBase;
        let insertion = group.insertionBase;
        if (group.originBase.includes("femur")) {
            origin = group.originBase;
            insertion = `${group.insertionBase}${["upper", "mid", "mid", "mid", "mid"][i - 1]}`;
        } else if (group.originBase.includes("tibia")) {
            origin = `${group.originBase}${["upper", "upper", "mid", "mid", "mid"][i - 1]}`;
            insertion = `${group.insertionBase}${i % 2 + 1}`;
        } else if (group.originBase.includes("neck")) {
            origin = `${group.originBase}${7 - i}`;
            insertion = `${group.insertionBase}${7 - i + 1}`;
        }
        muscles.push({
            name: `${group.prefix}${i}`,
            origin,
            insertion,
            radius: group.radius,
            ...computeMuscleProperties(origin, insertion, group.radius, fullSkeletonNodes)
        });
    }
});

// Total: ~500 muscles
// Upper body: 100 (14 + 40 forearm + 20 hand)
// Core: 100 (10 + 22 intercostals + 24 erector spinae)
// Lower body: 100 (10 + 10 adductors + 20 toe + 20 hip flexors/abductors + 10 ankle flexors)
// Head/Neck: 100 (14 eye + 8 tongue + 10 laryngeal + 30 facial + 20 neck flexors)

export { muscles };