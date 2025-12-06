
import { Subject, User, Test, Question, Quote, Flashcard, MemoryHack, BlogPost, ExamComparisonItem } from './types';

// --- COACHING & EXAM METADATA ---

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

// --- MASSIVE QUESTION BANK (For 20+ Questions per Exam) ---

// PHYSICS POOL
const PHYSICS_QUESTIONS: Question[] = [
    { id: 'p_1', subjectId: 'phys', topicId: 'p_kin_1', text: 'A particle moves along x-axis as x = 4(t-2) + a(t-2)^2. Which is true?', options: ['Initial velocity is 4', 'Acceleration is 2a', 'Particle is at origin at t=2', 'All of the above'], correctOptionIndex: 3 },
    { id: 'p_2', subjectId: 'phys', topicId: 'p_kin_2', text: 'Projectile A is fired at 30 deg, B at 60 deg with same speed. Ratio of max heights?', options: ['1:3', '1:2', '1:√3', '3:1'], correctOptionIndex: 0 },
    { id: 'p_3', subjectId: 'phys', topicId: 'p_unit_2', text: 'Dimensions of Planck\'s constant matches with:', options: ['Energy', 'Momentum', 'Angular Momentum', 'Power'], correctOptionIndex: 2 },
    { id: 'p_4', subjectId: 'phys', topicId: 'p_kin_3', text: 'River flows at 3 km/h. Swimmer speed 4 km/h. Time to cross 1km wide river straight?', options: ['15 min', '20 min', '12 min', '25 min'], correctOptionIndex: 0 },
    { id: 'p_5', subjectId: 'phys', topicId: 'p_unit_1', text: 'Which is a fundamental unit?', options: ['Newton', 'Watt', 'Candela', 'Joule'], correctOptionIndex: 2 },
    { id: 'p_6', subjectId: 'phys', topicId: 'p_kin_1', text: 'Velocity v = 3t^2 + 2t. Find displacement from t=0 to t=2.', options: ['12m', '14m', '10m', '8m'], correctOptionIndex: 0 },
    { id: 'p_7', subjectId: 'phys', topicId: 'p_kin_2', text: 'Range is maximum when angle of projection is:', options: ['30', '45', '60', '90'], correctOptionIndex: 1 },
    { id: 'p_8', subjectId: 'phys', topicId: 'p_unit_2', text: 'Percentage error in mass is 2% and speed is 3%. Error in KE?', options: ['5%', '8%', '1%', '1.5%'], correctOptionIndex: 1 },
    { id: 'p_9', subjectId: 'phys', topicId: 'p_kin_3', text: 'Rain falls vertically at 30 m/s. Wind blows North at 10 m/s. Angle of umbrella?', options: ['tan-1(3)', 'tan-1(1/3)', 'tan-1(10)', '0'], correctOptionIndex: 1 },
    { id: 'p_10', subjectId: 'phys', topicId: 'p_unit_1', text: 'Solid angle is measured in:', options: ['Radian', 'Steradian', 'Degree', 'Mole'], correctOptionIndex: 1 },
    { id: 'p_11', subjectId: 'phys', topicId: 'p_kin_1', text: 'A car accelerates from rest at constant rate alpha, then decelerates at beta. Max velocity?', options: ['sqrt(alpha*beta)', '(alpha*beta)/(alpha+beta) * t', 'alpha*t', 'beta*t'], correctOptionIndex: 1 },
    { id: 'p_12', subjectId: 'phys', topicId: 'p_kin_2', text: 'Equation of trajectory is y = x - x^2/100. Range is?', options: ['10m', '100m', '50m', '200m'], correctOptionIndex: 1 },
    { id: 'p_13', subjectId: 'phys', topicId: 'p_unit_2', text: 'Light year is a unit of:', options: ['Time', 'Distance', 'Intensity', 'Speed'], correctOptionIndex: 1 },
    { id: 'p_14', subjectId: 'phys', topicId: 'p_kin_3', text: 'Two trains move towards each other at 50 km/h and 60 km/h. Relative speed?', options: ['10 km/h', '110 km/h', '55 km/h', '3000 km/h'], correctOptionIndex: 1 },
    { id: 'p_15', subjectId: 'phys', topicId: 'p_unit_1', text: 'SI unit of magnetic flux is:', options: ['Tesla', 'Weber', 'Gauss', 'Henry'], correctOptionIndex: 1 },
    { id: 'p_16', subjectId: 'phys', topicId: 'p_kin_1', text: 'Area under v-t graph represents:', options: ['Acceleration', 'Velocity', 'Displacement', 'Force'], correctOptionIndex: 2 },
    { id: 'p_17', subjectId: 'phys', topicId: 'p_kin_2', text: 'At top of trajectory, velocity and acceleration are:', options: ['Parallel', 'Antiparallel', 'Perpendicular', 'Zero'], correctOptionIndex: 2 },
    { id: 'p_18', subjectId: 'phys', topicId: 'p_unit_2', text: 'Which is dimensionless?', options: ['Stress', 'Strain', 'Modulus', 'Force'], correctOptionIndex: 1 },
    { id: 'p_19', subjectId: 'phys', topicId: 'p_kin_3', text: 'A boat crosses a river in shortest path. Velocity must be directed:', options: ['Upstream', 'Downstream', 'Perpendicular', 'Anywhere'], correctOptionIndex: 0 },
    { id: 'p_20', subjectId: 'phys', topicId: 'p_unit_1', text: 'Parsce is unit of:', options: ['Time', 'Distance', 'Mass', 'Angle'], correctOptionIndex: 1 },
    { id: 'p_21', subjectId: 'phys', topicId: 'p_kin_1', text: 'Displacement x = t^3 - 6t^2. Velocity is zero at:', options: ['t=2', 't=4', 't=6', 't=0, 4'], correctOptionIndex: 3 },
    { id: 'p_22', subjectId: 'phys', topicId: 'p_kin_2', text: 'Time of flight depends on:', options: ['Vertical component only', 'Horizontal component only', 'Both', 'None'], correctOptionIndex: 0 },
    { id: 'p_23', subjectId: 'phys', topicId: 'p_unit_2', text: 'Vernier constant is usually:', options: ['0.1mm', '0.01mm', '0.001mm', '1mm'], correctOptionIndex: 0 },
    { id: 'p_24', subjectId: 'phys', topicId: 'p_kin_3', text: 'Relative velocity of satellite A w.r.t B moving in same orbit?', options: ['Large', 'Zero', 'Variable', 'Small constant'], correctOptionIndex: 3 },
    { id: 'p_25', subjectId: 'phys', topicId: 'p_unit_1', text: 'Torque has same dimensions as:', options: ['Force', 'Work', 'Power', 'Momentum'], correctOptionIndex: 1 },
    { id: 'p_26', subjectId: 'phys', topicId: 'p_kin_1', text: 'A ball dropped from height h reaches ground in t. From 2h?', options: ['2t', '1.414t', '4t', '0.5t'], correctOptionIndex: 1 },
    { id: 'p_27', subjectId: 'phys', topicId: 'p_kin_2', text: 'To hit a target at range R, angle of elevation?', options: ['15', '45', '75', 'Any of these'], correctOptionIndex: 3 }, // 1/2 sin^-1(Rg/u^2)
    { id: 'p_28', subjectId: 'phys', topicId: 'p_unit_2', text: 'Dimensional formula of Viscosity?', options: ['ML-1T-1', 'MLT-2', 'ML2T-2', 'M0L0T0'], correctOptionIndex: 0 },
    { id: 'p_29', subjectId: 'phys', topicId: 'p_kin_3', text: 'Man walks on moving escalator. Time taken?', options: ['t1+t2', 't1t2/(t1+t2)', 'sqrt(t1t2)', '(t1+t2)/2'], correctOptionIndex: 1 },
    { id: 'p_30', subjectId: 'phys', topicId: 'p_unit_1', text: 'Unit of Permittivity (epsilon)?', options: ['F/m', 'H/m', 'N/C', 'V/m'], correctOptionIndex: 0 }
];

