
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
      targetExam: 'JEE Main & Advanced',
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

export const BLOG_POSTS: BlogPost[] = [
    {
        id: 'blog_1',
        title: 'The 1-7-30 Revision Strategy: Beating the Forgetting Curve',
        excerpt: 'Why do you forget formulas 2 days after studying? Learn the scientifically proven method to retain 90% of what you learn.',
        author: 'Rahul Sharma (IIT Bombay)',
        date: 'Oct 15, 2024',
        category: 'Strategy',
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000',
        content: `
            <p>We've all been there. You spend 4 hours mastering Rotational Motion, solving every problem in the book. Two weeks later, you open a mock test, and your mind goes blank. You remember studying it, but the formula for Moment of Inertia of a solid cone just won't come to you.</p>
            <br/>
            <h3 class="text-xl font-bold text-slate-800">The Problem: Ebbinghaus Forgetting Curve</h3>
            <p>The human brain is wired to forget. Research shows that within 24 hours of learning something new, we forget about 50-80% of it unless we review it. By day 30, we retain less than 5%.</p>
            <br/>
            <h3 class="text-xl font-bold text-slate-800">The Solution: Spaced Repetition (1-7-30)</h3>
            <p>To hack your brain's retention, you need to interrupt the forgetting curve at specific intervals:</p>
            <ul class="list-disc pl-5 space-y-2 mt-2">
                <li><strong>The 1st Review (24 Hours):</strong> Revise the topic the very next day. This signals to your brain that this information is important. It takes only 10-15 minutes but restores retention to 100%.</li>
                <li><strong>The 2nd Review (7 Days):</strong> Revise it again a week later. This pushes the memory from short-term to medium-term storage.</li>
                <li><strong>The 3rd Review (30 Days):</strong> The final seal. Reviewing it after a month cements it into long-term memory.</li>
            </ul>
            <br/>
            <p>Using the <strong>IIT JEE Prep Syllabus Tracker</strong>, you can easily mark topics for revision. Don't just study hard; study smart.</p>
        `
    },
    {
        id: 'blog_2',
        title: 'Physics: Why "Deriving" is Better Than "Memorizing"',
        excerpt: 'Stop mugging up formulas. Understanding the derivation is the key to solving Advanced level problems.',
        author: 'A. Verma (Physics Faculty)',
        date: 'Oct 10, 2024',
        category: 'Subject-wise',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000',
        content: `
            <p>In JEE Mains, you might get away with direct formula application. But JEE Advanced is a different beast. It tests your understanding of the <em>assumptions</em> behind the formulas.</p>
            <br/>
            <h3 class="text-xl font-bold text-slate-800">Case Study: Projectile Motion</h3>
            <p>Everyone knows <em>R = u²sin(2θ)/g</em>. But this formula assumes:</p>
            <ol class="list-decimal pl-5 space-y-2 mt-2">
                <li>The landing point is at the same height as the launch point.</li>
                <li>There is no air resistance.</li>
                <li>The ground is flat (not an inclined plane).</li>
            </ol>
            <br/>
            <p>If a question asks for the range on an inclined plane, or if there's a wind force, the standard formula fails. If you know how to derive the equation of trajectory using <em>x = ut</em> and <em>y = ut - 1/2gt²</em>, you can solve ANY variation of the problem.</p>
            <br/>
            <p><strong>Actionable Tip:</strong> For every chapter in Physics, maintain a "Derivation Notebook". Before memorizing the final result, write down the starting conditions and the steps to get there.</p>
        `
    },
    {
        id: 'blog_3',
        title: 'Managing Stress: The 4-7-8 Breathing Technique',
        excerpt: 'Exam anxiety is real. Here is a simple tool you can use right inside the exam hall to calm your nerves.',
        author: 'Dr. S. Gupta (Psychologist)',
        date: 'Oct 05, 2024',
        category: 'Motivation',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000',
        content: `
            <p>Your heart is racing. Your palms are sweaty. You read the first question of the paper, and your mind goes blank. This is the "Fight or Flight" response, and it shuts down the logical part of your brain (prefrontal cortex).</p>
            <br/>
            <h3 class="text-xl font-bold text-slate-800">The Reset Button</h3>
            <p>You can hack your nervous system using the <strong>4-7-8 Breathing Technique</strong>. You can do this invisibly in the exam hall:</p>
            <br/>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>Inhale</strong> quietly through the nose for <strong>4 seconds</strong>.</li>
                <li><strong>Hold</strong> the breath for <strong>7 seconds</strong>.</li>
                <li><strong>Exhale</strong> completely through the mouth for <strong>8 seconds</strong>.</li>
            </ul>
            <br/>
            <p>Repeat this cycle 4 times. This forces your body to switch from "Sympathetic" (Panic) to "Parasympathetic" (Calm) mode. Your heart rate will drop, and your logical brain will come back online.</p>
            <br/>
            <p>Check out the <strong>Wellness Corner</strong> in the app for a guided visual aid of this technique.</p>
        `
    }
];

