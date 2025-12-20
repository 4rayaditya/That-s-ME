# 🚀 Quick Start - Space Portfolio

## Start the Experience

```bash
npm run dev
```

Navigate to: `http://localhost:3000`

## Controls

**Move**: W/A/S/D or Arrow Keys  
**Look**: Mouse (click to lock)  
**Ascend**: SPACE  
**Descend**: SHIFT  
**Enter Galaxy**: Click on glowing spheres  
**Exit Galaxy**: Click "EXIT GALAXY" button (bottom center)  

## First Time Setup

1. **Click anywhere** on the screen to enable mouse controls
2. **Fly around** using WASD to explore the universe
3. **Find galaxies** - glowing colored spheres with labels:
   - 🔵 Home Station (center)
   - 🟣 Projects Nebula (right)
   - 🟢 About Constellation (left)
   - 🟠 Skills Cluster (bottom right)
   - 🔴 Contact Gateway (top left)
4. **Click on a galaxy** to zoom in and explore its interior
5. **Press EXIT** to return to universe view

## Customization Checklist

### 1. Update Contact Info
**File**: `src/components/3d/ContactGalaxy.tsx`

```tsx
const contactMethods = [
  { icon: '📧', label: 'Email', value: 'YOUR_EMAIL@example.com', ... },
  { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/YOURNAME', ... },
  { icon: '🐙', label: 'GitHub', value: 'github.com/YOURUSERNAME', ... },
  { icon: '🐦', label: 'Twitter', value: '@YOURHANDLE', ... },
];
```

### 2. Update Skills
**File**: `src/components/3d/AboutGalaxy.tsx`

```tsx
const skills = [
  { name: 'YOUR_SKILL', color: '#hexcolor', icon: '🎯' },
  // Add 6-8 skills
];
```

Also update the bio HTML section in the same file.

### 3. Update Projects
**File**: `src/data/projects.json`

Projects will automatically appear orbiting in the Projects Galaxy.

### 4. Update SEO Metadata
**File**: `src/app/layout.tsx`

Update title, description, and OpenGraph tags with your info.

### 5. Galaxy Positions (Optional)
**File**: `src/components/scenes/UniverseScene.tsx`

Adjust galaxy positions if you want different spacing:

```tsx
const galaxies = [
  {
    id: 'projects',
    position: [40, 5, -20], // Change X, Y, Z
    ...
  },
];
```

## Performance

The portfolio automatically detects device performance:
- **High-End**: Full effects, 4500 particles
- **Mid-Range**: Reduced effects
- **Low-End**: 2D fallback view

To manually adjust:
- **Reduce particles**: `src/components/scenes/UniverseScene.tsx`
- **Lower star count**: Adjust `<Stars count={...} />`
- **Simplify galaxies**: Reduce orbiting objects

## Troubleshooting

**Camera won't move**:
- Click the screen to enable pointer lock
- Check that you're in the universe view (not inside a galaxy)

**Galaxies not clickable**:
- Hover should show "Click to Enter" text
- Ensure you're close enough (fly towards them)

**Performance issues**:
- Check browser console for errors
- Try a different browser (Chrome/Edge recommended)
- Disable browser extensions
- Update graphics drivers

**Cockpit not visible**:
- Click "Show Cockpit" button in HUD (bottom center)

## Build for Production

```bash
npm run build
npm start
```

## Deploy

### Vercel (Recommended)
```bash
vercel deploy
```

### Netlify
```bash
npm run build
# Upload .next folder
```

### Docker
```bash
docker build -t space-portfolio .
docker run -p 3000:3000 space-portfolio
```

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 15+
- ⚠️ Mobile (limited FPP controls)

## File Overview

```
src/
├── components/
│   ├── 3d/               # 3D objects & effects
│   ├── scenes/           # Main scenes
│   ├── ui/               # HUD overlays
│   └── sections/         # Page sections
├── store/
│   └── universeStore.ts  # Navigation state
└── data/
    └── projects.json     # Project data
```

## Need Help?

See full documentation: [SPACE_PORTFOLIO_GUIDE.md](./SPACE_PORTFOLIO_GUIDE.md)

---

**Ready to Launch!** 🚀

*Your portfolio awaits in the stars...*