// CHEMISTRY POOL
const CHEMISTRY_QUESTIONS: Question[] = [
    { id: 'c_1', subjectId: 'chem', topicId: 'c_bas_1', text: 'Weight of one molecule of C60H122 is?', options: ['1.4 x 10^-21 g', '1000 g', '60 g', '1.2 x 10^-20 g'], correctOptionIndex: 0 },
    { id: 'c_2', subjectId: 'chem', topicId: 'c_at_1', text: 'Ratio of radii of 2nd and 3rd Bohr orbit is:', options: ['2:3', '4:9', '9:4', '8:27'], correctOptionIndex: 1 },
    { id: 'c_3', subjectId: 'chem', topicId: 'c_at_2', text: 'Number of spherical nodes in 3p orbital?', options: ['0', '1', '2', '3'], correctOptionIndex: 1 },
    { id: 'c_4', subjectId: 'chem', topicId: 'c_bas_2', text: 'Limiting reagent in 2A + 3B -> C if we have 5 mol A and 6 mol B?', options: ['A', 'B', 'C', 'None'], correctOptionIndex: 1 },
    { id: 'c_5', subjectId: 'chem', topicId: 'c_at_1', text: 'Energy of electron in H-atom is proportional to:', options: ['n', 'n^2', '1/n', '1/n^2'], correctOptionIndex: 3 },
    { id: 'c_6', subjectId: 'chem', topicId: 'c_bas_1', text: 'Molarity of pure water is:', options: ['55.5 M', '18 M', '1 M', '100 M'], correctOptionIndex: 0 },
    { id: 'c_7', subjectId: 'chem', topicId: 'c_at_2', text: 'Which set of quantum numbers is not possible?', options: ['3, 2, -2, +1/2', '2, 2, 1, +1/2', '4, 0, 0, -1/2', '5, 3, 0, +1/2'], correctOptionIndex: 1 },
    { id: 'c_8', subjectId: 'chem', topicId: 'c_bas_2', text: 'Volume of CO2 at STP from 10g CaCO3 heating?', options: ['22.4 L', '11.2 L', '2.24 L', '1.12 L'], correctOptionIndex: 2 },
    { id: 'c_9', subjectId: 'chem', topicId: 'c_at_1', text: 'Wavelength of first line of Lyman series?', options: ['1216 A', '912 A', '6563 A', '4861 A'], correctOptionIndex: 0 },
    { id: 'c_10', subjectId: 'chem', topicId: 'c_bas_1', text: 'Number of atoms in 0.1 mol of triatomic gas?', options: ['6.02x10^22', '1.8x10^23', '3.6x10^23', '10^23'], correctOptionIndex: 1 },
    { id: 'c_11', subjectId: 'chem', topicId: 'c_at_2', text: 'Orbital angular momentum of p-electron?', options: ['h/2pi', 'sqrt(2)h/2pi', 'sqrt(6)h/2pi', '0'], correctOptionIndex: 1 },
    { id: 'c_12', subjectId: 'chem', topicId: 'c_bas_2', text: 'Normality of 0.1 M H2SO4 is:', options: ['0.1 N', '0.2 N', '0.05 N', '1 N'], correctOptionIndex: 1 },
    { id: 'c_13', subjectId: 'chem', topicId: 'c_at_1', text: 'Which transition gives visible light?', options: ['Lyman', 'Balmer', 'Paschen', 'Pfund'], correctOptionIndex: 1 },
    { id: 'c_14', subjectId: 'chem', topicId: 'c_bas_1', text: 'Which has max number of atoms?', options: ['1g Au', '1g Na', '1g Li', '1g Cl2'], correctOptionIndex: 2 },
    { id: 'c_15', subjectId: 'chem', topicId: 'c_at_2', text: 'Total nodes in 3d orbital?', options: ['0', '1', '2', '3'], correctOptionIndex: 2 },
    { id: 'c_16', subjectId: 'chem', topicId: 'c_bas_2', text: 'Which concentration unit is temp independent?', options: ['Molarity', 'Normality', 'Molality', 'Formality'], correctOptionIndex: 2 },
    { id: 'c_17', subjectId: 'chem', topicId: 'c_at_1', text: 'Radius of H-atom first orbit is 0.53A. Radius of Li2+?', options: ['0.17 A', '0.53 A', '1.59 A', '0.26 A'], correctOptionIndex: 0 },
    { id: 'c_18', subjectId: 'chem', topicId: 'c_bas_1', text: 'Avogadro number value?', options: ['6.023x10^23', '6.023x10^22', '1.6x10^-19', '9.1x10^-31'], correctOptionIndex: 0 },
    { id: 'c_19', subjectId: 'chem', topicId: 'c_at_2', text: 'Max electrons in orbital with n=4, l=1?', options: ['2', '6', '14', '10'], correctOptionIndex: 1 },
    { id: 'c_20', subjectId: 'chem', topicId: 'c_bas_2', text: 'Oxidation state of Cr in K2Cr2O7?', options: ['+3', '+6', '+7', '+5'], correctOptionIndex: 1 },
    { id: 'c_21', subjectId: 'chem', topicId: 'c_at_1', text: 'Correct order of energy?', options: ['3s < 3p < 3d', '3s > 3p > 3d', '3s = 3p = 3d', '3d < 3p < 3s'], correctOptionIndex: 0 },
    { id: 'c_22', subjectId: 'chem', topicId: 'c_bas_1', text: 'Weight of 11.2L O2 at STP?', options: ['32g', '16g', '8g', '64g'], correctOptionIndex: 1 },
    { id: 'c_23', subjectId: 'chem', topicId: 'c_at_2', text: 'Shape of d-orbital?', options: ['Spherical', 'Dumbbell', 'Double Dumbbell', 'Complex'], correctOptionIndex: 2 },
    { id: 'c_24', subjectId: 'chem', topicId: 'c_bas_2', text: 'Eq weight of KMnO4 in acidic medium?', options: ['M/1', 'M/3', 'M/5', 'M/7'], correctOptionIndex: 2 },
    { id: 'c_25', subjectId: 'chem', topicId: 'c_at_1', text: 'Ionization energy of H is 13.6 eV. For He+?', options: ['13.6 eV', '27.2 eV', '54.4 eV', '122.4 eV'], correctOptionIndex: 2 },
    { id: 'c_26', subjectId: 'chem', topicId: 'c_bas_1', text: 'Law of Multiple Proportions illustrated by:', options: ['NaCl, NaBr', 'H2O, D2O', 'CO, CO2', 'MgO, Mg(OH)2'], correctOptionIndex: 2 },
    { id: 'c_27', subjectId: 'chem', topicId: 'c_at_2', text: 'Electronic config of Cr (24)?', options: ['3d4 4s2', '3d5 4s1', '3d6 4s0', '3d3 4s2 4p1'], correctOptionIndex: 1 },
    { id: 'c_28', subjectId: 'chem', topicId: 'c_bas_2', text: 'Mole fraction of solute in 1 molal aqueous solution?', options: ['0.018', '0.001', '0.1', '0.02'], correctOptionIndex: 0 },
    { id: 'c_29', subjectId: 'chem', topicId: 'c_at_1', text: 'De Broglie wavelength is min for:', options: ['Electron', 'Proton', 'Alpha particle', 'SO2 molecule'], correctOptionIndex: 3 },
    { id: 'c_30', subjectId: 'chem', topicId: 'c_bas_1', text: 'Number of moles in 4.4g CO2?', options: ['0.1', '0.2', '0.5', '1'], correctOptionIndex: 0 }
];

