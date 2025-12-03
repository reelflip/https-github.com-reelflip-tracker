

import { Subject, User, Test, Question, Quote, Flashcard } from './types';

export const COACHING_INSTITUTES = [
    "Allen Career Institute",
    "FIITJEE",
    "Aakash Byju's",
    "Resonance",
    "Sri Chaitanya",
    "Narayana Group",
    "Physics Wallah (Vidyapeeth)",
    "Unacademy Centers",
    "Bansal Classes",
    "Vibrant Academy",
    "Motion Education",
    "Reliable Institute",
    "Bakliwal Tutorials",
    "Pace IIT & Medical",
    "VMC (Vidyamandir Classes)",
    "Super 30",
    "Self Study / Online Only"
];

export const TARGET_YEARS = [2025, 2026, 2027, 2028];

export const MOCK_USERS: User[] = [
  { 
      id: 'admin_001', 
      name: 'System Administrator', 
      email: 'admin', 
      role: 'ADMIN',
      isVerified: true
  },
  {
      id: 'u_student_demo',
      name: 'InnFriend Student',
      email: 'innfriend1@gmail.com',
      role: 'STUDENT',
      isVerified: true,
      institute: 'Allen Career Institute',
      targetYear: 2025,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=innfriend1',
      parentId: 'u_parent_demo'
  },
  {
      id: 'u_parent_demo',
      name: 'Vikas Parent',
      email: 'vikas.00@gmail.com',
      role: 'PARENT',
      isVerified: true,
      studentId: 'u_student_demo',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikas'
  }
];

