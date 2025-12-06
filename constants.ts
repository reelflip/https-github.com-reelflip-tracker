



import { Subject, User, Test, Question, Quote, Flashcard, MemoryHack, BlogPost, ExamComparisonItem } from './types';

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

export const TARGET_EXAMS = [
    "JEE Main & Advanced",
    "NEET (Medical)",
    "BITSAT (BITS Pilani)",
    "VITEEE (VIT)",
    "SRMJEEE (SRM)",
    "MET (Manipal)",
    "MHT-CET (Maharashtra)",
    "WBJEE (West Bengal)",
    "COMEDK (Karnataka)",
    "AMUEEE (Aligarh)",
    "CUET (Central Univ)",
    "Other Engineering Exam"
];

export const TARGET_YEARS = [2025, 2026, 2027, 2028];

export const MOCK_USERS: User[] = [
  { 
      id: '100000', 
      name: 'System Administrator', 
      email: 'admin', 
      role: 'ADMIN',
      isVerified: true
  },
  {
      id: '582910',
      name: 'InnFriend Student',
      email: 'innfriend1@gmail.com',
      role: 'STUDENT',
      isVerified: true,
      institute: 'Allen Career Institute',
      targetYear: 2025,
      targetExam: 'JEE Main & Advanced',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=innfriend1',
      parentId: '749201'
  },
  {
      id: '749201',
      name: 'Vikas Parent',
      email: 'vikas.00@gmail.com',
      role: 'PARENT',
      isVerified: true,
      studentId: '582910',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikas'
  },
  {
      id: '492813',
      name: 'Dev Student',
      email: 'student@dev.local',
      role: 'STUDENT',
      isVerified: true,
      targetYear: 2025,
      targetExam: 'JEE Main & Advanced',
      institute: 'Dev Institute'
  },
  {
      id: '839102',
      name: 'Dev Parent',
      email: 'parent@dev.local',
      role: 'PARENT',
      isVerified: true,
  }
];

