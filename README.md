# Bolivia Urban Regulation Explorer

A production-ready, hierarchical territorial exploration system for exploring Bolivia's departments and cities through an interactive map interface.

## Overview

This is **NOT** a generic map application. It's a 3-level navigation system:

- **Level 1 (Country)**: View all 9 Bolivian departments as interactive polygons
- **Level 2 (Department)**: Select a department to view its cities as markers
- **Level 3 (City)**: Click a city to open a detailed information panel

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 with Tailwind CSS
- **Maps**: Leaflet + react-leaflet
- **Data Format**: GeoJSON (real geographic data, not mocked)
- **Styling**: Tailwind CSS with custom components

## Project Structure

```
/app
  layout.tsx          # Root layout with metadata
  page.tsx            # Main application component
  globals.css         # Global Tailwind styles

/components
  Navbar.tsx          # Top navigation bar with breadcrumbs
  MapView.tsx         # Leaflet map with GeoJSON rendering
  InfoPanel.tsx       # Right-side panel for city information
  /ui
    button.tsx        # Reusable Button component

/lib
  mapUtils.ts         # Utility functions for bounds, filtering, etc.
  utils.ts            # Common utilities (cn function for className merging)

/public/data
  bolivia_departments_simplified.geojson    # Department polygon boundaries
  bolivia_major_cities_points.geojson       # City locations and metadata
```

## Features

### Map Interaction
- ✅ **Click departments** to zoom in and highlight
- ✅ **Hover effects** on departments for better UX
- ✅ **City markers** visible only when a department is selected
- ✅ **Smooth zoom transitions** with fitBounds animation
- ✅ **Reset View button** to return to country-level view

### Navigation
- ✅ **Breadcrumb navigation** showing current level (Bolivia / Department / City)
- ✅ **3-level hierarchy**: Country → Department → City
- ✅ **Right-side info panel** opens when a city is selected
- ✅ **Close panel** button to deselect city

### Data Integration
- ✅ **Real GeoJSON data** for accurate department boundaries
- ✅ **City point features** with metadata (role, rank, department)
- ✅ **Focus bounding boxes** for each city enabling precise map centering
- ✅ **No mocked data** — all boundaries and coordinates are authentic

## Getting Started

### Prerequisites
- Node.js 18+ (pnpm recommended, but npm/yarn work too)

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   # or: npm install
   # or: yarn install
   ```

2. **Run the development server**:
   ```bash
   pnpm dev
   # or: npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

### Production Build

```bash
pnpm build
pnpm start
```

## How GeoJSON is Integrated

### 1. Data Files Location
- `public/data/bolivia_departments_simplified.geojson` — Department polygon boundaries
- `public/data/bolivia_major_cities_points.geojson` — City point features

### 2. Loading Data
The main page (`app/page.tsx`) fetches both GeoJSON files on mount:

```typescript
const [deptRes, citiesRes] = await Promise.all([
  fetch('/data/bolivia_departments_simplified.geojson'),
  fetch('/data/bolivia_major_cities_points.geojson'),
]);
```

### 3. Rendering Departments
In `MapView.tsx`, departments are rendered as Leaflet GeoJSON layers with:
- Dynamic styling based on selection state
- Click handlers to zoom to department bounds
- Hover effects for better UX

```typescript
L.geoJSON(departmentFeature, {
  style: (feature) => ({
    fillColor: isSelected ? '#3b82f6' : '#f3f4f6',
    weight: isSelected ? 2 : 1,
  }),
  onEachFeature: (feature, layer) => {
    layer.on('click', () => onSelectDepartment(departmentName));
  },
}).addTo(map);
```

### 4. Rendering Cities
City markers are created from the GeoJSON point features:
- Filtered by selected department using `getCitiesByDepartment()`
- Rendered as circle markers with color coding (primary/secondary)
- Clickable to select and center on city

