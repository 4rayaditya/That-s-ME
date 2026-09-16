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
        { label: 'WebRTC Scale', value: 'Millions', change: 'GSoC' },
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
        image: '/images/projects/hyper-vis.jpg',
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
    {
        id: 'jitsi-ptz',
        title: 'Jitsi WebRTC PTZ Camera Control',
        subtitle: 'Production Open Source Contribution',
        category: 'systems',
        categoryLabel: 'WebRTC & Systems',
        description: 'Contributed merged pull requests across 3 repositories in a production WebRTC platform used by millions globally.',
        longDescription: 'Contributed merged pull requests across 3 repositories (jitsi-meet, lib-jitsi-meet, jitsi-meet-electron-sdk) in a production WebRTC platform used by millions globally. Developed a PTZ (Pan-Tilt-Zoom) camera control feature via the WebRTC constraints API, integrating TypeScript UI components and resolving a critical uninitialized field bug in JitsiLocalTrack; GSoC 2026 proposal scored 89/100 after mentor validation.',
        tags: ['TypeScript', 'WebRTC', 'React', 'Electron', 'Jitsi Meet'],
        image: '/images/projects/aether-kernel.jpg',
        metrics: [
            { label: 'Repositories', value: '3 Merged' },
            { label: 'Reach', value: 'Millions' },
            { label: 'Proposal Score', value: '89/100' },
        ],
        architecture: ['WebRTC Constraints API', 'lib-jitsi-meet Core', 'jitsi-meet Web UI', 'Electron SDK'],
        liveUrl: 'https://github.com/jitsi',
        githubUrl: 'https://github.com/4rayaditya',
        featured: true,
        year: '2025 - 2026',
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
            { name: 'WebRTC', level: 92, icon: '📹', highlight: 'Real-Time Media & PTZ' },
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
        id: 'jitsi-gsoc',
        role: 'Open Source Contributor',
        company: 'Jitsi - GSoC',
        period: 'October 2025 - February 2026',
        location: 'Remote',
        description: 'Contributed production WebRTC code and PTZ camera features to globally utilized video conferencing repositories.',
        achievements: [
            'Contributed merged pull requests across 3 repositories (jitsi-meet, lib-jitsi-meet, jitsi-meet-electron-sdk) in a production WebRTC platform used by millions globally.',
            'Developed a PTZ (Pan-Tilt-Zoom) camera control feature via the WebRTC constraints API, integrating TypeScript UI components and resolving a critical uninitialized field bug in JitsiLocalTrack; GSoC 2026 proposal scored 89/100 after mentor validation.',
        ],
        technologies: ['TypeScript', 'WebRTC', 'React', 'JitsiLocalTrack', 'Electron', 'Camera API'],
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
