import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Campus } from '@/types';
import { INITIAL_CAMPUSES } from '@/lib/constants/campuses';

interface CampusState {
  selectedCampus: Campus;
  selectedDeliveryLocationId: string | null;
  customInstructions: string;
  setCampus: (campus: Campus) => void;
  setDeliveryLocationId: (locationId: string) => void;
  setCustomInstructions: (instructions: string) => void;
}

export const useCampusStore = create<CampusState>()(
  persist(
    (set) => ({
      selectedCampus: INITIAL_CAMPUSES[0], // Default to CPUT Bellville Campus
      selectedDeliveryLocationId: INITIAL_CAMPUSES[0].deliveryLocations[0].id,
      customInstructions: '',
      setCampus: (campus) =>
        set({
          selectedCampus: campus,
          selectedDeliveryLocationId: campus.deliveryLocations[0]?.id || null,
        }),
      setDeliveryLocationId: (locationId) => set({ selectedDeliveryLocationId: locationId }),
      setCustomInstructions: (instructions) => set({ customInstructions: instructions }),
    }),
    {
      name: 'campuscart-selected-campus',
    }
  )
);
