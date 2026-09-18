export interface Project {
    id: string;
    title: string;
    subtitle: string;
    category: '3d' | 'fullstack' | 'systems';
    categoryLabel: string;
    description: string;
    longDescription: string;
    tags: string[];
    image: string;
    metrics: { label: string; value: string }[];
    architecture: string[];
    liveUrl: string;
    githubUrl: string;
    featured: boolean;
    year: string;
}

export interface SkillCategory {
    title: string;
    color: string;
    skills: {
        name: string;
        level: number;
        icon: string;
        highlight?: string;
    }[];
}

export interface ExperienceItem {
    id: string;
    role: string;
    company: string;
    period: string;
    location: string;
    description: string;
    achievements: string[];
    technologies: string[];
}

export interface EducationItem {
    degree: string;
    institution: string;
    year: string;
    badge: string;
    description: string;
}

export const PERSONAL_INFO = {
    name: 'Aditya Narayan Ray',
    handle: '@4rayaditya',
    role: 'Software Engineer Intern & Systems Developer',
    bio: 'Computer Science undergraduate (9.82 CGPA) at Manipal University Jaipur pursuing a Software Engineer, Intern position. Solid foundation in data structures, algorithms, and backend system design with a proven track record of shipping production code: merged pull requests to a WebRTC platform used by millions, a document-processing backend handling 50,000+ records at 91% precision, and a full-stack system exposing 30+ REST endpoints.',
    location: 'Jaipur, India',
    status: 'Open for Software Engineer Intern Roles',
    phone: '+91-7008211252',
    email: 'rayaditya731@gmail.com',
    github: 'https://github.com/4rayaditya',
    linkedin: 'https://linkedin.com/in/4rayaditya',
    twitter: 'https://twitter.com/4rayaditya',
    stats: [
        { label: 'CGPA', value: '9.82', change: 'Top 1%' },
        { label: 'Dean\'s List', value: '4 Sems', change: 'Academic' },
        { label: 'WebRTC Scale', value: 'Millions', change: 'Open Source' },
        { label: 'Pipeline Precision', value: '91%', change: '50K+ Records' },
    ],
    principles: [
        { title: 'Production Backend Architecture', desc: 'Designing resilient REST APIs, event-driven pipelines with Kafka, and high-performance databases.' },
        { title: 'Data Structures & Algorithms', desc: 'Applying algorithmic rigor and low-level performance optimization across C++, Python, and TypeScript.' },
        { title: 'Collaborative Open Source Execution', desc: 'Shipping peer-reviewed pull requests to globally distributed codebases with clean tests and documentation.' },
    ]
};

