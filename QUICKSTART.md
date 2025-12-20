# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Customize Your Portfolio

**Update Personal Info:**
- Edit [src/components/sections/Hero.tsx](src/components/sections/Hero.tsx) - Change name and title
- Edit [src/app/page.tsx](src/app/page.tsx) - Update contact links
- Edit [src/app/layout.tsx](src/app/layout.tsx) - Update SEO metadata

**Add Your Projects:**
- Edit [src/data/projects.json](src/data/projects.json)
- Add project images to `public/images/`

### 3. Run & Deploy

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Deploy to Vercel
# Push to GitHub, then import on vercel.com
```

## 📝 Essential Customizations

### Replace Placeholders

| File | What to Change |
|------|----------------|
| `src/components/sections/Hero.tsx` | Your name, role, description |
| `src/app/page.tsx` | Email, LinkedIn, GitHub links |
| `src/app/layout.tsx` | Meta title, description, social links |
| `src/data/projects.json` | Your actual projects |
| `public/images/` | Project thumbnails |

### Optional Enhancements

- **Fonts**: Add custom fonts to `public/fonts/` for 3D text
- **Models**: Add 3D models (.glb) to `public/models/`
- **Analytics**: Add Google Analytics ID to layout
- **Domain**: Configure custom domain in Vercel

## 🎨 Styling Tips

**Colors**: Edit `tailwind.config.ts`
```typescript
colors: {
  primary: {
    400: '#your-color',
    500: '#your-color',
    600: '#your-color',
  }
}
```

**3D Scene Colors**: Edit scene components
```typescript
<FloatingObject color="#your-color" />
```

## 🐛 Common Issues

**TypeScript errors?**
```bash
npm run build
```

**3D not showing?**
- Check browser console
- Try different browser
- Visit: get.webgl.org

**Slow loading?**
- Check PERFORMANCE.md
- Lower pixel ratio in Scene.tsx
- Disable shadows for medium tier

## 📚 Documentation

- [README.md](README.md) - Full documentation
- [PERFORMANCE.md](PERFORMANCE.md) - Performance details
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide

## 💬 Need Help?

Open an issue or reach out via the contact form!
