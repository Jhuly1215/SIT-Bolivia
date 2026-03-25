'use client';

import { 
  Building2, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Layers
} from 'lucide-react';
import { useState, useMemo } from 'react';
import type { FeatureCollection } from 'geojson';
import type { DepartmentFeature, ZoneFeature } from '@/lib/mapUtils';
import { getCitiesByDepartment } from '@/lib/mapUtils';

interface SidebarProps {
  departmentsGeoJSON: FeatureCollection | null;
  citiesGeoJSON: FeatureCollection | null;
  zonesGeoJSON: FeatureCollection | null;
  selectedDepartment: string | null;
  selectedCity: string | null;
  selectedZone: string | null;
  onSelectDepartment: (dept: string | null) => void;
  onSelectCity: (city: string | null) => void;
  onSelectZone: (zone: string | null) => void;
  onReset: () => void;
}

export default function Sidebar({
  departmentsGeoJSON,
  citiesGeoJSON,
  zonesGeoJSON,
  selectedDepartment,
  selectedCity,
  selectedZone,
  onSelectDepartment,
  onSelectCity,
  onSelectZone,
  onReset
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  // Departments
  const departments = useMemo(() => {
    if (!departmentsGeoJSON) return [];
    return departmentsGeoJSON.features.map(f => (f as DepartmentFeature).properties.name).sort();
  }, [departmentsGeoJSON]);

  // Cities for the expanded department
  const cities = useMemo(() => {
    if (!citiesGeoJSON || !expandedDept) return [];
    return getCitiesByDepartment(citiesGeoJSON, expandedDept).map(c => c.properties.city).sort();
  }, [citiesGeoJSON, expandedDept]);

  // Filter departments based on search
  const filteredDepartments = useMemo(() => {
    return departments.filter(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [departments, searchTerm]);

  const handleDeptClick = (dept: string) => {
    const isExpanding = expandedDept !== dept;
    setExpandedDept(isExpanding ? dept : null);
    if (isExpanding) {
      onSelectDepartment(dept);
    } else {
      onSelectDepartment(null);
    }
  };

  return (
    <div className="w-[340px] h-full bg-white border-r border-gray-100 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.1)] flex flex-col z-20 shrink-0">
      
      {/* Search Header */}
      <div className="p-4 py-5">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Buscar departamento o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Hierarchy List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredDepartments.map(dept => {
          const isDeptExpanded = expandedDept === dept;
          const isDeptSelected = selectedDepartment === dept;

          return (
            <div key={dept} className="mb-1">
              <div 
                onClick={() => handleDeptClick(dept)}
                className={`flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                  isDeptExpanded ? 'bg-blue-50/60' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Status Dot */}
                  <div className={`w-1.5 h-1.5 rounded-full ${isDeptExpanded ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  
                  <span className={`text-[15px] ${isDeptExpanded ? 'font-semibold text-blue-700' : 'font-medium text-gray-600'}`}>
                    {dept}
                  </span>
                </div>
                {isDeptExpanded ? (
                  <ChevronDown className="w-4 h-4 text-blue-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>

              {/* Cities List */}
              {isDeptExpanded && (
                <div className="mt-4 mb-2">
                  <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-3">
                    Ciudades en {dept}
                  </h3>
                  
                  <div className="space-y-1">
                    {cities.length === 0 ? (
                      <div className="text-sm text-gray-400 px-3 py-2">No data</div>
                    ) : (
                      cities.map(city => {
                        const isCitySelected = selectedCity === city;
                        return (
                          <div key={city}>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectCity(isCitySelected ? null : city);
                              }}
                              className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${
                                isCitySelected 
                                  ? 'bg-blue-600 text-white shadow-md' 
                                  : 'text-gray-700 hover:bg-gray-100 font-medium'
                              }`}
                            >
                              <div className={`flex items-center justify-center p-1.5 rounded-lg ${isCitySelected ? 'bg-white/20' : 'bg-gray-200 text-blue-600'}`}>
                                <Building2 className={`w-4 h-4 ${isCitySelected ? 'text-white' : 'text-blue-600'}`} />
                              </div>
                              <span className="text-[15px] font-semibold">{city}</span>
                            </div>
                            
                            {/* Zones List (if city is selected) */}
                            {isCitySelected && zonesGeoJSON && (
                              <div className="pl-5 pr-2 py-2 mt-2 ml-4 border-l-2 border-gray-100 space-y-1.5">
                                {(zonesGeoJSON.features as ZoneFeature[]).map(zone => {
                                  const isZoneSelected = selectedZone === zone.properties.id;
                                  return (
                                    <div
                                      key={zone.properties.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectZone(isZoneSelected ? null : zone.properties.id);
                                      }}
                                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                                        isZoneSelected 
                                          ? 'bg-purple-100/80 text-purple-800 shadow-sm' 
                                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                      }`}
                                    >
                                      <Layers className="w-4 h-4" style={{ color: zone.properties.color }} />
                                      <span className="text-sm font-medium truncate">{zone.properties.name}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
