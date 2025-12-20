# 🚀 3D Developer Portfolio

A production-ready, high-performance 3D portfolio built with Next.js, React Three Fiber, and modern web technologies. Optimized for Core Web Vitals and designed to showcase projects in an immersive 3D environment.

## ✨ Features

- **🎨 Interactive 3D Scenes**: Immersive hero section and project showcase using React Three Fiber
- **⚡ Performance Optimized**: Automatic performance detection with tier-based rendering
- **📱 Fully Responsive**: Graceful degradation to 2D on low-end devices
- **🎯 Dynamic Projects**: Easy-to-update JSON-based project management
- **🎬 Smooth Animations**: GSAP-powered transitions and scroll effects
- **🌐 SEO Ready**: Comprehensive metadata and Open Graph support
- **🎭 Lazy Loading**: Dynamic imports and Suspense boundaries for optimal loading
- **💾 State Management**: Zustand for lightweight global state

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **3D**: React Three Fiber, @react-three/drei, Three.js
- **Animation**: GSAP, Framer Motion
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Language**: TypeScript
- **Performance**: Dynamic imports, Suspense, Web Workers ready

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── 3d/                # 3D components
│   │   ├── Scene.tsx      # Canvas wrapper with performance settings
│   │   ├── Loader.tsx     # Loading states
│   │   ├── FloatingObject.tsx
│   │   ├── CameraRig.tsx  # Camera controls
│   │   └── ProjectCard3D.tsx
│   ├── ui/                # UI components
│   │   └── ProjectDetailPanel.tsx
│   ├── sections/          # Page sections
│   │   ├── Hero.tsx
│   │   ├── HeroScene.tsx
│   │   ├── Projects.tsx
│   │   └── ProjectsScene.tsx
│   └── PerformanceDetector.tsx
├── data/
│   └── projects.json      # Project data
├── lib/
│   ├── utils.ts           # Utility functions
│   └── cn.ts              # Class name merger
├── store/
│   └── appStore.ts        # Zustand store
└── types/
    └── index.ts           # TypeScript types
```

## 🎯 Adding New Projects

Edit `src/data/projects.json`:

```json
{
  "id": "unique-project-id",
  "title": "Project Title",
  "description": "Short description",
  "longDescription": "Detailed description for the detail panel",
  "techStack": ["Next.js", "React", "TypeScript"],
  "githubUrl": "https://github.com/user/repo",
  "liveDemoUrl": "https://demo.vercel.app",
  "thumbnail": "/images/project-thumbnail.jpg",
  "featured": true,
  "year": 2024
}
```

Add project thumbnail to `public/images/`.

## 🎨 Customization

### Personal Information

Update in [src/components/sections/Hero.tsx](src/components/sections/Hero.tsx):
- Name
- Title/Role
- Description

Update in [src/app/page.tsx](src/app/page.tsx):
- Email
- LinkedIn
- GitHub

### Metadata & SEO

Edit [src/app/layout.tsx](src/app/layout.tsx):
- Site title
- Description
- Keywords
- Social media links
- Open Graph images

### Colors & Theme

Edit [tailwind.config.ts](tailwind.config.ts):
- Primary colors
- Custom animations
- Breakpoints

### 3D Scene Configuration

**Hero Scene** - [src/components/sections/HeroScene.tsx](src/components/sections/HeroScene.tsx):
- Floating object positions
- Colors and materials
- Lighting setup

**Projects Scene** - [src/components/sections/ProjectsScene.tsx](src/components/sections/ProjectsScene.tsx):
- Layout arrangement (currently circular)
- Camera settings
- Interaction controls

## ⚡ Performance Decisions

### 1. **Automatic Performance Detection**
- Detects device type (mobile/tablet/desktop)
- Checks CPU cores, memory, and connection speed
- Assigns performance tier (high/medium/low)
- Adjusts rendering quality automatically

### 2. **Lazy Loading Strategy**
```typescript
// 3D scenes are dynamically imported
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,  // Disable SSR for 3D content
  loading: () => <Loader />  // Show loading state
});
```

### 3. **Suspense Boundaries**
Every 3D scene is wrapped in Suspense with fallback loaders:
```typescript
<Suspense fallback={<Loader />}>
  <FloatingObject />
</Suspense>
```

### 4. **Pixel Ratio Optimization**
```typescript
dpr={performanceTier.pixelRatio}  // Capped at 2 for high-tier, 1 for medium/low
```

### 5. **Conditional Features**
- Shadows: Disabled on medium/low tier
- Post-processing: Disabled on medium/low tier
- Light count: Reduced on lower tiers

### 6. **Graceful Degradation**
Low-end devices render 2D card grid instead of 3D scene.

### 7. **Optimized Rendering**
- `useMemo` for expensive calculations
- `useCallback` for event handlers
- Instanced meshes for repeated geometry
- Throttled scroll handlers

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Build for Production

```bash
npm run build
npm run start
```

### Environment Variables (Optional)

Create `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 📊 Lighthouse Optimization Checklist

- ✅ Dynamic imports for 3D content
- ✅ Image optimization (Next.js Image)
- ✅ Font optimization (Next.js Font)
- ✅ Performance tier detection
- ✅ Lazy loading with Suspense
- ✅ Minimal JavaScript on initial load
- ✅ CSS optimization with Tailwind
- ✅ Proper meta tags for SEO

## 🐛 Troubleshooting

### 3D Scene Not Rendering

1. Check browser console for errors
2. Verify WebGL support: visit [get.webgl.org](https://get.webgl.org)
3. Try disabling browser extensions
4. Check performance tier in React DevTools

### Performance Issues

1. Lower pixel ratio in [src/components/3d/Scene.tsx](src/components/3d/Scene.tsx)
2. Reduce light count
3. Disable shadows
4. Use 2D fallback mode

### TypeScript Errors

```bash
npm run build
# Check for type errors
```

## 📝 License

MIT License - feel free to use for your own portfolio!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Contact

- Email: your.email@example.com
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- GitHub: [Your Username](https://github.com/yourusername)

---

**Built with ❤️ using Next.js, React Three Fiber, and TypeScript**
