'use client';

import React from 'react';
import { Home, Search, ShoppingBag, MessageSquare, Store } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

interface BottomNavProps {
  activeTab: 'home' | 'search' | 'orders' | 'chat' | 'seller';
  onTabChange: (tab: 'home' | 'search' | 'orders' | 'chat' | 'seller') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuthStore();
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  const navItems: Array<{
    id: 'home' | 'search' | 'orders' | 'chat' | 'seller';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: itemCount },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    {
      id: 'seller',
      label: user?.role === 'seller' ? 'Dashboard' : 'Sell',
      icon: Store,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200/80 shadow-lg md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 transition-all cursor-pointer ${
                isActive ? 'text-emerald-600 font-bold' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-gray-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
