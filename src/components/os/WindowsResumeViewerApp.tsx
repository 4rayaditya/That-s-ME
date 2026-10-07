'use client';

import React, { useState } from 'react';
import { Printer, Download, ExternalLink, Eye, LayoutList, Phone, Mail, MapPin } from 'lucide-react';
import { Win7PdfIcon } from './Win7Icons';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

export default function WindowsResumeViewerApp() {
    const [viewMode, setViewMode] = useState<'html' | 'pdf'>('html');
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handleCopyEmail = () => {
        navigator.clipboard?.writeText('rayaditya731@gmail.com');
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden font-sans bg-[#e5e9ee] text-slate-800 select-text">
            {/* Windows 7 Aero Classic Toolbar */}
            <div className="h-10 px-3 sm:px-4 bg-gradient-to-b from-[#f8fafc] via-[#e9edf3] to-[#d8dfe8] border-b border-[#a6b4c3] flex items-center justify-between select-none text-xs gap-2 shadow-sm flex-shrink-0">
                <div className="flex items-center gap-2 text-slate-700 min-w-0">
                    <Win7PdfIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-semibold text-slate-900 truncate">Resume.pdf</span>
                    <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">— Windows Reader</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* View Switcher Toggle (Windows 7 Glass Style) */}
                    <div className="flex items-center rounded bg-[#d0d7e2] p-0.5 text-[11px] font-medium border border-[#a2b0c1]">
                        <button
                            onClick={() => setViewMode('html')}
                            className={`px-2.5 py-0.5 rounded flex items-center gap-1 transition-all cursor-pointer ${
                                viewMode === 'html'
                                    ? 'bg-gradient-to-b from-white to-[#dbe4ef] text-blue-950 font-bold shadow-sm border border-[#7e99b8]'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <LayoutList className="w-3 h-3" />
                            <span>Resume</span>
                        </button>
                        <button
                            onClick={() => setViewMode('pdf')}
                            className={`px-2.5 py-0.5 rounded flex items-center gap-1 transition-all cursor-pointer ${
                                viewMode === 'pdf'
                                    ? 'bg-gradient-to-b from-white to-[#dbe4ef] text-blue-950 font-bold shadow-sm border border-[#7e99b8]'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Eye className="w-3 h-3" />
                            <span>PDF File</span>
                        </button>
                    </div>

                    {/* Download PDF button (Windows 7 Button) */}
                    <a
                        href="/resume.pdf"
                        download="Aditya_Narayan_Ray_Resume.pdf"
                        className="flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-to-b from-[#ffffff] via-[#f1f4f8] to-[#d8e0ea] hover:from-[#f5f9ff] hover:to-[#c8d6e7] active:to-[#b6c7db] border border-[#8fa0b5] text-slate-800 font-medium text-xs transition-all cursor-pointer shadow-sm"
                        title="Download Original PDF"
                    >
                        <Download className="w-3 h-3 text-blue-700" />
                        <span className="hidden sm:inline">Download</span>
                    </a>

                    {/* Open in new tab */}
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 p-1.5 rounded bg-gradient-to-b from-white to-[#e4e9f0] hover:to-[#d0dae6] border border-[#9cb0c6] text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-sm"
                        title="Open in Browser Tab"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Print button */}
                    <button
                        onClick={handlePrint}
                        className="hidden md:flex items-center gap-1 p-1.5 rounded bg-gradient-to-b from-white to-[#e4e9f0] hover:to-[#d0dae6] border border-[#9cb0c6] text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-sm"
                        title="Print Document"
                    >
                        <Printer className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Document Canvas Area */}
            <div className="flex-1 overflow-hidden relative">
                {viewMode === 'pdf' ? (
                    <div className="w-full h-full bg-[#525659]">
                        <iframe
                            src="/resume.pdf#toolbar=0"
                            className="w-full h-full border-0"
                            title="Aditya Narayan Ray Resume PDF"
                        />
                    </div>
                ) : (
                    <div className="w-full h-full overflow-y-auto p-2 sm:p-5 md:p-8 custom-scrollbar bg-[#d5dbe4]">
                        {/* Pure White Clean Paper Sheet - Block layout with mx-auto so it covers 100% of height */}
                        <div className="mx-auto max-w-3xl bg-white text-slate-900 p-4 sm:p-8 md:p-12 space-y-4 shadow-[0_2px_15px_rgba(0,0,0,0.12)] font-sans min-h-full">
                            {/* Header Section */}
                            <div className="text-center pb-2 border-b border-slate-400">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-wide uppercase text-black font-serif">
                                    Aditya Narayan Ray
                                </h1>
                                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-700 mt-2">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-slate-500" />
                                        Jaipur, India
                                    </span>
                                    <span className="text-slate-400 hidden sm:inline">•</span>
                                    <a
                                        href="tel:+917008211252"
                                        className="flex items-center gap-1 hover:text-blue-700 transition-colors"
                                    >
                                        <Phone className="w-3 h-3 text-slate-500" />
                                        +91-7008211252
                                    </a>
                                    <span className="text-slate-400 hidden sm:inline">•</span>
                                    <button
                                        onClick={handleCopyEmail}
                                        className="flex items-center gap-1 hover:text-blue-700 transition-colors underline cursor-pointer"
                                        title="Click to copy email"
                                    >
                                        <Mail className="w-3 h-3 text-slate-500" />
                                        <span>rayaditya731@gmail.com</span>
                                        {copiedEmail && <span className="text-[10px] text-green-700 font-bold ml-0.5">(Copied!)</span>}
                                    </button>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-700 mt-1">
                                    <a
                                        href="https://linkedin.com/in/4rayaditya"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-700 hover:underline"
                                    >
                                        <LinkedinIcon className="w-3 h-3 text-blue-700" />
                                        linkedin.com/in/4rayaditya
                                    </a>
                                    <span className="text-slate-400 hidden sm:inline">•</span>
                                    <a
                                        href="https://github.com/4rayaditya"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-700 hover:underline"
                                    >
                                        <GithubIcon className="w-3 h-3 text-slate-800" />
                                        github.com/4rayaditya
                                    </a>
                                </div>
                            </div>

                            {/* Section 1: Technical Skills */}
                            <div className="space-y-1">
                                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-black font-serif border-b border-slate-400 pb-1">
                                    Technical Skills
                                </h2>
                                <div className="space-y-1 text-xs sm:text-[13px] leading-relaxed text-slate-800 pt-1">
                                    <div>
                                        <strong className="font-semibold text-black">Programming Languages:</strong>{' '}
                                        <span>C++, Python, JavaScript, TypeScript, C</span>
                                    </div>
                                    <div>
                                        <strong className="font-semibold text-black">Backend &amp; Systems:</strong>{' '}
                                        <span>FastAPI, Node.js, Supabase, REST APIs</span>
                                    </div>
                                    <div>
                                        <strong className="font-semibold text-black">Frontend Technologies:</strong>{' '}
                                        <span>React.js, Tailwind CSS, WebSockets, WebRTC, Three.js</span>
                                    </div>
                                    <div>
                                        <strong className="font-semibold text-black">Databases and Storage:</strong>{' '}
                                        <span>PostgreSQL, MySQL, MongoDB, Google Drive API</span>
                                    </div>
                                    <div>
                                        <strong className="font-semibold text-black">Tools &amp; Practices:</strong>{' '}
                                        <span>Git, GitHub, Docker</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Professional Experience */}
                            <div className="space-y-1">
                                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-black font-serif border-b border-slate-400 pb-1">
                                    Professional Experience
                                </h2>

                                {/* Experience 1: Jitsi */}
                                <div className="space-y-1 text-xs sm:text-[13px] pt-1">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-semibold text-black">
                                        <span className="text-sm">Open Source Contributor</span>
                                        <span className="font-normal text-slate-600 text-xs">Oct 2025 – Feb 2026</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between italic text-slate-700 text-xs">
                                        <span>Jitsi</span>
                                        <span className="not-italic text-slate-600 text-[11px]">Remote</span>
                                    </div>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-800 text-xs sm:text-[12px] pt-0.5 leading-relaxed">
                                        <li>
                                            Contributed <strong className="font-semibold text-black">7 merged pull requests</strong> across <strong className="font-semibold text-black">3 repositories</strong> (jitsi-meet, lib-jitsi-meet, jitsi-meet-electron-sdk) in a <strong className="font-semibold text-black">production WebRTC</strong> platform used by millions globally.
                                        </li>
                                        <li>
                                            Developed a <strong className="font-semibold text-black">PTZ (Pan-Tilt-Zoom)</strong> camera control feature via the WebRTC constraints API, integrating TypeScript UI components and resolving a critical uninitialized field bug in JitsiLocalTrack.
                                        </li>
                                    </ul>
                                </div>

                                {/* Experience 2: NISER */}
                                <div className="space-y-1 text-xs sm:text-[13px] pt-2">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-semibold text-black">
                                        <span className="text-sm">Summer Research Intern</span>
                                        <span className="font-normal text-slate-600 text-xs">May 2026 – Jun 2026</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between italic text-slate-700 text-xs">
                                        <span>NISER (National Institute of Science Education and Research)</span>
                                        <span className="not-italic text-slate-600 text-[11px]">Bhubaneswar, Odisha</span>
                                    </div>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-800 text-xs sm:text-[12px] pt-0.5 leading-relaxed">
                                        <li>
                                            Benchmarked <strong className="font-semibold text-black">Weighted Nonlinear Least Squares (WNLLS)</strong>, <strong className="font-semibold text-black">Gaussian Process regression</strong>, and <strong className="font-semibold text-black">Physics-Informed Neural Networks (PINNs)</strong> for estimating photon mass attenuation coefficients from <strong className="font-semibold text-black">Cs-137 gamma-ray transmission data</strong>; co-authoring a comparative methodology paper on the tradeoffs.
                                        </li>
                                        <li>
                                            Built and iteratively debugged PINN training pipelines across <strong className="font-semibold text-black">five materials</strong> (Al, Cu, Brass, Steel, Pb).
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Section 3: Education */}
                            <div className="space-y-1">
                                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-black font-serif border-b border-slate-400 pb-1">
                                    Education
                                </h2>
                                <div className="space-y-1 text-xs sm:text-[13px] pt-1">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-semibold text-black">
                                        <span className="text-sm">Manipal University Jaipur</span>
                                        <span className="font-normal text-slate-600 text-xs">Aug 2024 – May 2028</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between italic text-slate-700 text-xs">
                                        <span>Bachelor of Technology in Computer Science and Engineering</span>
                                        <span className="not-italic text-slate-600 text-[11px]">Jaipur, India</span>
                                    </div>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-800 text-xs sm:text-[12px] pt-1">
                                        <li>
                                            CGPA: <strong className="font-semibold text-black">9.82/10.0</strong> — <strong className="font-semibold text-black">Dean's List</strong> Recipient for <strong className="font-semibold text-black">4 Semesters</strong> — <span className="font-medium text-slate-900">9.67, 10, 9.72, 9.90</span>
                                        </li>
                                        <li>
                                            Relevant Coursework: <strong className="font-semibold text-black">Data Structures &amp; Algorithms</strong>, <strong className="font-semibold text-black">Object-Oriented Programming</strong>, <strong className="font-semibold text-black">Database Management Systems</strong>, Design and Analysis of Algorithms
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Section 4: Technical Projects */}
                            <div className="space-y-1">
                                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-black font-serif border-b border-slate-400 pb-1">
                                    Technical Projects
                                </h2>

                                {/* Project 1: Ecolympics */}
                                <div className="space-y-1 text-xs sm:text-[13px] pt-1">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-semibold text-black">
                                        <span className="text-sm">
                                            Ecolympics – Waste Warriors NGO Portal{' '}
                                            <span className="text-slate-600 font-normal italic text-xs">| React.js, Node.js, Supabase, Google Drive API</span>
                                        </span>
                                        <span className="font-normal text-slate-600 text-xs">Sep 2026</span>
                                    </div>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-800 text-xs sm:text-[12px] pt-0.5 leading-relaxed">
                                        <li>
                                            Developed an <strong className="font-semibold text-black">RBAC-enabled dashboard</strong> during the JPMorgan Chase Code for Good Hackathon, successfully migrating the NGO from manual Google Docs tracking to a centralized evaluation portal.
                                        </li>
                                        <li>
                                            Architected a zero-cost storage pipeline by utilizing India's free NGO Google Workspace tier, storing raw files in Google Drive while managing metadata and reference links efficiently in Supabase.
                                        </li>
                                    </ul>
                                </div>

                                {/* Project 2: Sentinel AI */}
                                <div className="space-y-1 text-xs sm:text-[13px] pt-2">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-semibold text-black">
                                        <span className="text-sm">
                                            Sentinel AI – NGO Rescue Coordination Platform{' '}
                                            <span className="text-slate-600 font-normal italic text-xs">| React, FastAPI, PostgreSQL, Docker</span>
                                        </span>
                                        <span className="font-normal text-slate-600 text-xs">Aug 2026</span>
                                    </div>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-800 text-xs sm:text-[12px] pt-0.5 leading-relaxed">
                                        <li>
                                            Built a full-stack platform consolidating citizen reports, FIRs, images, and voice notes into a unified case workflow, with <strong className="font-semibold text-black">JWT-based role access control</strong> across citizen, NGO admin, police, and volunteer roles.
                                        </li>
                                        <li>
                                            Designed a modular backend exposing <strong className="font-semibold text-black">30+ REST endpoints</strong>, integrating <strong className="font-semibold text-black">Tesseract OCR</strong>, <strong className="font-semibold text-black">OpenAI Whisper</strong> (speech-to-text), and <strong className="font-semibold text-black">Llama-3</strong> for AI-assisted case risk prioritization and a rule-based shelter engine.
                                        </li>
                                    </ul>
                                </div>

                                {/* Project 3: Do LLMs know when they don't know */}
                                <div className="space-y-1 text-xs sm:text-[13px] pt-2">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-semibold text-black">
                                        <span className="text-sm">
                                            Do LLMs know when they don’t know{' '}
                                            <span className="text-slate-600 font-normal italic text-xs">| Python, Llama, Qwen</span>
                                        </span>
                                        <span className="font-normal text-slate-600 text-xs">Oct 2026</span>
                                    </div>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-800 text-xs sm:text-[12px] pt-0.5 leading-relaxed">
                                        <li>
                                            Architected an experimental evaluation pipeline testing 160 benchmark questions across 4 conditions, processing 640 responses to quantify LLM epistemic overconfidence.
                                        </li>
                                        <li>
                                            Engineered a <strong className="font-semibold text-black">Logprob Probe Gate</strong> intervention that slashed hallucination rates by <strong className="font-semibold text-black">89%</strong> (from 57.5% down to 6.2%) and increased overall accuracy to 78.8%.
                                        </li>
                                        <li>
                                            Implemented explicit abstention prompting, achieving a statistically significant (McNemar’s test, p=0.002) hallucination reduction while maintaining a 0.0% false abstention rate on verifiable facts.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Section 5: Honors, Awards & Certifications */}
                            <div className="space-y-1">
                                <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-black font-serif border-b border-slate-400 pb-1">
                                    Honors, Awards &amp; Certifications
                                </h2>
                                <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed text-slate-800 pt-1">
                                    <div>
                                        <strong className="font-semibold text-black">Problem Solving:</strong>{' '}
                                        <span>LeetCode Rating: 1510</span>
                                    </div>
                                    <div>
                                        <strong className="font-semibold text-black">Competition Awards:</strong>{' '}
                                        <span>
                                            Secured <strong className="font-semibold text-black">1st Place</strong> out of 100+ competing engineering teams at a Bug Fixing Competition, <strong className="font-semibold text-black">Evoque 2025</strong>. Finalist at <strong className="font-semibold text-black">JPMorgan Chase Code for Good Hackathon</strong>.
                                        </span>
                                    </div>
                                    <div>
                                        <strong className="font-semibold text-black">Academic Honors:</strong>{' '}
                                        <span>
                                            Awarded <strong className="font-semibold text-black">Dean's List</strong> status for maintaining a <strong className="font-semibold text-black">top 1% academic ranking</strong> across 4 consecutive semesters
                                        </span>
                                    </div>
                                    <div>
                                        <strong className="font-semibold text-black">Certifications:</strong>{' '}
                                        <span>
                                            <strong className="font-semibold text-black">Machine Learning Specialization</strong> (Andrew Ng / DeepLearning.AI), <strong className="font-semibold text-black">Microsoft Azure AI Fundamentals</strong>
                                        </span>
                                    </div>
                                    <div>
                                        <strong className="font-semibold text-black">Leadership:</strong>{' '}
                                        <span>
                                            <strong className="font-semibold text-black">Web Development Head</strong>, ACM MUJ SIGAI – lead and mentor a team of 40+ students; Buddy Mentor for undergraduates
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
