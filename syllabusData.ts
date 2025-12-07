
// This file can be used to modularize the syllabus data if desired.
// Currently, the application imports everything from constants.ts.
// Keeping this file populated with valid data prevents import errors if refactoring occurs.

import { Subject } from './types';

export const JEE_SYLLABUS: Subject[] = [
    {
        id: 'phys',
        name: 'Physics',
        chapters: [
            {
                id: 'p_mech',
                name: 'Mechanics',
                topics: [
                    { id: 'p_unit_1', name: 'Units & Dimensions' },
                    { id: 'p_kin_1', name: 'Kinematics 1D' },
                    { id: 'p_kin_2', name: 'Projectile Motion' },
                    { id: 'p_laws_1', name: 'Newton\'s Laws of Motion' },
                    { id: 'p_fric', name: 'Friction' },
                    { id: 'p_work_1', name: 'Work, Energy & Power' },
                    { id: 'p_circ', name: 'Circular Motion' },
                    { id: 'p_com', name: 'Center of Mass' },
                    { id: 'p_rot_1', name: 'Rotational Motion' },
                    { id: 'p_grav', name: 'Gravitation' },
                    { id: 'p_solids', name: 'Properties of Solids' },
                    { id: 'p_fluids', name: 'Fluid Mechanics' }
                ]
            },
            {
                id: 'p_thermo',
                name: 'Heat & Thermodynamics',
                topics: [
                    { id: 'p_th_exp', name: 'Thermal Properties' },
                    { id: 'p_th_1', name: 'Thermodynamics' },
                    { id: 'p_ktg', name: 'Kinetic Theory of Gases' }
                ]
            },
            {
                id: 'p_elec_mag',
                name: 'Electromagnetism',
                topics: [
                    { id: 'p_elec_1', name: 'Electrostatics' },
                    { id: 'p_curr_1', name: 'Current Electricity' },
                    { id: 'p_mag_1', name: 'Moving Charges & Magnetism' },
                    { id: 'p_emi_1', name: 'EMI & AC' }
                ]
            },
            {
                id: 'p_optics_mod',
                name: 'Optics & Modern Physics',
                topics: [
                    { id: 'p_opt_1', name: 'Ray Optics' },
                    { id: 'p_wave_opt', name: 'Wave Optics' },
                    { id: 'p_dual_1', name: 'Dual Nature of Matter' },
                    { id: 'p_nuc_1', name: 'Atoms & Nuclei' },
                    { id: 'p_semi_1', name: 'Semiconductors' }
                ]
            }
        ]
    },
    {
        id: 'chem',
        name: 'Chemistry',
        chapters: [
            {
                id: 'c_phys',
                name: 'Physical Chemistry',
                topics: [
                    { id: 'c_bas_1', name: 'Mole Concept' },
                    { id: 'c_atm_1', name: 'Atomic Structure' },
                    { id: 'c_equil', name: 'Equilibrium' },
                    { id: 'c_kin_1', name: 'Chemical Kinetics' },
                    { id: 'c_elec', name: 'Electrochemistry' },
                    { id: 'c_soln', name: 'Solutions' },
                    { id: 'c_th_1', name: 'Thermodynamics' }
                ]
            },
            {
                id: 'c_inorg',
                name: 'Inorganic Chemistry',
                topics: [
                    { id: 'c_per_1', name: 'Periodic Table' },
                    { id: 'c_bond', name: 'Chemical Bonding' },
                    { id: 'c_coord', name: 'Coordination Compounds' },
                    { id: 'c_blk_1', name: 'p-Block Elements' },
                    { id: 'c_blk_2', name: 'd and f Block Elements' }
                ]
            },
            {
                id: 'c_org',
                name: 'Organic Chemistry',
                topics: [
                    { id: 'c_org_1', name: 'GOC (General Organic Chemistry)' },
                    { id: 'c_org_2', name: 'Hydrocarbons' },
                    { id: 'c_org_3', name: 'Haloalkanes & Haloarenes' },
                    { id: 'c_org_4', name: 'Aldehydes, Ketones & Acids' },
                    { id: 'c_org_5', name: 'Amines' },
                    { id: 'c_bio', name: 'Biomolecules' }
                ]
            }
        ]
    },
    {
        id: 'math',
        name: 'Mathematics',
        chapters: [
            {
                id: 'm_alg',
                name: 'Algebra',
                topics: [
                    { id: 'm_quad', name: 'Quadratic Equations' },
                    { id: 'm_seq', name: 'Sequence & Series' },
                    { id: 'm_comp_1', name: 'Complex Numbers' },
                    { id: 'm_mat', name: 'Matrices & Determinants' },
                    { id: 'm_bin_1', name: 'Binomial Theorem' },
                    { id: 'm_perm_1', name: 'Permutation & Combination' },
                    { id: 'm_prob', name: 'Probability' }
                ]
            },
            {
                id: 'm_calc',
                name: 'Calculus',
                topics: [
                    { id: 'm_func', name: 'Functions' },
                    { id: 'm_lim', name: 'Limits, Continuity & Derivability' },
                    { id: 'm_diff_1', name: 'Differentiation' },
                    { id: 'm_app_der', name: 'Application of Derivatives' },
                    { id: 'm_int_1', name: 'Indefinite Integration' },
                    { id: 'm_int_2', name: 'Definite Integration' },
                    { id: 'm_de_1', name: 'Differential Equations' }
                ]
            },
            {
                id: 'm_coord',
                name: 'Coordinate Geometry',
                topics: [
                    { id: 'm_coord_1', name: 'Straight Lines' },
                    { id: 'm_coord_2', name: 'Circles' },
                    { id: 'm_coord_3', name: 'Conic Sections' }
                ]
            },
            {
                id: 'm_vec_3d',
                name: 'Vectors & 3D',
                topics: [
                    { id: 'm_vect', name: 'Vectors' },
                    { id: 'm_3d_1', name: '3D Geometry' }
                ]
            },
            {
                id: 'm_trig',
                name: 'Trigonometry',
                topics: [
                    { id: 'm_trig_1', name: 'Trigonometric Ratios' },
                    { id: 'm_trig_eq', name: 'Trigonometric Equations' }
                ]
            }
        ]
    }
];