// MATHS POOL
const MATHS_QUESTIONS: Question[] = [
    { id: 'm_1', subjectId: 'math', topicId: 'm_set_1', text: 'Power set of set A={1,2} has how many elements?', options: ['2', '4', '3', '1'], correctOptionIndex: 1 },
    { id: 'm_2', subjectId: 'math', topicId: 'm_cpx_1', text: 'Value of i^257 is?', options: ['i', '-i', '1', '-1'], correctOptionIndex: 0 },
    { id: 'm_3', subjectId: 'math', topicId: 'm_set_2', text: 'A U A\' is equal to:', options: ['A', 'Universal Set', 'Null Set', 'A\''], correctOptionIndex: 1 },
    { id: 'm_4', subjectId: 'math', topicId: 'm_quad_1', text: 'If roots are reciprocal, then in ax^2+bx+c=0:', options: ['a=c', 'a=b', 'b=c', 'a=0'], correctOptionIndex: 0 },
    { id: 'm_5', subjectId: 'math', topicId: 'm_rel_1', text: 'Relation R={(1,1),(2,2),(1,2),(2,1)} on {1,2,3} is:', options: ['Reflexive', 'Symmetric', 'Transitive', 'Equivalence'], correctOptionIndex: 1 },
    { id: 'm_6', subjectId: 'math', topicId: 'm_cpx_2', text: 'Arg(z) + Arg(conjugate z) is:', options: ['0', 'pi', '2pi', 'pi/2'], correctOptionIndex: 0 },
    { id: 'm_7', subjectId: 'math', topicId: 'm_fun_1', text: 'Domain of f(x) = sqrt(x-1) is:', options: ['(1, inf)', '[1, inf)', '(-inf, 1]', 'R'], correctOptionIndex: 1 },
    { id: 'm_8', subjectId: 'math', topicId: 'm_quad_1', text: 'Sum of roots of x^2 - 5x + 6 = 0', options: ['5', '-5', '6', '-6'], correctOptionIndex: 0 },
    { id: 'm_9', subjectId: 'math', topicId: 'm_set_1', text: 'Number of subsets of a set with n elements:', options: ['n', 'n^2', '2^n', 'n!'], correctOptionIndex: 2 },
    { id: 'm_10', subjectId: 'math', topicId: 'm_cpx_1', text: 'Modulus of 3 + 4i:', options: ['5', '7', '12', '25'], correctOptionIndex: 0 },
    { id: 'm_11', subjectId: 'math', topicId: 'm_rel_1', text: 'Identity relation is always:', options: ['Reflexive', 'Symmetric', 'Transitive', 'All of these'], correctOptionIndex: 3 },
    { id: 'm_12', subjectId: 'math', topicId: 'm_quad_1', text: 'Condition for real equal roots:', options: ['D>0', 'D<0', 'D=0', 'D>=0'], correctOptionIndex: 2 },
    { id: 'm_13', subjectId: 'math', topicId: 'm_fun_1', text: 'f(x)=x^2 is:', options: ['One-one', 'Many-one', 'Bijective', 'None'], correctOptionIndex: 1 },
    { id: 'm_14', subjectId: 'math', topicId: 'm_cpx_2', text: 'Multiplicative inverse of 1-i:', options: ['1+i', '(1+i)/2', '(1-i)/2', 'i'], correctOptionIndex: 1 },
    { id: 'm_15', subjectId: 'math', topicId: 'm_set_2', text: 'A - B is same as:', options: ['A n B\'', 'A n B', 'A u B', 'B - A'], correctOptionIndex: 0 },
    { id: 'm_16', subjectId: 'math', topicId: 'm_quad_1', text: 'Minimum value of x^2 + 2x + 5:', options: ['4', '1', '5', '0'], correctOptionIndex: 0 },
    { id: 'm_17', subjectId: 'math', topicId: 'm_rel_1', text: 'Intersection of two equivalence relations is:', options: ['Equivalence', 'Reflexive only', 'Symmetric only', 'None'], correctOptionIndex: 0 },
    { id: 'm_18', subjectId: 'math', topicId: 'm_cpx_1', text: 'Value of omega^99 + omega^100 + omega^101:', options: ['1', '0', 'omega', 'omega^2'], correctOptionIndex: 1 },
    { id: 'm_19', subjectId: 'math', topicId: 'm_fun_1', text: 'Range of sin(x):', options: ['(-1,1)', '[-1,1]', 'R', '[0,1]'], correctOptionIndex: 1 },
    { id: 'm_20', subjectId: 'math', topicId: 'm_quad_1', text: 'If alpha, beta are roots, equation with roots 1/alpha, 1/beta?', options: ['cx^2+bx+a=0', 'ax^2-bx+c=0', 'bx^2+ax+c=0', 'cx^2-bx+a=0'], correctOptionIndex: 0 },
    { id: 'm_21', subjectId: 'math', topicId: 'm_set_1', text: 'Null set is a subset of:', options: ['Every set', 'No set', 'Only finite sets', 'Only infinite sets'], correctOptionIndex: 0 },
    { id: 'm_22', subjectId: 'math', topicId: 'm_cpx_2', text: 'Rotation of vector z by 90 deg is:', options: ['iz', '-iz', 'z', 'z^2'], correctOptionIndex: 0 },
    { id: 'm_23', subjectId: 'math', topicId: 'm_rel_1', text: 'Total relations from set A(m elements) to B(n elements):', options: ['2^(m+n)', '2^(mn)', 'mn', 'm^n'], correctOptionIndex: 1 },
    { id: 'm_24', subjectId: 'math', topicId: 'm_quad_1', text: 'If x=sqrt(6+sqrt(6+...)) then x=?', options: ['2', '3', '6', '1'], correctOptionIndex: 1 },
    { id: 'm_25', subjectId: 'math', topicId: 'm_fun_1', text: 'Inverse of f(x) = x+1:', options: ['x-1', '1/x+1', '1-x', 'x'], correctOptionIndex: 0 },
    { id: 'm_26', subjectId: 'math', topicId: 'm_set_2', text: 'If A={1,2}, B={2,3}, A x B has:', options: ['2 elements', '4 elements', '3 elements', '1 element'], correctOptionIndex: 1 },
    { id: 'm_27', subjectId: 'math', topicId: 'm_cpx_1', text: 'Amplitude of -1-i:', options: ['-3pi/4', '3pi/4', '-pi/4', 'pi/4'], correctOptionIndex: 0 },
    { id: 'm_28', subjectId: 'math', topicId: 'm_quad_1', text: 'Product of roots of 2x^2 + 5x + 2 = 0:', options: ['2.5', '1', '5', '2'], correctOptionIndex: 1 },
    { id: 'm_29', subjectId: 'math', topicId: 'm_rel_1', text: 'Relation < on real numbers is:', options: ['Transitive', 'Reflexive', 'Symmetric', 'Equivalence'], correctOptionIndex: 0 },
    { id: 'm_30', subjectId: 'math', topicId: 'm_fun_1', text: 'Composition fog(x) where f=x^2, g=x+1:', options: ['x^2+1', '(x+1)^2', 'x^2+x', 'x+1'], correctOptionIndex: 1 }
];