export const PROJECTS: Project[] = [
    {
        id: 'pinn-gamma-ray',
        title: 'Physics-Informed Neural Networks (PINNs) in Gamma-Ray Attenuation',
        subtitle: 'Summer Research Internship — NISER',
        category: 'systems',
        categoryLabel: 'Physics AI & Computational Research',
        description: 'Investigated the noise robustness of Physics-Informed Neural Networks (PINNs) under conditions of extreme data sparsity and heavy perturbation (N in [5,16]) using experimental Cs-137 transmission data across 5 materials.',
        longDescription: 'Summer Research Internship at the National Institute of Science Education and Research (NISER).\n\nOverview:\nThis project investigates the noise robustness of Physics-Informed Neural Networks (PINNs) under conditions of extreme data sparsity and heavy perturbation (N ∈ [5, 16]). Using experimental narrow-beam gamma-ray transmission data (Cs-137, 661.7 keV) for five materials—aluminium, copper, brass, carbon steel, and lead—the research benchmarks a custom-engineered "Rectified PINN" against classical weighted log-linear least squares (WNLLS) and Gaussian process regression.\n\nKey Contributions & Architecture:\n• Architectural Rectification: Identified a critical vanishing-gradient trap in conventional PINN formulations caused by the standard exponential positivity map (∂L_phys / ∂z ∝ μ).\n• Enhanced Network Stability: Engineered a robust solution replacing the exponential map with a bounded Softplus map, paired with Theil-Sen initialization and stationary pre-step checkpointing to decouple model evaluation from non-stationary physics loss weights.\n• Comprehensive Benchmarking: Designed and executed a 50-cell Monte Carlo suite comprising 1,500 network training trials (3,000 epochs each) across five log-normal noise tiers (up to σ = 56.23%) to rigorously test algorithm limits.\n• Broad-Beam Buildup Identification: Proved the PINN\'s structural superiority in regimes lacking a closed-form inverse by jointly recovering attenuation and buildup parameters (μ and β) with 0.15% and 0.52% error at zero noise, whereas misspecified classical WNLLS maintained an irreducible ≈ 60% bias.\n\nResults & Impact:\n• Eliminated all divergent modes in the neural network, completing 1,500 high-noise trials with zero non-physical estimates and no errors above 200%.\n• Demonstrated that classical WNLLS is prone to fatal statistical failure at maximum noise (reversing sign in ~10% of trials), but remains computationally superior (~0.04 ms vs ~10.3 s) and more accurate in zero-noise regimes.\n• Established a definitive deployment criterion: PINNs are strictly warranted for complex physical models where closed-form estimators do not exist (e.g., multi-dimensional transport or beam hardening), rather than as a universal noise-mitigation tool.\n• Open-sourced the entire benchmark suite, PyTorch implementations, and experimental datasets for community use.',
        tags: ['PyTorch', 'PINNs', 'Gaussian Process', 'Monte Carlo', 'Python', 'Physics AI'],
        image: '/images/projects/hyperverse.jpg',
        metrics: [
            { label: 'Trials', value: '1,500 Monte Carlo' },
            { label: 'Zero-Noise Error', value: '0.15% (μ)' },
            { label: 'Noise Tiers', value: 'Up to 56.2%' },
        ],
        architecture: ['Rectified PINN (Softplus Map)', 'Theil-Sen Robust Initialization', 'Stationary Pre-Step Checkpointing', '50-Cell Monte Carlo Benchmark'],
        liveUrl: 'https://github.com/4rayaditya/PINN-for-gamma-rays',
        githubUrl: 'https://github.com/4rayaditya/PINN-for-gamma-rays',
        featured: true,
        year: '2026',
    },
    {
        id: 'jitsi-oss',
        title: 'Jitsi Open Source Contributions',
        subtitle: 'Production WebRTC & Core Ecosystem',
        category: 'systems',
        categoryLabel: 'WebRTC & Systems',
        description: 'Over a four-month period, contributed and merged multiple pull requests across 4 core Jitsi repositories to enhance system reliability, security, and developer experience.',
        longDescription: 'Over a four-month period, contributed and merged multiple pull requests across four core Jitsi repositories (jitsi-meet, lib-jitsi-meet, jitsi-meet-electron-sdk, and handbook) to enhance system reliability, security, and developer experience:\n\n• WebRTC & Media Routing (lib-jitsi-meet): Resolved critical timeout leaks within ChatRoom, QualityController, and XmppConnection to prevent memory degradation during extended conferences; investigated and resolved VP8 simulcast degradation on low-resolution Chromium clients by optimizing encoding order, SDP munging, and dynamic layer configuration.\n\n• Desktop SDK Security & Stability (jitsi-meet-electron-sdk): Modernized and refactored the SDK to fully enforce Electron context isolation, implementing contextBridge and secure IPC handlers to harden application security; diagnosed and patched a critical race condition where rapid screen-share toggling triggered a null callback crash.\n\n• Application Enhancements & Type Safety (jitsi-meet): Corrected aspect ratio distortions in the image resize pipeline to ensure custom virtual background images render accurately without stretching; elevated codebase strictness by enabling strictPropertyInitialization across web and native TypeScript configurations.\n\n• Technical Documentation (handbook): Authored previously missing API documentation for receiver constraints and effect configuration, providing clear parameter guidelines and usage examples for downstream developers.',
        tags: ['TypeScript', 'WebRTC', 'Electron', 'VP8 Simulcast', 'WebSockets', 'JavaScript', 'Jitsi Meet'],
        image: '/images/projects/vortexgl.jpg',
        metrics: [
            { label: 'Repositories', value: '4 Core' },
            { label: 'Contributions', value: 'Multiple PRs Merged' },
            { label: 'Ecosystem Scale', value: 'Millions of Users' },
        ],
        architecture: ['WebRTC Media Routing', 'Electron Context Isolation', 'SDP Munging & VP8', 'TypeScript Strict Typing'],
        liveUrl: 'https://github.com/jitsi',
        githubUrl: 'https://github.com/jitsi',
        featured: true,
        year: '2025 - 2026',
    },
    {
        id: 'sentinel-ai',
        title: 'Sentinel AI',
        subtitle: 'NGO Rescue Coordination Platform',
        category: 'fullstack',
        categoryLabel: 'Full-Stack & Systems',
        description: 'Consolidates citizen reports, FIRs, images, and voice notes into a unified case workflow with JWT-based role access control across citizen, NGO admin, police, and volunteer roles.',
        longDescription: 'Engineered a full-stack platform (React, FastAPI, PostgreSQL) consolidating citizen rescue reports, FIRs, images, and voice notes into a unified case workflow with JWT-based role access control across citizen, NGO admin, police, and volunteer roles. Designed a modular backend exposing 30+ REST endpoints, integrating OCR, speech-to-text, and LLM-based summarization for AI-assisted case risk prioritization, a rule-based shelter recommendation engine, and a real-time case-tracking dashboard.',
        tags: ['React', 'FastAPI', 'PostgreSQL', 'Docker', 'JWT', 'OCR', 'LLM'],
        image: '/images/projects/nexus-ai.jpg',
        metrics: [
            { label: 'REST Endpoints', value: '30+' },
            { label: 'Role Types', value: '4 (JWT)' },
            { label: 'Integration', value: 'OCR + Speech' },
        ],
        architecture: ['FastAPI Backend', 'PostgreSQL Database', 'React Frontend', 'Docker Containers', 'JWT Security'],
        liveUrl: 'https://github.com/4rayaditya',
        githubUrl: 'https://github.com/4rayaditya',
        featured: true,
        year: '2026',
    },
    {
        id: 'ny-legal',
        title: 'Ny',
        subtitle: 'Legal Data Platform (RAG Pipeline)',
        category: 'systems',
        categoryLabel: 'AI & Data Systems',
        description: 'Automated document categorization and hybrid vector similarity retrieval pipeline parsing court transcripts across 50,000+ records at 91% precision.',
        longDescription: 'Developed an automated document categorization pipeline using Python and FastAPI to securely parse and map court transcripts, processing a dataset of 50,000+ records with 91% precision. Implemented a hybrid retrieval architecture combining vector similarity search and relational PostgreSQL queries (RAG pipeline), reducing system response times to under 200ms and improving data accuracy by 35%.',
        tags: ['Python', 'FastAPI', 'PostgreSQL', 'RAG', 'Vector Search'],
        image: '/images/projects/aerosphere.jpg',
        metrics: [
            { label: 'Dataset Size', value: '50,000+' },
            { label: 'Precision', value: '91%' },
            { label: 'Response Time', value: '<200ms' },
        ],
        architecture: ['Python & FastAPI', 'Vector Similarity Search', 'PostgreSQL Relational DB', 'RAG Pipeline'],
        liveUrl: 'https://github.com/4rayaditya',
        githubUrl: 'https://github.com/4rayaditya',
        featured: true,
        year: '2025',
    },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
    {
        title: 'Programming Languages',
        color: '#00f5d4',
        skills: [
            { name: 'C++', level: 92, icon: '⚡', highlight: 'DSA & Systems' },
            { name: 'Python', level: 95, icon: '🐍', highlight: 'FastAPI, ML, RAG' },
            { name: 'JavaScript', level: 92, icon: '🟨', highlight: 'ES6+ & Web' },
            { name: 'TypeScript', level: 94, icon: '📘', highlight: 'Type-Safe Architecture' },
            { name: 'C', level: 88, icon: '⚙️', highlight: 'Low-Level Systems' },
        ],
    },
    {
        title: 'Backend & Systems',
        color: '#9d4edd',
        skills: [
            { name: 'FastAPI', level: 95, icon: '🚀', highlight: 'Asynchronous REST APIs' },
            { name: 'Node.js', level: 90, icon: '🟢', highlight: 'Event-Driven Services' },
            { name: 'Kafka', level: 85, icon: '📨', highlight: 'Event Streaming' },
            { name: 'REST APIs', level: 96, icon: '🔌', highlight: '30+ Endpoints Designed' },
        ],
    },
    {
        title: 'Frontend Technologies',
        color: '#00b4d8',
        skills: [
            { name: 'React.js', level: 94, icon: '⚛️', highlight: 'Modern UI & Hooks' },
            { name: 'Tailwind CSS', level: 95, icon: '🎨', highlight: 'Responsive Design' },
            { name: 'WebSockets', level: 90, icon: '📡', highlight: 'Bi-Directional Streaming' },
            { name: 'WebRTC', level: 92, icon: '📹', highlight: 'Real-Time Media & Streaming' },
        ],
    },
    {
        title: 'Databases & Storage',
        color: '#ffaa00',
        skills: [
            { name: 'PostgreSQL', level: 94, icon: '🐘', highlight: 'Relational & Vector Queries' },
            { name: 'MySQL', level: 88, icon: '🐬', highlight: 'Schema & Indexing' },
            { name: 'MongoDB', level: 86, icon: '🍃', highlight: 'Document Stores' },
            { name: 'Redis', level: 89, icon: '⚡', highlight: 'In-Memory Caching & Pub/Sub' },
        ],
    },
    {
        title: 'Tools & Practices',
        color: '#ff007f',
        skills: [
            { name: 'Git & GitHub', level: 96, icon: '🐙', highlight: 'OSS & Code Reviews' },
            { name: 'Docker', level: 90, icon: '🐳', highlight: 'Containerization' },
            { name: 'CI/CD', level: 88, icon: '🔄', highlight: 'Automated Pipelines' },
            { name: 'System Design', level: 91, icon: '📐', highlight: 'Scalable Architecture' },
        ],
    },
];

