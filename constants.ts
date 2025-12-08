
import { Subject, User, Test, Question, Quote, Flashcard, MemoryHack, BlogPost, ExamComparisonItem } from './types';

// VERSION: v7.0 (Emergency Restoration)
// TIMESTAMP: 2025-12-07T14:30:00Z

export const COACHING_INSTITUTES = ["Allen Career Institute","FIITJEE","Aakash Byju's","Resonance","Sri Chaitanya","Narayana Group","Physics Wallah (Vidyapeeth)","Unacademy Centers","Bansal Classes","Vibrant Academy","Motion Education","Reliable Institute","Bakliwal Tutorials","Pace IIT & Medical","VMC (Vidyamandir Classes)","Super 30","Self Study / Online Only"];
export const TARGET_EXAMS = ["JEE Main & Advanced","NEET (Medical)","BITSAT (BITS Pilani)","VITEEE (VIT)","SRMJEEE (SRM)","MET (Manipal)","MHT-CET (Maharashtra)","WBJEE (West Bengal)","COMEDK (Karnataka)","AMUEEE (Aligarh)","CUET (Central Univ)","Other Engineering Exam"];
export const TARGET_YEARS = [2025, 2026, 2027, 2028];

export const MOCK_USERS: User[] = [
  { id: '100000', name: 'System Administrator', email: 'admin', role: 'ADMIN', isVerified: true },
  { id: '582910', name: 'InnFriend Student', email: 'innfriend1@gmail.com', role: 'STUDENT', isVerified: true, institute: 'Allen Career Institute', targetYear: 2025, targetExam: 'JEE Main & Advanced', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=innfriend1', parentId: '749201' },
  { id: '749201', name: 'Vikas Parent', email: 'vikas.00@gmail.com', role: 'PARENT', isVerified: true, studentId: '582910', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikas' }
];

export const DEFAULT_QUOTES: Quote[] = [
    { id: 'q1', text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { id: 'q2', text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { id: 'q3', text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { id: 'q4', text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { id: 'q5', text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" }
];

export const BLOG_POSTS: BlogPost[] = [
    { id: 'blog_1', title: 'The 1-7-30 Revision Strategy', excerpt: 'Learn the scientifically proven Spaced Repetition method.', author: 'Rahul Sharma', date: '2024-10-15', category: 'Strategy', imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000', content: '<p>Content regarding revision strategy...</p>' },
    { id: 'blog_2', title: 'Physics: Deriving vs Memorizing', excerpt: 'Why understanding derivation beats rote learning in JEE Advanced.', author: 'A. Verma', date: '2024-10-10', category: 'Subject-wise', imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000', content: '<p>Content regarding physics...</p>' },
    { id: 'blog_3', title: 'Exam Anxiety Hacks', excerpt: 'Simple breathing techniques to reset your brain.', author: 'Dr. S. Gupta', date: '2024-10-05', category: 'Motivation', imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000', content: '<p>Content regarding anxiety...</p>' }
];

export const EXAM_COMPARISON_DATA: ExamComparisonItem[] = [
    { name: 'JEE Advanced', difficulty: 5, color: 'text-red-600 bg-red-50 border-red-100', barColor: 'bg-red-600', borderColor: 'border-l-red-600', hoverBg: 'hover:bg-red-50/50', focus: 'Deep concepts, tricky, multi-step problems.', desc: 'The gateway to the IITs.', colleges: '23 IITs, IISc Bangalore.', dates: 'Late May' },
    { name: 'JEE Main', difficulty: 4, color: 'text-orange-600 bg-orange-50 border-orange-100', barColor: 'bg-orange-500', borderColor: 'border-l-orange-500', hoverBg: 'hover:bg-orange-50/50', focus: 'Balanced approach + NCERT.', desc: 'Entry to NITs/IIITs.', colleges: '31 NITs, 26 IIITs.', dates: 'Jan & April' },
    { name: 'BITSAT', difficulty: 3, color: 'text-purple-600 bg-purple-50 border-purple-100', barColor: 'bg-purple-500', borderColor: 'border-l-purple-500', hoverBg: 'hover:bg-purple-50/50', focus: 'Speed + Accuracy.', desc: 'Bits Pilani Entrance.', colleges: 'BITS Pilani, Goa, Hyd.', dates: 'May & June' }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
    { id: 'f1', subjectId: 'phys', difficulty: 'EASY', front: 'Range of Projectile', back: 'R = (u² sin 2θ) / g' },
    { id: 'f2', subjectId: 'chem', difficulty: 'MEDIUM', front: 'Hybridization of CH4', back: 'sp³ (Tetrahedral)' },
    { id: 'f3', subjectId: 'math', difficulty: 'HARD', front: 'd/dx sin(x)', back: 'cos(x)' },
    { id: 'f4', subjectId: 'phys', difficulty: 'MEDIUM', front: 'Newton 2nd Law', back: 'F = ma' },
    { id: 'f5', subjectId: 'chem', difficulty: 'EASY', front: 'pH formula', back: '-log[H+]' },
    { id: 'f6', subjectId: 'math', difficulty: 'MEDIUM', front: 'Sum n natural nos', back: 'n(n+1)/2' },
    { id: 'f7', subjectId: 'phys', difficulty: 'HARD', front: 'MOI Disc', back: 'MR²/2' },
    { id: 'f8', subjectId: 'chem', difficulty: 'HARD', front: 'Gibbs Free Energy', back: 'ΔG = ΔH - TΔS' },
    { id: 'f9', subjectId: 'math', difficulty: 'EASY', front: 'i²', back: '-1' },
    { id: 'f10', subjectId: 'phys', difficulty: 'MEDIUM', front: 'Unit Capacitance', back: 'Farad (F)' },
    { id: 'f11', subjectId: 'chem', difficulty: 'MEDIUM', front: 'Ideal Gas Eq', back: 'PV = nRT' },
    { id: 'f12', subjectId: 'math', difficulty: 'HARD', front: 'Int(1/x)', back: 'ln|x| + C' },
    { id: 'f13', subjectId: 'phys', difficulty: 'EASY', front: 'Kinetic Energy', back: '1/2 mv²' },
    { id: 'f14', subjectId: 'chem', difficulty: 'MEDIUM', front: 'Molarity', back: 'Moles/Vol(L)' },
    { id: 'f15', subjectId: 'math', difficulty: 'HARD', front: 'Sin(A+B)', back: 'sinAcosB + cosAsinB' }
];

export const INITIAL_MEMORY_HACKS: MemoryHack[] = [
    { id: 'h1', subjectId: 'chem', category: 'Inorganic', title: 'Reactivity Series', description: 'Order of metals', trick: 'Please Stop Calling Me A Careless Zebra...', tags: ['Metals'] },
    { id: 'h2', subjectId: 'phys', category: 'Optics', title: 'VIBGYOR', description: 'Spectrum colors', trick: 'Violet Indigo Blue Green Yellow Orange Red', tags: ['Light'] },
    { id: 'h3', subjectId: 'math', category: 'Trig', title: 'ASTC Rule', description: 'Quadrants', trick: 'Add Sugar To Coffee', tags: ['Trigonometry'] }
];

export const JEE_SYLLABUS: Subject[] = [
    { id: 'phys', name: 'Physics', chapters: [
        { id: 'p_mech', name: 'Mechanics', topics: [{id:'p_unit_1',name:'Units & Dimensions'},{id:'p_kin_1',name:'Kinematics 1D'},{id:'p_kin_2',name:'Projectile Motion'},{id:'p_laws_1',name:'NLM'},{id:'p_fric',name:'Friction'},{id:'p_work_1',name:'Work Energy'},{id:'p_circ',name:'Circular Motion'},{id:'p_com',name:'Center of Mass'},{id:'p_rot_1',name:'Rotation'},{id:'p_grav',name:'Gravitation'}] },
        { id: 'p_thermo', name: 'Thermodynamics', topics: [{id:'p_th_exp',name:'Thermal Properties'},{id:'p_th_1',name:'Thermodynamics'},{id:'p_ktg',name:'KTG'}] },
        { id: 'p_elec', name: 'Electrodynamics', topics: [{id:'p_elec_1',name:'Electrostatics'},{id:'p_curr_1',name:'Current Electricity'},{id:'p_mag_1',name:'Magnetism'},{id:'p_emi_1',name:'EMI & AC'}] },
        { id: 'p_opt', name: 'Optics & Modern', topics: [{id:'p_opt_1',name:'Ray Optics'},{id:'p_wave_opt',name:'Wave Optics'},{id:'p_dual_1',name:'Dual Nature'},{id:'p_nuc_1',name:'Atoms & Nuclei'},{id:'p_semi_1',name:'Semiconductors'}] }
    ]},
    { id: 'chem', name: 'Chemistry', chapters: [
        { id: 'c_phys', name: 'Physical Chem', topics: [{id:'c_bas_1',name:'Mole Concept'},{id:'c_atm_1',name:'Atomic Structure'},{id:'c_equil',name:'Equilibrium'},{id:'c_kin_1',name:'Kinetics'},{id:'c_elec',name:'Electrochemistry'},{id:'c_soln',name:'Solutions'}] },
        { id: 'c_inorg', name: 'Inorganic Chem', topics: [{id:'c_per_1',name:'Periodic Table'},{id:'c_bond',name:'Chemical Bonding'},{id:'c_coord',name:'Coordination'},{id:'c_blk_1',name:'p-Block'},{id:'c_blk_2',name:'d-f Block'}] },
        { id: 'c_org', name: 'Organic Chem', topics: [{id:'c_org_1',name:'GOC'},{id:'c_org_2',name:'Hydrocarbons'},{id:'c_org_3',name:'Haloalkanes'},{id:'c_org_4',name:'Aldehydes/Ketones'},{id:'c_org_5',name:'Amines'},{id:'c_bio',name:'Biomolecules'}] }
    ]},
    { id: 'math', name: 'Mathematics', chapters: [
        { id: 'm_alg', name: 'Algebra', topics: [{id:'m_quad',name:'Quadratic Eq'},{id:'m_seq',name:'Sequence Series'},{id:'m_comp_1',name:'Complex Nos'},{id:'m_mat',name:'Matrices'},{id:'m_bin_1',name:'Binomial'},{id:'m_perm_1',name:'P & C'},{id:'m_prob',name:'Probability'}] },
        { id: 'm_calc', name: 'Calculus', topics: [{id:'m_func',name:'Functions'},{id:'m_lim',name:'Limits'},{id:'m_diff_1',name:'Differentiation'},{id:'m_int_1',name:'Integration'},{id:'m_de_1',name:'Diff Equations'}] },
        { id: 'm_coord', name: 'Coordinate Geom', topics: [{id:'m_coord_1',name:'Straight Lines'},{id:'m_coord_2',name:'Circles'},{id:'m_coord_3',name:'Conic Sections'}] },
        { id: 'm_vec', name: 'Vectors & 3D', topics: [{id:'m_vect',name:'Vectors'},{id:'m_3d_1',name:'3D Geometry'}] },
        { id: 'm_trig', name: 'Trigonometry', topics: [{id:'m_trig_1',name:'Ratios & Identities'},{id:'m_trig_eq',name:'Equations'}] }
    ]}
];

export const TOPIC_VIDEO_MAP: Record<string, string> = {
    'p_unit_1': 'https://www.youtube.com/embed/hmJD8753wXY', 'p_kin_1': 'https://www.youtube.com/embed/1v1Z2y8gqQk', 'p_kin_2': 'https://www.youtube.com/embed/M8C_qGg7a7Y',
    'p_law_1': 'https://www.youtube.com/embed/xZ1F3y5y5zY', 'p_rot_1': 'https://www.youtube.com/embed/XgJ1s6R3y3c', 'p_elec_1': 'https://www.youtube.com/embed/0v8a4j1g3kU',
    'c_bas_1': 'https://www.youtube.com/embed/8y9z0a1b2c3', 'c_atm_1': 'https://www.youtube.com/embed/9z8y7x6w5v4', 'c_bnd_1': 'https://www.youtube.com/embed/1a2b3c4d5e6',
    'm_set_1': 'https://www.youtube.com/embed/3c4d5e6f7g8', 'm_calc_1': 'https://www.youtube.com/embed/4d5e6f7g8h9', 'm_coord_1': 'https://www.youtube.com/embed/5e6f7g8h9i0'
};

export const QUESTIONS_POOL: Question[] = [
    { id: 'q1', subjectId: 'phys', topicId: 'p_kin_1', text: 'Unit of Force?', options: ['Newton','Joule','Watt','Pascal'], correctOptionIndex: 0 },
    { id: 'q2', subjectId: 'chem', topicId: 'c_atm_1', text: 'Electron charge?', options: ['Positive','Negative','Neutral','None'], correctOptionIndex: 1 },
    { id: 'q3', subjectId: 'math', topicId: 'm_quad', text: 'Roots of x^2-1=0?', options: ['1,-1','1,1','-1,-1','0,0'], correctOptionIndex: 0 }
];

export const MOCK_TESTS: Test[] = [
    { id: 't1', title: 'JEE Main Mock 1', durationMinutes: 180, category: 'PAST_PAPER', difficulty: 'MAINS', examType: 'JEE', questions: QUESTIONS_POOL },
    { id: 't2', title: 'BITSAT Speed Test', durationMinutes: 180, category: 'PAST_PAPER', difficulty: 'CUSTOM', examType: 'BITSAT', questions: QUESTIONS_POOL }
];

export const AI_KNOWLEDGE_BASE: Record<string, string> = {
    "torque": "Torque is the rotational equivalent of linear force. It is the product of the force and the perpendicular distance from the axis of rotation. Formula: τ = r × F.",
    "entropy": "Entropy is a measure of the disorder or randomness of a system. In thermodynamics, it represents the unavailability of a system's thermal energy for conversion into mechanical work.",
    "projectile motion": "Projectile motion is a form of motion experienced by an object or particle that is projected near the Earth's surface and moves along a curved path under the action of gravity only.",
    "ohm's law": "Ohm's law states that the current through a conductor between two points is directly proportional to the voltage across the two points. Formula: V = IR.",
    "integration": "Integration is a fundamental concept in calculus, which is the reverse process of differentiation. It is used to find areas, volumes, central points and many useful things.",
    "cannizzaro reaction": "Cannizzaro reaction is a chemical reaction that involves the base-induced disproportionation of an aldehyde lacking a hydrogen atom in the alpha position.",
    "vsepr theory": "Valence shell electron pair repulsion (VSEPR) theory is a model used in chemistry to predict the geometry of individual molecules from the number of electron pairs surrounding their central atoms.",
    "newton's second law": "Newton's second law states that the rate of change of momentum of a body is directly proportional to the applied force and takes place in the direction in which the force acts. F = ma.",
    "photosynthesis": "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.",
    "mitochondria": "Mitochondria are membrane-bound cell organelles (mitochondrion, singular) that generate most of the chemical energy needed to power the cell's biochemical reactions.",
    "derivative": "The derivative of a function of a real variable measures the sensitivity to change of the function value (output value) with respect to a change in its argument (input value).",
    "matrix": "A matrix is a rectangular array or table of numbers, symbols, or expressions, arranged in rows and columns.",
    "vector": "A vector is a quantity that has both magnitude and direction.",
    "scalar": "A scalar is a quantity that has magnitude but no direction.",
    "work": "Work is the energy transferred to or from an object via the application of force along a displacement. W = F.d",
    "energy": "Energy is the quantitative property that must be transferred to a body or physical system to perform work on the body, or to heat it.",
    "power": "Power is the rate of doing work or transferring heat, i.e. the amount of energy transferred or converted per unit time. P = W/t.",
    "momentum": "Momentum is the product of the mass and velocity of an object. p = mv.",
    "impulse": "Impulse is the integral of a force, F, over the time interval, t, for which it acts. J = FΔt.",
    "center of mass": "The center of mass of a distribution of mass in space is the unique point where the weighted relative position of the distributed mass sums to zero.",
    "moment of inertia": "Moment of inertia is a quantity expressing a body's tendency to resist angular acceleration.",
    "gravitation": "Gravitation is a natural phenomenon by which all things with mass or energy are brought toward one another.",
    "kepler's laws": "Kepler's laws of planetary motion are three scientific laws describing the motion of planets around the Sun.",
    "simple harmonic motion": "Simple harmonic motion is a type of periodic motion where the restoring force is directly proportional to the displacement and acts in the direction opposite to that of displacement.",
    "doppler effect": "The Doppler effect is the change in frequency of a wave in relation to an observer who is moving relative to the wave source.",
    "coulomb's law": "Coulomb's law states that the electrical force between two charged objects is directly proportional to the product of the quantity of charge on the objects and inversely proportional to the square of the separation distance between the two objects.",
    "gauss's law": "Gauss's law relates the distribution of electric charge to the resulting electric field.",
    "capacitance": "Capacitance is the ratio of the change in an electric charge in a system to the corresponding change in its electric potential.",
    "kirchhoff's laws": "Kirchhoff's circuit laws are two equalities that deal with the current and potential difference (commonly known as voltage) in the lumped element model of electrical circuits.",
    "biot-savart law": "The Biot-Savart law is an equation describing the magnetic field generated by a constant electric current.",
    "ampere's law": "Ampère's circuital law relates the integrated magnetic field around a closed loop to the electric current passing through the loop.",
    "lenz's law": "Lenz's law states that the direction of the electric current induced in a conductor by a changing magnetic field is such that the magnetic field created by the induced current opposes the initial changing magnetic field.",
    "snell's law": "Snell's law is a formula used to describe the relationship between the angles of incidence and refraction.",
    "photoelectric effect": "The photoelectric effect is the emission of electrons when electromagnetic radiation, such as light, hits a material.",
    "radioactivity": "Radioactivity is the process by which an unstable atomic nucleus loses energy by radiation.",
    "mole concept": "A mole is the amount of substance of a system which contains as many elementary entities as there are atoms in 0.012 kilogram of carbon 12.",
    "ideal gas law": "The ideal gas law is the equation of state of a hypothetical ideal gas. PV = nRT.",
    "boyle's law": "Boyle's law is an experimental gas law that describes how the pressure of a gas tends to increase as the volume of the container decreases.",
    "charles's law": "Charles's law is an experimental gas law that describes how gases tend to expand when heated.",
    "avogadro's law": "Avogadro's law states that equal volumes of all gases, at the same temperature and pressure, have the same number of molecules.",
    "dalton's law": "Dalton's law states that in a mixture of non-reacting gases, the total pressure exerted is equal to the sum of the partial pressures of the individual gases.",
    "graham's law": "Graham's law states that the rate of effusion of a gas is inversely proportional to the square root of the mass of its particles.",
    "hybridization": "Hybridization is the concept of mixing atomic orbitals into new hybrid orbitals suitable for the pairing of electrons to form chemical bonds in valence bond theory.",
    "le chatelier's principle": "Le Chatelier's principle states that if a dynamic equilibrium is disturbed by changing the conditions, the position of equilibrium shifts to counteract the change to reestablish an equilibrium.",
    "ph": "pH is a scale used to specify the acidity or basicity of an aqueous solution.",
    "buffer solution": "A buffer solution is an aqueous solution consisting of a mixture of a weak acid and its conjugate base, or vice versa.",
    "periodic table": "The periodic table is a tabular display of the chemical elements, which are arranged by atomic number, electron configuration, and recurring chemical properties.",
    "transition metals": "The transition metals are the metallic elements that serve as a bridge, or transition, between the two sides of the table.",
    "lanthanides": "The lanthanide series comprises the 15 metallic chemical elements with atomic numbers 57 through 71, from lanthanum through lutetium.",
    "actinides": "The actinide series encompasses the 15 metallic chemical elements with atomic numbers from 89 to 103, actinium through lawrencium.",
    "coordination compound": "A coordination complex consists of a central atom or ion, which is usually metallic and is called the coordination centre, and a surrounding array of bound molecules or ions, that are in turn known as ligands or complexing agents.",
    "isomerism": "Isomerism is the phenomenon in which more than one compounds have the same chemical formula but different chemical structures.",
    "resonance": "Resonance is a way of describing bonding in certain molecules or ions by the combination of several contributing structures into a resonance hybrid in valence bond theory.",
    "electrophile": "An electrophile is a reagent attracted to electrons.",
    "nucleophile": "A nucleophile is a chemical species that donates an electron pair to form a chemical bond in relation to a reaction.",
    "sn1 reaction": "The SN1 reaction is a substitution reaction in organic chemistry, the name of which refers to the Hughes-Ingold symbol of the mechanism.",
    "sn2 reaction": "The SN2 reaction is a type of reaction mechanism that is common in organic chemistry.",
    "elimination reaction": "An elimination reaction is a type of organic reaction in which two substituents are removed from a molecule in either a one or two-step mechanism.",
    "addition reaction": "An addition reaction, in organic chemistry, is in its simplest terms an organic reaction where two or more molecules combine to form a larger one.",
    "polymer": "A polymer is a substance or material consisting of very large molecules, or macromolecules, composed of many repeating subunits.",
    "biomolecule": "A biomolecule or biological molecule is a loosely used term for molecules present in organisms that are essential to one or more typically biological processes.",
    "quadratic equation": "In algebra, a quadratic equation is any equation that can be rearranged in standard form as ax^{2}+bx+c=0.",
    "arithmetic progression": "An arithmetic progression or arithmetic sequence is a sequence of numbers such that the difference between the consecutive terms is constant.",
    "geometric progression": "A geometric progression, also known as a geometric sequence, is a sequence of numbers where each term after the first is found by multiplying the previous one by a fixed, non-zero number called the common ratio.",
    "complex number": "A complex number is a number that can be expressed in the form a + bi, where a and b are real numbers, and i is a solution of the equation x^2 = −1.",
    "permutation": "A permutation is an arrangement of all or part of a set of objects, with regard to the order of the arrangement.",
    "combination": "A combination is a selection of items from a collection, such that the order of selection does not matter.",
    "binomial theorem": "The binomial theorem describes the algebraic expansion of powers of a binomial.",
    "probability": "Probability is the branch of mathematics concerning numerical descriptions of how likely an event is to occur, or how likely it is that a proposition is true.",
    "trigonometry": "Trigonometry is a branch of mathematics that studies relationships between side lengths and angles of triangles.",
    "function": "A function is a binary relation between two sets that associates every element of the first set to exactly one element of the second set.",
    "limit": "In mathematics, a limit is the value that a function (or sequence) approaches as the input (or index) approaches some value.",
    "continuity": "A continuous function is a function for which sufficiently small changes in the input result in arbitrarily small changes in the output.",
    "differentiation": "Differentiation is the process of finding a derivative.",
    "tangent": "The tangent line to a plane curve at a given point is the straight line that just touches the curve at that point.",
    "normal": "In geometry, a normal is an object such as a line or vector that is perpendicular to a given object.",
    "maxima and minima": "In mathematical analysis, the maxima and minima (the respective plurals of maximum and minimum) of a function, known collectively as extrema, are the largest and smallest value of the function, either within a given range (the local or relative extrema) or on the entire domain (the global or absolute extrema).",
    "definite integral": "The definite integral of a function f(x) from a to b is the signed area of the region in the xy-plane that is bounded by the graph of f, the x-axis and the vertical lines x = a and x = b.",
    "differential equation": "A differential equation is a mathematical equation that relates some function with its derivatives.",
    "coordinate geometry": "Coordinate geometry is a branch of geometry where the position of the points on the plane is defined with the help of an ordered pair of numbers also known as coordinates.",
    "straight line": "A line is an infinitely long object with no width, depth, or curvature.",
    "circle": "A circle is a shape consisting of all points in a plane that are a given distance from a given point, the centre.",
    "parabola": "A parabola is a plane curve which is mirror-symmetrical and is approximately U-shaped.",
    "ellipse": "An ellipse is a plane curve surrounding two focal points, such that for all points on the curve, the sum of the two distances to the focal points is a constant.",
    "hyperbola": "A hyperbola is a type of smooth curve lying in a plane, defined by its geometric properties or by equations for which it is the solution set.",
    "vector algebra": "Vector algebra involves algebraic operations on vectors.",
    "three-dimensional geometry": "Three-dimensional geometry involves the mathematics of shapes in 3D space and involves 3 coordinates which are x-coordinate, y-coordinate and z-coordinate."
};