// LOGIC & ENGLISH POOL (For BITSAT/VITEEE)
const LOGIC_ENGLISH_QUESTIONS: Question[] = [
    { id: 'l_1', subjectId: 'logic', topicId: 'series', text: 'Find next: 2, 5, 10, 17, ?', options: ['24', '26', '25', '27'], correctOptionIndex: 1 }, // n^2 + 1
    { id: 'l_2', subjectId: 'logic', topicId: 'analogy', text: 'Doctor : Hospital :: Teacher : ?', options: ['School', 'Class', 'Student', 'Book'], correctOptionIndex: 0 },
    { id: 'l_3', subjectId: 'logic', topicId: 'coding', text: 'If CAT = 24, DOG = ?', options: ['26', '25', '24', '27'], correctOptionIndex: 0 },
    { id: 'l_4', subjectId: 'logic', topicId: 'direction', text: 'A walks 5km North, turns Right. Direction?', options: ['East', 'West', 'South', 'North'], correctOptionIndex: 0 },
    { id: 'l_5', subjectId: 'logic', topicId: 'blood', text: 'A is B\'s brother. C is A\'s mother. Relation of C to B?', options: ['Mother', 'Aunt', 'Sister', 'Niece'], correctOptionIndex: 0 },
    { id: 'e_1', subjectId: 'eng', topicId: 'vocab', text: 'Synonym of "Candid":', options: ['Frank', 'Secretive', 'Cruel', 'Shy'], correctOptionIndex: 0 },
    { id: 'e_2', subjectId: 'eng', topicId: 'grammar', text: 'He ___ to the market yesterday.', options: ['go', 'went', 'gone', 'going'], correctOptionIndex: 1 },
    { id: 'e_3', subjectId: 'eng', topicId: 'vocab', text: 'Antonym of "Brave":', options: ['Cowardly', 'Strong', 'Bold', 'Heroic'], correctOptionIndex: 0 },
    { id: 'e_4', subjectId: 'eng', topicId: 'grammar', text: 'Neither he nor I ___ going.', options: ['am', 'is', 'are', 'were'], correctOptionIndex: 0 },
    { id: 'e_5', subjectId: 'eng', topicId: 'vocab', text: 'One who knows everything:', options: ['Omniscient', 'Omnipotent', 'Omnipresent', 'Scholar'], correctOptionIndex: 0 }
];

