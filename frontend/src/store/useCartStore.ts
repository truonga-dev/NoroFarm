import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  unit: string
  image_url: string | null
  stock: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: any, quantity: number) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === product.id)
          if (existingItem) {
            // Check stock limit
            const newQuantity = Math.min(existingItem.quantity + quantity, product.stock)
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: newQuantity } : i
              ),
            }
          }
          return {
            items: [...state.items, {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: Math.min(quantity, product.stock),
              unit: product.unit,
              image_url: product.image_url,
              stock: product.stock
            }],
          }
        })
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }))
      },
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id === id) {
              return { ...i, quantity: Math.min(Math.max(1, quantity), i.stock) }
            }
            return i
          }),
        }))
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      }
    }),
    {
      name: 'norofarm-cart', // local storage key
    }
  )
)
