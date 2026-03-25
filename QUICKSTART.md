# Quick Start Guide

Get **Bolivia Urban Regulation Explorer** running in 60 seconds.

## 1. Install Dependencies

```bash
pnpm install
```

Or if using npm:
```bash
npm install
```

## 2. Start Development Server

```bash
pnpm dev
```

Or:
```bash
npm run dev
```

You'll see:
```
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
```

## 3. Open in Browser

Go to **http://localhost:3000**

You should see:
- A full-screen map of Bolivia
- The navbar with app title at the top
- All 9 departments visible as gray polygons

## 4. Try Navigation

### Level 1 → Level 2
**Click any department** (e.g., "La Paz")
- Zooms to department bounds
- Department highlight turns blue
- City markers appear (small circles)

### Level 2 → Level 3
**Click any city marker** (e.g., "La Paz")
- Map centers on city
- Right panel opens showing city details
- Breadcrumb updates: Bolivia / La Paz / La Paz

### Back to Level 1
**Click "Reset View"** button
- Zooms back to country level
- Clears all selections

## 5. File Structure Quick Reference

```
app/page.tsx                          # Main app (state management)
components/
  ├── MapView.tsx                    # Leaflet map rendering
  ├── Navbar.tsx                     # Top navigation bar
  └── InfoPanel.tsx                  # Right-side info drawer
lib/mapUtils.ts                       # Map utility functions
public/data/
  ├── bolivia_departments_simplified.geojson
  └── bolivia_major_cities_points.geojson
```

## 6. Stopping the Server

Press **Ctrl+C** in your terminal.

## 7. Building for Production

```bash
pnpm build
pnpm start
```

Visit http://localhost:3000 to see production build.

---

## Troubleshooting

### "Cannot find module" error
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Map not loading
- Check browser console (F12)
- Verify `/public/data/*.geojson` files exist
- Look for red errors under "Network" tab

### Port 3000 in use
```bash
# Use different port
pnpm dev -- -p 3001
```

### Styles look broken
- Wait 5-10 seconds for Tailwind to compile
- Hard refresh browser (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)

---

## Next Steps

1. **Read the full README**: `README.md`
2. **Understand the data**: `DATA_SCHEMA.md`
3. **Customize the UI**: Edit files in `/components`
4. **Add new features**: Extend functionality in `/app/page.tsx`

---

## Key Technologies

| Technology | Purpose |
|------------|---------|
| **Next.js** | React framework with SSR/SSG |
| **React** | UI library |
| **Leaflet** | Open-source map library |
| **Tailwind CSS** | Utility-first CSS framework |
| **GeoJSON** | Geographic data format |

All tools are production-ready and well-maintained.

---

## Support

- 📖 Full docs: `README.md`
- 📊 Data docs: `DATA_SCHEMA.md`
- 💻 Code: Well-commented source files
- 🗺️ Map: Learn Leaflet at https://leafletjs.com

Happy mapping! 🇧🇴
