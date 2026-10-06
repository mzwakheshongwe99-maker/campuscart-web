'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Star, Clock, Store } from 'lucide-react';
import { Product } from '@/types';
import { formatZAR } from '@/services/finance';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <div
      onClick={() => onProductClick && onProductClick(product)}
      className="group bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* TAG BADGE */}
        {product.tag && (
          <span className="absolute top-2.5 left-2.5 bg-gray-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase">
            {product.tag}
          </span>
        )}

        {/* RATING BADGE */}
        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-gray-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>{product.sellerRating.toFixed(1)}</span>
        </div>

        {/* ETA BADGE */}
        <div className="absolute bottom-2.5 left-2.5 bg-emerald-950/80 backdrop-blur-xs text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{product.eta}</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* SELLER NAME */}
          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium mb-1 truncate">
            <Store className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate hover:underline">{product.sellerName}</span>
          </div>

          {/* PRODUCT NAME */}
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>

          {/* DESCRIPTION */}
          <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-normal">
            {product.description}
          </p>
        </div>

        {/* PRICE & ADD BUTTON */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-50">
          <div>
            <span className="text-xs text-gray-400 font-medium block text-[10px] uppercase tracking-wider">
              Price
            </span>
            <span className="text-base font-black text-emerald-700 tracking-tight">
              {formatZAR(product.priceCents)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
