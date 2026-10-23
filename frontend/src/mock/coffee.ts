export interface CoffeePriceData {
  id: string
  region: string
  price: number
  change: number
  isUp: boolean
  updatedAt: string
}

export const COFFEE_PRICES: CoffeePriceData[] = [
  { id: "1", region: "Đắk Lắk", price: 105400, change: 1200, isUp: true, updatedAt: "10/07/2026" },
  { id: "2", region: "Lâm Đồng", price: 104800, change: 800, isUp: true, updatedAt: "10/07/2026" },
  { id: "3", region: "Gia Lai", price: 105200, change: -200, isUp: false, updatedAt: "10/07/2026" },
  { id: "4", region: "Đắk Nông", price: 105500, change: 1500, isUp: true, updatedAt: "10/07/2026" },
  { id: "5", region: "Kon Tum", price: 105100, change: 0, isUp: true, updatedAt: "10/07/2026" },
]

export const COFFEE_HISTORY = [
  { date: "01/07", price: 98000 },
  { date: "02/07", price: 99500 },
  { date: "03/07", price: 101000 },
  { date: "04/07", price: 100500 },
  { date: "05/07", price: 102000 },
  { date: "06/07", price: 104000 },
  { date: "07/07", price: 105400 },
]
