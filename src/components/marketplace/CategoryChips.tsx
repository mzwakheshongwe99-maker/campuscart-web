'use client';

import React from 'react';
import { INITIAL_CATEGORIES } from '@/lib/constants/categories';

interface CategoryChipsProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1">
      {INITIAL_CATEGORIES.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              isSelected
                ? 'bg-gray-900 text-white shadow-sm scale-102'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/80 shadow-2xs'
            }`}
          >
            <span className="text-base leading-none">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
