# 🚀 Spaceship FPP Universe Portfolio

## Overview

An immersive **first-person perspective (FPP) spaceship portfolio** where you pilot a spacecraft through a vast 3D universe. Each galaxy represents a different section of the portfolio (Projects, About, Contact, Skills). Click on galaxies to zoom in and explore their unique interiors.

---

## 🎮 Features

### Core Experience
- **First-Person Spaceship View**: Visible cockpit, wings, and dashboard from FPP perspective
- **Free Flight Controls**: WASD/Arrow keys + mouse look to navigate through space
- **Interactive Galaxies**: 5 explorable galaxies representing different portfolio sections
- **Smooth Transitions**: GSAP-powered camera animations when entering/exiting galaxies
- **Immersive HUD**: Real-time speed indicator, minimap, navigation hints, and location display

### Visual Effects
- **8000+ Stars**: Multi-layered star fields for depth
- **4500 Particles**: Animated particle systems with physics
- **Nebula Clouds**: Large semi-transparent nebulae in the background
- **Galaxy Glows**: Pulsing cores with multi-layer glow effects
- **Dynamic Lighting**: Point lights from galaxies and ship thrusters
- **Lens Flares**: Atmospheric lens effects (optional)

### Galaxy Interiors

#### 🌌 Universe (Main Space)
- Open space with all galaxies visible
- Free flight enabled
- Spaceship cockpit visible

