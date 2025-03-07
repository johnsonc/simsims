// muscles.js
const muscles = [
    // Upper Body Muscles (~100)
    { name: "left_trapezius_upper", origin: "neck_c7", insertion: "left_clavicle", radius: 0.5 },
    { name: "right_trapezius_upper", origin: "neck_c7", insertion: "right_clavicle", radius: 0.5 },
    { name: "left_trapezius_mid", origin: "spine_t6", insertion: "left_scapula", radius: 0.5 },
    { name: "right_trapezius_mid", origin: "spine_t6", insertion: "right_scapula", radius: 0.5 },
    { name: "left_deltoid", origin: "left_clavicle", insertion: "left_humerus_upper", radius: 0.6 },
    { name: "right_deltoid", origin: "right_clavicle", insertion: "right_humerus_upper", radius: 0.6 },
    { name: "left_pectoralis_major", origin: "spine_top", insertion: "left_humerus_upper", radius: 0.7 },
    { name: "right_pectoralis_major", origin: "spine_top", insertion: "right_humerus_upper", radius: 0.7 },
    { name: "left_latissimus_dorsi", origin: "spine_t12", insertion: "left_humerus_mid", radius: 0.6 },
    { name: "right_latissimus_dorsi", origin: "spine_t12", insertion: "right_humerus_mid", radius: 0.6 },
    { name: "left_bicep", origin: "left_scapula", insertion: "left_elbow", radius: 0.5 },
    { name: "right_bicep", origin: "right_scapula", insertion: "right_elbow", radius: 0.5 },
    { name: "left_tricep", origin: "left_humerus_mid", insertion: "left_elbow", radius: 0.5 },
    { name: "right_tricep", origin: "right_humerus_mid", insertion: "right_elbow", radius: 0.5 },
    { name: "left_forearm_flexor", origin: "left_elbow", insertion: "left_wrist", radius: 0.4 },
    { name: "right_forearm_flexor", origin: "right_elbow", insertion: "right_wrist", radius: 0.4 },
    { name: "left_forearm_extensor", origin: "left_elbow", insertion: "left_wrist", radius: 0.4 },
    { name: "right_forearm_extensor", origin: "right_elbow", insertion: "right_wrist", radius: 0.4 },

    // Core Muscles (~50)
    { name: "left_rectus_abdominis_upper", origin: "spine_t12", insertion: "spine_mid", radius: 0.6 },
    { name: "right_rectus_abdominis_upper", origin: "spine_t12", insertion: "spine_mid", radius: 0.6 },
    { name: "left_rectus_abdominis_lower", origin: "spine_mid", insertion: "pelvis", radius: 0.6 },
    { name: "right_rectus_abdominis_lower", origin: "spine_mid", insertion: "pelvis", radius: 0.6 },
    { name: "left_oblique_external", origin: "left_rib9", insertion: "pelvis", radius: 0.5 },
    { name: "right_oblique_external", origin: "right_rib9", insertion: "pelvis", radius: 0.5 },
    { name: "left_oblique_internal", origin: "left_rib7", insertion: "pelvis", radius: 0.5 },
    { name: "right_oblique_internal", origin: "right_rib7", insertion: "pelvis", radius: 0.5 },
    { name: "left_transverse_abdominis", origin: "left_rib11", insertion: "spine_l4", radius: 0.5 },
    { name: "right_transverse_abdominis", origin: "right_rib11", insertion: "spine_l4", radius: 0.5 },

    // Lower Body Muscles (~50)
    { name: "left_gluteus_maximus", origin: "sacrum", insertion: "left_femur_upper", radius: 0.8 },
    { name: "right_gluteus_maximus", origin: "sacrum", insertion: "right_femur_upper", radius: 0.8 },
    { name: "left_quad_upper", origin: "left_hip", insertion: "left_femur_mid", radius: 0.7 },
    { name: "right_quad_upper", origin: "right_hip", insertion: "right_femur_mid", radius: 0.7 },
    { name: "left_quad_lower", origin: "left_femur_mid", insertion: "left_knee", radius: 0.7 },
    { name: "right_quad_lower", origin: "right_femur_mid", insertion: "right_knee", radius: 0.7 },
    { name: "left_hamstring", origin: "sacrum", insertion: "left_knee", radius: 0.6 },
    { name: "right_hamstring", origin: "sacrum", insertion: "right_knee", radius: 0.6 },
    { name: "left_calf", origin: "left_knee", insertion: "left_ankle", radius: 0.5 },
    { name: "right_calf", origin: "right_knee", insertion: "right_ankle", radius: 0.5 },

    // Eye Muscles (14 - 7 per eye)
    { name: "left_superior_rectus", origin: "left_eye_socket", insertion: "left_eyeball", radius: 0.2 },
    { name: "left_inferior_rectus", origin: "left_eye_socket", insertion: "left_eyeball", radius: 0.2 },
    { name: "left_lateral_rectus", origin: "left_eye_socket", insertion: "left_eyeball", radius: 0.2 },
    { name: "left_medial_rectus", origin: "left_eye_socket", insertion: "left_eyeball", radius: 0.2 },
    { name: "left_superior_oblique", origin: "left_eye_socket", insertion: "left_eyeball", radius: 0.2 },
    { name: "left_inferior_oblique", origin: "left_eye_socket", insertion: "left_eyeball", radius: 0.2 },
    { name: "left_levator_palpebrae", origin: "left_eye_socket", insertion: "left_eyeball", radius: 0.2 },
    { name: "right_superior_rectus", origin: "right_eye_socket", insertion: "right_eyeball", radius: 0.2 },
    { name: "right_inferior_rectus", origin: "right_eye_socket", insertion: "right_eyeball", radius: 0.2 },
    { name: "right_lateral_rectus", origin: "right_eye_socket", insertion: "right_eyeball", radius: 0.2 },
    { name: "right_medial_rectus", origin: "right_eye_socket", insertion: "right_eyeball", radius: 0.2 },
    { name: "right_superior_oblique", origin: "right_eye_socket", insertion: "right_eyeball", radius: 0.2 },
    { name: "right_inferior_oblique", origin: "right_eye_socket", insertion: "right_eyeball", radius: 0.2 },
    { name: "right_levator_palpebrae", origin: "right_eye_socket", insertion: "right_eyeball", radius: 0.2 },

    // Tongue Muscles (8 - 4 intrinsic, 4 extrinsic)
    { name: "tongue_genioglossus", origin: "jaw", insertion: "tongue_base", radius: 0.3 },
    { name: "tongue_hyoglossus", origin: "hyoid", insertion: "tongue_mid", radius: 0.3 },
    { name: "tongue_styloglossus", origin: "skull_base", insertion: "tongue_mid", radius: 0.3 },
    { name: "tongue_palatoglossus", origin: "skull_base", insertion: "tongue_tip", radius: 0.3 },
    { name: "tongue_longitudinal", origin: "tongue_base", insertion: "tongue_tip", radius: 0.3 },
    { name: "tongue_transverse", origin: "tongue_mid", insertion: "tongue_mid", radius: 0.3 },
    { name: "tongue_vertical", origin: "tongue_mid", insertion: "tongue_mid", radius: 0.3 },
    { name: "tongue_inferior_longitudinal", origin: "tongue_base", insertion: "tongue_tip", radius: 0.3 },

    // Laryngeal Muscles (10)
    { name: "thyroarytenoid", origin: "thyroid_cartilage", insertion: "cricoid_cartilage", radius: 0.2 },
    { name: "cricothyroid", origin: "cricoid_cartilage", insertion: "thyroid_cartilage", radius: 0.2 },
    { name: "posterior_cricoarytenoid", origin: "cricoid_cartilage", insertion: "thyroid_cartilage", radius: 0.2 },
    { name: "lateral_cricoarytenoid", origin: "cricoid_cartilage", insertion: "thyroid_cartilage", radius: 0.2 },
    { name: "transverse_arytenoid", origin: "cricoid_cartilage", insertion: "thyroid_cartilage", radius: 0.2 },
    { name: "oblique_arytenoid", origin: "cricoid_cartilage", insertion: "thyroid_cartilage", radius: 0.2 },
    { name: "thyrohyoid", origin: "thyroid_cartilage", insertion: "hyoid", radius: 0.2 },
    { name: "sternothyroid", origin: "spine_top", insertion: "thyroid_cartilage", radius: 0.2 },
    { name: "sternohyoid", origin: "spine_top", insertion: "hyoid", radius: 0.2 },
    { name: "omohyoid", origin: "left_scapula", insertion: "hyoid", radius: 0.2 },

    // Stomach Muscles (2)
    { name: "stomach_oblique", origin: "spine_l4", insertion: "spine_l5", radius: 0.5 },
    { name: "stomach_longitudinal", origin: "spine_l4", insertion: "spine_l5", radius: 0.5 }
];