export const DEFAULT_QUOTES: Quote[] = [
    { id: 'q1', text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { id: 'q2', text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { id: 'q3', text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { id: 'q4', text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { id: 'q5', text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
    // --- PHYSICS ---
    // Mechanics
    { id: 'ph_1', subjectId: 'phys', front: 'Equation of Trajectory (Projectile Motion)', back: 'y = x tan(θ) - (gx²) / (2u² cos²θ)', difficulty: 'MEDIUM' },
    { id: 'ph_2', subjectId: 'phys', front: 'Maximum Range of Projectile', back: 'R_max = u² / g (at θ = 45°)', difficulty: 'EASY' },
    { id: 'ph_3', subjectId: 'phys', front: 'Pseudo Force Direction', back: 'Opposite to the acceleration of the non-inertial frame. F_p = -ma', difficulty: 'EASY' },
    { id: 'ph_4', subjectId: 'phys', front: 'Work-Energy Theorem', back: 'W_all_forces = ΔK (Change in Kinetic Energy)', difficulty: 'EASY' },
    { id: 'ph_5', subjectId: 'phys', front: 'Center of Mass (Semi-Circular Ring)', back: 'y_cm = 2R / π', difficulty: 'HARD' },
    { id: 'ph_6', subjectId: 'phys', front: 'Moment of Inertia (Solid Sphere)', back: 'I = (2/5)MR²', difficulty: 'MEDIUM' },
    { id: 'ph_7', subjectId: 'phys', front: 'Moment of Inertia (Hollow Sphere)', back: 'I = (2/3)MR²', difficulty: 'MEDIUM' },
    { id: 'ph_8', subjectId: 'phys', front: 'Escape Velocity', back: 'v_e = √(2GM / R) ≈ 11.2 km/s (Earth)', difficulty: 'MEDIUM' },
    { id: 'ph_9', subjectId: 'phys', front: 'Bernoulli\'s Principle', back: 'P + ½ρv² + ρgh = Constant', difficulty: 'MEDIUM' },
    { id: 'ph_10', subjectId: 'phys', front: 'Terminal Velocity formula', back: 'v_t = 2r²(ρ - σ)g / 9η', difficulty: 'HARD' },
    
    // Thermo & Waves
    { id: 'ph_11', subjectId: 'phys', front: 'First Law of Thermodynamics', back: 'ΔQ = ΔU + ΔW', difficulty: 'EASY' },
    { id: 'ph_12', subjectId: 'phys', front: 'Efficiency of Carnot Engine', back: 'η = 1 - (T_sink / T_source)', difficulty: 'MEDIUM' },
    { id: 'ph_13', subjectId: 'phys', front: 'Time Period of Simple Pendulum', back: 'T = 2π √(L / g)', difficulty: 'EASY' },
    { id: 'ph_14', subjectId: 'phys', front: 'Doppler Effect (Apparent Frequency)', back: 'f\' = f (v ± v_o) / (v ∓ v_s)', difficulty: 'HARD' },

    // Electromagnetism
    { id: 'ph_15', subjectId: 'phys', front: 'Coulomb\'s Law', back: 'F = k(q₁q₂) / r²', difficulty: 'EASY' },
    { id: 'ph_16', subjectId: 'phys', front: 'Electric Field due to Infite Line Charge', back: 'E = λ / (2πε₀r)', difficulty: 'MEDIUM' },
    { id: 'ph_17', subjectId: 'phys', front: 'Capacitance of Parallel Plate', back: 'C = (Kε₀A) / d', difficulty: 'EASY' },
    { id: 'ph_18', subjectId: 'phys', front: 'Energy Stored in Capacitor', back: 'U = ½CV² = Q² / 2C', difficulty: 'EASY' },
    { id: 'ph_19', subjectId: 'phys', front: 'Biot-Savart Law (Mag Field)', back: 'dB = (μ₀/4π) * (Idl x r) / r³', difficulty: 'HARD' },
    { id: 'ph_20', subjectId: 'phys', front: 'Magnetic Field inside Solenoid', back: 'B = μ₀ni', difficulty: 'MEDIUM' },
    { id: 'ph_21', subjectId: 'phys', front: 'Resonant Frequency (LCR Circuit)', back: 'ω = 1 / √(LC)', difficulty: 'MEDIUM' },

    // Optics & Modern Physics
    { id: 'ph_22', subjectId: 'phys', front: 'Lens Maker\'s Formula', back: '1/f = (μ - 1)(1/R₁ - 1/R₂)', difficulty: 'HARD' },
    { id: 'ph_23', subjectId: 'phys', front: 'Young\'s Double Slit (Fringe Width)', back: 'β = Dλ / d', difficulty: 'MEDIUM' },
    { id: 'ph_24', subjectId: 'phys', front: 'Einstein\'s Photoelectric Equation', back: 'K_max = hν - Φ (Work Function)', difficulty: 'MEDIUM' },
    { id: 'ph_25', subjectId: 'phys', front: 'De-Broglie Wavelength', back: 'λ = h / p = h / mv', difficulty: 'EASY' },
    { id: 'ph_26', subjectId: 'phys', front: 'Radioactive Decay Law', back: 'N = N₀ e^(-λt)', difficulty: 'MEDIUM' },

    // --- CHEMISTRY ---
    // Physical
    { id: 'ch_1', subjectId: 'chem', front: 'Rydberg Formula (Hydrogen)', back: '1/λ = R (1/n₁² - 1/n₂²)', difficulty: 'MEDIUM' },
    { id: 'ch_2', subjectId: 'chem', front: 'Ideal Gas Equation', back: 'PV = nRT', difficulty: 'EASY' },
    { id: 'ch_3', subjectId: 'chem', front: 'Compressibility Factor (Z)', back: 'Z = PV / nRT', difficulty: 'MEDIUM' },
    { id: 'ch_4', subjectId: 'chem', front: 'Gibbs Helmholtz Equation', back: 'ΔG = ΔH - TΔS', difficulty: 'MEDIUM' },
    { id: 'ch_5', subjectId: 'chem', front: 'Work done (Isothermal Reversible)', back: 'W = -2.303 nRT log(V₂/V₁)', difficulty: 'HARD' },
    { id: 'ch_6', subjectId: 'chem', front: 'Bragg\'s Equation', back: 'nλ = 2d sin(θ)', difficulty: 'MEDIUM' },
    { id: 'ch_7', subjectId: 'chem', front: 'Raoult\'s Law', back: 'P_total = P_A°x_A + P_B°x_B', difficulty: 'EASY' },
    { id: 'ch_8', subjectId: 'chem', front: 'Nernst Equation (EMF)', back: 'E = E° - (0.0591/n) log Q', difficulty: 'HARD' },
    { id: 'ch_9', subjectId: 'chem', front: 'First Order Kinetics (Half Life)', back: 't_½ = 0.693 / k', difficulty: 'EASY' },
    { id: 'ch_10', subjectId: 'chem', front: 'Arrhenius Equation', back: 'k = A e^(-Ea / RT)', difficulty: 'MEDIUM' },

    // Inorganic
    { id: 'ch_11', subjectId: 'chem', front: 'Bond Order Formula', back: 'BO = ½ (Nb - Na)', difficulty: 'EASY' },
    { id: 'ch_12', subjectId: 'chem', front: 'Hybridization Formula', back: 'H = ½ (V + M - C + A)', difficulty: 'MEDIUM' },
    { id: 'ch_13', subjectId: 'chem', front: 'Spin Only Magnetic Moment', back: 'μ = √(n(n+2)) BM', difficulty: 'MEDIUM' },
    { id: 'ch_14', subjectId: 'chem', front: 'Flame Test: Sodium (Na)', back: 'Golden Yellow', difficulty: 'EASY' },
    { id: 'ch_15', subjectId: 'chem', front: 'Flame Test: Copper (Cu)', back: 'Bluish Green', difficulty: 'EASY' },

    // Organic
    { id: 'ch_16', subjectId: 'chem', front: 'Markovnikov\'s Rule', back: 'Negative part of reagent goes to Carbon with fewer Hydrogens.', difficulty: 'EASY' },
    { id: 'ch_17', subjectId: 'chem', front: 'Anti-Markovnikov (Peroxide Effect)', back: 'Only valid for HBr + Peroxide. Br goes to Carbon with MORE Hydrogens.', difficulty: 'MEDIUM' },
    { id: 'ch_18', subjectId: 'chem', front: 'Lucas Reagent', back: 'Conc. HCl + Anhydrous ZnCl₂ (Distinguishes Alcohols)', difficulty: 'MEDIUM' },
    { id: 'ch_19', subjectId: 'chem', front: 'Reimer-Tiemann Reaction Product', back: 'Salicylaldehyde (from Phenol)', difficulty: 'HARD' },
    { id: 'ch_20', subjectId: 'chem', front: 'Cannizzaro Reaction Condition', back: 'Aldehydes with NO alpha-hydrogen + Conc. Base', difficulty: 'HARD' },
    { id: 'ch_21', subjectId: 'chem', front: 'Aldol Condensation Condition', back: 'Aldehydes/Ketones WITH alpha-hydrogen + Dilute Base', difficulty: 'HARD' },
    { id: 'ch_22', subjectId: 'chem', front: 'Hinsberg Reagent', back: 'Benzenesulfonyl chloride (Separates 1°, 2°, 3° Amines)', difficulty: 'HARD' },

    // --- MATHEMATICS ---
    // Algebra
    { id: 'ma_1', subjectId: 'math', front: 'Sum of roots (Quadratic)', back: 'α + β = -b/a', difficulty: 'EASY' },
    { id: 'ma_2', subjectId: 'math', front: 'Product of roots (Quadratic)', back: 'αβ = c/a', difficulty: 'EASY' },
    { id: 'ma_3', subjectId: 'math', front: 'Sum of n terms of GP', back: 'Sn = a(r^n - 1) / (r - 1) for r > 1', difficulty: 'MEDIUM' },
    { id: 'ma_4', subjectId: 'math', front: 'Sum of Infinite GP', back: 'S_inf = a / (1 - r) for |r| < 1', difficulty: 'EASY' },
    { id: 'ma_5', subjectId: 'math', front: 'Logarithm Power Rule', back: 'log(a^b) = b log(a)', difficulty: 'EASY' },
    { id: 'ma_6', subjectId: 'math', front: 'Binomial General Term', back: 'T_(r+1) = nCr (x)^(n-r) (y)^r', difficulty: 'MEDIUM' },
    { id: 'ma_7', subjectId: 'math', front: 'Expansion of e^x', back: '1 + x + x²/2! + x³/3! + ...', difficulty: 'HARD' },

    // Trigonometry
    { id: 'ma_8', subjectId: 'math', front: 'sin(A+B)', back: 'sinAcosB + cosAsinB', difficulty: 'EASY' },
    { id: 'ma_9', subjectId: 'math', front: 'cos(2A)', back: 'cos²A - sin²A = 2cos²A - 1', difficulty: 'MEDIUM' },
    { id: 'ma_10', subjectId: 'math', front: 'Sine Rule', back: 'a/sinA = b/sinB = c/sinC = 2R', difficulty: 'MEDIUM' },
    { id: 'ma_11', subjectId: 'math', front: 'Cosine Rule (side a)', back: 'a² = b² + c² - 2bc cosA', difficulty: 'MEDIUM' },

    // Coordinate Geometry
    { id: 'ma_12', subjectId: 'math', front: 'Slope Point Form', back: 'y - y₁ = m(x - x₁)', difficulty: 'EASY' },
    { id: 'ma_13', subjectId: 'math', front: 'Distance of point from line', back: '|ax₁ + by₁ + c| / √(a² + b²)', difficulty: 'MEDIUM' },
    { id: 'ma_14', subjectId: 'math', front: 'Condition for Orthogonality of 2 circles', back: '2g₁g₂ + 2f₁f₂ = c₁ + c₂', difficulty: 'HARD' },
    { id: 'ma_15', subjectId: 'math', front: 'Length of Latus Rectum (Parabola y²=4ax)', back: '4a', difficulty: 'MEDIUM' },
    { id: 'ma_16', subjectId: 'math', front: 'Eccentricity of Ellipse', back: 'e = √(1 - b²/a²) where a > b', difficulty: 'MEDIUM' },

    // Calculus
    { id: 'ma_17', subjectId: 'math', front: 'Limit (sin x / x) as x->0', back: '1', difficulty: 'EASY' },
    { id: 'ma_18', subjectId: 'math', front: 'Derivative of tan(x)', back: 'sec²(x)', difficulty: 'EASY' },
    { id: 'ma_19', subjectId: 'math', front: 'Integration by Parts', back: '∫uv dx = u∫v dx - ∫(u\' ∫v dx) dx', difficulty: 'HARD' },
    { id: 'ma_20', subjectId: 'math', front: 'Area under curve y=f(x)', back: '∫ y dx (from a to b)', difficulty: 'EASY' },
    
    // Vectors & 3D
    { id: 'ma_21', subjectId: 'math', front: 'Dot Product (a . b)', back: '|a||b| cosθ', difficulty: 'EASY' },
    { id: 'ma_22', subjectId: 'math', front: 'Cross Product Magnitude', back: '|a||b| sinθ', difficulty: 'EASY' },
    { id: 'ma_23', subjectId: 'math', front: 'Volume of Parallelepiped', back: '[a b c] (Scalar Triple Product)', difficulty: 'HARD' },
    { id: 'ma_24', subjectId: 'math', front: 'Shortest Distance (Skew Lines)', back: '|(a₂-a₁) . (b₁ x b₂)| / |b₁ x b₂|', difficulty: 'HARD' }
];

export const JEE_SYLLABUS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    chapters: [
      {
        id: 'm_sets',
        name: 'Unit 1: Sets, Relations and Functions',
        topics: [
          { id: 'm_sets_1', name: 'Sets and their representation' },
          { id: 'm_sets_2', name: 'Relations and Functions' }
        ]
      },
      {
        id: 'm_complex',
        name: 'Unit 2: Complex Numbers & Quadratic Equations',
        topics: [
          { id: 'm_complex_1', name: 'Complex Numbers' },
          { id: 'm_complex_2', name: 'Quadratic Equations' }
        ]
      },
      {
        id: 'm_matrices',
        name: 'Unit 3: Matrices and Determinants',
        topics: [
          { id: 'm_mat_1', name: 'Matrices & Algebra' },
          { id: 'm_mat_2', name: 'Determinants' }
        ]
      },
      {
        id: 'm_pnc',
        name: 'Unit 4: Permutations and Combinations',
        topics: [
          { id: 'm_pnc_1', name: 'Fundamental Principle' },
          { id: 'm_pnc_2', name: 'P(n,r) and C(n,r)' }
        ]
      },
      {
        id: 'm_binomial',
        name: 'Unit 5: Binomial Theorem',
        topics: [
          { id: 'm_bin_1', name: 'Binomial Theorem & Applications' }
        ]
      },
      {
        id: 'm_seq',
        name: 'Unit 6: Sequence and Series',
        topics: [
          { id: 'm_seq_1', name: 'AP and GP' },
          { id: 'm_seq_2', name: 'AM and GM' }
        ]
      },
      {
        id: 'm_calc1',
        name: 'Unit 7: Limit, Continuity and Differentiability',
        topics: [
          { id: 'm_lim_1', name: 'Limits & Continuity' },
          { id: 'm_lim_2', name: 'Differentiation' },
          { id: 'm_lim_3', name: 'Applications of Derivatives (Maxima/Minima)' }
        ]
      },
      {
        id: 'm_calc2',
        name: 'Unit 8: Integral Calculus',
        topics: [
          { id: 'm_int_1', name: 'Indefinite Integrals' },
          { id: 'm_int_2', name: 'Definite Integrals' }
        ]
      },
      {
        id: 'm_diff_eq',
        name: 'Unit 9: Differential Equations',
        topics: [
          { id: 'm_de_1', name: 'Order and Degree' },
          { id: 'm_de_2', name: 'Solutions of ODEs' }
        ]
      },
      {
        id: 'm_coord',
        name: 'Unit 10: Co-ordinate Geometry',
        topics: [
          { id: 'm_geo_1', name: 'Straight Lines' },
          { id: 'm_geo_2', name: 'Circles' },
          { id: 'm_geo_3', name: 'Conic Sections (Parabola, Ellipse, Hyperbola)' }
        ]
      },
      {
        id: 'm_3d',
        name: 'Unit 11: Three Dimensional Geometry',
        topics: [
          { id: 'm_3d_1', name: 'Coordinates & Distance' },
          { id: 'm_3d_2', name: 'Lines & Skew Lines' }
        ]
      },
      {
        id: 'm_vector',
        name: 'Unit 12: Vector Algebra',
        topics: [
          { id: 'm_vec_1', name: 'Vectors & Scalars' },
          { id: 'm_vec_2', name: 'Scalar & Vector Products' }
        ]
      },
      {
        id: 'm_stats',
        name: 'Unit 13: Statistics and Probability',
        topics: [
          { id: 'm_stat_1', name: 'Measures of Dispersion' },
          { id: 'm_stat_2', name: 'Probability & Bayes Theorem' }
        ]
      },
      {
        id: 'm_trig',
        name: 'Unit 14: Trigonometry',
        topics: [
          { id: 'm_trig_1', name: 'Identities & Functions' },
          { id: 'm_trig_2', name: 'Inverse Trigonometric Functions' }
        ]
      }
    ]
  },
  {
    id: 'phys',
    name: 'Physics',
    chapters: [
      {
        id: 'p_units',
        name: 'Unit 1: Units and Measurements',
        topics: [
          { id: 'p_unit_1', name: 'SI Units & Dimensions' },
          { id: 'p_unit_2', name: 'Errors in Measurement' }
        ]
      },
      {
        id: 'p_kinematics',
        name: 'Unit 2: Kinematics',
        topics: [
          { id: 'p_kin_1', name: 'Motion in Straight Line' },
          { id: 'p_kin_2', name: 'Projectile & Relative Motion' }
        ]
      },
      {
        id: 'p_laws',
        name: 'Unit 3: Laws of Motion',
        topics: [
          { id: 'p_law_1', name: 'Newtons Laws & Impulse' },
          { id: 'p_law_2', name: 'Friction' },
          { id: 'p_law_3', name: 'Circular Motion Dynamics' }
        ]
      },
      {
        id: 'p_work',
        name: 'Unit 4: Work, Energy and Power',
        topics: [
          { id: 'p_work_1', name: 'Work-Energy Theorem' },
          { id: 'p_work_2', name: 'Collisions' }
        ]
      },
      {
        id: 'p_rot',
        name: 'Unit 5: Rotational Motion',
        topics: [
          { id: 'p_rot_1', name: 'Center of Mass' },
          { id: 'p_rot_2', name: 'Torque & MOI' },
          { id: 'p_rot_3', name: 'Rolling Motion' }
        ]
      },
      {
        id: 'p_grav',
        name: 'Unit 6: Gravitation',
        topics: [
          { id: 'p_grav_1', name: 'Law of Gravitation & Potential' },
          { id: 'p_grav_2', name: 'Satellites & Escape Velocity' }
        ]
      },
      {
        id: 'p_solids',
        name: 'Unit 7: Properties of Solids and Liquids',
        topics: [
          { id: 'p_sol_1', name: 'Elasticity (Hookes Law)' },
          { id: 'p_sol_2', name: 'Fluid Mechanics (Bernoulli)' },
          { id: 'p_sol_3', name: 'Thermal Expansion & Calorimetry' }
        ]
      },
      {
        id: 'p_thermo',
        name: 'Unit 8: Thermodynamics',
        topics: [
          { id: 'p_th_1', name: 'Laws of Thermodynamics' },
          { id: 'p_th_2', name: 'Processes (Iso/Adia/Rev/Irrev)' }
        ]
      },
      {
        id: 'p_ktg',
        name: 'Unit 9: Kinetic Theory of Gases',
        topics: [
          { id: 'p_ktg_1', name: 'Ideal Gas Equation' },
          { id: 'p_ktg_2', name: 'DOF & Equipartition' }
        ]
      },
      {
        id: 'p_osc',
        name: 'Unit 10: Oscillations and Waves',
        topics: [
          { id: 'p_osc_1', name: 'SHM' },
          { id: 'p_osc_2', name: 'Sound & String Waves' }
        ]
      },
      {
        id: 'p_elec',
        name: 'Unit 11: Electrostatics',
        topics: [
          { id: 'p_el_1', name: 'Coulombs Law & Field' },
          { id: 'p_el_2', name: 'Gauss Law' },
          { id: 'p_el_3', name: 'Potential & Capacitors' }
        ]
      },
      {
        id: 'p_curr',
        name: 'Unit 12: Current Electricity',
        topics: [
          { id: 'p_cur_1', name: 'Ohms Law & Resistance' },
          { id: 'p_cur_2', name: 'Kirchhoffs Laws & Instruments' }
        ]
      },
      {
        id: 'p_mag',
        name: 'Unit 13: Magnetic Effects of Current',
        topics: [
          { id: 'p_mag_1', name: 'Biot-Savart & Ampere Law' },
          { id: 'p_mag_2', name: 'Force on Charge/Current' },
          { id: 'p_mag_3', name: 'Magnetism & Matter' }
        ]
      },
      {
        id: 'p_emi',
        name: 'Unit 14: EMI and AC',
        topics: [
          { id: 'p_emi_1', name: 'Electromagnetic Induction' },
          { id: 'p_emi_2', name: 'Alternating Currents & LCR' }
        ]
      },
      {
        id: 'p_emw',
        name: 'Unit 15: Electromagnetic Waves',
        topics: [
          { id: 'p_emw_1', name: 'EM Spectrum & Characteristics' }
        ]
      },
      {
        id: 'p_optics',
        name: 'Unit 16: Optics',
        topics: [
          { id: 'p_opt_1', name: 'Ray Optics & Instruments' },
          { id: 'p_opt_2', name: 'Wave Optics (Interference/Diffraction)' }
        ]
      },
      {
        id: 'p_dual',
        name: 'Unit 17: Dual Nature of Matter',
        topics: [
          { id: 'p_dual_1', name: 'Photoelectric Effect' },
          { id: 'p_dual_2', name: 'De-Broglie Hypothesis' }
        ]
      },
      {
        id: 'p_atom',
        name: 'Unit 18: Atoms and Nuclei',
        topics: [
          { id: 'p_at_1', name: 'Bohr Model' },
          { id: 'p_at_2', name: 'Radioactivity & Nuclear Physics' }
        ]
      },
      {
        id: 'p_semi',
        name: 'Unit 19: Electronic Devices',
        topics: [
          { id: 'p_semi_1', name: 'Semiconductors & Diodes' },
          { id: 'p_semi_2', name: 'Logic Gates' }
        ]
      },
      {
        id: 'p_exp',
        name: 'Unit 20: Experimental Skills',
        topics: [
          { id: 'p_exp_1', name: 'Lab Experiments & Observations' }
        ]
      }
    ]
  },
  {
    id: 'chem',
    name: 'Chemistry',
    chapters: [
      // Physical Chemistry
      {
        id: 'c_basic',
        name: 'Unit 1: Basic Concepts in Chemistry',
        topics: [
          { id: 'c_bas_1', name: 'Mole Concept & Stoichiometry' }
        ]
      },
      {
        id: 'c_atom',
        name: 'Unit 2: Atomic Structure',
        topics: [
          { id: 'c_at_1', name: 'Bohr Model & Quantum Numbers' },
          { id: 'c_at_2', name: 'Electronic Configuration' }
        ]
      },
      {
        id: 'c_bond',
        name: 'Unit 3: Chemical Bonding',
        topics: [
          { id: 'c_bn_1', name: 'Ionic & Covalent Bond' },
          { id: 'c_bn_2', name: 'VSEPR & MO Theory' }
        ]
      },
      {
        id: 'c_thermo',
        name: 'Unit 4: Chemical Thermodynamics',
        topics: [
          { id: 'c_th_1', name: 'First Law & Enthalpy' },
          { id: 'c_th_2', name: 'Entropy & Gibbs Energy' }
        ]
      },
      {
        id: 'c_sol',
        name: 'Unit 5: Solutions',
        topics: [
          { id: 'c_sol_1', name: 'Concentration Terms' },
          { id: 'c_sol_2', name: 'Colligative Properties' }
        ]
      },
      {
        id: 'c_equi',
        name: 'Unit 6: Equilibrium',
        topics: [
          { id: 'c_eq_1', name: 'Chemical Equilibrium' },
          { id: 'c_eq_2', name: 'Ionic Equilibrium (pH, Buffers)' }
        ]
      },
      {
        id: 'c_redox',
        name: 'Unit 7: Redox & Electrochemistry',
        topics: [
          { id: 'c_red_1', name: 'Redox Reactions' },
          { id: 'c_red_2', name: 'Cells & Nernst Equation' }
        ]
      },
      {
        id: 'c_kin',
        name: 'Unit 8: Chemical Kinetics',
        topics: [
          { id: 'c_kin_1', name: 'Rate Laws & Order' },
          { id: 'c_kin_2', name: 'Arrhenius Equation' }
        ]
      },
      // Inorganic
      {
        id: 'c_period',
        name: 'Unit 9: Classification of Elements',
        topics: [
          { id: 'c_per_1', name: 'Periodic Trends' }
        ]
      },
      {
        id: 'c_pblock',
        name: 'Unit 10: p-Block Elements',
        topics: [
          { id: 'c_pb_1', name: 'Group 13 to 18 Trends' }
        ]
      },
      {
        id: 'c_dfblock',
        name: 'Unit 11: d- and f- Block Elements',
        topics: [
          { id: 'c_df_1', name: 'Transition Elements' },
          { id: 'c_df_2', name: 'Lanthanoids' }
        ]
      },
      {
        id: 'c_coord',
        name: 'Unit 12: Coordination Compounds',
        topics: [
          { id: 'c_co_1', name: 'Nomenclature & Isomerism' },
          { id: 'c_co_2', name: 'Bonding (VBT/CFT)' }
        ]
      },
      // Organic
      {
        id: 'c_org_basic',
        name: 'Unit 13-14: Basic Organic Chemistry',
        topics: [
          { id: 'c_goc_1', name: 'Purification & Analysis' },
          { id: 'c_goc_2', name: 'Nomenclature & Isomerism' },
          { id: 'c_goc_3', name: 'Electronic Effects (GOC)' }
        ]
      },
      {
        id: 'c_hydro',
        name: 'Unit 15: Hydrocarbons',
        topics: [
          { id: 'c_hy_1', name: 'Alkanes, Alkenes, Alkynes' },
          { id: 'c_hy_2', name: 'Aromatic Hydrocarbons' }
        ]
      },
      {
        id: 'c_halo',
        name: 'Unit 16: Haloalkanes & Haloarenes',
        topics: [
          { id: 'c_hal_1', name: 'Preparation & Properties' }
        ]
      },
      {
        id: 'c_oxygen',
        name: 'Unit 17: Oxygen Containing Compounds',
        topics: [
          { id: 'c_ox_1', name: 'Alcohols, Phenols, Ethers' },
          { id: 'c_ox_2', name: 'Aldehydes & Ketones' },
          { id: 'c_ox_3', name: 'Carboxylic Acids' }
        ]
      },
      {
        id: 'c_nitrogen',
        name: 'Unit 18: Nitrogen Containing Compounds',
        topics: [
          { id: 'c_nit_1', name: 'Amines & Diazonium Salts' }
        ]
      },
      {
        id: 'c_bio',
        name: 'Unit 19: Biomolecules',
        topics: [
          { id: 'c_bio_1', name: 'Carbohydrates & Proteins' },
          { id: 'c_bio_2', name: 'Vitamins & Nucleic Acids' }
        ]
      },
      {
        id: 'c_prac',
        name: 'Unit 20: Practical Chemistry',
        topics: [
          { id: 'c_pr_1', name: 'Salt Analysis & Titrations' }
        ]
      }
    ]
  }
];

const SAMPLE_QUESTIONS: Question[] = [
  { id: 'q1', subjectId: 'phys', topicId: 'p_kin_1', text: 'A particle moves along a straight line. Its velocity is given by v = 3t^2. What is the acceleration at t=2?', options: ['6 m/s²', '12 m/s²', '3 m/s²', '0 m/s²'], correctOptionIndex: 1 },
  { id: 'q2', subjectId: 'chem', topicId: 'c_at_1', text: 'Which quantum number defines the orientation of the orbital?', options: ['Principal (n)', 'Azimuthal (l)', 'Magnetic (m)', 'Spin (s)'], correctOptionIndex: 2 },
  { id: 'q3', subjectId: 'math', topicId: 'm_lim_1', text: 'Evaluate limit x->0 of (sin x)/x', options: ['0', '1', 'Infinity', 'Undefined'], correctOptionIndex: 1 },
];

export const MOCK_TESTS: Test[] = [
  {
    id: 'admin_t1',
    title: 'first test series',
    durationMinutes: 180,
    questions: SAMPLE_QUESTIONS,
    category: 'ADMIN',
    difficulty: 'CUSTOM'
  },
  {
    id: 'jeem_2024_1',
    title: 'JEE Mains 2024 (Jan 27 Shift 1)',
    durationMinutes: 180,
    questions: SAMPLE_QUESTIONS,
    category: 'PAST_PAPER',
    difficulty: 'MAINS'
  },
  {
    id: 'jeem_2023_1',
    title: 'JEE Mains 2023 (Apr 10 Shift 2)',
    durationMinutes: 180,
    questions: SAMPLE_QUESTIONS,
    category: 'PAST_PAPER',
    difficulty: 'MAINS'
  },
  {
    id: 'jeem_2022_1',
    title: 'JEE Mains 2022 (June 24 Shift 1)',
    durationMinutes: 180,
    questions: SAMPLE_QUESTIONS,
    category: 'PAST_PAPER',
    difficulty: 'MAINS'
  },
  {
    id: 'jeem_2021_1',
    title: 'JEE Mains 2021 (Feb 24 Shift 2)',
    durationMinutes: 180,
    questions: SAMPLE_QUESTIONS,
    category: 'PAST_PAPER',
    difficulty: 'MAINS'
  },
  {
    id: 'jeem_2020_1',
    title: 'JEE Mains 2020 (Sept 2 Shift 1)',
    durationMinutes: 180,
    questions: SAMPLE_QUESTIONS,
    category: 'PAST_PAPER',
    difficulty: 'MAINS'
  },
  {
    id: 'jeea_2023_1',
    title: 'JEE Advanced 2023 (Paper 1)',
    durationMinutes: 180,
    questions: SAMPLE_QUESTIONS,
    category: 'PAST_PAPER',
    difficulty: 'ADVANCED'
  },
  {
    id: 'jeea_2022_1',
    title: 'JEE Advanced 2022 (Paper 1)',
    durationMinutes: 180,
    questions: SAMPLE_QUESTIONS,
    category: 'PAST_PAPER',
    difficulty: 'ADVANCED'
  }
];