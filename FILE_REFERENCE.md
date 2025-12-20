# 📚 Complete File Reference

Quick reference guide to all files in the project.

---

## 📁 Root Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `next.config.js` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS configuration |
| `.eslintrc.json` | ESLint rules |
| `.gitignore` | Git ignore patterns |

## 📖 Documentation

| File | Purpose |
|------|---------|
| `README.md` | Main documentation |
| `QUICKSTART.md` | Quick setup guide |
| `PERFORMANCE.md` | Performance decisions |
| `DEPLOYMENT.md` | Deployment instructions |
| `ARCHITECTURE.md` | Technical architecture |
| `CHECKLIST.md` | Pre-deployment checklist |
| `PLANS.md` | Project overview |

## 🎨 Source Files

### App Directory (`src/app/`)

| File | Purpose |
|------|---------|
| `layout.tsx` | Root layout with SEO metadata |
| `page.tsx` | Home page with all sections |
| `globals.css` | Global styles |

### Components - 3D (`src/components/3d/`)

| File | Purpose |
|------|---------|
| `Scene.tsx` | Canvas wrapper with performance settings |
| `Loader.tsx` | Loading states for 3D scenes |
| `FloatingObject.tsx` | Animated 3D object for hero |
| `CameraRig.tsx` | Camera controls and animations |
| `ProjectCard3D.tsx` | 3D project cards |

### Components - UI (`src/components/ui/`)

| File | Purpose |
|------|---------|
| `ProjectDetailPanel.tsx` | Slide-in project details panel |

### Components - Sections (`src/components/sections/`)

| File | Purpose |
|------|---------|
| `Hero.tsx` | Hero section wrapper |
| `HeroScene.tsx` | Hero 3D scene |
| `Projects.tsx` | Projects section wrapper |
| `ProjectsScene.tsx` | Projects 3D scene |

### Components - Root (`src/components/`)

| File | Purpose |
|------|---------|
| `PerformanceDetector.tsx` | Detects device and performance tier |

### Data (`src/data/`)

| File | Purpose |
|------|---------|
| `projects.json` | Project data (edit this for your projects) |

### Library (`src/lib/`)

| File | Purpose |
|------|---------|
| `utils.ts` | Utility functions (device detection, etc.) |
| `cn.ts` | Class name merger for Tailwind |

### Store (`src/store/`)

| File | Purpose |
|------|---------|
| `appStore.ts` | Zustand global state management |

### Types (`src/types/`)

| File | Purpose |
|------|---------|
| `index.ts` | TypeScript type definitions |

## 🖼️ Public Assets (`public/`)

| Directory | Purpose |
|-----------|---------|
| `images/` | Project thumbnails |
| `models/` | 3D models (.glb files) |
| `fonts/` | Custom fonts (optional) |

---

## 🔧 Key Configuration Files

### next.config.js
- WebGL/3D model handling
- Image optimization settings
- Performance optimizations
- Bundle optimization

### tailwind.config.ts
- Custom color palette
- Custom animations
- Responsive breakpoints
- Custom utilities

### tsconfig.json
- TypeScript strict mode
- Path aliases (@/*)
- JSX configuration
- Build options

---

## 🎯 Files to Customize

### Must Edit
1. `src/data/projects.json` - Your projects
2. `src/components/sections/Hero.tsx` - Your name
3. `src/app/page.tsx` - Contact info
4. `src/app/layout.tsx` - SEO metadata

### Should Edit
5. `public/images/` - Add your images
6. `tailwind.config.ts` - Adjust colors
7. `README.md` - Update personal info

### Optional Edit
8. `src/components/sections/HeroScene.tsx` - Customize 3D
9. `src/components/sections/ProjectsScene.tsx` - Layout changes
10. `public/og-image.jpg` - Social media preview

---

## 📊 File Size Reference

| Type | Size | Count |
|------|------|-------|
| Configuration | ~5KB | 7 files |
| Documentation | ~50KB | 7 files |
| TypeScript Source | ~40KB | 20 files |
| Data | ~2KB | 1 file |
| **Total (pre-build)** | **~100KB** | **35 files** |

---

## 🚀 Build Output

After running `npm run build`:

```
.next/
├── static/
│   ├── chunks/          # ~300KB total
│   ├── css/            # ~30KB
│   └── media/          # varies
└── server/
    └── pages/          # Server components
```

---

## 🔍 Finding Files Quickly

### By Feature

**3D Rendering**:
- `src/components/3d/Scene.tsx`
- `src/components/sections/HeroScene.tsx`
- `src/components/sections/ProjectsScene.tsx`

**State Management**:
- `src/store/appStore.ts`

**Performance**:
- `src/lib/utils.ts` (detection)
- `src/components/PerformanceDetector.tsx`
- `src/components/3d/Scene.tsx` (settings)

**Data**:
- `src/data/projects.json`
- `src/types/index.ts`

**Styling**:
- `src/app/globals.css`
- `tailwind.config.ts`

---

## 📝 Common Edit Scenarios

### Adding a New Project
1. Edit: `src/data/projects.json`
2. Add image: `public/images/your-project.jpg`

### Changing Colors
1. Edit: `tailwind.config.ts` (primary colors)
2. Edit: Scene components for 3D colors

### Adding a New Section
1. Create: `src/components/sections/YourSection.tsx`
2. Import in: `src/app/page.tsx`
3. Add 3D scene if needed

### Modifying 3D Scene
1. Hero: `src/components/sections/HeroScene.tsx`
2. Projects: `src/components/sections/ProjectsScene.tsx`

---

**Quick Reference**: Bookmark this page for fast navigation!
