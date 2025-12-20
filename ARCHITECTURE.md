# 🏗️ Architecture Overview

This document explains the technical architecture and design patterns used in this 3D portfolio.

---

## 🎯 Core Architecture Principles

1. **Separation of Concerns**: 3D logic, UI logic, and business logic are isolated
2. **Progressive Enhancement**: Start with 2D, enhance with 3D
3. **Performance First**: Every decision optimized for speed
4. **Type Safety**: TypeScript throughout for reliability
5. **Composability**: Reusable, modular components

---

## 📐 Layer Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (React Components, UI, 3D Scenes)  │
├─────────────────────────────────────┤
│         Application Layer           │
│   (State Management, Business Logic)│
├─────────────────────────────────────┤
│           Data Layer                │
│      (JSON, Types, Constants)       │
└─────────────────────────────────────┘
```

### Presentation Layer
- **3D Components**: R3F-based 3D scenes
- **UI Components**: React components for interface
- **Sections**: Page-level composition components

### Application Layer
- **Store**: Zustand for global state
- **Utilities**: Helper functions, device detection
- **Hooks**: Custom React hooks (future)

### Data Layer
- **Projects**: JSON file with project data
- **Types**: TypeScript interfaces
- **Constants**: Configuration values

---

## 🔄 Data Flow

```
User Interaction
       ↓
  React Component
       ↓
  Zustand Store (if needed)
       ↓
  3D Scene Update
       ↓
  Visual Feedback
```

### Example: Project Selection

1. User clicks 3D project card
2. `ProjectCard3D` calls `setSelectedProject(id)`
3. Zustand updates `selectedProjectId` state
4. `ProjectDetailPanel` reads state and opens
5. GSAP animates panel into view

---

## 🎨 Component Architecture

### Atomic Design Pattern

```
Pages (Organisms)
  └── Sections (Organisms)
      └── 3D Scenes (Molecules)
          └── 3D Objects (Atoms)
      └── UI Components (Molecules)
          └── Basic Elements (Atoms)
```

### Example Hierarchy

```
page.tsx
  └── Hero (Section)
      ├── HeroScene (3D Scene)
      │   ├── FloatingObject (3D Atom)
      │   ├── CameraRig (3D Atom)
      │   └── Lights (3D Atom)
      └── Hero Content (UI)
          ├── Title
          ├── Description
          └── CTA Buttons
```

---

## 🎮 State Management Strategy

### Zustand Store Structure

```typescript
interface AppState {
  // Performance
  performanceTier: PerformanceTier;
  deviceType: DeviceType;
  
  // UI State
  selectedProjectId: string | null;
  isProjectDetailOpen: boolean;
  
  // Actions
  setPerformanceTier: (tier) => void;
  setSelectedProject: (id) => void;
  // ...
}
```

### When to Use Store vs Local State

**Use Zustand Store for:**
- Cross-component state (selected project)
- Performance settings (used by multiple scenes)
- Device detection (read by many components)

**Use Local State for:**
- Component-specific state (hover, animation)
- Form inputs
- Temporary UI state

---

## 🎬 Animation Strategy

### Animation Layers

1. **R3F useFrame**: Per-frame 3D animations (60fps)
2. **GSAP**: UI transitions and camera movements
3. **Framer Motion**: Future complex UI animations
4. **CSS**: Simple hover/transition effects

### Example: Project Card Animation

```typescript
// Continuous floating - useFrame
useFrame((state) => {
  mesh.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
});

// Interaction - lerp
useFrame(() => {
  mesh.scale.lerp(targetScale, 0.1);
});

// Camera transition - GSAP
animateCamera(camera, [x, y, z], duration);
```

---

## 🚀 Performance Architecture

### Loading Strategy

```
1. HTML Shell (instant)
   ↓
2. Critical CSS (instant)
   ↓
3. Core JS (~100KB, <1s)
   ↓
4. React Hydration
   ↓
5. 3D Scene Chunks (lazy, ~200KB)
   ↓
