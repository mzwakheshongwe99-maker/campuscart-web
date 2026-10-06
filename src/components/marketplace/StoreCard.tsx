'use client';

import React from 'react';
import Image from 'next/image';
import { Star, MapPin, CheckCircle2 } from 'lucide-react';
import { SellerProfile } from '@/types';

interface StoreCardProps {
  seller: SellerProfile;
  onClick?: (seller: SellerProfile) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ seller, onClick }) => {
  return (
    <div
      onClick={() => onClick && onClick(seller)}
      className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all p-3.5 flex items-center gap-3.5 cursor-pointer"
    >
      {/* LOGO */}
      <div className="relative w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
        <Image
          src={seller.logoUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80'}
          alt={seller.storeName}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      {/* INFO */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="font-bold text-gray-900 text-sm truncate">{seller.storeName}</h3>
          {seller.isOpen && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md shrink-0">
              <CheckCircle2 className="w-2.5 h-2.5" /> Open
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{seller.bio}</p>

        <div className="flex items-center gap-3 text-xs text-gray-600 mt-2">
          <div className="flex items-center gap-1 font-bold text-gray-900">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{seller.ratingAvg.toFixed(1)}</span>
            <span className="text-gray-400 font-normal">({seller.ratingCount})</span>
          </div>

          <div className="flex items-center gap-1 text-gray-500 truncate text-[11px]">
            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">{seller.campusName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