export const EXAM_COMPARISON_DATA: ExamComparisonItem[] = [
    { 
      name: 'JEE Advanced', 
      difficulty: 5, 
      color: 'text-red-600 bg-red-50 border-red-100',
      barColor: 'bg-red-600',
      borderColor: 'border-l-red-600',
      hoverBg: 'hover:bg-red-50/50',
      focus: 'Deep concepts, tricky, multi-step problems. Tests analytical thinking and subject depth.',
      desc: 'The gateway to the IITs. Requires high IQ application, not just memory.',
      colleges: '23 IITs, IISc Bangalore, IISERs, RGIPT, IIPE.',
      dates: 'Late May / Early June'
    },
    { 
      name: 'JEE Main', 
      difficulty: 4, 
      color: 'text-orange-600 bg-orange-50 border-orange-100',
      barColor: 'bg-orange-500',
      borderColor: 'border-l-orange-500',
      hoverBg: 'hover:bg-orange-50/50',
      focus: 'Balanced approach + NCERT. Speed & Accuracy are crucial.',
      desc: 'Screening for JEE Advanced. Entry to top government colleges.',
      colleges: '31 NITs, 26 IIITs, 33 GFTIs, DTU, NSUT, and many state colleges.',
      dates: 'Session 1: January | Session 2: April'
    },
    { 
      name: 'BITSAT', 
      difficulty: 3, 
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      barColor: 'bg-purple-500',
      borderColor: 'border-l-purple-500',
      hoverBg: 'hover:bg-purple-50/50',
      focus: 'Speed + Accuracy. Shorter questions, includes English & Logic.',
      desc: 'Known for having more questions in less time (130 Qs in 3 hrs).',
      colleges: 'BITS Pilani, BITS Goa, BITS Hyderabad.',
      dates: 'Session 1: Late May | Session 2: Late June'
    },
    { 
      name: 'VITEEE', 
      difficulty: 2, 
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
      barColor: 'bg-cyan-500',
      borderColor: 'border-l-cyan-500',
      hoverBg: 'hover:bg-cyan-50/50',
      focus: 'Direct application. Strictly based on NCERT pattern. No negative marking.',
      desc: 'Entrance for one of India\'s most popular private universities.',
      colleges: 'VIT Vellore, VIT Chennai, VIT AP, VIT Bhopal.',
      dates: 'Mid April (approx. 10 days window)'
    },
    { 
      name: 'MET (Manipal)', 
      difficulty: 3, 
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      barColor: 'bg-blue-500',
      borderColor: 'border-l-blue-600',
      hoverBg: 'hover:bg-blue-50/50',
      focus: 'Calculation-heavy. Requires fast numerical solving skills.',
      desc: 'Entrance for Manipal Academy of Higher Education.',
      colleges: 'Manipal Inst of Tech (MIT) Manipal, Bengaluru, Jaipur.',
      dates: 'Phase 1: Mid April | Phase 2: Mid May'
    },
    { 
      name: 'SRMJEEE', 
      difficulty: 2, 
      color: 'text-teal-600 bg-teal-50 border-teal-100',
      barColor: 'bg-teal-500',
      borderColor: 'border-l-teal-500',
      hoverBg: 'hover:bg-teal-50/50',
      focus: 'Moderate level. Standard textbook problems.',
      desc: 'Admission to SRM University campuses.',
      colleges: 'SRM Kattankulathur, Ramapuram, NCR Ghaziabad.',
      dates: 'Phase 1: April | Phase 2: June | Phase 3: July'
    },
    { 
      name: 'AMUEEE', 
      difficulty: 3, 
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      barColor: 'bg-indigo-500',
      borderColor: 'border-l-indigo-600',
      hoverBg: 'hover:bg-indigo-50/50',
      focus: 'Concept + Formula application. Moderate difficulty.',
      desc: 'For Aligarh Muslim University engineering programs.',
      colleges: 'ZHCET (AMU Aligarh).',
      dates: 'Mid May'
    },
    { 
      name: 'CUET-UG', 
      difficulty: 1, 
      color: 'text-green-600 bg-green-50 border-green-100',
      barColor: 'bg-green-500',
      borderColor: 'border-l-green-500',
      hoverBg: 'hover:bg-green-50/50',
      focus: 'Strictly NCERT-based. Fundamental understanding.',
      desc: 'Central Universities Entrance Test. Basic domain knowledge.',
      colleges: 'University of Delhi (DU), BHU, JNU, and 40+ Central Univs.',
      dates: 'Mid May to End May'
    },
];