export const EXPERIENCES: ExperienceItem[] = [
    {
        id: 'niser-intern',
        role: 'Summer Research Intern',
        company: 'NISER (National Institute of Science Education and Research)',
        period: 'May 2026 - June 2026',
        location: 'Bhubaneswar, Odisha',
        description: 'Benchmarked computational physics & machine learning regression methodologies for photon mass attenuation coefficient estimation.',
        achievements: [
            'Benchmarked Weighted Nonlinear Least Squares (WNLLS), Gaussian Process regression, and Physics-Informed Neural Networks (PINNs) for estimating photon mass attenuation coefficients from Cs-137 gamma-ray transmission data; co-authoring a comparative methodology paper on the tradeoffs.',
            'Built and iteratively debugged PINN training pipelines across five materials (Al, Cu, Brass, Steel, Pb), achieving R² > 0.99 on Aluminum.',
        ],
        technologies: ['Python', 'PINNs', 'Gaussian Process', 'WNLLS', 'Scientific Computing', 'Physics AI'],
    },
    {
        id: 'jitsi-oss',
        role: 'Open Source Contributor',
        company: 'Jitsi (Open Source)',
        period: 'October 2025 - February 2026',
        location: 'Remote',
        description: 'Contributed and merged multiple pull requests across 4 core Jitsi repositories, improving WebRTC media routing, Electron SDK security, and TypeScript architecture.',
        achievements: [
            'Contributed and merged multiple pull requests across 4 core repositories (jitsi-meet, lib-jitsi-meet, jitsi-meet-electron-sdk, handbook) in a production WebRTC platform used by millions globally.',
            'Resolved critical timeout and memory leaks across ChatRoom and QualityController, investigated and resolved VP8 simulcast degradation on low-resolution Chromium clients, and enforced Electron context isolation with secure contextBridge IPC handlers.',
            'Corrected image aspect ratio distortions in virtual background rendering, elevated codebase type safety by enabling strictPropertyInitialization across TypeScript configurations, and authored missing API documentation in the handbook.',
        ],
        technologies: ['TypeScript', 'WebRTC', 'Electron', 'VP8 Simulcast', 'React', 'WebSockets', 'JavaScript'],
    },
];