6. Assets (progressive)
```

### Code Splitting Map

```
Main Bundle (180KB)
  ├── React + React DOM
  ├── Next.js Runtime
  ├── Zustand
  └── Core Components

Dynamic Chunks
  ├── HeroScene.chunk.js (50KB)
  ├── ProjectsScene.chunk.js (60KB)
  ├── Three.js (100KB, shared)
  └── R3F + Drei (80KB, shared)
```

---

## 🔐 Type System

### Core Types

```typescript
// Domain types
Project
PerformanceTier
DeviceType

// Component props
SceneProps
ProjectCard3DProps
ProjectDetailPanelProps

// Store types
AppState
```

### Type Flow

```
JSON (projects.json)
  → Type Assertion (as Project[])
  → Component Props (typed)
  → Zustand Store (typed)
  → React Components (typed)
```

---

## 🎯 Rendering Strategy

### Server vs Client Rendering

| Component | Rendering | Reason |
|-----------|-----------|--------|
| Layout | Server | SEO, metadata |
| Hero (wrapper) | Server | Initial HTML |
| HeroScene | Client | WebGL/Canvas |
| Projects (wrapper) | Server | SEO, content |
| ProjectsScene | Client | WebGL/Canvas |

### Hydration Mismatch Prevention

```typescript
// ❌ Bad: Server/client mismatch
const [count, setCount] = useState(Math.random());

// ✅ Good: Client-only
const [count, setCount] = useState(0);
useEffect(() => setCount(Math.random()), []);
```

---

## 🧩 Extensibility Points

### Adding New 3D Scenes

1. Create scene component in `components/3d/`
2. Use dynamic import in parent
3. Wrap in Suspense
4. Follow Scene component pattern

### Adding New Project Fields

1. Update type in `types/index.ts`
2. Update JSON in `data/projects.json`
3. Update UI in `ProjectDetailPanel.tsx`
4. Update 3D card if needed

### Adding New Performance Tiers

1. Update tier logic in `lib/utils.ts`
2. Add new tier config in `detectPerformanceTier()`
3. Update Scene component to handle new tier
4. Test on target devices

---

## 🔍 Debug Architecture

### Development Tools

```typescript
// React DevTools
// - Component hierarchy
// - State inspection
// - Performance profiling

// R3F DevTools (optional)
import { Perf } from 'r3f-perf';
<Perf position="top-left" />

// Zustand DevTools
import { devtools } from 'zustand/middleware';
```

### Performance Monitoring

```typescript
// Log render times
useEffect(() => {
  console.log('Component rendered');
});

// Log state changes
useAppStore.subscribe((state) => {
  console.log('State updated:', state);
});
```

---

## 📦 Build Architecture

### Production Build Pipeline

```
1. TypeScript Compilation
   ↓
2. Next.js Build
   ↓
3. Code Splitting
   ↓
4. Tree Shaking
   ↓
5. Minification
   ↓
6. Asset Optimization
   ↓
7. Static Generation
   ↓
8. Output (.next/)
```

### Output Structure

```
.next/
├── static/
│   ├── chunks/        # JS chunks
│   ├── css/          # Optimized CSS
│   └── media/        # Images, fonts
├── server/
│   └── pages/        # Server components
└── cache/            # Build cache
```

---

## 🎓 Design Patterns Used

1. **Container/Presenter**: Sections vs Scenes
2. **Factory**: Performance tier creation
3. **Observer**: Zustand subscriptions
4. **Lazy Loading**: Dynamic imports
5. **Compound Components**: Scene + children
6. **Render Props**: Future custom hooks

---

## 🚦 Future Enhancements

### Short Term
- [ ] Web Workers for physics
- [ ] Intersection Observer for scenes
- [ ] More 3D models
- [ ] Blog section

### Long Term
- [ ] CMS integration
- [ ] Admin panel
- [ ] A/B testing
- [ ] Analytics dashboard

---

**Last Updated**: December 2024
