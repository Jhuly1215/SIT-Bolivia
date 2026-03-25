'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection } from 'geojson';
import { getBoundsFromPolygon, getCitiesByDepartment } from '@/lib/mapUtils';
import type { DepartmentFeature, CityFeature, ZoneFeature } from '@/lib/mapUtils';

interface MapViewProps {
  departmentsGeoJSON: FeatureCollection | null;
  citiesGeoJSON: FeatureCollection | null;
  zonesGeoJSON: FeatureCollection | null;
  selectedDepartment: string | null;
  selectedCity: string | null;
  selectedZone: string | null;
  onSelectDepartment: (department: string | null) => void;
  onSelectCity: (city: string | null) => void;
  onSelectZone: (zone: string | null) => void;
}

export default function MapView({
  departmentsGeoJSON,
  citiesGeoJSON,
  zonesGeoJSON,
  selectedDepartment,
  selectedCity,
  selectedZone,
  onSelectDepartment,
  onSelectCity,
  onSelectZone,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const departmentLayersRef = useRef<Map<string, L.Layer>>(new Map());
  const cityMarkersRef = useRef<Map<number, L.CircleMarker>>(new Map());
  const cityBoundaryRef = useRef<L.Circle | null>(null);
  const zoneLayersRef = useRef<Map<string, L.Layer>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView([-17.5, -64], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 18,
    }).addTo(map.current);
    
    // Invalidate size once after mount to prevent grey tiles in split layout
    setTimeout(() => {
      map.current?.invalidateSize();
    }, 100);
  }, []);

  // Window resize observer
  useEffect(() => {
    if (!mapContainer.current || !map.current) return;
    const resizeObserver = new ResizeObserver(() => {
      map.current?.invalidateSize();
    });
    resizeObserver.observe(mapContainer.current);
    return () => resizeObserver.disconnect();
  }, []);

  // 1. Add department layers
  useEffect(() => {
    if (!map.current || !departmentsGeoJSON) return;

    // Clear existing
    departmentLayersRef.current.forEach(layer => map.current?.removeLayer(layer));
    departmentLayersRef.current.clear();

    departmentsGeoJSON.features.forEach((feature: any) => {
      const departmentFeature = feature as DepartmentFeature;
      const departmentName = departmentFeature.properties.name;

      const geoJsonLayer = L.geoJSON(departmentFeature, {
        style: () => {
          // If no department selected -> normal
          if (!selectedDepartment) {
            return { color: '#6b7280', weight: 1, opacity: 0.8, fillColor: '#3b82f6', fillOpacity: 0.15 };
          }
          // If this is the selected department -> strong border
          if (selectedDepartment === departmentName) {
            return { color: '#1d4ed8', weight: 2, opacity: 1, fillColor: '#eff6ff', fillOpacity: 0.3 };
          }
          // If other department -> dim
          return { color: '#e5e7eb', weight: 1, opacity: 0.4, fillColor: '#f9fafb', fillOpacity: 0.1 };
        },
        onEachFeature: (feature, layer) => {
          layer.on('click', () => {
            onSelectDepartment(departmentName);
          });
          layer.on('mouseover', () => {
            if (selectedDepartment !== departmentName) {
              (layer as any).setStyle({ fillOpacity: selectedDepartment ? 0.15 : 0.25 });
            }
          });
          layer.on('mouseout', () => {
            if (selectedDepartment !== departmentName) {
              (layer as any).setStyle({ fillOpacity: selectedDepartment ? 0.1 : 0.15 });
            }
          });
        },
      }).addTo(map.current!);

      departmentLayersRef.current.set(departmentName, geoJsonLayer);
    });
  }, [departmentsGeoJSON, selectedDepartment, onSelectDepartment]);

  // 2. Add city markers when department is selected
  useEffect(() => {
    if (!map.current) return;
    
    cityMarkersRef.current.forEach(marker => marker.remove());
    cityMarkersRef.current.clear();
    
    if (!citiesGeoJSON || !selectedDepartment) return;

    const cities = getCitiesByDepartment(citiesGeoJSON, selectedDepartment);

    cities.forEach((feature: any) => {
      const cityFeature = feature as CityFeature;
      const [lng, lat] = (cityFeature.geometry as any).coordinates;
      const cityName = cityFeature.properties.city;
      const id = cityFeature.properties.id;

      const marker = L.circleMarker([lat, lng], {
        radius: selectedCity === cityName ? 6 : 5,
        fillColor: selectedCity === cityName ? '#2563eb' : '#fff',
        color: selectedCity === cityName ? '#1e3a8a' : '#3b82f6',
        weight: selectedCity === cityName ? 3 : 2,
        opacity: 1,
        fillOpacity: 1,
      })
        .bindTooltip(cityName, { direction: 'top', offset: [0, -10] })
        .on('click', () => {
          onSelectCity(cityName);
        })
        .addTo(map.current!);

      cityMarkersRef.current.set(id, marker);
    });
  }, [citiesGeoJSON, selectedDepartment, selectedCity, onSelectCity]);

  // 3. Add visible boundary for selected City
  useEffect(() => {
    if (!map.current) return;
    
    if (cityBoundaryRef.current) {
      cityBoundaryRef.current.remove();
      cityBoundaryRef.current = null;
    }

    if (!selectedCity || !selectedDepartment || !citiesGeoJSON) return;

    const cityFeature = (citiesGeoJSON.features as any[]).find(
      (f: any) => f.properties.city === selectedCity && f.properties.department === selectedDepartment
    ) as CityFeature;

    if (cityFeature) {
      const [lng, lat] = (cityFeature.geometry as any).coordinates;
      // Define a fake visible circle boundary for the city area (approx 4km radius)
      cityBoundaryRef.current = L.circle([lat, lng], {
        radius: 4000,
        color: '#3b82f6',
        weight: 2,
        dashArray: '5, 5',
        fillColor: '#bfdbfe',
        fillOpacity: 0.15,
        interactive: false
      }).addTo(map.current);
    }
  }, [selectedCity, selectedDepartment, citiesGeoJSON]);

  // 4. Render Zones
  useEffect(() => {
    if (!map.current) return;

    zoneLayersRef.current.forEach(layer => layer.remove());
    zoneLayersRef.current.clear();

    if (!zonesGeoJSON || !selectedCity) return;

    zonesGeoJSON.features.forEach((feature: any) => {
      const zone = feature as ZoneFeature;
      const isSelected = selectedZone === zone.properties.id;

      const layer = L.geoJSON(zone, {
        style: () => {
          return {
            color: zone.properties.color,
            weight: isSelected ? 3 : 1,
            opacity: isSelected ? 1 : 0.8,
            fillColor: zone.properties.color,
            fillOpacity: isSelected ? 0.6 : 0.35,
          };
        },
        onEachFeature: (f, l) => {
          l.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            onSelectZone(zone.properties.id);
          });
          l.bindTooltip(zone.properties.name, { sticky: true });
          
          l.on('mouseover', () => {
            if (selectedZone !== zone.properties.id) {
              (l as any).setStyle({ fillOpacity: 0.5, weight: 2 });
            }
          });
          l.on('mouseout', () => {
            if (selectedZone !== zone.properties.id) {
              (l as any).setStyle({ fillOpacity: 0.35, weight: 1 });
            }
          });
        }
      }).addTo(map.current!);

      zoneLayersRef.current.set(zone.properties.id, layer);
    });
  }, [zonesGeoJSON, selectedCity, selectedZone, onSelectZone]);

  // Map Navigation: Zoom to selected department or city
  useEffect(() => {
    if (!map.current || !departmentsGeoJSON) return;

    // Zoom to City if selected
    if (selectedCity && selectedDepartment && citiesGeoJSON) {
      const cityFeature = (citiesGeoJSON.features as any[]).find(
        (f: any) => f.properties.city === selectedCity && f.properties.department === selectedDepartment
      ) as CityFeature;

      if (cityFeature) {
        const [lng, lat] = (cityFeature.geometry as any).coordinates;
        map.current.setView([lat, lng], 13, { animate: true, duration: 0.5 });
      }
      return; // Stop here, city takes precedence
    }

    // Zoom to Department if selected
    if (selectedDepartment) {
      const feature = departmentsGeoJSON.features.find(
        (f: any) => f.properties.name === selectedDepartment
      ) as DepartmentFeature;

      if (feature) {
        const bounds = getBoundsFromPolygon(feature);
        map.current.fitBounds(bounds, { padding: [20, 20], maxZoom: 10, animate: true });
      }
      return;
    }

    // Otherwise show Bolivia
    map.current.setView([-17.5, -64], 5, { animate: true });

  }, [selectedDepartment, selectedCity, departmentsGeoJSON, citiesGeoJSON]);

  // Ensure map clicks de-select zone (if clicked outside)
  useEffect(() => {
    if (!map.current) return;
    
    const handleMapClick = () => {
      if (selectedZone) onSelectZone(null);
    };

    map.current.on('click', handleMapClick);
    return () => {
      map.current?.off('click', handleMapClick);
    };
  }, [selectedZone, onSelectZone]);

  return (
    <div ref={mapContainer} className="w-full h-full bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
  );
}
