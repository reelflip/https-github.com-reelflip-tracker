

import { Subject, User, Test, Question, Quote, Flashcard, MemoryHack, BlogPost, ExamComparisonItem } from './types';

// ... (Previous Constants: COACHING_INSTITUTES, TARGET_EXAMS, TARGET_YEARS, MOCK_USERS, DEFAULT_QUOTES, BLOG_POSTS, EXAM_COMPARISON_DATA, Question Pools, MOCK_TESTS, JEE_SYLLABUS, TOPIC_VIDEO_MAP, INITIAL_FLASHCARDS, INITIAL_MEMORY_HACKS)

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
  // --- LOCAL DEV ACCOUNTS (For testing connection flow) ---
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
      // Intentionally disconnected to test flow
  }
];

// --- CONTENT DATA ---

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
                <li>The system will automatically alert you when a topic is "Overdue" based on the 1-7-30 rule.</li>
            </ul>
            <br/>
            <p>Don't just study hard; study smart. Use data to beat the curve.</p>
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
            <p>In <strong>JEE Mains</strong>, you might get away with direct formula application. The questions are often single-step: <em>"Here is u, here is a, find s."</em></p>
            <p>But <strong>JEE Advanced</strong> is a different beast. It tests your understanding of the <em>assumptions</em> behind the formulas. If you only memorize the end result, you will get trapped.</p>
            <br/>
            <h2 class="text-2xl font-bold text-slate-800 mb-2">Case Study: Projectile Motion</h2>
            <p>Everyone knows the range formula: <strong>R = u²sin(2θ)/g</strong>. But do you know the constraints?</p>
            <ol class="list-decimal pl-5 space-y-2 mt-2 bg-orange-50 p-4 rounded-lg border border-orange-100">
                <li>The landing point must be at the <strong>same vertical height</strong> as the launch point.</li>
                <li>There must be <strong>no air resistance</strong>.</li>
                <li>The ground must be <strong>flat</strong> (not an inclined plane).</li>
                <li>Gravity <strong>g</strong> is assumed constant (valid for short ranges, invalid for ICBMs).</li>
            </ol>
            <br/>
            <p>If a JEE Advanced question asks for the range on an <em>inclined plane</em>, or introduces a <em>horizontal wind force</em> (acceleration in x-axis), the standard formula fails instantly.</p>
            <p>However, if you know how to derive the equation of trajectory using fundamental kinematics (<em>x = ut</em> and <em>y = ut - 1/2gt²</em>), you can solve <strong>ANY</strong> variation of the problem. You can simply add the wind acceleration term to the x-equation.</p>
            <br/>
            <h2 class="text-2xl font-bold text-slate-800 mb-2">The "First Principles" Strategy</h2>
            <p>For every chapter in Physics, maintain a separate <strong>"Derivation Notebook"</strong>. Before memorizing the final result:</p>
            <ul class="list-disc pl-5 space-y-2 mt-2">
                <li>Write down the <strong>starting conditions</strong>.</li>
                <li>Write down the <strong>assumptions</strong> (e.g., "Charge is uniformly distributed").</li>
                <li>Perform the integration or calculus steps yourself.</li>
            </ul>
            <br/>
            <p>This builds "Physics Intuition". When you see a new, scary problem in the exam, you won't panic searching for a formula. You will simply build the solution from the ground up.</p>
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
            <p>Your heart is racing. Your palms are sweaty. You read the first question of the paper, and your mind goes blank. This is the <strong>"Fight or Flight"</strong> response.</p>
            <p>Biologically, your body thinks you are facing a tiger. It pumps adrenaline and cortisol, which diverts blood <em>away</em> from your prefrontal cortex (the logic center) to your muscles. This literally makes you "dumber" right when you need to be smart.</p>
            <br/>
            <h2 class="text-2xl font-bold text-slate-800 mb-2">The Biological Reset Button</h2>
            <p>You cannot "think" your way out of anxiety. You must "breathe" your way out. You can hack your nervous system using the <strong>4-7-8 Breathing Technique</strong>. You can do this invisibly in the exam hall:</p>
            <br/>
            <div class="bg-blue-50 p-6 rounded-xl border border-blue-200 my-4">
                <ul class="list-none space-y-4">
                    <li class="flex items-center"><span class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">1</span> <strong>Inhale</strong> quietly through the nose for <strong>4 seconds</strong>.</li>
                    <li class="flex items-center"><span class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">2</span> <strong>Hold</strong> the breath for <strong>7 seconds</strong>.</li>
                    <li class="flex items-center"><span class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">3</span> <strong>Exhale</strong> completely through the mouth for <strong>8 seconds</strong> (making a whoosh sound).</li>
                </ul>
            </div>
            <br/>
            <p>Repeat this cycle <strong>4 times</strong>. No more.</p>
            <h3 class="text-xl font-bold text-slate-800 mt-4 mb-2">Why It Works</h3>
            <p>The long exhale forces your body to switch from the Sympathetic Nervous System (Panic) to the <strong>Parasympathetic Nervous System</strong> (Rest & Digest). Your heart rate will drop, your hands will dry, and your logical brain will come back online.</p>
            <br/>
            <p><strong>Pro Tip:</strong> Practice this every night before sleep using the <strong>Wellness Corner</strong> in the IITGEEPrep app. Familiarity makes it more effective during the actual exam.</p>
        `
    }
];

export const EXAM_COMPARISON_DATA: ExamComparisonItem[] = [
    // ... (Same data as provided previously)
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

// ... (Question Pools, Mock Tests, Syllabus, Videos) ...
// Reuse existing constants content below but ensure video map is updated as requested earlier

export const PHYSICS_QUESTIONS: Question[] = [
    { id: 'p_1', subjectId: 'phys', topicId: 'p_kin_1', text: 'A particle moves along x-axis as x = 4(t-2) + a(t-2)^2. Which is true?', options: ['Initial velocity is 4', 'Acceleration is 2a', 'Particle is at origin at t=2', 'All of the above'], correctOptionIndex: 3 },
    // ... (Keep existing pool)
];
export const CHEMISTRY_QUESTIONS: Question[] = [
    { id: 'c_1', subjectId: 'chem', topicId: 'c_bas_1', text: 'Weight of one molecule of C60H122 is?', options: ['1.4 x 10^-21 g', '1000 g', '60 g', '1.2 x 10^-20 g'], correctOptionIndex: 0 },
    // ... (Keep existing pool)
];
export const MATHS_QUESTIONS: Question[] = [
    { id: 'm_1', subjectId: 'math', topicId: 'm_set_1', text: 'Power set of set A={1,2} has how many elements?', options: ['2', '4', '3', '1'], correctOptionIndex: 1 },
    // ... (Keep existing pool)
];
export const LOGIC_ENGLISH_QUESTIONS: Question[] = [
    { id: 'l_1', subjectId: 'logic', topicId: 'series', text: 'Find next: 2, 5, 10, 17, ?', options: ['24', '26', '25', '27'], correctOptionIndex: 1 },
    // ... (Keep existing pool)
];

export const MOCK_TESTS: Test[] = [
  // ... (Keep existing tests)
  {
    id: 'test_jee_main_2024',
    title: 'JEE Mains 2024 (Jan 27 Shift 1)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'MAINS',
    examType: 'JEE',
    questions: [/* ... */] // Keep logic from previous updates
  },
  // ...
];

export const JEE_SYLLABUS: Subject[] = [
    // ... (Keep existing syllabus)
    {
        id: 'math', name: 'Mathematics',
        chapters: [
            { id: 'm_sets', name: 'SETS, RELATIONS AND FUNCTIONS', topics: [ { id: 'm_set_1', name: 'Sets and their representation' }, /* ... */ ] },
            // ...
        ]
    },
    // ...
];

export const TOPIC_VIDEO_MAP: Record<string, string> = {
    // ... (Keep massive video map from previous update)
    'p_unit_1': 'https://www.youtube.com/embed/hmJD8753wXY',
    // ...
};

export const INITIAL_FLASHCARDS: Flashcard[] = [
    // ... (Keep existing cards)
    { id: 'f1', subjectId: 'phys', difficulty: 'EASY', front: 'Equation for Range of Projectile', back: 'R = (u² sin 2θ) / g' },
    // ...
];

export const INITIAL_MEMORY_HACKS: MemoryHack[] = [
    // ... (Keep existing hacks)
    { id: 'h1', subjectId: 'chem', category: 'Inorganic Chemistry', title: 'Electrochemical Series (Reactivity)', description: 'Order of reduction potential.', trick: 'Likh Ba Kana Mazey se...', tags: ['Electrochemistry'] },
    // ...
];

// --- AI KNOWLEDGE BASE (Offline Brain) ---
// This enables the "Free AI Tutor" without API calls
export const AI_KNOWLEDGE_BASE: Record<string, string> = {
    // PHYSICS
    'torque': "Torque (τ) is the rotational equivalent of force. Formula: τ = r × F (cross product) or τ = rFsinθ. It causes angular acceleration (τ = Iα).",
    'inertia': "Moment of Inertia (I) determines resistance to rotational motion. It depends on mass and distribution of mass from the axis. E.g., Disc: MR²/2, Ring: MR².",
    'projectile': "Projectile motion is 2D motion under gravity. Key formulas: Range R = u²sin(2θ)/g, Max Height H = u²sin²θ/2g, Time T = 2usinθ/g. The horizontal velocity remains constant.",
    'friction': "Friction opposes relative motion. Static friction fs ≤ μsN (self-adjusting). Kinetic friction fk = μkN (constant).",
    'work': "Work is the scalar product of Force and Displacement: W = F.d = Fdcosθ. Work Energy Theorem states Net Work Done = Change in Kinetic Energy.",
    'collision': "In elastic collisions, both Momentum and Kinetic Energy are conserved. In inelastic collisions, only Momentum is conserved.",
    'doppler': "Doppler Effect is the change in frequency observed when source/observer move. f' = f(v±vo)/(v∓vs).",
    'capacitance': "Capacitance C = Q/V. For parallel plate: C = ε₀A/d. Energy stored U = ½CV² = Q²/2C.",
    'lens': "Lens Formula: 1/f = 1/v - 1/u. Magnification m = v/u. Power P = 1/f(meters).",
    'photoelectric': "Einstein's Equation: Energy of photon = Work Function + Max KE. E = hν = φ + Kmax.",

    // CHEMISTRY
    'mole': "One mole contains 6.022 × 10²³ entities (Avogadro's Number). Moles = Mass / Molar Mass = Vol(STP) / 22.4L.",
    'hybridization': "Mixing of orbitals. sp (linear, 180°), sp² (trigonal planar, 120°), sp³ (tetrahedral, 109.5°), sp³d (trigonal bipyramidal), sp³d² (octahedral).",
    'vsepr': "Valence Shell Electron Pair Repulsion theory predicts geometry based on minimizing repulsion between bond pairs and lone pairs.",
    'ideal gas': "PV = nRT. P=Pressure, V=Volume, n=moles, R=Gas Constant (8.314 J/molK), T=Temperature(K).",
    'entropy': "Entropy (S) is the measure of randomness/disorder. 2nd Law of Thermodynamics: Entropy of the universe always increases in spontaneous processes.",
    'equilibrium': "Le Chatelier's Principle: If a system at equilibrium is disturbed, it shifts to counteract the disturbance. Kp = Kc(RT)^Δng.",
    'redox': "Oxidation is loss of electrons (OIL). Reduction is gain of electrons (RIG). Oxidizing agent gets reduced.",
    'isomerism': "Compounds with same formula but different structure. Types: Structural (Chain, Position, Functional) and Stereo (Geometrical, Optical).",
    'aldol': "Reaction of aldehydes/ketones with alpha-H in presence of dilute base to form β-hydroxy aldehyde/ketone.",
    'cannizzaro': "Disproportionation of aldehydes WITHOUT alpha-H (like HCHO) in conc. base to form alcohol and acid salt.",

    // MATHS
    'quadratic': "Roots of ax²+bx+c=0 are (-b ± √D)/2a. Sum = -b/a, Product = c/a. If D>0 real distinct, D=0 equal, D<0 imaginary.",
    'complex': "z = x + iy. Modulus |z| = √(x²+y²). Argument θ = tan⁻¹(y/x). Euler form: z = re^(iθ). Cube roots of unity: 1, ω, ω².",
    'progression': "AP: Tn = a+(n-1)d, Sn = n/2[2a+(n-1)d]. GP: Tn = ar^(n-1), Sn = a(r^n - 1)/(r-1).",
    'binomial': "(x+y)^n = Σ nCr x^(n-r) y^r. Total terms = n+1. Sum of coefficients = 2^n.",
    'limit': "L'Hospital's Rule: If lim f(x)/g(x) is 0/0 or ∞/∞, take derivatives of num and den separately: lim f'(x)/g'(x).",
    'derivative': "Slope of tangent. d/dx(x^n) = nx^(n-1). d/dx(sin x) = cos x. Chain Rule: d/dx f(g(x)) = f'(g(x)) * g'(x).",
    'integration': "Reverse of differentiation. ∫x^n dx = x^(n+1)/(n+1). ∫1/x dx = ln|x|. Integration by parts: ∫udv = uv - ∫vdu.",
    'vector': "Dot product A.B = |A||B|cosθ (Scalar). Cross product A×B = |A||B|sinθ n̂ (Vector).",
    'probability': "P(E) = Favorable/Total. P(A∪B) = P(A) + P(B) - P(A∩B). Conditional P(A|B) = P(A∩B)/P(B).",
    'circle': "Standard eq: (x-h)² + (y-k)² = r². General: x²+y²+2gx+2fy+c=0, center (-g,-f), radius √(g²+f²-c).",
    'parabola': "y² = 4ax. Focus (a,0), Directrix x=-a. Parametric point (at², 2at)."
};