export const TOPIC_VIDEO_MAP: Record<string, string> = {
    // PHYSICS
    'p_unit_1': 'https://www.youtube.com/embed/hmJD8753wXY', // Units
    'p_kin_1': 'https://www.youtube.com/embed/1v1Z2y8gqQk', // Kinematics 1D
    'p_kin_2': 'https://www.youtube.com/embed/M8C_qGg7a7Y', // Projectile
    'p_law_1': 'https://www.youtube.com/embed/xZ1F3y5y5zY', // NLM
    'p_rot_1': 'https://www.youtube.com/embed/XgJ1s6R3y3c', // Rotation
    'p_elec_1': 'https://www.youtube.com/embed/0v8a4j1g3kU', // Electrostatics
    'p_opt_1': 'https://www.youtube.com/embed/7y8c9k0l1m2', // Ray Optics
    'p_work_1': 'https://www.youtube.com/embed/ltJ375-77O4', // Work Energy
    'p_grav_1': 'https://www.youtube.com/embed/w7sK1oO5_yE', // Gravitation
    'p_thermo': 'https://www.youtube.com/embed/9lX4Xb5qgq0', // Thermo
    'p_ac_1': 'https://www.youtube.com/embed/9a8b7c6d5e4', // AC
    
    // CHEMISTRY
    'c_bas_1': 'https://www.youtube.com/embed/8y9z0a1b2c3', // Mole Concept
    'c_atm_1': 'https://www.youtube.com/embed/9z8y7x6w5v4', // Atomic Structure
    'c_bnd_1': 'https://www.youtube.com/embed/1a2b3c4d5e6', // Bonding
    'c_org_2': 'https://www.youtube.com/embed/2b3c4d5e6f7', // Hydrocarbons
    'c_kin_1': 'https://www.youtube.com/embed/3c4d5e6f7g8', // Kinetics
    'c_equil': 'https://www.youtube.com/embed/4d5e6f7g8h9', // Equilibrium
    'c_coord': 'https://www.youtube.com/embed/5e6f7g8h9i0', // Coordination
    
    // MATHS
    'm_set_1': 'https://www.youtube.com/embed/3c4d5e6f7g8', // Sets
    'm_calc_1': 'https://www.youtube.com/embed/4d5e6f7g8h9', // Calculus
    'm_coord_1': 'https://www.youtube.com/embed/5e6f7g8h9i0', // Straight Lines
    'm_trig_1': 'https://www.youtube.com/embed/6f7g8h9i0j1', // Trigonometry
    'm_vect': 'https://www.youtube.com/embed/7g8h9i0j1k2', // Vectors
    'm_prob': 'https://www.youtube.com/embed/8h9i0j1k2l3', // Probability
    'm_mat_1': 'https://www.youtube.com/embed/9i0j1k2l3m4' // Matrices
};