#### 🏠 Home Station
- Landing platform (placeholder for expansion)
- Blue color theme (#0ea5e9)

#### 🎨 Projects Nebula
- **Orbiting Projects**: 6 project cards rotating around a central star
- **Purple Theme**: (#8b5cf6)
- **Interactive Cards**: Click to view project details
- **Orbital Rings**: Visual indicators of project paths

#### 👨‍💻 About Constellation
- **Bio Hologram**: Floating HTML panel with developer info
- **Skill Orbs**: 6 floating spheres representing tech skills
- **Connecting Lines**: Energy beams linking skills to center
- **Green Theme**: (#10b981)

#### 💼 Contact Gateway
- **Portal Design**: Torus gateway with 4 contact methods
- **Floating Cards**: Email, LinkedIn, GitHub, Twitter
- **Energy Beams**: Pulsing connections from center
- **Red Theme**: (#ef4444)

#### 🛠️ Skills Cluster
- Orange theme (#f59e0b)
- Placeholder for future expansion

---

## 🎯 Controls

### Movement
- **W / ↑**: Move forward
- **S / ↓**: Move backward
- **A / ←**: Strafe left
- **D / →**: Strafe right
- **SPACE**: Ascend
- **SHIFT**: Descend

### Camera
- **MOUSE**: Look around (click to lock pointer)
- **CLICK ON GALAXY**: Zoom in and enter

### HUD Controls
- **EXIT GALAXY**: Return to universe view
- **TOGGLE COCKPIT**: Show/hide spaceship cockpit
- **SHOW/HIDE GUIDE**: Toggle navigation hints

---

## 📁 File Structure

```
src/
├── components/
│   ├── 3d/
│   │   ├── SpaceshipCockpit.tsx      # FPP cockpit with wings & dashboard
│   │   ├── Galaxy.tsx                # Glowing galaxy sphere with labels
│   │   ├── FPPControls.tsx           # WASD + mouse look controls
│   │   ├── ProjectsGalaxy.tsx        # Projects interior scene
│   │   ├── AboutGalaxy.tsx           # About interior scene
│   │   ├── ContactGalaxy.tsx         # Contact interior scene
│   │   ├── ParticleField.tsx         # Animated particle system
│   │   ├── CameraTransitionController.tsx  # GSAP camera animations
│   │   └── ProjectCard3D.tsx         # 3D project card (reused)
│   │
│   ├── scenes/
│   │   ├── UniverseScene.tsx         # Main space with all galaxies
│   │   └── SpaceSceneWrapper.tsx     # Canvas wrapper & scene switcher
│   │
│   ├── ui/
│   │   └── SpaceHUD.tsx              # HUD overlay (speed, minimap, hints)
│   │
│   └── sections/
│       └── Hero.tsx                  # Main entry point (updated)
│
└── store/
    └── universeStore.ts              # Navigation state management
```

---

## 🔧 Technical Details

### State Management (Zustand)

**universeStore.ts** manages:
- `currentSection`: Which galaxy you're in ('universe' | 'home' | 'projects' | 'about' | 'contact' | 'skills')
- `isTransitioning`: Boolean for camera animation state
- `cameraTransition`: Transition config (from, to, lookAt, duration)
- `fppEnabled`: Toggle FPP controls
- `showCockpit`: Toggle cockpit visibility
- `galaxiesDiscovered`: Set of discovered galaxies

### Camera Transitions

Using **GSAP** for smooth animations:
1. Galaxy click triggers `navigateToGalaxy()`
2. Camera position & rotation animated over 2 seconds
3. On complete, section switches and FPP controls disable
4. EXIT button triggers `exitGalaxy()` to return to universe

### Performance

- **Dynamic Imports**: All 3D scenes lazy-loaded
- **Suspense Boundaries**: Loading states for each scene
- **Particle Optimization**: BufferGeometry with instancing
- **Low-End Fallback**: 2D gradient background if `performanceTier.tier === 'low'`

### Pointer Lock

FPP controls use **Pointer Lock API**:
- Click anywhere to lock mouse
- ESC to unlock
- Mouse movement controls camera rotation
- Vertical rotation clamped to ±90°

---

## 🎨 Customization

### Galaxy Positions

Edit `UniverseScene.tsx`:

```tsx
const galaxies = [
  {
    id: 'projects',
    label: 'Projects Nebula',
    position: [40, 5, -20], // X, Y, Z coordinates
    color: '#8b5cf6',        // Hex color
    scale: 1.5,              // Relative size
  },
  // ... add more galaxies
];
```

### Contact Information

Update `ContactGalaxy.tsx`:

```tsx
const contactMethods = [
  { icon: '📧', label: 'Email', value: 'YOUR_EMAIL@example.com', color: '#ef4444' },
  { icon: '💼', label: 'LinkedIn', value: 'YOUR_LINKEDIN', color: '#0077b5' },
  // ... update with your info
];
```

### Skills

Update `AboutGalaxy.tsx`:

```tsx
const skills = [
  { name: 'React', color: '#61dafb', icon: '⚛️' },
  { name: 'YOUR_SKILL', color: '#COLOR', icon: '🎯' },
  // ... add your skills
];
```

### Projects

Update `projects.json` - projects automatically orbit in Projects Galaxy.

---

## 🚀 Performance Tips

### Recommended Settings
- **High-End**: All effects enabled, 60+ FPS
- **Mid-Range**: Reduce particle counts in `ParticleField` components
- **Low-End**: Automatically falls back to 2D view

### Optimization Options

1. **Reduce Particles**:
```tsx
<ParticleField count={500} /> // Lower from 2000
```

2. **Simplify Stars**:
```tsx
<Stars count={2000} /> // Lower from 8000
```

3. **Disable Effects**:
Comment out nebula clouds in `UniverseScene.tsx`

---

## 🐛 Troubleshooting

### Camera Not Moving
- **Solution**: Click to enable pointer lock
- **Check**: `fppEnabled` is true in universeStore

### Galaxy Click Not Working
- **Solution**: Ensure you're in universe view (`currentSection === 'universe'`)
- **Check**: Hover should show "Click to Enter" text

### Performance Issues
- **Solution**: Check `performanceTier` in devtools
- **Fallback**: Will auto-switch to 2D if tier is 'low'

### Cockpit Not Visible
- **Solution**: Click "Show Cockpit" button in HUD
- **Check**: `showCockpit` state in universeStore

---

## 📱 Mobile Support

Currently optimized for **desktop** with mouse + keyboard. Mobile adaptations:
1. Touch controls for movement (virtual joystick)
2. Swipe for camera rotation
3. Tap galaxies to enter
4. Reduced particle counts
5. Simplified shaders

---

## 🎓 Learning Resources

### Three.js Concepts Used
- **BufferGeometry**: Efficient particle rendering
- **PointLight**: Dynamic lighting from galaxies
- **Pointer Lock**: FPP controls
- **Line**: Energy beams connecting objects
- **Float**: Drei helper for floating animations

### React Three Fiber
- **useFrame**: Animation loop
- **useThree**: Access camera & scene
- **Suspense**: Async loading
- **Canvas**: WebGL renderer

### GSAP
- **gsap.to()**: Camera position tweening
- **ease**: 'power2.inOut' for smooth transitions

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Ship customization (colors, models)
- [ ] Sound effects (engine, galaxy entry)
- [ ] Background music
- [ ] Warp speed animation
- [ ] More galaxy interiors (Skills, Blog, etc.)
- [ ] Multiplayer (see other visitors as ships)
- [ ] Achievement system
- [ ] Asteroid fields
- [ ] Black holes
- [ ] Interactive tutorials

### Advanced Ideas
- **VR Support**: Integrate WebXR for VR headsets
- **Procedural Generation**: Random galaxy positions
- **Physics**: Gravity fields around galaxies
- **Missions**: Collect items, complete challenges

---

## 📄 License

This project is part of your portfolio. Customize freely!

---

## 🙏 Credits

**Technologies**:
- React Three Fiber
- Three.js
- GSAP
- Zustand
- Next.js 14
- TypeScript

**Inspiration**:
- No Man's Sky
- Elite Dangerous
- Space exploration games

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Ensure WebGL is enabled
3. Try disabling browser extensions
4. Update graphics drivers

---

**Built with ❤️ and ☕**

*Explore the universe, one galaxy at a time.* 🌌
