import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, SellerProfile } from '@/types';
import { MOCK_SELLERS } from '@/lib/mock-data';

interface AuthState {
  user: UserProfile | null;
  sellerProfile: SellerProfile | null;
  isAuthenticated: boolean;
  loginAsBuyer: (name?: string, email?: string) => void;
  loginAsSeller: (storeName?: string) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  updateSellerProfile: (data: Partial<SellerProfile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: 'demo-buyer-id',
        email: 'sipho@student.cput.ac.za',
        fullName: 'Sipho Zulu',
        role: 'buyer',
        isSeller: false,
        universityId: 'cput',
        campusId: 'cput-bellville',
        createdAt: new Date().toISOString(),
      },
      sellerProfile: null,
      isAuthenticated: true,

      loginAsBuyer: (name = 'Sipho Zulu', email = 'sipho@student.cput.ac.za') => {
        set({
          user: {
            id: 'demo-buyer-id',
            email,
            fullName: name,
            role: 'buyer',
            isSeller: false,
            universityId: 'cput',
            campusId: 'cput-bellville',
            createdAt: new Date().toISOString(),
          },
          sellerProfile: null,
          isAuthenticated: true,
        });
      },

      loginAsSeller: (storeName = 'Student Bites') => {
        const mockSeller = MOCK_SELLERS.find((s) => s.storeName === storeName) || MOCK_SELLERS[0];
        set({
          user: {
            id: mockSeller.userId,
            email: 'seller@campuscart.co.za',
            fullName: 'Lebo Mathosa',
            role: 'seller',
            isSeller: true,
            universityId: 'cput',
            campusId: mockSeller.campusId,
            createdAt: new Date().toISOString(),
          },
          sellerProfile: mockSeller,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          sellerProfile: null,
          isAuthenticated: false,
        });
      },

      updateUserProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      updateSellerProfile: (data) => {
        set((state) => ({
          sellerProfile: state.sellerProfile ? { ...state.sellerProfile, ...data } : null,
        }));
      },
    }),
    {
      name: 'campuscart-auth-session',
    }
  )
);
