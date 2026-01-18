import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  image: string | null;
  sku: string;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  couponCode: string | null;
  discount: number;
  total: number;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,
      couponCode: null,
      discount: 0,
      total: 0,

      addItem: (item, quantity = 1) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (i) => i.variantId === item.variantId
        );

        let newItems: CartItem[];
        if (existingIndex >= 0) {
          newItems = [...items];
          newItems[existingIndex].quantity += quantity;
        } else {
          newItems = [...items, { ...item, quantity }];
        }

        const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
        const subtotal = newItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        const { discount } = get();
        const total = Math.max(0, subtotal - discount);

        set({ items: newItems, itemCount, subtotal, total });
      },

      updateQuantity: (variantId, quantity) => {
        const { items } = get();
        const newItems = items
          .map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
          .filter((item) => item.quantity > 0);

        const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
        const subtotal = newItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        const { discount } = get();
        const total = Math.max(0, subtotal - discount);

        set({ items: newItems, itemCount, subtotal, total });
      },

      removeItem: (variantId) => {
        const { items } = get();
        const newItems = items.filter((item) => item.variantId !== variantId);

        const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
        const subtotal = newItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        const { discount } = get();
        const total = Math.max(0, subtotal - discount);

        set({ items: newItems, itemCount, subtotal, total });
      },

      clearCart: () => {
        set({
          items: [],
          itemCount: 0,
          subtotal: 0,
          couponCode: null,
          discount: 0,
          total: 0,
        });
      },

      applyCoupon: (code, discount) => {
        const { subtotal } = get();
        const total = Math.max(0, subtotal - discount);
        set({ couponCode: code, discount, total });
      },

      removeCoupon: () => {
        const { subtotal } = get();
        set({ couponCode: null, discount: 0, total: subtotal });
      },
    }),
    {
      name: 'silvaniya-cart',
    }
  )
);
