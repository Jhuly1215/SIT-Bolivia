'use client';

import { X, Building2, MapPin, Layers, Users, TrendingUp, ShieldAlert, BookOpen, ChevronRight } from 'lucide-react';
import type { FeatureCollection } from 'geojson';
import { getCitiesByDepartment, ZoneFeature } from '@/lib/mapUtils';

interface InfoPanelProps {
  departmentsGeoJSON: FeatureCollection | null;
  citiesGeoJSON: FeatureCollection | null;
  zonesGeoJSON: FeatureCollection | null;
  selectedDepartment: string | null;
  selectedCity: string | null;
  selectedZone: string | null;
  onClose: () => void;
}

export default function InfoPanel({
  departmentsGeoJSON,
  citiesGeoJSON,
  zonesGeoJSON,
  selectedDepartment,
  selectedCity,
  selectedZone,
  onClose
}: InfoPanelProps) {
  if (!selectedDepartment) return null;

  // Render Zone Info
  if (selectedZone && zonesGeoJSON) {
    const zone = (zonesGeoJSON.features as ZoneFeature[]).find(z => z.properties.id === selectedZone);
    if (!zone) return null;

    return (
      <div className="w-[420px] h-full bg-white border-l border-gray-200 shadow-2xl flex flex-col z-20 shrink-0 relative">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white relative">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50/80 text-blue-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-gray-900 leading-tight">{zone.properties.name}</h2>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">{zone.properties.type}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors absolute right-4 top-4">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-50/80">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Destino</span>
              <span className="text-[15px] font-bold text-gray-800">{zone.properties.regulations.landUse.includes('Commercial') ? 'Vivienda/Comercio' : zone.properties.regulations.landUse}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50/80">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Patrón</span>
              <span className="text-[15px] font-bold text-blue-600">IMP2</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50/80">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Altura Máxima</span>
              <span className="text-[15px] font-bold text-gray-800">{zone.properties.regulations.maxHeight.includes('5') ? '5 pisos' : zone.properties.regulations.maxHeight}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50/80">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Densidad</span>
              <span className="text-[15px] font-bold text-gray-800">{zone.properties.regulations.density}</span>
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-bold text-gray-400 mb-4 uppercase tracking-wider">Normativa Asociada</h3>
            <div className="space-y-2.5">
              {[
                'Ley Municipal de Uso de Suelos',
                'Reglamento de Edificaciones',
                'Plan de Ordenamiento Territorial'
              ].map((doc, idx) => (
                <div key={idx} className="bg-white border-2 border-gray-100 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-400 hover:shadow-[0_4px_12px_-4px_rgba(59,130,246,0.3)] transition-all group">
                  <span className="text-[14px] font-bold text-gray-700 group-hover:text-blue-700">{doc}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-colors shadow-md">
            <BookOpen className="w-5 h-5" />
            <span className="text-[15px]">Ver Documento Completo</span>
          </button>
        </div>
      </div>
    );
  }

  // Render City Info
  if (selectedCity && citiesGeoJSON) {
    const city = getCitiesByDepartment(citiesGeoJSON, selectedDepartment).find(c => c.properties.city === selectedCity);
    if (!city) return null;

    return (
      <div className="w-[420px] h-full bg-white border-l border-gray-200 shadow-xl flex flex-col z-20 shrink-0">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-blue-50/30 relative">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-gray-900 leading-tight">{selectedCity}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors absolute right-4 top-4">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h3 className="text-[12px] font-bold text-gray-400 mb-4 uppercase tracking-widest">Overview</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Rank</span>
                <span className="block text-[14px] font-bold text-gray-800 capitalize">{city.properties.rank}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Role</span>
                <span className="block text-[14px] font-bold text-gray-800 capitalize">{city.properties.role.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[12px] font-bold text-gray-400 mb-4 uppercase tracking-widest">Simulated Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                <div className="flex items-center gap-3 text-gray-500 font-medium">
                  <Users className="w-4 h-4" />
                  <span className="text-[14px]">Population</span>
                </div>
                <span className="text-[15px] font-bold text-gray-900">~{Math.floor(Math.random() * 500) + 100}k</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                <div className="flex items-center gap-3 text-gray-500 font-medium">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[14px]">Growth Rate</span>
                </div>
                <span className="text-[15px] font-bold text-emerald-600">+{Math.floor(Math.random() * 5) + 1}.2%</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-orange-100 rounded-xl bg-orange-50/50">
                <div className="flex items-center gap-3 text-orange-700 font-medium">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[14px]">Urban Risk</span>
                </div>
                <span className="text-[15px] font-bold text-orange-700">Moderate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Department Info
  const citiesCount = citiesGeoJSON ? getCitiesByDepartment(citiesGeoJSON, selectedDepartment).length : 0;
  
  return (
    <div className="w-[420px] h-full bg-white border-l border-gray-200 shadow-xl flex flex-col z-20 shrink-0">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 relative">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-200 text-gray-600 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-gray-900 leading-tight">{selectedDepartment}</h2>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors absolute right-4 top-4">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-blue-50/80 border-2 border-blue-100 rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white text-blue-500 rounded-lg shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[14px] font-bold text-blue-900">Major Cities</span>
              <span className="block text-[12px] font-medium text-blue-700">in {selectedDepartment}</span>
            </div>
          </div>
          <span className="text-2xl font-black text-blue-600">{citiesCount}</span>
        </div>
      </div>
    </div>
  );
}
