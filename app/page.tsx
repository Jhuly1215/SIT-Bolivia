'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import InfoPanel from '@/components/InfoPanel';
import Navbar from '@/components/Navbar';
import type { FeatureCollection } from 'geojson';
import { getCitiesByDepartment, generateMockZonesForCity, CityFeature } from '@/lib/mapUtils';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function Home() {
  const [departmentsGeoJSON, setDepartmentsGeoJSON] = useState<FeatureCollection | null>(null);
  const [citiesGeoJSON, setCitiesGeoJSON] = useState<FeatureCollection | null>(null);
  const [zonesGeoJSON, setZonesGeoJSON] = useState<FeatureCollection | null>(null);
  
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load GeoJSON data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [deptRes, citiesRes] = await Promise.all([
          fetch('/data/bolivia_departments_simplified.geojson'),
          fetch('/data/bolivia_major_cities_points.geojson'),
        ]);

        const deptData = await deptRes.json();
        const citiesData = await citiesRes.json();

        setDepartmentsGeoJSON(deptData);
        setCitiesGeoJSON(citiesData);
      } catch (error) {
        console.error('Error loading GeoJSON data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // When city changes, generate fake zones
  useEffect(() => {
    if (selectedCity && selectedDepartment && citiesGeoJSON) {
      const city = getCitiesByDepartment(citiesGeoJSON, selectedDepartment)
                     .find(c => c.properties.city === selectedCity);
      if (city) {
        setZonesGeoJSON(generateMockZonesForCity(city as CityFeature));
      } else {
        setZonesGeoJSON(null);
      }
    } else {
      setZonesGeoJSON(null);
    }
  }, [selectedCity, selectedDepartment, citiesGeoJSON]);

  const handleResetView = () => {
    setSelectedDepartment(null);
    setSelectedCity(null);
    setSelectedZone(null);
  };

  const handleSelectDepartment = (department: string | null) => {
    setSelectedDepartment(department);
    setSelectedCity(null);
    setSelectedZone(null);
  };

  const handleSelectCity = (city: string | null) => {
    setSelectedCity(city);
    setSelectedZone(null);
  };

  const handleSelectZone = (zone: string | null) => {
    setSelectedZone(zone);
  };

  const handleCloseInfoPanel = () => {
    if (selectedZone) {
      setSelectedZone(null);
    } else if (selectedCity) {
      setSelectedCity(null);
    } else if (selectedDepartment) {
      setSelectedDepartment(null);
    }
  };

  if (loading || !departmentsGeoJSON || !citiesGeoJSON) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading Bolivia Urban Regulation Explorer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-white font-sans text-gray-900">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          departmentsGeoJSON={departmentsGeoJSON}
          citiesGeoJSON={citiesGeoJSON}
          zonesGeoJSON={zonesGeoJSON}
          selectedDepartment={selectedDepartment}
          selectedCity={selectedCity}
          selectedZone={selectedZone}
          onSelectDepartment={handleSelectDepartment}
          onSelectCity={handleSelectCity}
          onSelectZone={handleSelectZone}
          onReset={handleResetView}
        />
        
        <main className="flex-1 relative h-full">
          <MapView
            departmentsGeoJSON={departmentsGeoJSON}
            citiesGeoJSON={citiesGeoJSON}
            zonesGeoJSON={zonesGeoJSON}
            selectedDepartment={selectedDepartment}
            selectedCity={selectedCity}
            selectedZone={selectedZone}
            onSelectDepartment={handleSelectDepartment}
            onSelectCity={handleSelectCity}
            onSelectZone={handleSelectZone}
          />
        </main>

        {(selectedDepartment || selectedCity || selectedZone) && (
          <InfoPanel
            departmentsGeoJSON={departmentsGeoJSON}
            citiesGeoJSON={citiesGeoJSON}
            zonesGeoJSON={zonesGeoJSON}
            selectedDepartment={selectedDepartment}
            selectedCity={selectedCity}
            selectedZone={selectedZone}
            onClose={handleCloseInfoPanel}
          />
        )}
      </div>
    </div>
  );
}
