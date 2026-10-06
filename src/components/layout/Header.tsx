'use client';

import React, { useState } from 'react';
import { ShoppingBag, MapPin, Store } from 'lucide-react';
import { useCampusStore } from '@/store/useCampusStore';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CampusSelectorModal } from './CampusSelectorModal';
import { CartDrawer } from '../checkout/CartDrawer';

export const Header: React.FC = () => {
  const { selectedCampus } = useCampusStore();
  const { getItemCount } = useCartStore();
  const { user, loginAsSeller, loginAsBuyer } = useAuthStore();

  const [isCampusModalOpen, setIsCampusModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const itemCount = getItemCount();

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">

            {/* LOGO & BRAND */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-200">
                CC
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-black text-gray-900 tracking-tight">
                  Campus<span className="text-emerald-600">Cart</span>
                </span>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider -mt-1">
                  South Africa Student Marketplace
                </p>
              </div>
            </div>

            {/* CAMPUS SELECTOR BUTTON */}
            <button
              onClick={() => setIsCampusModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/60 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">
                {selectedCampus.name}
              </span>
              <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                {selectedCampus.universityName}
              </span>
            </button>

            {/* ACTION BUTTONS (Cart, Role Switcher, Profile) */}
            <div className="flex items-center gap-2">
              {/* Role Toggle Button */}
              {user?.role === 'seller' ? (
                <button
                  onClick={() => loginAsBuyer()}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-all"
                >
                  Switch to Buyer
                </button>
              ) : (
                <button
                  onClick={() => loginAsSeller('Student Bites')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  <Store className="w-3.5 h-3.5" />
                  Seller Mode
                </button>
              )}

              {/* CART BUTTON */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-gray-900 text-white hover:bg-emerald-700 transition-all shadow-sm cursor-pointer"
                aria-label="View Basket"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-gray-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs border-2 border-white animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CAMPUS SELECTOR MODAL */}
      <CampusSelectorModal
        isOpen={isCampusModalOpen}
        onClose={() => setIsCampusModalOpen(false)}
      />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};