export const INITIAL_MEMORY_HACKS: MemoryHack[] = [
    // --- CHEMISTRY ---
    // Inorganic
    {
        id: 'h1',
        subjectId: 'chem',
        category: 'Inorganic Chemistry',
        title: 'Electrochemical Series (Reactivity)',
        description: 'Order of reduction potential (decreasing reactivity).',
        trick: 'Likh Ba Kana Mazey se Ala Manjan Kar Fekona Cd CoNi Suno Prabhat Hai Kyu Aayi Hogi Aaj Pitayi Aur Free\n(Li K Ba Ca Na Mg Al Mn Zn Cr Fe Cd Co Ni Sn Pb H Cu I Hg Ag Pt Au F)',
        tags: ['Electrochemistry', 'Redox', 'Metals']
    },
    // Periodic Table
    {
        id: 'h2',
        subjectId: 'chem',
        category: 'Inorganic Chemistry',
        title: 'Group 1 Elements (Alkali Metals)',
        description: 'Li, Na, K, Rb, Cs, Fr',
        trick: 'LiNa Ki Ruby Se Friendship',
        tags: ['Periodic Table', 'S-Block']
    },
    {
        id: 'h3',
        subjectId: 'chem',
        category: 'Inorganic Chemistry',
        title: 'Group 2 Elements (Alkaline Earth)',
        description: 'Be, Mg, Ca, Sr, Ba, Ra',
        trick: 'Beta Mange Car Scooter Baap Raazi',
        tags: ['Periodic Table', 'S-Block']
    },
    {
        id: 'h4',
        subjectId: 'chem',
        category: 'Inorganic Chemistry',
        title: 'Group 13 Elements (Boron Family)',
        description: 'B, Al, Ga, In, Tl',
        trick: 'Baigan Aloo Gajar In Thaila',
        tags: ['Periodic Table', 'P-Block']
    },
    {
        id: 'h5',
        subjectId: 'chem',
        category: 'Inorganic Chemistry',
        title: 'Group 14 Elements (Carbon Family)',
        description: 'C, Si, Ge, Sn, Pb',
        trick: 'Kahe Sita Ji Suno Prabhu',
        tags: ['Periodic Table', 'P-Block']
    },
    {
        id: 'h6',
        subjectId: 'chem',
        category: 'Inorganic Chemistry',
        title: 'Group 15 Elements (Nitrogen Family)',
        description: 'N, P, As, Sb, Bi',
        trick: 'Nana Patekar Aishwarya Sab Bimar',
        tags: ['Periodic Table', 'P-Block']
    },
    {
        id: 'h7',
        subjectId: 'chem',
        category: 'Inorganic Chemistry',
        title: 'Group 16 Elements (Oxygen Family)',
        description: 'O, S, Se, Te, Po',
        trick: 'Oh Style Se Tepoo (Cheat with style)',
        tags: ['Periodic Table', 'P-Block']
    },
    {
        id: 'h8',
        subjectId: 'chem',
        category: 'Inorganic Chemistry',
        title: 'Group 17 Elements (Halogens)',
        description: 'F, Cl, Br, I, At',
        trick: 'Phir Kal Bahar Aayegi Aunty',
        tags: ['Periodic Table', 'P-Block']
    },
    {
        id: 'h9',
        subjectId: 'chem',
        category: 'Inorganic Chemistry',
        title: 'Group 18 Elements (Noble Gases)',
        description: 'He, Ne, Ar, Kr, Xe, Rn',
        trick: 'Heena Neena Aur Kareena Ka X-Ray Rangeen',
        tags: ['Periodic Table', 'P-Block']
    },
    // Organic
    {
        id: 'h10',
        subjectId: 'chem',
        category: 'Organic Chemistry',
        title: 'Ortho/Para Directors (Activators)',
        description: 'Groups that direct incoming electrophiles to O/P positions.',
        trick: 'AHA! (Alkyl, Halogen, Amino/Hydroxyl)',
        tags: ['GOC', 'Reactions']
    },
    {
        id: 'h11',
        subjectId: 'chem',
        category: 'Organic Chemistry',
        title: 'Aldol Condensation Requirement',
        description: 'Which aldehydes/ketones undergo Aldol?',
        trick: 'Alpha H hai toh Aldol hai. (Must contain Alpha Hydrogen)',
        tags: ['Aldehydes', 'Ketones', 'Reactions']
    },
    {
        id: 'h12',
        subjectId: 'chem',
        category: 'Organic Chemistry',
        title: 'Cannizzaro Reaction Requirement',
        description: 'Which aldehydes undergo Cannizzaro?',
        trick: 'NO Alpha H = Cannizzaro (e.g. HCHO, PhCHO)',
        tags: ['Aldehydes', 'Reactions']
    },

    // --- PHYSICS ---
    // Mechanics
    {
        id: 'h13',
        subjectId: 'phys',
        category: 'Mechanics',
        title: 'Equations of Motion (Validity)',
        description: 'When can you apply v = u + at?',
        trick: 'Only when "a" is constant! Check if F is constant or function of time/position.',
        tags: ['Kinematics']
    },
    {
        id: 'h14',
        subjectId: 'phys',
        category: 'Mechanics',
        title: 'Work Done by Conservative Force',
        description: 'Relation between Work and Potential Energy',
        trick: 'W_con = -ΔU (Work by conservative force is negative of change in PE)',
        tags: ['Work Energy Power']
    },
    // Electrodynamics
    {
        id: 'h15',
        subjectId: 'phys',
        category: 'Electrodynamics',
        title: 'Color Code for Resistors',
        description: 'Black Brown Red Orange Yellow Green Blue Violet Grey White',
        trick: 'B B ROY of Great Britain had a Very Good Wife',
        tags: ['Current Electricity']
    },
    {
        id: 'h16',
        subjectId: 'phys',
        category: 'Electrodynamics',
        title: 'Fleming Left vs Right Hand Rule',
        description: 'Which hand for what?',
        trick: 'M-G-R: Motor-Generator-Right. (Left for Motor, Right for Generator)',
        tags: ['Magnetism']
    },
    // Optics
    {
        id: 'h17',
        subjectId: 'phys',
        category: 'Optics',
        title: 'Concave/Convex Mirror Focal Length',
        description: 'Sign convention for mirrors and lenses.',
        trick: 'Concave = Cave = Inwards = Negative (-ve). Convex = Positive (+ve).',
        tags: ['Ray Optics']
    },
    {
        id: 'h18',
        subjectId: 'phys',
        category: 'Modern Physics',
        title: 'Lyman, Balmer, Paschen Series',
        description: 'Order of Hydrogen Spectrum Series',
        trick: 'Lo Blood Pressure (BP), Blood Pressure (BP) High. \n(Lyman, Balmer, Paschen, Brackett, Pfund, Humphrey)',
        tags: ['Atoms']
    },

    // --- MATHS ---
    // Trigonometry
    {
        id: 'h19',
        subjectId: 'math',
        category: 'Trigonometry',
        title: 'Signs of Trig Ratios in Quadrants',
        description: 'Q1, Q2, Q3, Q4 positive ratios.',
        trick: 'Add Sugar To Coffee (All, Sin, Tan, Cos)',
        tags: ['Trigonometry']
    },
    // Calculus
    {
        id: 'h20',
        subjectId: 'math',
        category: 'Calculus',
        title: 'Integration by Parts (Order)',
        description: 'Order of choosing first function (u).',
        trick: 'ILATE (Inverse, Log, Algebraic, Trig, Exponential)',
        tags: ['Integration']
    },
    // Coordinate Geometry
    {
        id: 'h21',
        subjectId: 'math',
        category: 'Coordinate Geometry',
        title: 'Eccentricity of Conics',
        description: 'Range of e for different shapes.',
        trick: 'Circle (e=0) < Ellipse (0<e<1) < Parabola (e=1) < Hyperbola (e>1). Alphabetical order C-E-P-H matches value increase!',
        tags: ['Conic Sections']
    },
    // Algebra
    {
        id: 'h22',
        subjectId: 'math',
        category: 'Algebra',
        title: 'Cube Roots of Unity (1, ω, ω²)',
        description: 'Properties of Omega',
        trick: 'Sum is Zero (1+ω+ω²=0). Product is One (ω³=1).',
        tags: ['Complex Numbers']
    },
    {
        id: 'h23',
        subjectId: 'math',
        category: 'Vectors',
        title: 'Cross Product Direction',
        description: 'i x j = k',
        trick: 'Follow the Circle: i -> j -> k is positive. Going against (j -> i) is negative.',
        tags: ['Vectors']
    }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
    // PHYSICS
    { id: 'f1', subjectId: 'phys', difficulty: 'EASY', front: 'Equation for Range of Projectile', back: 'R = (u² sin 2θ) / g' },
    { id: 'f2', subjectId: 'phys', difficulty: 'MEDIUM', front: 'Moment of Inertia: Solid Sphere', back: 'I = (2/5)MR²' },
    { id: 'f3', subjectId: 'phys', difficulty: 'MEDIUM', front: 'Moment of Inertia: Hollow Sphere', back: 'I = (2/3)MR²' },
    { id: 'f4', subjectId: 'phys', difficulty: 'HARD', front: 'Escape Velocity Formula', back: 'v = √(2GM/R) or √(2gR)' },
    { id: 'f5', subjectId: 'phys', difficulty: 'MEDIUM', front: 'Time Period of Simple Pendulum', back: 'T = 2π √(L/g)' },
    { id: 'f6', subjectId: 'phys', difficulty: 'EASY', front: 'Ohm\'s Law', back: 'V = IR' },
    { id: 'f7', subjectId: 'phys', difficulty: 'MEDIUM', front: 'Capacitance of Parallel Plate', back: 'C = (ε₀A) / d' },
    { id: 'f8', subjectId: 'phys', difficulty: 'HARD', front: 'Biot-Savart Law (Mag Field)', back: 'dB = (μ₀/4π) * (Idl x r) / r³' },
    { id: 'f9', subjectId: 'phys', difficulty: 'MEDIUM', front: 'Young\'s Double Slit Fringe Width', back: 'β = (λD) / d' },
    { id: 'f10', subjectId: 'phys', difficulty: 'HARD', front: 'De-Broglie Wavelength', back: 'λ = h / mv = h / p' },
    { id: 'f11', subjectId: 'phys', difficulty: 'MEDIUM', front: 'First Law of Thermodynamics', back: 'ΔQ = ΔU + ΔW' },
    { id: 'f12', subjectId: 'phys', difficulty: 'MEDIUM', front: 'Centripetal Acceleration', back: 'a = v² / r = ω²r' },
    { id: 'f13', subjectId: 'phys', difficulty: 'HARD', front: 'Bernoulli\'s Equation', back: 'P + ½ρv² + ρgh = Constant' },
    { id: 'f14', subjectId: 'phys', difficulty: 'EASY', front: 'Power Formula (Electricity)', back: 'P = VI = I²R = V²/R' },
    { id: 'f15', subjectId: 'phys', difficulty: 'MEDIUM', front: 'Malus Law (Polarization)', back: 'I = I₀ cos²θ' },

    // CHEMISTRY
    { id: 'c1', subjectId: 'chem', difficulty: 'EASY', front: 'Ideal Gas Equation', back: 'PV = nRT' },
    { id: 'c2', subjectId: 'chem', difficulty: 'MEDIUM', front: 'Nernst Equation (EMF)', back: 'E = E° - (0.059/n) log Q' },
    { id: 'c3', subjectId: 'chem', difficulty: 'HARD', front: 'Bragg\'s Equation', back: 'nλ = 2d sinθ' },
    { id: 'c4', subjectId: 'chem', difficulty: 'MEDIUM', front: 'Rate constant (First Order)', back: 'k = (2.303/t) log(a / a-x)' },
    { id: 'c5', subjectId: 'chem', difficulty: 'MEDIUM', front: 'Half life (First Order)', back: 't½ = 0.693 / k' },
    { id: 'c6', subjectId: 'chem', difficulty: 'EASY', front: 'pH Formula', back: 'pH = -log[H+]' },
    { id: 'c7', subjectId: 'chem', difficulty: 'HARD', front: 'Rydberg Formula (Hydrogen)', back: '1/λ = R (1/n₁² - 1/n₂²)' },
    { id: 'c8', subjectId: 'chem', difficulty: 'MEDIUM', front: 'Gibbs Free Energy', back: 'ΔG = ΔH - TΔS' },
    { id: 'c9', subjectId: 'chem', difficulty: 'HARD', front: 'Cannizzaro Reaction Product', back: 'Disproportionation: Alcohol + Carboxylic Acid Salt' },
    { id: 'c10', subjectId: 'chem', difficulty: 'MEDIUM', front: 'Reimer-Tiemann Reaction Product', back: 'Salicylaldehyde (from Phenol)' },
    { id: 'c11', subjectId: 'chem', difficulty: 'EASY', front: 'General Formula: Alkanes', back: 'CnH(2n+2)' },
    { id: 'c12', subjectId: 'chem', difficulty: 'MEDIUM', front: 'Hybridization of Carbon in Ethene', back: 'sp² (Trigonal Planar)' },
    { id: 'c13', subjectId: 'chem', difficulty: 'MEDIUM', front: 'Molality formula', back: 'Moles of solute / Mass of solvent (kg)' },
    { id: 'c14', subjectId: 'chem', difficulty: 'HARD', front: 'Arrhenius Equation', back: 'k = A * e^(-Ea/RT)' },
    { id: 'c15', subjectId: 'chem', difficulty: 'MEDIUM', front: 'Bond Order Formula', back: '½ (Nb - Na)' },

    // MATHS
    { id: 'm1', subjectId: 'math', difficulty: 'EASY', front: 'Quadratic Roots Formula', back: 'x = (-b ± √D) / 2a' },
    { id: 'm2', subjectId: 'math', difficulty: 'MEDIUM', front: 'Sum of AP (n terms)', back: 'S = n/2 [2a + (n-1)d]' },
    { id: 'm3', subjectId: 'math', difficulty: 'HARD', front: 'Sum of GP (infinite)', back: 'S = a / (1-r) where |r|<1' },
    { id: 'm4', subjectId: 'math', difficulty: 'MEDIUM', front: 'Distance of point from line', back: '|ax₁ + by₁ + c| / √(a² + b²)' },
    { id: 'm5', subjectId: 'math', difficulty: 'HARD', front: 'Integration of ln(x)', back: 'x ln(x) - x + C' },
    { id: 'm6', subjectId: 'math', difficulty: 'MEDIUM', front: 'Slope of Normal', back: '-1 / (dy/dx)' },
    { id: 'm7', subjectId: 'math', difficulty: 'EASY', front: 'sin²x + cos²x', back: '1' },
    { id: 'm8', subjectId: 'math', difficulty: 'HARD', front: 'Expansion of e^x', back: '1 + x + x²/2! + x³/3! + ...' },
    { id: 'm9', subjectId: 'math', difficulty: 'MEDIUM', front: 'Area of Triangle (Vertices)', back: '½ |x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|' },
    { id: 'm10', subjectId: 'math', difficulty: 'HARD', front: 'Angle between two lines', back: 'tanθ = |(m₁ - m₂) / (1 + m₁m₂)|' },
    { id: 'm11', subjectId: 'math', difficulty: 'MEDIUM', front: 'L\'Hospital\'s Rule Condition', back: '0/0 or ∞/∞ form' },
    { id: 'm12', subjectId: 'math', difficulty: 'EASY', front: 'Derivative of sin(x)', back: 'cos(x)' },
    { id: 'm13', subjectId: 'math', difficulty: 'MEDIUM', front: 'Projection of a on b', back: '(a . b) / |b|' },
    { id: 'm14', subjectId: 'math', difficulty: 'HARD', front: 'Equation of Tangent to Circle', back: 'xx₁ + yy₁ = a² (at point x₁, y₁)' },
    { id: 'm15', subjectId: 'math', difficulty: 'MEDIUM', front: 'Variance Formula', back: 'Σx²/n - (Σx/n)²' }
];