### 5. Map Utilities
`lib/mapUtils.ts` provides helper functions:
- `getBoundsFromPolygon()` — Extract bounds from polygon geometry
- `getCityBounds()` — Get bounds from city focus_bbox
- `getCitiesByDepartment()` — Filter cities by department name
- `getBoliviaBounds()` — Get country-level bounds

## State Management

Using React `useState` for simplicity (no external state library needed):

```typescript
const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
const [selectedCity, setSelectedCity] = useState<string | null>(null);
const [departmentsGeoJSON, setDepartmentsGeoJSON] = useState<FeatureCollection | null>(null);
```

## Map Styling

### Department Colors
- **Unselected**: Light gray fill (#f3f4f6), gray border (#9ca3af)
- **Selected**: Blue fill (#3b82f6), dark border (#1f2937)
- **Hover**: Increased fill opacity (0.2 instead of 0.1)

### City Markers
- **Unselected**: Blue circle (#3b82f6), 6px radius
- **Selected**: Red circle (#ef4444), 8px radius
- All markers have borders and 80% fill opacity

### Base Map
- OpenStreetMap tiles (default Leaflet provider)
- Attribution included per OSM requirements

## Component Architecture

### Navbar.tsx
- Displays app title and breadcrumb navigation
- Reset View button that clears all selections
- Responsive layout with flexbox

### MapView.tsx
- Manages Leaflet map instance and lifecycle
- Renders department polygons and city markers
- Handles all click and hover interactions
- Uses refs to track layer/marker objects

### InfoPanel.tsx
- Right-side drawer that appears when city is selected
- Shows city name and department
- Placeholder for regulation data ("coming soon")
- Close button to deselect city

### Navbar.tsx
- Top navigation with app title and breadcrumbs
- Reset button to return to country view

## Browser Compatibility

Works in all modern browsers supporting:
- ES2020+ JavaScript
- CSS Grid/Flexbox
- Leaflet (Chrome, Firefox, Safari, Edge)

## Performance Considerations

- GeoJSON files are loaded once on page mount
- Layer refs prevent re-rendering on each state change
- Leaflet handles efficient map rendering
- Smooth transitions use Leaflet's built-in animation

## Customization

### Adding New Departments
Simply add a new feature to `bolivia_departments_simplified.geojson` with:
```json
{
  "type": "Feature",
  "properties": { "id": "XX", "name": "Department Name" },
  "geometry": { "type": "Polygon", "coordinates": [...] }
}
```

### Adding New Cities
Add a point feature to `bolivia_major_cities_points.geojson`:
```json
{
  "type": "Feature",
  "properties": {
    "id": 999,
    "department": "Department Name",
    "city": "City Name",
    "slug": "city-name",
    "rank": "primary",
    "role": "capital_departamental",
    "focus_bbox": [west, south, east, north]
  },
  "geometry": { "type": "Point", "coordinates": [lng, lat] }
}
```

## Constraints & Design Decisions

- ✅ No Google Maps or external APIs (privacy-first)
- ✅ No hardcoded coordinates (uses real GeoJSON)
- ✅ Maintains 3-level hierarchy (no shortcuts)
- ✅ Cities are navigation anchors only (not administrative boundaries)
- ✅ Clean, minimal UI (not flashy or overdesigned)

## Troubleshooting

### Map not loading
- Check that `/public/data/*.geojson` files exist
- Open browser console for fetch errors
- Verify network tab shows successful GeoJSON requests

### Cities not appearing
- Select a department first (cities only show when department is selected)
- Check GeoJSON `properties.department` matches exactly

### Styles not applying
- Run `pnpm install` to ensure Tailwind and dependencies are installed
- Check that CSS is being generated in `.next/` folder
- Clear browser cache if needed

## Future Enhancements

- Add search functionality for departments/cities
- Implement zoom level-based feature visibility
- Add more metadata to info panel (population, area, etc.)
- Export map as image
- Multi-language support

## License

Internal use only. See project repository for details.

## Questions?

Refer to the component source code for detailed implementation notes. Each component is well-documented with TypeScript types and comments.