export const EDUCATION_CERTS: EducationItem[] = [
    {
        degree: 'Bachelor of Technology in Computer Science and Engineering',
        institution: 'Manipal University Jaipur',
        year: 'Aug 2024 - May 2028',
        badge: 'CGPA: 9.82/10.0',
        description: 'Dean\'s List Recipient for 4 Semesters (9.67, 10, 9.72, 9.90). Coursework: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Design and Analysis of Algorithms.',
    },
    {
        degree: '1st Place Winner — Bug Monopoly Competition',
        institution: 'Evoque 2025',
        year: '2025',
        badge: '1st / 100+ Teams',
        description: 'Secured 1st Place out of 100+ competing engineering teams at the Bug Monopoly Competition.',
    },
    {
        degree: 'Finalist — Code For Good 2026',
        institution: 'JPMorganChase',
        year: '2026',
        badge: 'National Finalist',
        description: 'Selected as national finalist at JPMorganChase Code For Good 2026 hackathon.',
    },
    {
        degree: 'Machine Learning Specialization',
        institution: 'Andrew Ng / DeepLearning.AI',
        year: '2025',
        badge: 'Specialization Certificate',
        description: 'Supervised Learning, Neural Networks, Deep Learning, and Model Evaluation architectures.',
    },
    {
        degree: 'Microsoft Azure AI Fundamentals',
        institution: 'Microsoft',
        year: '2025',
        badge: 'Certified',
        description: 'Fundamental AI workloads, machine learning principles, and cloud computer vision/NLP services.',
    },
];
