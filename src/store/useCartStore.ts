import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, FeeBreakdown } from '@/types';
import { calculateOrderFees } from '@/services/finance';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotalCents: () => number;
  getFeeBreakdown: () => FeeBreakdown;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.product.id === product.id);

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex].quantity += quantity;
          set({ items: updated });
        } else {
          set({ items: [...currentItems, { product, quantity }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getSubtotalCents: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.priceCents * item.quantity,
          0
        );
      },
      getFeeBreakdown: () => {
        const subtotal = get().getSubtotalCents();
        return calculateOrderFees(subtotal);
      },
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'campuscart-shopping-cart',
    }
  )
);