export const DEFAULT_QUOTES: Quote[] = [
    { id: 'q1', text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { id: 'q2', text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { id: 'q3', text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { id: 'q4', text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { id: 'q5', text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" }
];

export const BLOG_POSTS: BlogPost[] = [
    {
        id: 'blog_1',
        title: 'The 1-7-30 Revision Strategy: Beating the Forgetting Curve for JEE',
        excerpt: 'Why do you forget formulas 2 days after studying? Learn the scientifically proven Spaced Repetition method to retain 90% of your Physics and Chemistry syllabus.',
        author: 'Rahul Sharma (IIT Bombay)',
        date: '2024-10-15',
        category: 'Strategy',
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000',
        content: `
            <p>We've all been there. You spend 4 intense hours mastering <strong>Rotational Motion</strong>, solving every problem in HC Verma. Two weeks later, you open a mock test, and your mind goes blank. You remember studying it, but the formula for the <em>Moment of Inertia of a solid cone</em> just won't come to you.</p>
            <br/>
            <h2 class="text-2xl font-bold text-slate-800 mb-2">The Problem: Ebbinghaus Forgetting Curve</h2>
            <p>The human brain is wired to forget. Hermann Ebbinghaus, a German psychologist, discovered that within <strong>24 hours</strong> of learning something new, we forget about <strong>50-80%</strong> of it unless we review it. By day 30, retention drops to less than 5%.</p>
            <p>For an <strong>IIT JEE aspirant</strong> covering 90+ chapters across Physics, Chemistry, and Maths, this is a disaster. You cannot afford to relearn chapters from scratch every month.</p>
            <br/>
            <h2 class="text-2xl font-bold text-slate-800 mb-2">The Solution: Spaced Repetition (1-7-30)</h2>
            <p>To hack your brain's retention, you need to interrupt the forgetting curve at specific intervals. This signals to your hippocampus that this information is vital.</p>
            
            <h3 class="text-xl font-bold text-blue-600 mt-4 mb-2">1. The 1st Review (24 Hours)</h3>
            <p>Revise the topic the very next day. Do not solve new problems; just review your short notes and key formulas. This takes only 10-15 minutes but restores retention to 100%.</p>
            
            <h3 class="text-xl font-bold text-blue-600 mt-4 mb-2">2. The 2nd Review (7 Days)</h3>
            <p>Revise it again exactly a week later. Solve 5-10 mixed questions. This pushes the memory from short-term to medium-term storage.</p>
            
            <h3 class="text-xl font-bold text-blue-600 mt-4 mb-2">3. The 3rd Review (30 Days)</h3>
            <p>The final seal. Reviewing it after a month cements it into long-term memory. At this stage, the concept becomes intuitive.</p>
            <br/>
            <h2 class="text-2xl font-bold text-slate-800 mb-2">How to Track This?</h2>
            <p>Manually tracking dates for 90 chapters is impossible. That's why we built the <strong>IITGEEPrep Revision Manager</strong>. It automatically calculates these dates for you:</p>
            <ul class="list-disc pl-5 space-y-2 mt-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <li>Mark a topic as <strong>"Completed"</strong> in the Syllabus Tracker.</li>
                <li>Go to the <strong>Revision Tab</strong>.</li>
                <li>The system will move the topic to "Due Today" when it's time for the 1st, 2nd, or 3rd review.</li>
            </ul>
        `
    },
    {
        id: 'blog_2',
        title: 'Physics for JEE Advanced: Why "Deriving" beats "Memorizing"',
        excerpt: 'Stop mugging up formulas. In JEE Advanced, understanding the derivation and assumptions is the key to solving complex, multi-concept problems.',
        author: 'A. Verma (Physics Faculty)',
        date: '2024-10-10',
        category: 'Subject-wise',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000',
        content: `
            <p>In JEE Mains, you might get away with plugging values into formulas. In <strong>JEE Advanced</strong>, that strategy fails instantly.</p>
            <p>Advanced questions are designed to break standard formulas. They introduce variable mass, non-uniform fields, or complex constraints that standard equations don't cover.</p>
            <br/>
            <h3 class="text-xl font-bold text-slate-800 mb-2">The Derivation Mindset</h3>
            <p>When you learn a concept like <em>Electrostatic Potential</em>, don't just memorize $V = kQ/r$. Understand that $V = -\int E \cdot dr$. Why? Because when the question asks for potential in a non-uniform field, the first formula is useless, but the derivation saves you.</p>
            <p><strong>Actionable Tip:</strong> For every chapter in Physics, maintain a "Derivation Notebook". Write down the starting assumptions for every major law. (e.g., "Bernoulli's principle assumes incompressible, non-viscous flow").</p>
        `
    },
    {
        id: 'blog_3',
        title: 'Exam Anxiety: The 4-7-8 Breathing Technique for Students',
        excerpt: 'Exam stress can lower your IQ by 15 points in the exam hall. Here is a physiological hack to calm your nerves instantly during JEE or BITSAT.',
        author: 'Dr. S. Gupta (Psychologist)',
        date: '2024-10-05',
        category: 'Motivation',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000',
        content: `
            <p>Your heart is racing. Your palms are sweaty. You read the first question of the paper, and your mind goes blank. This is the "Fight or Flight" response, and it shuts down the logical part of your brain (Prefrontal Cortex).</p>
            <br/>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Reset with 4-7-8 Breathing</h3>
            <p>You can hack your nervous system back into "Rest and Digest" mode using this simple technique:</p>
            <ol class="list-decimal pl-5 space-y-2 mt-2">
                <li><strong>Inhale</strong> quietly through the nose for <strong>4 seconds</strong>.</li>
                <li><strong>Hold</strong> the breath for <strong>7 seconds</strong>.</li>
                <li><strong>Exhale</strong> forcefully through the mouth for <strong>8 seconds</strong> (making a whoosh sound).</li>
            </ol>
            <p>Repeat this cycle 4 times. It physically forces your heart rate to slow down. Use the <strong>Wellness Corner</strong> in this app to practice daily.</p>
        `
    }
];

export const EXAM_COMPARISON_DATA: ExamComparisonItem[] = [
    { 
      name: 'JEE Advanced', difficulty: 5, color: 'text-red-600 bg-red-50 border-red-100', barColor: 'bg-red-600', borderColor: 'border-l-red-600', hoverBg: 'hover:bg-red-50/50',
      focus: 'Deep concepts, tricky, multi-step problems. Tests analytical thinking and subject depth.',
      desc: 'The gateway to the IITs. Requires high IQ application, not just memory.',
      colleges: '23 IITs, IISc Bangalore, IISERs, RGIPT, IIPE.', dates: 'Late May / Early June'
    },
    { 
      name: 'JEE Main', difficulty: 4, color: 'text-orange-600 bg-orange-50 border-orange-100', barColor: 'bg-orange-500', borderColor: 'border-l-orange-500', hoverBg: 'hover:bg-orange-50/50',
      focus: 'Balanced approach + NCERT. Speed & Accuracy are crucial.',
      desc: 'Screening for JEE Advanced. Entry to top government colleges.',
      colleges: '31 NITs, 26 IIITs, 33 GFTIs, DTU, NSUT, and many state colleges.', dates: 'Session 1: January | Session 2: April'
    },
    { 
      name: 'BITSAT', difficulty: 3, color: 'text-purple-600 bg-purple-50 border-purple-100', barColor: 'bg-purple-500', borderColor: 'border-l-purple-500', hoverBg: 'hover:bg-purple-50/50',
      focus: 'Speed + Accuracy. Shorter questions, includes English & Logic.',
      desc: 'Known for having more questions in less time (130 Qs in 3 hrs).',
      colleges: 'BITS Pilani, BITS Goa, BITS Hyderabad.', dates: 'Session 1: Late May | Session 2: Late June'
    },
    { 
      name: 'VITEEE', difficulty: 2, color: 'text-cyan-600 bg-cyan-50 border-cyan-100', barColor: 'bg-cyan-500', borderColor: 'border-l-cyan-500', hoverBg: 'hover:bg-cyan-50/50',
      focus: 'Direct application. Strictly based on NCERT pattern. No negative marking.',
      desc: 'Entrance for one of India\'s most popular private universities.',
      colleges: 'VIT Vellore, VIT Chennai, VIT AP, VIT Bhopal.', dates: 'Mid April (approx. 10 days window)'
    },
    { 
      name: 'MET (Manipal)', difficulty: 3, color: 'text-blue-600 bg-blue-50 border-blue-100', barColor: 'bg-blue-500', borderColor: 'border-l-blue-600', hoverBg: 'hover:bg-blue-50/50',
      focus: 'Calculation-heavy. Requires fast numerical solving skills.',
      desc: 'Entrance for Manipal Academy of Higher Education.',
      colleges: 'Manipal Inst of Tech (MIT) Manipal, Bengaluru, Jaipur.', dates: 'Phase 1: Mid April | Phase 2: Mid May'
    },
    { 
      name: 'SRMJEEE', difficulty: 2, color: 'text-teal-600 bg-teal-50 border-teal-100', barColor: 'bg-teal-500', borderColor: 'border-l-teal-500', hoverBg: 'hover:bg-teal-50/50',
      focus: 'Moderate level. Standard textbook problems.',
      desc: 'Admission to SRM University campuses.',
      colleges: 'SRM Kattankulathur, Ramapuram, NCR Ghaziabad.', dates: 'Phase 1: April | Phase 2: June | Phase 3: July'
    },
    { 
      name: 'AMUEEE', difficulty: 3, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', barColor: 'bg-indigo-500', borderColor: 'border-l-indigo-600', hoverBg: 'hover:bg-indigo-50/50',
      focus: 'Concept + Formula application. Moderate difficulty.',
      desc: 'For Aligarh Muslim University engineering programs.',
      colleges: 'ZHCET (AMU Aligarh).', dates: 'Mid May'
    },
    { 
      name: 'CUET-UG', difficulty: 1, color: 'text-green-600 bg-green-50 border-green-100', barColor: 'bg-green-500', borderColor: 'border-l-green-500', hoverBg: 'hover:bg-green-50/50',
      focus: 'Strictly NCERT-based. Fundamental understanding.',
      desc: 'Central Universities Entrance Test. Basic domain knowledge.',
      colleges: 'University of Delhi (DU), BHU, JNU, and 40+ Central Univs.', dates: 'Mid May to End May'
    }
];

export const PHYSICS_QUESTIONS: Question[] = [
    { id: 'p_1', subjectId: 'phys', topicId: 'p_kin_1', text: 'A particle moves along x-axis as x = 4(t-2) + a(t-2)^2. Which is true?', options: ['Initial velocity is 4', 'Acceleration is 2a', 'Particle is at origin at t=2', 'All of the above'], correctOptionIndex: 3 },
    { id: 'p_2', subjectId: 'phys', topicId: 'p_kin_2', text: 'A projectile is thrown with speed u at angle θ. What is its speed at the highest point?', options: ['0', 'u', 'u cos θ', 'u sin θ'], correctOptionIndex: 2 },
    { id: 'p_3', subjectId: 'phys', topicId: 'p_laws_1', text: 'Action and Reaction forces act on:', options: ['Same body', 'Different bodies', 'Sometimes same, sometimes different', 'Depends on frame'], correctOptionIndex: 1 },
    { id: 'p_4', subjectId: 'phys', topicId: 'p_rot_1', text: 'Moment of Inertia of a solid sphere about its tangent is:', options: ['2/5 MR²', '7/5 MR²', '5/3 MR²', '3/2 MR²'], correctOptionIndex: 1 },
    { id: 'p_5', subjectId: 'phys', topicId: 'p_elec_1', text: 'Electric field inside a hollow charged conductor is:', options: ['σ/ε₀', 'Zero', 'Infinite', 'σ/2ε₀'], correctOptionIndex: 1 },
    { id: 'p_6', subjectId: 'phys', topicId: 'p_grav', text: 'Two planets have radii r1 and r2 and densities d1 and d2. The ratio of acceleration due to gravity on them is:', options: ['r1d1 : r2d2', 'r1d2 : r2d1', 'r1^2 : r2^2', 'd1 : d2'], correctOptionIndex: 0 },
    { id: 'p_7', subjectId: 'phys', topicId: 'p_thrm', text: 'In an adiabatic process, which of the following is constant?', options: ['PV', 'TV', 'PV^γ', 'V/T'], correctOptionIndex: 2 },
    { id: 'p_8', subjectId: 'phys', topicId: 'p_opt', text: 'Critical angle for light moving from medium 1 (RI=u1) to medium 2 (RI=u2) where u1 > u2 is:', options: ['sin^-1(u1/u2)', 'sin^-1(u2/u1)', 'cos^-1(u2/u1)', 'tan^-1(u1/u2)'], correctOptionIndex: 1 },
    { id: 'p_9', subjectId: 'phys', topicId: 'p_mod', text: 'In photoelectric effect, the maximum kinetic energy of emitted electrons depends on:', options: ['Intensity of light', 'Frequency of light', 'Time of exposure', 'All of above'], correctOptionIndex: 1 },
    { id: 'p_10', subjectId: 'phys', topicId: 'p_semi', text: 'In a p-type semiconductor, the majority charge carriers are:', options: ['Electrons', 'Holes', 'Neutrons', 'Ions'], correctOptionIndex: 1 },
    // Adding 20 more physics questions
    { id: 'p_11', subjectId: 'phys', topicId: 'p_unit_1', text: 'Which of the following is not a unit of time?', options: ['Microsecond', 'Leap year', 'Lunar month', 'Parsec'], correctOptionIndex: 3 },
    { id: 'p_12', subjectId: 'phys', topicId: 'p_kin_1', text: 'The area under velocity-time graph represents:', options: ['Force', 'Displacement', 'Distance', 'Acceleration'], correctOptionIndex: 1 },
    { id: 'p_13', subjectId: 'phys', topicId: 'p_work_1', text: 'A body moves distance 10m along a straight line under force 5N. Work done is 25J. Angle is:', options: ['0°', '30°', '60°', '90°'], correctOptionIndex: 2 },
    { id: 'p_14', subjectId: 'phys', topicId: 'p_grav_2', text: 'Escape velocity from Earth is 11.2 km/s. If planet has double mass & double radius, escape velocity is:', options: ['11.2 km/s', '22.4 km/s', '5.6 km/s', '11.2√2 km/s'], correctOptionIndex: 0 },
    { id: 'p_15', subjectId: 'phys', topicId: 'p_prop_1', text: 'Young\'s modulus is the property of:', options: ['Solid only', 'Liquid only', 'Gas only', 'All'], correctOptionIndex: 0 },
    { id: 'p_16', subjectId: 'phys', topicId: 'p_prop_2', text: 'Hydraulic brakes work on:', options: ['Pascal\'s Law', 'Archimedes Principle', 'Bernoulli\'s Theorem', 'Torricelli\'s Law'], correctOptionIndex: 0 },
    { id: 'p_17', subjectId: 'phys', topicId: 'p_th_1', text: 'First law of thermodynamics is a special case of:', options: ['Newton\'s Law', 'Law of Conservation of Energy', 'Charle\'s Law', 'Law of Heat Exchange'], correctOptionIndex: 1 },
    { id: 'p_18', subjectId: 'phys', topicId: 'p_osc_1', text: 'Time period of a simple pendulum depends on:', options: ['Mass of bob', 'Length', 'Amplitude', 'Material'], correctOptionIndex: 1 },
    { id: 'p_19', subjectId: 'phys', topicId: 'p_wave_1', text: 'Sound waves in air are:', options: ['Transverse', 'Longitudinal', 'Electromagnetic', 'Non-mechanical'], correctOptionIndex: 1 },
    { id: 'p_20', subjectId: 'phys', topicId: 'p_el_1', text: 'Two point charges +2C and +6C repel with force 12N. If -2C is given to each, force becomes:', options: ['4N Repulsive', '4N Attractive', 'Zero', 'Infinite'], correctOptionIndex: 2 },
    { id: 'p_21', subjectId: 'phys', topicId: 'p_el_2', text: 'Capacitance of earth (R=6400km) is approx:', options: ['711 µF', '1 F', '711 F', '1 µF'], correctOptionIndex: 0 },
    { id: 'p_22', subjectId: 'phys', topicId: 'p_curr_1', text: 'Which material has negative temperature coefficient of resistance?', options: ['Copper', 'Silver', 'Silicon', 'Aluminum'], correctOptionIndex: 2 },
    { id: 'p_23', subjectId: 'phys', topicId: 'p_mag_1', text: 'Lorentz force is:', options: ['qE', 'q(v x B)', 'q(E + v x B)', 'E + v x B'], correctOptionIndex: 2 },
    { id: 'p_24', subjectId: 'phys', topicId: 'p_emi_1', text: 'Lenz\'s law is a consequence of conservation of:', options: ['Charge', 'Momentum', 'Energy', 'Mass'], correctOptionIndex: 2 },
    { id: 'p_25', subjectId: 'phys', topicId: 'p_ac_1', text: 'In a pure inductive circuit, current:', options: ['Leads voltage by 90°', 'Lags voltage by 90°', 'In phase', 'Lags by 45°'], correctOptionIndex: 1 },
    { id: 'p_26', subjectId: 'phys', topicId: 'p_opt_1', text: 'Mirage is observed due to:', options: ['Interference', 'Diffraction', 'Total Internal Reflection', 'Scattering'], correctOptionIndex: 2 },
    { id: 'p_27', subjectId: 'phys', topicId: 'p_dual_1', text: 'De Broglie wavelength of a particle is:', options: ['h/mv', 'hm/v', 'mv/h', 'h/m'], correctOptionIndex: 0 },
    { id: 'p_28', subjectId: 'phys', topicId: 'p_nuc_1', text: 'Sun\'s energy is due to:', options: ['Nuclear Fission', 'Nuclear Fusion', 'Radioactivity', 'Chemical burning'], correctOptionIndex: 1 },
    { id: 'p_29', subjectId: 'phys', topicId: 'p_diode_1', text: 'Which gate is a Universal Gate?', options: ['AND', 'OR', 'NAND', 'NOT'], correctOptionIndex: 2 },
    { id: 'p_30', subjectId: 'phys', topicId: 'p_semi_1', text: 'Zener diode is used as:', options: ['Amplifier', 'Rectifier', 'Oscillator', 'Voltage Regulator'], correctOptionIndex: 3 }
];

export const CHEMISTRY_QUESTIONS: Question[] = [
    { id: 'c_1', subjectId: 'chem', topicId: 'c_bas_1', text: 'Weight of one molecule of C60H122 is?', options: ['1.4 x 10^-21 g', '1000 g', '60 g', '1.2 x 10^-20 g'], correctOptionIndex: 0 },
    { id: 'c_2', subjectId: 'chem', topicId: 'c_atom', text: 'Which quantum number defines the orientation of the orbital?', options: ['Principal (n)', 'Azimuthal (l)', 'Magnetic (m)', 'Spin (s)'], correctOptionIndex: 2 },
    { id: 'c_3', subjectId: 'chem', topicId: 'c_bond', text: 'Which molecule has a trigonal pyramidal shape?', options: ['BF3', 'CH4', 'NH3', 'H2O'], correctOptionIndex: 2 },
    { id: 'c_4', subjectId: 'chem', topicId: 'c_equil', text: 'pH of a 0.001 M HCl solution is:', options: ['1', '2', '3', '4'], correctOptionIndex: 2 },
    { id: 'c_5', subjectId: 'chem', topicId: 'c_org_1', text: 'The reaction of an alkyl halide with sodium metal in dry ether is called:', options: ['Wurtz reaction', 'Friedel-Crafts', 'Kolbe\'s reaction', 'Reimer-Tiemann'], correctOptionIndex: 0 },
    { id: 'c_6', subjectId: 'chem', topicId: 'c_soln', text: 'Which of the following is a colligative property?', options: ['Surface Tension', 'Viscosity', 'Osmotic Pressure', 'Refractive Index'], correctOptionIndex: 2 },
    { id: 'c_7', subjectId: 'chem', topicId: 'c_elec', text: 'The unit of cell constant is:', options: ['cm', 'cm^-1', 'cm^2', 'cm^-2'], correctOptionIndex: 1 },
    { id: 'c_8', subjectId: 'chem', topicId: 'c_kin', text: 'For a first order reaction, the half life depends on:', options: ['Initial concentration', 'Temperature', 'Pressure', 'None'], correctOptionIndex: 1 },
    { id: 'c_9', subjectId: 'chem', topicId: 'c_coord', text: 'The oxidation state of Ni in [Ni(CO)4] is:', options: ['+2', '+4', '0', '-1'], correctOptionIndex: 2 },
    { id: 'c_10', subjectId: 'chem', topicId: 'c_bio', text: 'Which vitamin is water soluble?', options: ['Vitamin A', 'Vitamin D', 'Vitamin C', 'Vitamin K'], correctOptionIndex: 2 },
    // Adding 20 more chemistry questions
    { id: 'c_11', subjectId: 'chem', topicId: 'c_per_1', text: 'Which element has the highest electronegativity?', options: ['F', 'O', 'N', 'Cl'], correctOptionIndex: 0 },
    { id: 'c_12', subjectId: 'chem', topicId: 'c_blk_1', text: 'Which noble gas is most abundant in atmosphere?', options: ['He', 'Ne', 'Ar', 'Kr'], correctOptionIndex: 2 },
    { id: 'c_13', subjectId: 'chem', topicId: 'c_org_2', text: 'Marsh gas is mainly:', options: ['Ethane', 'Methane', 'Propane', 'Butane'], correctOptionIndex: 1 },
    { id: 'c_14', subjectId: 'chem', topicId: 'c_atm_1', text: 'Total number of orbitals in n=3 shell is:', options: ['3', '6', '9', '18'], correctOptionIndex: 2 },
    { id: 'c_15', subjectId: 'chem', topicId: 'c_th_1', text: 'For an exothermic reaction, ΔH is:', options: ['Positive', 'Negative', 'Zero', 'Undefined'], correctOptionIndex: 1 },
    { id: 'c_16', subjectId: 'chem', topicId: 'c_org_4', text: 'Formalin is an aqueous solution of:', options: ['Formic Acid', 'Formaldehyde', 'Fluorescein', 'Furfural'], correctOptionIndex: 1 },
    { id: 'c_17', subjectId: 'chem', topicId: 'c_red_1', text: 'In KMnO4, oxidation state of Mn is:', options: ['+2', '+5', '+7', '+6'], correctOptionIndex: 2 },
    { id: 'c_18', subjectId: 'chem', topicId: 'c_org_3', text: 'SN1 reaction is favored by:', options: ['Non-polar solvent', 'Polar protic solvent', 'Polar aprotic solvent', 'None'], correctOptionIndex: 1 },
    { id: 'c_19', subjectId: 'chem', topicId: 'c_blk_2', text: 'Brass is an alloy of:', options: ['Cu + Zn', 'Cu + Sn', 'Cu + Ni', 'Zn + Pb'], correctOptionIndex: 0 },
    { id: 'c_20', subjectId: 'chem', topicId: 'c_crd_1', text: 'Shape of [Co(NH3)6]3+ is:', options: ['Tetrahedral', 'Square Planar', 'Octahedral', 'Trigonal Bipyramidal'], correctOptionIndex: 2 },
    { id: 'c_21', subjectId: 'chem', topicId: 'c_eq_2', text: 'Conjugate base of H2O is:', options: ['H3O+', 'OH-', 'H+', 'O2-'], correctOptionIndex: 1 },
    { id: 'c_22', subjectId: 'chem', topicId: 'c_kin_1', text: 'Unit of rate constant for zero order reaction:', options: ['mol L^-1 s^-1', 's^-1', 'L mol^-1 s^-1', 'Dimensionless'], correctOptionIndex: 0 },
    { id: 'c_23', subjectId: 'chem', topicId: 'c_org_6', text: 'Glucose contains how many chiral carbons?', options: ['3', '4', '5', '6'], correctOptionIndex: 1 },
    { id: 'c_24', subjectId: 'chem', topicId: 'c_sol_1', text: 'Which has highest boiling point?', options: ['0.1M Glucose', '0.1M NaCl', '0.1M BaCl2', '0.1M Urea'], correctOptionIndex: 2 },
    { id: 'c_25', subjectId: 'chem', topicId: 'c_atm_2', text: 'Which rule is violated if configuration is 1s2 2s2 2p5 3s1?', options: ['Aufbau', 'Hund\'s', 'Pauli\'s', 'None'], correctOptionIndex: 0 },
    { id: 'c_26', subjectId: 'chem', topicId: 'c_bnd_1', text: 'Bond angle in water molecule is:', options: ['109.5°', '120°', '180°', '104.5°'], correctOptionIndex: 3 },
    { id: 'c_27', subjectId: 'chem', topicId: 'c_org_5', text: 'Primary amines react with HNO2 to give:', options: ['Alcohols', 'Nitro compounds', 'Secondary amines', 'Amides'], correctOptionIndex: 0 },
    { id: 'c_28', subjectId: 'chem', topicId: 'c_th_1', text: 'Which is an intensive property?', options: ['Mass', 'Volume', 'Enthalpy', 'Temperature'], correctOptionIndex: 3 },
    { id: 'c_29', subjectId: 'chem', topicId: 'c_red_1', text: 'Which is the strongest reducing agent?', options: ['Li', 'Na', 'K', 'Cs'], correctOptionIndex: 0 },
    { id: 'c_30', subjectId: 'chem', topicId: 'c_org_2', text: 'Ozonolysis of ethene gives:', options: ['Ethanol', 'Ethanal', 'Methanal', 'Glycol'], correctOptionIndex: 2 }
];

export const MATHS_QUESTIONS: Question[] = [
    { id: 'm_1', subjectId: 'math', topicId: 'm_set_1', text: 'Power set of set A={1,2} has how many elements?', options: ['2', '4', '3', '1'], correctOptionIndex: 1 },
    { id: 'm_2', subjectId: 'math', topicId: 'm_quad', text: 'If roots of x² - 5x + 6 = 0 are α and β, find α + β.', options: ['5', '-5', '6', '-6'], correctOptionIndex: 0 },
    { id: 'm_3', subjectId: 'math', topicId: 'm_seq', text: '10th term of AP: 2, 7, 12... is:', options: ['45', '47', '50', '52'], correctOptionIndex: 1 },
    { id: 'm_4', subjectId: 'math', topicId: 'm_lim', text: 'lim(x→0) (sin x)/x is:', options: ['0', '1', '∞', 'Undefined'], correctOptionIndex: 1 },
    { id: 'm_5', subjectId: 'math', topicId: 'm_calc_1', text: 'd/dx(ln x) is:', options: ['1/x', 'e^x', 'x', 'log x'], correctOptionIndex: 0 },
    { id: 'm_6', subjectId: 'math', topicId: 'm_mat', text: 'If A is a square matrix of order 3 and |A|=5, then |2A| is:', options: ['10', '40', '25', '125'], correctOptionIndex: 1 },
    { id: 'm_7', subjectId: 'math', topicId: 'm_vect', text: 'The projection of vector i+j on k is:', options: ['1', '0', '√2', '2'], correctOptionIndex: 1 },
    { id: 'm_8', subjectId: 'math', topicId: 'm_prob', text: 'Probability of getting a sum of 7 when two dice are thrown:', options: ['1/6', '1/12', '5/36', '7/36'], correctOptionIndex: 0 },
    { id: 'm_9', subjectId: 'math', topicId: 'm_coord', text: 'Equation of circle with center (0,0) and radius 5 is:', options: ['x²+y²=5', 'x²+y²=25', 'x+y=5', 'x-y=25'], correctOptionIndex: 1 },
    { id: 'm_10', subjectId: 'math', topicId: 'm_trig', text: 'Value of sin²30° + cos²30° is:', options: ['0', '1', '1/2', '2'], correctOptionIndex: 1 },
    // Adding 20 more maths questions
    { id: 'm_11', subjectId: 'math', topicId: 'm_set_3', text: 'If f(x) = x^2, then f is:', options: ['One-one', 'Onto', 'Many-one', 'Bijective'], correctOptionIndex: 2 },
    { id: 'm_12', subjectId: 'math', topicId: 'm_comp_1', text: 'i^4 is equal to:', options: ['1', '-1', 'i', '-i'], correctOptionIndex: 0 },
    { id: 'm_13', subjectId: 'math', topicId: 'm_perm_1', text: 'Value of 5! is:', options: ['20', '60', '120', '100'], correctOptionIndex: 2 },
    { id: 'm_14', subjectId: 'math', topicId: 'm_bin_1', text: 'Number of terms in (x+y)^10 is:', options: ['10', '11', '9', '20'], correctOptionIndex: 1 },
    { id: 'm_15', subjectId: 'math', topicId: 'm_seq_1', text: 'Geometric mean of 4 and 16 is:', options: ['8', '10', '12', '6'], correctOptionIndex: 0 },
    { id: 'm_16', subjectId: 'math', topicId: 'm_diff_1', text: 'Derivative of tan x is:', options: ['sec x', 'sec^2 x', 'cot x', '-cosec^2 x'], correctOptionIndex: 1 },
    { id: 'm_17', subjectId: 'math', topicId: 'm_int_1', text: 'Integral of 1/x dx is:', options: ['ln|x| + C', '-1/x^2', 'x', 'e^x'], correctOptionIndex: 0 },
    { id: 'm_18', subjectId: 'math', topicId: 'm_de_1', text: 'Order of d2y/dx2 + (dy/dx)^3 = 0 is:', options: ['1', '2', '3', '0'], correctOptionIndex: 1 },
    { id: 'm_19', subjectId: 'math', topicId: 'm_coord_1', text: 'Slope of line 2x - y + 3 = 0 is:', options: ['2', '-2', '1/2', '-1/2'], correctOptionIndex: 0 },
    { id: 'm_20', subjectId: 'math', topicId: 'm_3d_1', text: 'Distance of point (1,2,3) from origin is:', options: ['√6', '√14', '6', '14'], correctOptionIndex: 1 },
    { id: 'm_21', subjectId: 'math', topicId: 'm_vec_1', text: 'Dot product of i and j is:', options: ['0', '1', 'k', '-k'], correctOptionIndex: 0 },
    { id: 'm_22', subjectId: 'math', topicId: 'm_stat_1', text: 'Mean of first 5 natural numbers is:', options: ['2', '3', '2.5', '3.5'], correctOptionIndex: 1 },
    { id: 'm_23', subjectId: 'math', topicId: 'm_trig_1', text: 'tan 45° is:', options: ['0', '1', '1/√3', '√3'], correctOptionIndex: 1 },
    { id: 'm_24', subjectId: 'math', topicId: 'm_mat_2', text: 'A matrix A is singular if |A| is:', options: ['1', '-1', '0', 'Undefined'], correctOptionIndex: 2 },
    { id: 'm_25', subjectId: 'math', topicId: 'm_comp_2', text: 'Product of cube roots of unity (1, ω, ω²) is:', options: ['0', '1', '-1', '3'], correctOptionIndex: 1 },
    { id: 'm_26', subjectId: 'math', topicId: 'm_coord_3', text: 'Eccentricity of parabola is:', options: ['0', '1', '<1', '>1'], correctOptionIndex: 1 },
    { id: 'm_27', subjectId: 'math', topicId: 'm_lim_1', text: 'Lim(x->inf) 1/x is:', options: ['0', '1', 'inf', '-1'], correctOptionIndex: 0 },
    { id: 'm_28', subjectId: 'math', topicId: 'm_prob_1', text: 'P(E) + P(not E) is:', options: ['0', '0.5', '1', 'Undefined'], correctOptionIndex: 2 },
    { id: 'm_29', subjectId: 'math', topicId: 'm_quad', text: 'Discriminant of ax^2+bx+c=0 is:', options: ['b^2-4ac', 'b^2+4ac', 'sqrt(b^2-4ac)', 'b-4ac'], correctOptionIndex: 0 },
    { id: 'm_30', subjectId: 'math', topicId: 'm_int_2', text: 'Int(0 to 1) x dx is:', options: ['1', '0.5', '0', '2'], correctOptionIndex: 1 }
];

export const MOCK_TESTS: Test[] = [
  {
    id: 'test_jee_main_2024',
    title: 'JEE Mains 2024 (Jan 27 Shift 1)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'MAINS',
    examType: 'JEE',
    questions: [
        ...PHYSICS_QUESTIONS.slice(0, 10),
        ...CHEMISTRY_QUESTIONS.slice(0, 10),
        ...MATHS_QUESTIONS.slice(0, 10)
    ]
  },
  {
    id: 'test_jee_main_2024_s2',
    title: 'JEE Mains 2024 (Session 2 Apr 4)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'MAINS',
    examType: 'JEE',
    questions: [
        ...PHYSICS_QUESTIONS.slice(10, 20),
        ...CHEMISTRY_QUESTIONS.slice(10, 20),
        ...MATHS_QUESTIONS.slice(10, 20)
    ]
  },
  {
    id: 'test_jee_main_2023',
    title: 'JEE Mains 2023 (Apr 10 Shift 2)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'MAINS',
    examType: 'JEE',
    questions: [
        ...PHYSICS_QUESTIONS.slice(2, 12),
        ...CHEMISTRY_QUESTIONS.slice(2, 12),
        ...MATHS_QUESTIONS.slice(2, 12)
    ]
  },
  {
    id: 'test_jee_adv_2022',
    title: 'JEE Advanced 2022 (Paper 1)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'ADVANCED',
    examType: 'JEE',
    questions: [
        ...PHYSICS_QUESTIONS.slice(15, 25),
        ...CHEMISTRY_QUESTIONS.slice(15, 25),
        ...MATHS_QUESTIONS.slice(15, 25)
    ]
  },
  {
    id: 'test_bitsat_2023',
    title: 'BITSAT 2023 (Memory Based)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'CUSTOM',
    examType: 'BITSAT',
    questions: [
        ...PHYSICS_QUESTIONS.slice(0, 8),
        ...CHEMISTRY_QUESTIONS.slice(0, 8),
        ...MATHS_QUESTIONS.slice(0, 8)
    ]
  },
  {
    id: 'test_viteee_2022',
    title: 'VITEEE 2022 Sample Paper',
    durationMinutes: 150,
    category: 'PAST_PAPER',
    difficulty: 'CUSTOM',
    examType: 'VITEEE',
    questions: [
        ...PHYSICS_QUESTIONS.slice(5, 15),
        ...CHEMISTRY_QUESTIONS.slice(5, 15),
        ...MATHS_QUESTIONS.slice(5, 15)
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

export const INITIAL_FLASHCARDS: Flashcard[] = [
    { id: 'f1', subjectId: 'phys', difficulty: 'EASY', front: 'Equation for Range of Projectile', back: 'R = (u² sin 2θ) / g' },
    { id: 'f2', subjectId: 'chem', difficulty: 'MEDIUM', front: 'Hybridization of CH4', back: 'sp³ (Tetrahedral)' },
    { id: 'f3', subjectId: 'math', difficulty: 'HARD', front: 'Derivative of sin(x)', back: 'cos(x)' },
    { id: 'f4', subjectId: 'phys', difficulty: 'MEDIUM', front: 'Newton\'s Second Law', back: 'F = ma (Force = mass × acceleration)' },
    { id: 'f5', subjectId: 'chem', difficulty: 'EASY', front: 'pH formula', back: '-log[H+]' },
    { id: 'f6', subjectId: 'math', difficulty: 'MEDIUM', front: 'Sum of first n natural numbers', back: 'n(n+1)/2' },
    { id: 'f7', subjectId: 'phys', difficulty: 'HARD', front: 'Moment of Inertia (Disc)', back: 'MR²/2' },
    { id: 'f8', subjectId: 'chem', difficulty: 'HARD', front: 'Gibbs Free Energy Equation', back: 'ΔG = ΔH - TΔS' },
    { id: 'f9', subjectId: 'math', difficulty: 'EASY', front: 'Value of i²', back: '-1' },
    { id: 'f10', subjectId: 'phys', difficulty: 'MEDIUM', front: 'Unit of Capacitance', back: 'Farad (F)' }
];

export const INITIAL_MEMORY_HACKS: MemoryHack[] = [
    { id: 'h1', subjectId: 'chem', category: 'Inorganic Chemistry', title: 'Electrochemical Series (Reactivity)', description: 'Order of reduction potential.', trick: 'Likh Ba Kana Mazey se...', tags: ['Electrochemistry'] },
    { id: 'h2', subjectId: 'phys', category: 'Optics', title: 'VIBGYOR', description: 'Colors of visible spectrum.', trick: 'Violet Indigo Blue Green Yellow Orange Red', tags: ['Optics', 'Wave'] },
    { id: 'h3', subjectId: 'math', category: 'Trigonometry', title: 'ASTC Rule', description: 'Signs of trig functions in quadrants.', trick: 'Add Sugar To Coffee (All, Sin, Tan, Cos)', tags: ['Trigonometry'] },
    { id: 'h4', subjectId: 'chem', category: 'Organic', title: 'Aldol Condensation', description: 'Reaction conditions.', trick: 'Alpha Hydrogen + Dilute Base = Aldol', tags: ['Organic'] },
    { id: 'h5', subjectId: 'phys', category: 'Electricity', title: 'BBROYGBVGW', description: 'Resistor Color Code', trick: 'B B Roy Great Britain Very Good Wife', tags: ['Current'] }
];

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

export const AI_KNOWLEDGE_BASE: Record<string, string> = {
    "torque": "Torque is the rotational equivalent of force. Formula: τ = r x F = rFsinθ. It causes angular acceleration.",
    "entropy": "Entropy is a measure of the disorder or randomness in a system. Second law of thermodynamics states that entropy of the universe always increases.",
    "integration": "Integration is the process of finding the area under a curve. It is the reverse process of differentiation.",
    "ohm's law": "Ohm's Law states that V = IR, where V is voltage, I is current, and R is resistance. It applies to ohmic conductors.",
    "projectile motion": "Motion of an object thrown into the air, subject only to gravity. Path is a parabola. Key formulas: H = u²sin²θ/2g, R = u²sin2θ/g.",
    "vsepr": "Valence Shell Electron Pair Repulsion theory predicts molecular geometry based on minimizing repulsion between electron pairs around a central atom.",
    "cannizzaro reaction": "A redox reaction of aldehydes without alpha-hydrogen in presence of conc. base (NaOH), giving an alcohol and a carboxylic acid salt.",
    "newton's laws": "1. Inertia. 2. F=ma. 3. Action-Reaction. They govern classical mechanics.",
    "mole concept": "One mole contains 6.022 x 10²³ particles (Avogadro's number). Molar mass is mass of 1 mole of substance.",
    "hybridization": "Mixing of atomic orbitals to form new hybrid orbitals suitable for bonding. e.g., sp3 (tetrahedral), sp2 (trigonal planar).",
    "photoelectric effect": "Emission of electrons when electromagnetic radiation hits a material. Evidence for particle nature of light. KE = hν - Φ.",
    "bernopulli": "Bernoulli's principle states that an increase in the speed of a fluid occurs simultaneously with a decrease in static pressure or potential energy.",
    "doppler effect": "Change in frequency of a wave in relation to an observer who is moving relative to the wave source."
};