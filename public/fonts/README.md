# Fonts Directory

This directory is for custom fonts used in 3D text rendering.

## Required Fonts (for 3D Text)

If you want to use custom fonts in 3D text (like in ProjectCard3D), you'll need:

- `inter-bold.woff` - For titles
- `inter-regular.woff` - For body text

## Getting Fonts

### Option 1: Download from Google Fonts
1. Visit [Google Fonts](https://fonts.google.com/)
2. Select "Inter" font
3. Download and extract
4. Copy `.woff` or `.woff2` files here

### Option 2: Use Existing Fonts
The project already uses Next.js font optimization for web fonts.
3D fonts are optional - if missing, fallback text will be used.

## Usage in 3D

```typescript
import { Text } from '@react-three/drei';

<Text
  font="/fonts/inter-bold.woff"
  fontSize={0.2}
>
  Your Text
</Text>
```

## Format Requirements

- Format: `.woff` or `.woff2`
- Size: Keep under 100KB per font
- Subset: Only include required characters

## Note

For optimal performance, only load fonts that are actually used in 3D scenes.
Regular web text uses Next.js automatic font optimization.
