# Images Directory

Place your project thumbnails and other images here.

## Required Images

### Project Thumbnails
- Name: `project-1.jpg`, `project-2.jpg`, etc.
- Format: JPG or PNG
- Recommended size: 1200x630px (2:1 ratio)
- File size: Keep under 200KB each

### Social Media
- `og-image.jpg` - Open Graph preview (1200x630px)
- `favicon.ico` - Site favicon

## Optimization Tips

### Before Adding Images

1. **Resize**: Use exact size needed
2. **Compress**: Use tools like TinyPNG or Squoosh
3. **Format**: 
   - Photos: JPG
   - Graphics: PNG
   - Icons: SVG

### Tools

- [TinyPNG](https://tinypng.com/) - Image compression
- [Squoosh](https://squoosh.app/) - Advanced optimization
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG optimization

## Example Structure

```
images/
├── project-1.jpg      # AI Dashboard thumbnail
├── project-2.jpg      # E-Commerce 3D Viewer
├── project-3.jpg      # Portfolio Builder
├── project-4.jpg      # Virtual Events
├── project-5.jpg      # Game Engine
├── project-6.jpg      # NFT Gallery
├── og-image.jpg       # Social media preview
└── favicon.ico        # Site icon
```

## Next.js Image Component

When using these images in React:

```typescript
import Image from 'next/image';

<Image
  src="/images/project-1.jpg"
  width={800}
  height={600}
  alt="Project name"
  loading="lazy"
/>
```

Next.js automatically optimizes images on-the-fly!

## Placeholder Images

If you don't have project images yet, use placeholder services:

- [Unsplash](https://unsplash.com/) - Free stock photos
- [Placeholder.com](https://placeholder.com/)
- [Lorem Picsum](https://picsum.photos/)

## Note

Images in `public/` folder are served at `/images/your-image.jpg`