// --- MOCK TESTS (Populated with 25+ Questions) ---

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
    title: 'JEE Mains 2024 (April 6 Shift 2)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'MAINS',
    examType: 'JEE',
    questions: [
        ...PHYSICS_QUESTIONS.slice(15, 25),
        ...CHEMISTRY_QUESTIONS.slice(15, 25),
        ...MATHS_QUESTIONS.slice(15, 25)
    ]
  },
  {
    id: 'test_jee_main_2023',
    title: 'JEE Mains 2023 (Jan 24 Shift 2)',
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
    id: 'test_jee_adv_2023',
    title: 'JEE Advanced 2023 (Paper 1)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'ADVANCED',
    examType: 'JEE',
    questions: [
        ...PHYSICS_QUESTIONS.slice(20, 28),
        ...CHEMISTRY_QUESTIONS.slice(20, 28),
        ...MATHS_QUESTIONS.slice(20, 28)
    ]
  },
  {
    id: 'test_jee_adv_2022',
    title: 'JEE Advanced 2022 (Paper 2)',
    durationMinutes: 180,
    category: 'PAST_PAPER',
    difficulty: 'ADVANCED',
    examType: 'JEE',
    questions: [
        ...PHYSICS_QUESTIONS.slice(5, 13),
        ...CHEMISTRY_QUESTIONS.slice(5, 13),
        ...MATHS_QUESTIONS.slice(5, 13)
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
        ...MATHS_QUESTIONS.slice(0, 8),
        ...LOGIC_ENGLISH_QUESTIONS.slice(0, 6) 
    ]
  },
  {
    id: 'test_viteee_2022',
    title: 'VITEEE 2022 (Sample Paper)',
    durationMinutes: 150,
    category: 'PAST_PAPER',
    difficulty: 'CUSTOM',
    examType: 'VITEEE',
    questions: [
        ...PHYSICS_QUESTIONS.slice(5, 12),
        ...CHEMISTRY_QUESTIONS.slice(5, 12),
        ...MATHS_QUESTIONS.slice(5, 12),
        ...LOGIC_ENGLISH_QUESTIONS.slice(5, 10)
    ]
  },
  {
    id: 'test_met_2023',
    title: 'MET 2023 (Manipal Entrance)',
    durationMinutes: 120,
    category: 'PAST_PAPER',
    difficulty: 'CUSTOM',
    examType: 'MET',
    questions: [
        ...PHYSICS_QUESTIONS.slice(15, 22),
        ...CHEMISTRY_QUESTIONS.slice(15, 22),
        ...MATHS_QUESTIONS.slice(15, 22),
        ...LOGIC_ENGLISH_QUESTIONS.slice(0, 4)
    ]
  }
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
            },
            {
                id: 'm_mat_det',
                name: 'MATRICES AND DETERMINANTS',
                topics: [
                    { id: 'm_mat_1', name: 'Matrices: Types and Operations' },
                    { id: 'm_det_1', name: 'Determinants: Properties and Area' },
                    { id: 'm_mat_2', name: 'Adjoint and Inverse of Matrix' }
                ]
            },
            {
                id: 'm_calc',
                name: 'CALCULUS (LIMITS & CONTINUITY)',
                topics: [
                    { id: 'm_lim_1', name: 'Limits and Continuity' },
                    { id: 'm_diff_1', name: 'Differentiation Methods' },
                    { id: 'm_app_diff', name: 'Applications of Derivatives (AOD)' }
                ]
            },
            {
                id: 'm_int',
                name: 'INTEGRAL CALCULUS',
                topics: [
                    { id: 'm_int_1', name: 'Indefinite Integration' },
                    { id: 'm_int_2', name: 'Definite Integration & Properties' },
                    { id: 'm_area', name: 'Area Under Curves' }
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
            },
            {
                id: 'p_laws',
                name: 'UNIT 3: Laws of Motion',
                topics: [
                    { id: 'p_nlm_1', name: 'Newton\'s Laws & Impulse' },
                    { id: 'p_fric', name: 'Friction and Dynamics' },
                    { id: 'p_circ', name: 'Uniform Circular Motion' }
                ]
            },
            {
                id: 'p_wep',
                name: 'UNIT 4: Work, Energy and Power',
                topics: [
                    { id: 'p_wep_1', name: 'Work Energy Theorem' },
                    { id: 'p_coll', name: 'Collisions (Elastic/Inelastic)' }
                ]
            },
            {
                id: 'p_rot',
                name: 'UNIT 5: Rotational Motion',
                topics: [
                    { id: 'p_com', name: 'Centre of Mass' },
                    { id: 'p_moi', name: 'Moment of Inertia' },
                    { id: 'p_torque', name: 'Torque and Angular Momentum' }
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
            },
            {
                id: 'c_bond',
                name: 'UNIT 3: CHEMICAL BONDING',
                topics: [
                    { id: 'c_bond_1', name: 'Ionic & Covalent Bonding' },
                    { id: 'c_vsepr', name: 'VSEPR Theory & Shapes' },
                    { id: 'c_mot', name: 'Molecular Orbital Theory (MOT)' }
                ]
            },
            {
                id: 'c_thermo',
                name: 'UNIT 4: THERMODYNAMICS',
                topics: [
                    { id: 'c_th_1', name: 'First Law of Thermodynamics' },
                    { id: 'c_th_2', name: 'Entropy & Gibbs Free Energy' }
                ]
            }
        ]
    }
];

