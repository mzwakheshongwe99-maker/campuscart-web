'use client';

import React, { useState } from 'react';
import { X, MapPin, Check, Building2 } from 'lucide-react';
import { INITIAL_UNIVERSITIES, INITIAL_CAMPUSES } from '@/lib/constants/campuses';
import { useCampusStore } from '@/store/useCampusStore';
import { Campus } from '@/types';

interface CampusSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CampusSelectorModal: React.FC<CampusSelectorModalProps> = ({ isOpen, onClose }) => {
  const { selectedCampus, setCampus } = useCampusStore();
  const [activeUniversityId, setActiveUniversityId] = useState<string>(selectedCampus.universityId);

  if (!isOpen) return null;

  const filteredCampuses = INITIAL_CAMPUSES.filter(
    (c) => c.universityId === activeUniversityId
  );

  const handleSelectCampus = (campus: Campus) => {
    setCampus(campus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Select Your Campus
            </h2>
            <p className="text-xs text-gray-500">
              CampusCart connects you to student sellers on your campus.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* UNIVERSITY TABS */}
        <div className="p-3 bg-gray-100/60 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-gray-200/60">
          {INITIAL_UNIVERSITIES.map((uni) => {
            const isSelected = activeUniversityId === uni.id;
            return (
              <button
                key={uni.id}
                onClick={() => setActiveUniversityId(uni.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200/60'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                {uni.code}
              </button>
            );
          })}
        </div>

        {/* CAMPUSES LIST */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Available Campuses for {INITIAL_UNIVERSITIES.find((u) => u.id === activeUniversityId)?.name}
          </p>

          {filteredCampuses.map((campus) => {
            const isCurrent = campus.id === selectedCampus.id;
            return (
              <div
                key={campus.id}
                onClick={() => handleSelectCampus(campus)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                    : 'bg-white border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/20'
                }`}
              >
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{campus.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {campus.deliveryLocations.length} drop-off meeting points available
                  </p>
                </div>
                {isCurrent && (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Don&apos;t see your institution? More South African campuses coming soon!
          </p>
        </div>

      </div>
    </div>
  );
};