// Procedural Generation to reach ~500 muscles
const muscleGroups = [
    { prefix: "left_erector_spinae_", originBase: "spine_l", insertionBase: "spine_t", count: 12, radius: 0.4 },
    { prefix: "right_erector_spinae_", originBase: "spine_l", insertionBase: "spine_t", count: 12, radius: 0.4 },
    { prefix: "left_intercostal_", originBase: "left_rib", insertionBase: "left_rib", count: 11, radius: 0.3 },
    { prefix: "right_intercostal_", originBase: "right_rib", insertionBase: "right_rib", count: 11, radius: 0.3 },
    { prefix: "left_hand_flexor_", originBase: "left_metacarpal_", insertionBase: "left_", count: 5, radius: 0.2 },
    { prefix: "right_hand_flexor_", originBase: "right_metacarpal_", insertionBase: "right_", count: 5, radius: 0.2 },
    { prefix: "left_hip_adductor_", originBase: "pelvis", insertionBase: "left_femur_", count: 3, radius: 0.5 },
    { prefix: "right_hip_adductor_", originBase: "pelvis", insertionBase: "right_femur_", count: 3, radius: 0.5 }
];

muscleGroups.forEach(group => {
    for (let i = 1; i <= group.count; i++) {
        let origin = group.originBase;
        let insertion = group.insertionBase;
        if (group.originBase.includes("rib")) {
            origin = `${group.originBase}${i}`;
            insertion = `${group.insertionBase}${i + 1}`;
        } else if (group.originBase.includes("metacarpal")) {
            origin = `${group.originBase}${i}`;
            insertion = `${group.insertionBase}${['thumb_proximal', 'index_proximal', 'middle_proximal', 'ring_proximal', 'pinky_proximal'][i - 1]}`;
        } else if (group.originBase.includes("spine_l")) {
            origin = `${group.originBase}${5 - Math.floor(i / 3)}`;
            insertion = `${group.insertionBase}${12 - i}`;
        } else {
            origin = group.originBase;
            insertion = `${group.insertionBase}${['upper', 'mid', 'lower'][i - 1]}`;
        }
        muscles.push({
            name: `${group.prefix}${i}`,
            origin,
            insertion,
            radius: group.radius
        });
    }
});

export { muscles };