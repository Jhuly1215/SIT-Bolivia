# Bolivia Urban Regulation Explorer — seed map datasets

Archivos incluidos:
- `bolivia_departments_simplified.geojson`: polígonos simplificados de los 9 departamentos.
- `bolivia_departments_meta.json`: metadatos por departamento (bbox y centro).
- `bolivia_major_cities_seed.json`: ciudades importantes por departamento con centro y bbox sugerido para zoom.
- `bolivia_major_cities_points.geojson`: puntos de ciudades para Leaflet.
- `bolivia_map_hierarchy_seed.json`: jerarquía Bolivia -> departamento -> ciudad.

Notas:
- Los departamentos sí usan geometrías reales.
- Las ciudades en esta versión son `seed centers` para navegación inicial. No son límites municipales oficiales ni polígonos urbanos legales.
- Si luego consigues límites municipales oficiales, reemplaza el archivo de ciudades por un GeoJSON de municipios o áreas urbanas.
