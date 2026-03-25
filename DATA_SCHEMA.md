# Bolivia Map Data Schema

This document describes the GeoJSON structure used in the Bolivia Urban Regulation Explorer.

## Department Boundaries: `bolivia_departments_simplified.geojson`

A **FeatureCollection** of 9 Polygon features representing the departments of Bolivia.

### Feature Structure

```json
{
  "type": "Feature",
  "properties": {
    "id": "LP",
    "name": "La Paz"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[lng, lat], [lng, lat], ...]]
  }
}
```

### Properties

| Property | Type   | Description                    |
|----------|--------|--------------------------------|
| `id`     | string | 2-letter department code (LP, CB, SC, etc.) |
| `name`   | string | Full department name in Spanish |

### Geometry

- **Type**: `Polygon`
- **Coordinates**: Array of rings (outer boundary + holes if any)
- **Format**: `[longitude, latitude]` per GeoJSON spec
- **Simplification**: Simplified for web performance (see filename)

### Example

```json
{
  "type": "Feature",
  "properties": {
    "id": "LP",
    "name": "La Paz"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-68.2736, -16.6351],
      [-68.2736, -16.3551],
      [-67.9936, -16.3551],
      [-67.9936, -16.6351],
      [-68.2736, -16.6351]
    ]]
  }
}
```

---

## City Points: `bolivia_major_cities_points.geojson`

A **FeatureCollection** of Point features representing major cities and urban centers.

### Feature Structure

```json
{
  "type": "Feature",
  "properties": {
    "id": 1,
    "department": "La Paz",
    "city": "La Paz",
    "slug": "la-paz",
    "rank": "primary",
    "role": "capital_departamental",
    "focus_bbox": [west, south, east, north]
  },
  "geometry": {
    "type": "Point",
    "coordinates": [lng, lat]
  }
}
```

### Properties

| Property     | Type            | Description |
|--------------|-----------------|-------------|
| `id`         | number          | Unique city identifier |
| `department` | string          | Parent department name (must match department GeoJSON) |
| `city`       | string          | City name |
| `slug`       | string          | URL-friendly city identifier (lowercase, hyphens) |
| `rank`       | string          | `"primary"` or `"secondary"` — importance level |
| `role`       | string          | Functional role (e.g., `"capital_departamental"`, `"metro_principal"`, `"industrial"`) |
| `focus_bbox` | [W, S, E, N]    | Bounding box for map centering `[west, south, east, north]` |

### Geometry

- **Type**: `Point`
- **Coordinates**: `[longitude, latitude]`
- **Represents**: City center or main urban area

### Rank Values

- `"primary"`: Capital cities and major urban centers
- `"secondary"`: Smaller cities and towns

### Role Values

Common roles in the dataset:

| Role | Description |
|------|-------------|
| `capital_departamental` | Department capital |
| `metro_principal` | Main metropolitan area |
| `metro_norte` | Northern metropolitan center |
| `industrial` | Industrial hub |

### Example

```json
{
  "type": "Feature",
  "properties": {
    "id": 1,
    "department": "La Paz",
    "city": "La Paz",
    "slug": "la-paz",
    "rank": "primary",
    "role": "capital_departamental",
    "focus_bbox": [-68.2736, -16.6351, -67.9936, -16.3551]
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-68.1336, -16.4951]
  }
}
```

---

## Data Validation Rules

### Department GeoJSON

✅ **Valid**:
- Exactly 9 features (one per department)
- Each has `id` (2-letter code) and `name` properties
- Coordinates form valid closed rings
- No self-intersecting polygons

❌ **Invalid**:
- Missing required properties
- Malformed rings (not closed)
- Overlapping polygons
- Null/undefined values

### City GeoJSON

✅ **Valid**:
- `department` value matches a `name` in department GeoJSON
- `id` is unique across all features
- `focus_bbox` forms a valid rectangle: `[west < east, south < north]`
- Coordinates are within Bolivia bounds: `[-70.5, -22.5, -57.5, -9.5]`

❌ **Invalid**:
- Department not found in department GeoJSON
- Duplicate `id` values
- Invalid bounding box (reversed coordinates)
- Point outside Bolivia (usually indicates data error)

---

## Coordinate System

All coordinates use **WGS84** (EPSG:4326):

- **Latitude**: -22.5° (south) to -9.5° (north)
- **Longitude**: -70.5° (west) to -57.5° (east)
- **Format**: `[longitude, latitude]` per GeoJSON RFC 7946

---

## Usage in Application

### Loading Data

```typescript
// Fetch from public/data/ folder
const response = await fetch('/data/bolivia_departments_simplified.geojson');
const geojson = await response.json();
```

### Filtering Cities by Department

```typescript
const citiesByDept = cities.features.filter(
  feature => feature.properties.department === 'La Paz'
);
```

### Extracting Bounds for Zoom

```typescript
// For department polygon
const bounds = [[minLat, minLng], [maxLat, maxLng]];
map.fitBounds(bounds);

// For city (using focus_bbox)
const [w, s, e, n] = city.properties.focus_bbox;
map.fitBounds([[s, w], [n, e]]);
```

### Styling Based on Properties

```typescript
const color = feature.properties.rank === 'primary' ? '#3b82f6' : '#60a5fa';
```

---

## Common Queries

### Q: How do I find all cities in a department?
```typescript
const cities = geojson.features.filter(f => 
  f.properties.department === 'Cochabamba'
);
```

### Q: How do I sort cities by importance?
```typescript
const sorted = cities.sort((a, b) => 
  (a.properties.rank === 'primary' ? 0 : 1) - 
  (b.properties.rank === 'primary' ? 0 : 1)
);
```

### Q: How do I center the map on a city?
```typescript
const [w, s, e, n] = city.properties.focus_bbox;
map.fitBounds([[s, w], [n, e]], { padding: [50, 50] });
```

### Q: What are the department codes?
The `id` field in department properties:
- `LP` — La Paz
- `CB` — Cochabamba
- `SC` — Santa Cruz
- `PT` — Potosí
- `OR` — Oruro
- `TJ` — Tarija
- `BN` — Beni
- `PD` — Pando
- `CH` — Chuquisaca

---

## Data Integrity

- ✅ All 9 departments included
- ✅ Major cities represented (20+ total)
- ✅ Coordinates accurate to ~1-2km
- ✅ Polygons validated with QGIS
- ✅ No orphaned cities (all have matching departments)

---

## Updates & Modifications

When modifying GeoJSON files:

1. **Validate** with a GeoJSON validator (geojsonlint.com)
2. **Test** in the application to ensure proper rendering
3. **Backup** original files before changes
4. **Document** any changes in a CHANGELOG

Example validation:
```bash
# Using Node.js
const fs = require('fs');
const geojson = JSON.parse(fs.readFileSync('file.geojson'));
console.log(`Features: ${geojson.features.length}`);
```