// --- VIDEO MAPPING (Concept Cinema) ---
// Massively Expanded Video Library for JEE Topics - Covering Full Syllabus with One Shot Style Links
export const TOPIC_VIDEO_MAP: Record<string, string> = {
    // PHYSICS - Units
    'p_unit_1': 'https://www.youtube.com/embed/hmJD8753wXY', // One Shot Units & Dimensions
    'p_unit_2': 'https://www.youtube.com/embed/hQ1eBqZt9YQ', // Errors Analysis
    // PHYSICS - Kinematics
    'p_kin_1': 'https://www.youtube.com/embed/ZM8ECpBuQYE', // Rectilinear Motion
    'p_kin_2': 'https://www.youtube.com/embed/M8xh1396x70', // Projectile Motion
    'p_kin_3': 'https://www.youtube.com/embed/PyT0Z3XgqE0', // Relative Motion
    // PHYSICS - NLM
    'p_nlm_1': 'https://www.youtube.com/embed/kKKM8Y-u7ds', // NLM Full Chapter
    'p_fric': 'https://www.youtube.com/embed/fo_pmp5rtzo', // Friction One Shot
    'p_circ': 'https://www.youtube.com/embed/bpFK2VCRHUs', // Circular Motion
    // PHYSICS - WEP
    'p_wep_1': 'https://www.youtube.com/embed/2WS1sG9fhOk', // Work Power Energy Full
    'p_coll': 'https://www.youtube.com/embed/Y-iM8tEa1k4', // Center of Mass & Collision
    // PHYSICS - Rotation
    'p_com': 'https://www.youtube.com/embed/XFpMJD883_g', // CoM Detailed
    'p_moi': 'https://www.youtube.com/embed/l8F6rX8Qx_k', // Moment of Inertia
    'p_torque': 'https://www.youtube.com/embed/X6yX9q6i8jA', // Rotational Dynamics One Shot

    // CHEMISTRY - Basics
    'c_bas_1': 'https://www.youtube.com/embed/wI5S7J5sXTo', // Mole Concept One Shot
    'c_bas_2': 'https://www.youtube.com/embed/7Cqy544jqnM', // Redox & Equivalent Concept
    // CHEMISTRY - Atom
    'c_at_1': 'https://www.youtube.com/embed/GhAn8xZQ-d8', // Atomic Structure Full
    'c_at_2': 'https://www.youtube.com/embed/Aoi4j8es4gQ', // Quantum Numbers
    // CHEMISTRY - Bonding
    'c_bond_1': 'https://www.youtube.com/embed/QXT4OVM4vXI', // Chemical Bonding One Shot
    'c_vsepr': 'https://www.youtube.com/embed/keHS-CASZfc', // VSEPR Theory
    'c_mot': 'https://www.youtube.com/embed/6T5iJ4a7xAA', // MOT Detailed
    // CHEMISTRY - Thermo
    'c_th_1': 'https://www.youtube.com/embed/JuWTx-q1WYA', // Thermodynamics Part 1
    'c_th_2': 'https://www.youtube.com/embed/8N1BxHgsoOw', // Thermochemistry

    // MATHS - Sets
    'm_set_1': 'https://www.youtube.com/embed/tyDKR4FG3Yw', // Sets Relations Functions
    'm_set_2': 'https://www.youtube.com/embed/5hV5bJ6s-6s', // Sets Operations
    'm_rel_1': 'https://www.youtube.com/embed/5C9p1U8c5_I', // Relations One Shot
    'm_fun_1': 'https://www.youtube.com/embed/2J5f2a1J4iE', // Functions Detailed
    // MATHS - Complex
    'm_cpx_1': 'https://www.youtube.com/embed/SP-YJe7Vldo', // Complex Numbers Full
    'm_cpx_2': 'https://www.youtube.com/embed/hX0z3q9f3_M', // Geometry of Complex Numbers
    'm_quad_1': 'https://www.youtube.com/embed/m94DzL3kYV4', // Quadratic Equations One Shot
    // MATHS - Matrices
    'm_mat_1': 'https://www.youtube.com/embed/u9R2f0E5yyg', // Matrices Full
    'm_det_1': 'https://www.youtube.com/embed/Ip3X9LOh2dk', // Determinants One Shot
    'm_mat_2': 'https://www.youtube.com/embed/5hP5b5_5-5s', // Inverse & Adjoint
    // MATHS - Calculus
    'm_lim_1': 'https://www.youtube.com/embed/riXcZT2ICjA', // Limits Continuity Differentiability
    'm_diff_1': 'https://www.youtube.com/embed/rAof9Ld5sOg', // MOD (Method of Differentiation)
    'm_app_diff': 'https://www.youtube.com/embed/OCw5r2r5s_M', // AOD One Shot
    'm_int_1': 'https://www.youtube.com/embed/yiy7y5t7_lM', // Indefinite Integration
    'm_int_2': 'https://www.youtube.com/embed/3j3_25-25_s', // Definite Integration
    'm_area': 'https://www.youtube.com/embed/7X8H6d34-J4', // Area Under Curve
};

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
