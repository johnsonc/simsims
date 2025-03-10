// bones.js
const fullSkeletonNodes = {
    // Axial Skeleton
    // Spine (24 vertebrae + sacrum + coccyx)
    "root": { pos: [0, 0, 0] },
    "spine_base": { pos: [0, 5, 0], parent: "root" },
    "spine_l5": { pos: [0, 5.5, 0], parent: "spine_base" },
    "spine_l4": { pos: [0, 6, 0], parent: "spine_l5" },
    "spine_l3": { pos: [0, 6.5, 0], parent: "spine_l4" },
    "spine_l2": { pos: [0, 7, 0], parent: "spine_l3" },
    "spine_l1": { pos: [0, 7.5, 0], parent: "spine_l2" },
    "spine_t12": { pos: [0, 8, 0], parent: "spine_l1" },
    "spine_t11": { pos: [0, 8.5, 0], parent: "spine_t12" },
    "spine_t10": { pos: [0, 9, 0], parent: "spine_t11" },
    "spine_t9": { pos: [0, 9.5, 0], parent: "spine_t10" },
    "spine_t8": { pos: [0, 10, 0], parent: "spine_t9" },
    "spine_t7": { pos: [0, 10.5, 0], parent: "spine_t8" },
    "spine_t6": { pos: [0, 11, 0], parent: "spine_t7" },
    "spine_t5": { pos: [0, 11.5, 0], parent: "spine_t6" },
    "spine_t4": { pos: [0, 12, 0], parent: "spine_t5" },
    "spine_t3": { pos: [0, 12.5, 0], parent: "spine_t4" },
    "spine_t2": { pos: [0, 13, 0], parent: "spine_t3" },
    "spine_t1": { pos: [0, 13.5, 0], parent: "spine_t2" },
    "spine_top": { pos: [0, 14, 0], parent: "spine_t1" },
    "sacrum": { pos: [0, 4.5, -0.5], parent: "spine_base" },
    "coccyx": { pos: [0, 4, -0.7], parent: "sacrum" },

    // Neck (Cervical Spine - 7 vertebrae)
    "neck_c7": { pos: [0, 14.5, 0], parent: "spine_top" },
    "neck_c6": { pos: [0, 15, 0], parent: "neck_c7" },
    "neck_c5": { pos: [0, 15.5, 0], parent: "neck_c6" },
    "neck_c4": { pos: [0, 16, 0], parent: "neck_c5" },
    "neck_c3": { pos: [0, 16.5, 0], parent: "neck_c4" },
    "neck_c2": { pos: [0, 17, 0], parent: "neck_c3" },
    "neck_c1": { pos: [0, 17.5, 0], parent: "neck_c2" },

    // Skull
    "skull_base": { pos: [0, 18, 0], parent: "neck_c1" },
    "head": { pos: [0, 19, 0], parent: "skull_base" },
    "jaw": { pos: [0, 18.2, 0.5], parent: "skull_base" },
    "right_cheekbone": { pos: [1, 18.5, 0.5], parent: "skull_base" },
    "left_cheekbone": { pos: [-1, 18.5, 0.5], parent: "skull_base" },
    "nose_bridge": { pos: [0, 18.8, 1], parent: "skull_base" },
    "nose_tip": { pos: [0, 18.5, 1.5], parent: "nose_bridge" },
    "right_eye_socket": { pos: [1, 19, 1], parent: "skull_base" },
    "left_eye_socket": { pos: [-1, 19, 1], parent: "skull_base" },
    "right_eyeball": { pos: [1, 19, 1.2], parent: "right_eye_socket" },
    "left_eyeball": { pos: [-1, 19, 1.2], parent: "left_eye_socket" },

    // Ribs (12 pairs)
    "left_rib1": { pos: [-2, 14, -0.5], parent: "spine_top" },
    "left_rib2": { pos: [-2.2, 13.5, -0.5], parent: "spine_t2" },
    "left_rib3": { pos: [-2.4, 13, -0.5], parent: "spine_t3" },
    "left_rib4": { pos: [-2.6, 12.5, -0.5], parent: "spine_t4" },
    "left_rib5": { pos: [-2.8, 12, -0.5], parent: "spine_t5" },
    "left_rib6": { pos: [-3, 11.5, -0.5], parent: "spine_t6" },
    "left_rib7": { pos: [-3.2, 11, -0.5], parent: "spine_t7" },
    "left_rib8": { pos: [-3.4, 10.5, -0.5], parent: "spine_t8" },
    "left_rib9": { pos: [-3.2, 10, -0.5], parent: "spine_t9" },
    "left_rib10": { pos: [-3, 9.5, -0.5], parent: "spine_t10" },
    "left_rib11": { pos: [-2.8, 9, -0.5], parent: "spine_t11" },
    "left_rib12": { pos: [-2.6, 8.5, -0.5], parent: "spine_t12" },
    "right_rib1": { pos: [2, 14, -0.5], parent: "spine_top" },
    "right_rib2": { pos: [2.2, 13.5, -0.5], parent: "spine_t2" },
    "right_rib3": { pos: [2.4, 13, -0.5], parent: "spine_t3" },
    "right_rib4": { pos: [2.6, 12.5, -0.5], parent: "spine_t4" },
    "right_rib5": { pos: [2.8, 12, -0.5], parent: "spine_t5" },
    "right_rib6": { pos: [3, 11.5, -0.5], parent: "spine_t6" },
    "right_rib7": { pos: [3.2, 11, -0.5], parent: "spine_t7" },
    "right_rib8": { pos: [3.4, 10.5, -0.5], parent: "spine_t8" },
    "right_rib9": { pos: [3.2, 10, -0.5], parent: "spine_t9" },
    "right_rib10": { pos: [3, 9.5, -0.5], parent: "spine_t10" },
    "right_rib11": { pos: [2.8, 9, -0.5], parent: "spine_t11" },
    "right_rib12": { pos: [2.6, 8.5, -0.5], parent: "spine_t12" },

    // Pelvis
    "pelvis": { pos: [0, 4.5, 0], parent: "spine_base" },

    // Appendicular Skeleton
    // Left Arm
    "left_clavicle": { pos: [-1.5, 14, 0], parent: "spine_top" },
    "left_scapula": { pos: [-2, 13, -1], parent: "spine_top" },
    "left_shoulder": { pos: [-3, 14, 0], parent: "left_clavicle" },
    "left_humerus_upper": { pos: [-3.5, 13, 0], parent: "left_shoulder" },
    "left_humerus_mid": { pos: [-4, 12, 0], parent: "left_humerus_upper" },
    "left_elbow": { pos: [-5, 10, 0], parent: "left_humerus_mid" },
    "left_radius_upper": { pos: [-5, 9, 0.2], parent: "left_elbow" },
    "left_ulna_upper": { pos: [-5, 9, -0.2], parent: "left_elbow" },
    "left_radius_mid": { pos: [-5, 8, 0.2], parent: "left_radius_upper" },
    "left_ulna_mid": { pos: [-5, 8, -0.2], parent: "left_ulna_upper" },
    "left_wrist": { pos: [-5, 6, 0], parent: "left_radius_mid" },
    // Left Hand (Carpals, Metacarpals, Phalanges)
    "left_carpal_1": { pos: [-5, 5.8, 0], parent: "left_wrist" },
    "left_carpal_2": { pos: [-4.9, 5.8, 0], parent: "left_wrist" },
    "left_metacarpal_1": { pos: [-5.2, 5.5, 0.2], parent: "left_carpal_1" },
    "left_metacarpal_2": { pos: [-5, 5.5, 0.1], parent: "left_carpal_2" },
    "left_metacarpal_3": { pos: [-4.8, 5.5, 0], parent: "left_carpal_2" },
    "left_metacarpal_4": { pos: [-4.6, 5.5, -0.1], parent: "left_carpal_2" },
    "left_metacarpal_5": { pos: [-4.4, 5.5, -0.2], parent: "left_carpal_2" },
    "left_thumb_proximal": { pos: [-5.2, 5, 0.3], parent: "left_metacarpal_1" },
    "left_thumb_distal": { pos: [-5.2, 4.5, 0.4], parent: "left_thumb_proximal" },
    "left_index_proximal": { pos: [-5, 5, 0.1], parent: "left_metacarpal_2" },
    "left_index_middle": { pos: [-5, 4.5, 0.1], parent: "left_index_proximal" },
    "left_index_distal": { pos: [-5, 4, 0.1], parent: "left_index_middle" },
    "left_middle_proximal": { pos: [-4.8, 5, 0], parent: "left_metacarpal_3" },
    "left_middle_middle": { pos: [-4.8, 4.5, 0], parent: "left_middle_proximal" },
    "left_middle_distal": { pos: [-4.8, 4, 0], parent: "left_middle_middle" },
    "left_ring_proximal": { pos: [-4.6, 5, -0.1], parent: "left_metacarpal_4" },
    "left_ring_middle": { pos: [-4.6, 4.5, -0.1], parent: "left_ring_proximal" },
    "left_ring_distal": { pos: [-4.6, 4, -0.1], parent: "left_ring_middle" },
    "left_pinky_proximal": { pos: [-4.4, 5, -0.2], parent: "left_metacarpal_5" },
    "left_pinky_middle": { pos: [-4.4, 4.5, -0.2], parent: "left_pinky_proximal" },
    "left_pinky_distal": { pos: [-4.4, 4, -0.2], parent: "left_pinky_middle" },

    // Right Arm
    "right_clavicle": { pos: [1.5, 14, 0], parent: "spine_top" },
    "right_scapula": { pos: [2, 13, -1], parent: "spine_top" },
    "right_shoulder": { pos: [3, 14, 0], parent: "right_clavicle" },
    "right_humerus_upper": { pos: [3.5, 13, 0], parent: "right_shoulder" },
    "right_humerus_mid": { pos: [4, 12, 0], parent: "right_humerus_upper" },
    "right_elbow": { pos: [5, 10, 0], parent: "right_humerus_mid" },
    "right_radius_upper": { pos: [5, 9, 0.2], parent: "right_elbow" },
    "right_ulna_upper": { pos: [5, 9, -0.2], parent: "right_elbow" },
    "right_radius_mid": { pos: [5, 8, 0.2], parent: "right_radius_upper" },
    "right_ulna_mid": { pos: [5, 8, -0.2], parent: "right_ulna_upper" },
    "right_wrist": { pos: [5, 6, 0], parent: "right_radius_mid" },
    // Right Hand (Carpals, Metacarpals, Phalanges)
    "right_carpal_1": { pos: [5, 5.8, 0], parent: "right_wrist" },
    "right_carpal_2": { pos: [4.9, 5.8, 0], parent: "right_wrist" },
    "right_metacarpal_1": { pos: [5.2, 5.5, 0.2], parent: "right_carpal_1" },
    "right_metacarpal_2": { pos: [5, 5.5, 0.1], parent: "right_carpal_2" },
    "right_metacarpal_3": { pos: [4.8, 5.5, 0], parent: "right_carpal_2" },
    "right_metacarpal_4": { pos: [4.6, 5.5, -0.1], parent: "right_carpal_2" },
    "right_metacarpal_5": { pos: [4.4, 5.5, -0.2], parent: "right_carpal_2" },
    "right_thumb_proximal": { pos: [5.2, 5, 0.3], parent: "right_metacarpal_1" },
    "right_thumb_distal": { pos: [5.2, 4.5, 0.4], parent: "right_thumb_proximal" },
    "right_index_proximal": { pos: [5, 5, 0.1], parent: "right_metacarpal_2" },
    "right_index_middle": { pos: [5, 4.5, 0.1], parent: "right_index_proximal" },
    "right_index_distal": { pos: [5, 4, 0.1], parent: "right_index_middle" },
    "right_middle_proximal": { pos: [4.8, 5, 0], parent: "right_metacarpal_3" },
    "right_middle_middle": { pos: [4.8, 4.5, 0], parent: "right_middle_proximal" },
    "right_middle_distal": { pos: [4.8, 4, 0], parent: "right_middle_middle" },
    "right_ring_proximal": { pos: [4.6, 5, -0.1], parent: "right_metacarpal_4" },
    "right_ring_middle": { pos: [4.6, 4.5, -0.1], parent: "right_ring_proximal" },
    "right_ring_distal": { pos: [4.6, 4, -0.1], parent: "right_ring_middle" },
    "right_pinky_proximal": { pos: [4.4, 5, -0.2], parent: "right_metacarpal_5" },
    "right_pinky_middle": { pos: [4.4, 4.5, -0.2], parent: "right_pinky_proximal" },
    "right_pinky_distal": { pos: [4.4, 4, -0.2], parent: "right_pinky_middle" },

    // Left Leg
    "left_hip": { pos: [-2, 4, 0], parent: "pelvis" },
    "left_femur_upper": { pos: [-2, 2, 0], parent: "left_hip" },
    "left_femur_mid": { pos: [-2, 0, 0], parent: "left_femur_upper" },
    "left_knee": { pos: [-2, -2, 0], parent: "left_femur_mid" },
    "left_tibia_upper": { pos: [-2, -4, 0], parent: "left_knee" },
    "left_fibula_upper": { pos: [-2.2, -4, 0], parent: "left_knee" },
    "left_tibia_mid": { pos: [-2, -6, 0], parent: "left_tibia_upper" },
    "left_fibula_mid": { pos: [-2.2, -6, 0], parent: "left_fibula_upper" },
    "left_ankle": { pos: [-2, -8, 0], parent: "left_tibia_mid" },
    "left_tarsal_1": { pos: [-2, -8.2, 0.2], parent: "left_ankle" },
    "left_tarsal_2": { pos: [-2, -8.2, 0.4], parent: "left_tarsal_1" },
    "left_metatarsal_1": { pos: [-2, -8.2, 0.6], parent: "left_tarsal_2" },
    "left_metatarsal_2": { pos: [-1.9, -8.2, 0.6], parent: "left_tarsal_2" },
    "left_metatarsal_3": { pos: [-2, -8.2, 0.6], parent: "left_tarsal_2" },
    "left_metatarsal_4": { pos: [-2.1, -8.2, 0.6], parent: "left_tarsal_2" },
    "left_metatarsal_5": { pos: [-2.2, -8.2, 0.6], parent: "left_tarsal_2" },
    "left_toe_big_proximal": { pos: [-2, -8.2, 0.8], parent: "left_metatarsal_1" },
    "left_toe_big_distal": { pos: [-2, -8.2, 1], parent: "left_toe_big_proximal" },
    "left_toe_index_proximal": { pos: [-1.9, -8.2, 0.8], parent: "left_metatarsal_2" },
    "left_toe_index_distal": { pos: [-1.9, -8.2, 1], parent: "left_toe_index_proximal" },
    "left_toe_middle_proximal": { pos: [-2, -8.2, 0.8], parent: "left_metatarsal_3" },
    "left_toe_middle_distal": { pos: [-2, -8.2, 1], parent: "left_toe_middle_proximal" },
    "left_toe_ring_proximal": { pos: [-2.1, -8.2, 0.8], parent: "left_metatarsal_4" },
    "left_toe_ring_distal": { pos: [-2.1, -8.2, 1], parent: "left_toe_ring_proximal" },
    "left_toe_little_proximal": { pos: [-2.2, -8.2, 0.8], parent: "left_metatarsal_5" },
    "left_toe_little_distal": { pos: [-2.2, -8.2, 1], parent: "left_toe_little_proximal" },

    // Right Leg
    "right_hip": { pos: [2, 4, 0], parent: "pelvis" },
    "right_femur_upper": { pos: [2, 2, 0], parent: "right_hip" },
    "right_femur_mid": { pos: [2, 0, 0], parent: "right_femur_upper" },
    "right_knee": { pos: [2, -2, 0], parent: "right_femur_mid" },
    "right_tibia_upper": { pos: [2, -4, 0], parent: "right_knee" },
    "right_fibula_upper": { pos: [2.2, -4, 0], parent: "right_knee" },
    "right_tibia_mid": { pos: [2, -6, 0], parent: "right_tibia_upper" },
    "right_fibula_mid": { pos: [2.2, -6, 0], parent: "right_fibula_upper" },
    "right_ankle": { pos: [2, -8, 0], parent: "right_tibia_mid" },
    "right_tarsal_1": { pos: [2, -8.2, 0.2], parent: "right_ankle" },
    "right_tarsal_2": { pos: [2, -8.2, 0.4], parent: "right_tarsal_1" },
    "right_metatarsal_1": { pos: [2, -8.2, 0.6], parent: "right_tarsal_2" },
    "right_metatarsal_2": { pos: [1.9, -8.2, 0.6], parent: "right_tarsal_2" },
    "right_metatarsal_3": { pos: [2, -8.2, 0.6], parent: "right_tarsal_2" },
    "right_metatarsal_4": { pos: [2.1, -8.2, 0.6], parent: "right_tarsal_2" },
    "right_metatarsal_5": { pos: [2.2, -8.2, 0.6], parent: "right_tarsal_2" },
    "right_toe_big_proximal": { pos: [2, -8.2, 0.8], parent: "right_metatarsal_1" },
    "right_toe_big_distal": { pos: [2, -8.2, 1], parent: "right_toe_big_proximal" },
    "right_toe_index_proximal": { pos: [1.9, -8.2, 0.8], parent: "right_metatarsal_2" },
    "right_toe_index_distal": { pos: [1.9, -8.2, 1], parent: "right_toe_index_proximal" },
    "right_toe_middle_proximal": { pos: [2, -8.2, 0.8], parent: "right_metatarsal_3" },
    "right_toe_middle_distal": { pos: [2, -8.2, 1], parent: "right_toe_middle_proximal" },
    "right_toe_ring_proximal": { pos: [2.1, -8.2, 0.8], parent: "right_metatarsal_4" },
    "right_toe_ring_distal": { pos: [2.1, -8.2, 1], parent: "right_toe_ring_proximal" },
    "right_toe_little_proximal": { pos: [2.2, -8.2, 0.8], parent: "right_metatarsal_5" },
    "right_toe_little_distal": { pos: [2.2, -8.2, 1], parent: "right_toe_little_proximal" },

    // Laryngeal Structures
    "hyoid": { pos: [0, 16.7, 0.5], parent: "neck_c3" },
    "thyroid_cartilage": { pos: [0, 16.4, 0.6], parent: "hyoid" },
    "cricoid_cartilage": { pos: [0, 16.0, 0.6], parent: "thyroid_cartilage" },
    "epiglottis": { pos: [0, 16.6, 0.7], parent: "hyoid" },

    // Tongue Bones (Simplified)
    "tongue_base": { pos: [0, 18.0, 0.4], parent: "jaw" },
    "tongue_mid": { pos: [0, 18.0, 0.8], parent: "tongue_base" },
    "tongue_tip": { pos: [0, 18.0, 1.2], parent: "tongue_mid" }
};

export { fullSkeletonNodes };