export const JEE_SYLLABUS: Subject[] = [
    {
        id: 'math',
        name: 'Mathematics',
        chapters: [
            {
                id: 'm_sets',
                name: 'SETS, RELATIONS AND FUNCTIONS',
                topics: [
                    { id: 'm_set_1', name: 'Sets and their representation' },
                    { id: 'm_set_2', name: 'Union, intersection and complement of sets' },
                    { id: 'm_rel_1', name: 'Relations and Types' },
                    { id: 'm_fun_1', name: 'Functions: One-one, Into, Onto' }
                ]
            },
            {
                id: 'm_complex',
                name: 'COMPLEX NUMBERS AND QUADRATIC EQUATIONS',
                topics: [
                    { id: 'm_cpx_1', name: 'Complex Numbers Representation' },
                    { id: 'm_cpx_2', name: 'Argand Diagram & Algebra' },
                    { id: 'm_quad_1', name: 'Quadratic Equations & Roots' }
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
                name: 'UNIT 1: Units and Measurements',
                topics: [
                    { id: 'p_unit_1', name: 'SI Units & Dimensions' },
                    { id: 'p_unit_2', name: 'Errors in Measurement' }
                ]
            },
            {
                id: 'p_kin',
                name: 'UNIT 2: Kinematics',
                topics: [
                    { id: 'p_kin_1', name: 'Motion in Straight Line' },
                    { id: 'p_kin_2', name: 'Projectile Motion' },
                    { id: 'p_kin_3', name: 'Relative Velocity' }
                ]
            }
        ]
    },
    {
        id: 'chem',
        name: 'Chemistry',
        chapters: [
            {
                id: 'c_basic',
                name: 'UNIT I: SOME BASIC CONCEPTS IN CHEMISTRY',
                topics: [
                    { id: 'c_bas_1', name: 'Mole Concept' },
                    { id: 'c_bas_2', name: 'Stoichiometry' }
                ]
            },
            {
                id: 'c_atom',
                name: 'UNIT 2: ATOMIC STRUCTURE',
                topics: [
                    { id: 'c_at_1', name: 'Bohr Model & Spectrum' },
                    { id: 'c_at_2', name: 'Quantum Numbers & Orbitals' }
                ]
            }
        ]
    }
];

// Reusing existing sample questions logic but ensuring they are exported for MOCK_TESTS
const Q_PHYS_1 = { id: 'q1', subjectId: 'phys', topicId: 'p_kin_1', text: 'A particle moves along a straight line. Its velocity is given by v = 3t^2. What is the acceleration at t=2?', options: ['6 m/s²', '12 m/s²', '3 m/s²', '0 m/s²'], correctOptionIndex: 1 };
const Q_CHEM_1 = { id: 'q2', subjectId: 'chem', topicId: 'c_at_1', text: 'Which quantum number defines the orientation of the orbital?', options: ['Principal (n)', 'Azimuthal (l)', 'Magnetic (m)', 'Spin (s)'], correctOptionIndex: 2 };
const Q_MATH_1 = { id: 'q3', subjectId: 'math', topicId: 'm_lim_1', text: 'Evaluate limit x->0 of (sin x)/x', options: ['0', '1', 'Infinity', 'Undefined'], correctOptionIndex: 1 };
const Q_LOGIC_1 = { id: 'q_log_1', subjectId: 'logic', topicId: 'general', text: 'If A is brother of B, B is sister of C, and C is father of D, how is D related to A?', options: ['Nephew/Niece', 'Brother', 'Uncle', 'Cousin'], correctOptionIndex: 0 };
const Q_ENG_1 = { id: 'q_eng_1', subjectId: 'eng', topicId: 'vocab', text: 'Choose the synonym of "Ephemeral":', options: ['Lasting', 'Short-lived', 'Beautiful', 'Heavy'], correctOptionIndex: 1 };
// New questions for variety
const Q_LOGIC_2 = { id: 'q_log_2', subjectId: 'logic', topicId: 'series', text: 'Find the next number: 2, 6, 12, 20, ?', options: ['28', '30', '32', '24'], correctOptionIndex: 1 }; // 30 (n^2+n)
const Q_ENG_2 = { id: 'q_eng_2', subjectId: 'eng', topicId: 'grammar', text: 'Identify the error: "He is senior than me."', options: ['He', 'is', 'senior', 'than'], correctOptionIndex: 3 }; // 'to' instead of 'than'

// NEW QUESTIONS FOR JEE TESTS
const Q_PHYS_2 = { id: 'q_phys_2', subjectId: 'phys', topicId: 'p_kin_2', text: 'A projectile is fired at 45 degrees. The ratio of range to maximum height is:', options: ['1', '2', '4', '8'], correctOptionIndex: 2 };
const Q_CHEM_2 = { id: 'q_chem_2', subjectId: 'chem', topicId: 'c_bas_1', text: 'What is the molarity of pure water?', options: ['18 M', '55.5 M', '1 M', '100 M'], correctOptionIndex: 1 };
const Q_MATH_2 = { id: 'q_math_2', subjectId: 'math', topicId: 'm_quad_1', text: 'If roots of x² - px + q = 0 differ by 1, then:', options: ['p² = 4q', 'p² = 4q + 1', 'p² = 4q - 1', 'q² = 4p'], correctOptionIndex: 1 };
const Q_PHYS_3 = { id: 'q_phys_3', subjectId: 'phys', topicId: 'p_unit_2', text: 'Which pair has the same dimensions?', options: ['Work and Torque', 'Force and Power', 'Momentum and Energy', 'Impulse and Force'], correctOptionIndex: 0 };
const Q_CHEM_3 = { id: 'q_chem_3', subjectId: 'chem', topicId: 'c_at_2', text: 'The maximum number of electrons in a subshell with l=2 is:', options: ['6', '10', '14', '2'], correctOptionIndex: 1 };

export const MOCK_TESTS: Test[] = [
  {
    id: 'test_demo_1',
    title: 'JEE Mains 2024 (Jan 27 Shift 1)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'MAINS',
    examType: 'JEE',
    questions: [Q_PHYS_1, Q_CHEM_1, Q_MATH_1, Q_PHYS_2, Q_CHEM_2]
  },
  {
    id: 'test_jee_main_2023',
    title: 'JEE Mains 2023 (Jan 24 Shift 2)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'MAINS',
    examType: 'JEE',
    questions: [Q_MATH_2, Q_PHYS_3, Q_CHEM_3, Q_PHYS_1, Q_MATH_1]
  },
  {
    id: 'test_jee_main_2022',
    title: 'JEE Mains 2022 (July 25 Shift 1)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'MAINS',
    examType: 'JEE',
    questions: [Q_CHEM_1, Q_CHEM_2, Q_PHYS_2, Q_MATH_1, Q_PHYS_3]
  },
  {
    id: 'test_demo_2',
    title: 'JEE Advanced 2023 (Paper 1)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'ADVANCED',
    examType: 'JEE',
    questions: [Q_PHYS_1, Q_MATH_1, Q_CHEM_1, Q_PHYS_1]
  },
  {
    id: 'test_jee_adv_2022',
    title: 'JEE Advanced 2022 (Paper 2)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'ADVANCED',
    examType: 'JEE',
    questions: [Q_PHYS_2, Q_MATH_2, Q_CHEM_3, Q_PHYS_3, Q_CHEM_2]
  },
  {
    id: 'test_jee_adv_2021',
    title: 'JEE Advanced 2021 (Paper 1)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'ADVANCED',
    examType: 'JEE',
    questions: [Q_MATH_1, Q_PHYS_2, Q_CHEM_1, Q_MATH_2]
  },
  {
    id: 'test_bitsat_1',
    title: 'BITSAT 2023 (Session 1 Memory Based)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'CUSTOM',
    examType: 'BITSAT',
    questions: [Q_PHYS_1, Q_CHEM_1, Q_MATH_1, Q_LOGIC_1, Q_ENG_1, Q_LOGIC_2, Q_ENG_2]
  },
  {
    id: 'test_viteee_1',
    title: 'VITEEE 2022 (Sample Paper)',
    durationMinutes: 150,
    category: 'PAST_PAPER',
    difficulty: 'CUSTOM',
    examType: 'VITEEE',
    questions: [Q_PHYS_1, Q_CHEM_1, Q_MATH_1, Q_ENG_1, Q_ENG_2]
  },
  {
    id: 'test_met_1',
    title: 'MET 2023 (Manipal Entrance)',
    durationMinutes: 120,
    category: 'PAST_PAPER',
    difficulty: 'CUSTOM',
    examType: 'MET',
    questions: [Q_PHYS_1, Q_MATH_1, Q_CHEM_1, Q_ENG_1, Q_LOGIC_1]
  },
  {
    id: 'test_srm_1',
    title: 'SRMJEEE 2023 (Phase 1)',
    durationMinutes: 150,
    category: 'PAST_PAPER',
    difficulty: 'CUSTOM',
    examType: 'SRMJEEE',
    questions: [Q_PHYS_1, Q_CHEM_1, Q_MATH_1]
  }
];
