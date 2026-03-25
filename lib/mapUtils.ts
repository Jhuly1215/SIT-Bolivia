import { LatLngBounds } from 'leaflet';
import type { Feature, FeatureCollection, Polygon } from 'geojson';

export interface DepartmentFeature extends Feature<Polygon> {
  properties: {
    id: string;
    name: string;
  };
}

export interface CityFeature extends Feature {
  properties: {
    id: number;
    department: string;
    city: string;
    slug: string;
    rank: string;
    role: string;
    focus_bbox: [number, number, number, number];
  };
}

/**
 * Extract bounds from a polygon feature
 */
export const getBoundsFromPolygon = (
  feature: any
): [[number, number], [number, number]] => {
  let minLat = 90;
  let maxLat = -90;
  let minLng = 180;
  let maxLng = -180;

  const processCoord = (coord: any[]) => {
    if (typeof coord[0] === 'number') {
      minLng = Math.min(minLng, coord[0]);
      maxLng = Math.max(maxLng, coord[0]);
      minLat = Math.min(minLat, coord[1]);
      maxLat = Math.max(maxLat, coord[1]);
    } else {
      coord.forEach(processCoord);
    }
  };

  processCoord(feature.geometry.coordinates);

  return [[minLat, minLng], [maxLat, maxLng]];
};

/**
 * Get bounds from city focus_bbox property
 */
export const getCityBounds = (feature: CityFeature): [[number, number], [number, number]] => {
  const [west, south, east, north] = feature.properties.focus_bbox;
  return [[south, west], [north, east]];
};

/**
 * Get all cities belonging to a department
 */
export const getCitiesByDepartment = (
  cities: FeatureCollection<any, any>,
  departmentName: string
): CityFeature[] => {
  return cities.features.filter(
    (feature) => feature.properties.department === departmentName
  ) as CityFeature[];
};

/**
 * Get Bolivia bounds (all departments)
 */
export const getBoliviaBounds = (departments: FeatureCollection<any, any>): [[number, number], [number, number]] => {
  let minLat = 90;
  let maxLat = -90;
  let minLng = 180;
  let maxLng = -180;

  departments.features.forEach((feature: any) => {
    const [[lat1, lng1], [lat2, lng2]] = getBoundsFromPolygon(feature as DepartmentFeature);
    minLat = Math.min(minLat, lat1, lat2);
    maxLat = Math.max(maxLat, lat1, lat2);
    minLng = Math.min(minLng, lng1, lng2);
    maxLng = Math.max(maxLng, lng1, lng2);
  });

  return [[minLat, minLng], [maxLat, maxLng]];
};

export interface ZoneFeature extends Feature<Polygon> {
  properties: {
    id: string;
    cityId: number;
    name: string;
    type: 'Residential' | 'Commercial' | 'Mixed Use';
    color: string;
    regulations: {
      maxHeight: string;
      landUse: string;
      density: string;
    };
  };
}

export const generateMockZonesForCity = (city: CityFeature): FeatureCollection<Polygon, ZoneFeature['properties']> => {
  const [lng, lat] = (city.geometry as any).coordinates as [number, number];
  const cityId = city.properties.id;
  
  const zones: ZoneFeature[] = [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [lng - 0.01, lat - 0.01],
          [lng + 0.01, lat - 0.01],
          [lng + 0.01, lat + 0.01],
          [lng - 0.01, lat + 0.01],
          [lng - 0.01, lat - 0.01]
        ]]
      },
      properties: {
        id: `${cityId}-z1`, cityId, name: 'Centro Histórico', type: 'Mixed Use', color: '#8b5cf6',
        regulations: { maxHeight: '5 floors', landUse: 'Commercial & Residential', density: 'High' }
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [lng + 0.01, lat - 0.01],
          [lng + 0.03, lat - 0.01],
          [lng + 0.03, lat + 0.02],
          [lng + 0.01, lat + 0.02],
          [lng + 0.01, lat - 0.01]
        ]]
      },
      properties: {
        id: `${cityId}-z2`, cityId, name: 'Distrito Comercial', type: 'Commercial', color: '#3b82f6',
        regulations: { maxHeight: '15 floors', landUse: 'Corporate & Retail', density: 'Medium' }
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [lng - 0.02, lat + 0.01],
          [lng + 0.01, lat + 0.01],
          [lng + 0.01, lat + 0.03],
          [lng - 0.02, lat + 0.03],
          [lng - 0.02, lat + 0.01]
        ]]
      },
      properties: {
        id: `${cityId}-z3`, cityId, name: 'Zona Residencial Norte', type: 'Residential', color: '#10b981',
        regulations: { maxHeight: '3 floors', landUse: 'Housing', density: 'Low' }
      }
    }
  ];

  return { type: 'FeatureCollection', features: zones } as FeatureCollection<Polygon, ZoneFeature['properties']>;
};
