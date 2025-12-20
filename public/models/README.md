# 3D Models Directory

Place your 3D models here for use in scenes.

## Supported Formats

- **GLTF** (`.gltf`) - Recommended
- **GLB** (`.glb`) - Recommended (binary, smaller)
- **FBX** (`.fbx`) - Requires loader
- **OBJ** (`.obj`) - Basic support

## Recommended Format: GLB with Draco Compression

### Why GLB?
- Binary format (smaller file size)
- Self-contained (textures embedded)
- Industry standard
- Best browser support

### Why Draco?
- Reduces file size by 70-90%
- Faster loading
- Built-in R3F support

## Optimization Workflow

### 1. Export from Blender/Maya/3DS Max

**Blender Export Settings**:
- Format: glTF 2.0 (.glb)
- Include: Selected Objects
- Transform: +Y Up
- Geometry: Apply Modifiers
- Compression: Draco

### 2. Optimize with gltf-transform

```bash
# Install
npm install -g @gltf-transform/cli

# Optimize
gltf-transform optimize input.glb output.glb \
  --compress draco \
  --texture-compress webp

# Inspect
gltf-transform inspect model.glb
```

### 3. Validate

```bash
# Install validator
npm install -g gltf-validator

# Validate
gltf-validator model.glb
```

## Size Guidelines

| Complexity | Target Size | Polygon Count |
|------------|-------------|---------------|
| Simple | <100KB | <5K triangles |
| Medium | <500KB | <20K triangles |
| Complex | <2MB | <50K triangles |

## Usage in React Three Fiber

```typescript
import { useGLTF } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('/models/your-model.glb');
  return <primitive object={scene} />;
}

// Preload for better performance
useGLTF.preload('/models/your-model.glb');
```

## Draco Decoder Setup

Already configured in this project!

```typescript
// In Scene component
import { useGLTF } from '@react-three/drei';

// Draco decoder path (auto-configured)
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
```

## Free 3D Model Resources

- [Sketchfab](https://sketchfab.com/) - Huge library
- [Poly Haven](https://polyhaven.com/) - CC0 models
- [Kenney](https://kenney.nl/assets) - Game assets
- [Quaternius](http://quaternius.com/) - Low poly models

## Example Models for Portfolio

### Hero Section
- Abstract geometric shape
- ~50KB, animated
- Low poly, simple materials

### Project Cards
- Simple card/portal geometry
- <20KB each
- Instanced for performance

### Background Elements
- Particles (generated, no file)
- Simple primitives (cubes, spheres)
- Minimal overhead

## Common Issues

### Model not loading?
- Check file path
- Verify file format
- Check console for errors

### Model too dark?
- Add lights to scene
- Check material settings
- Increase ambient light

### Performance issues?
- Reduce polygon count
- Use Draco compression
- Implement LOD (Level of Detail)

## Note

This project uses procedural geometry (created in code) by default.
3D models are optional but can enhance visual appeal.
