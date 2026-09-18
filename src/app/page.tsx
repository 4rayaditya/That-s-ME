import dynamic from 'next/dynamic';

const StoryController = dynamic(() => import('@/components/story/StoryController'), {
    ssr: false,
});

export default function Home() {
    return (
        <main className="relative w-full h-dvh overflow-hidden bg-space-950 text-zinc-100 selection:bg-brand-cyan selection:text-space-950">
            {/* Cyberpunk Developer Room -> 360° Spiral Transition -> Linux Desktop Workstation */}
            <StoryController />
        </main>
    );
}
