import { apiClient } from "../client"

export const notificationService = {
  getNotifications: async (skip: number = 0, limit: number = 20) => {
    return apiClient.get("/notifications", { skip, limit })
  },
  
  markAsRead: async (id: number) => {
    return apiClient.post(`/notifications/${id}/read`)
  },
  
  markAllAsRead: async () => {
    return apiClient.post("/notifications/read-all")
  },

  // Price Alerts
  getPriceAlerts: async () => {
    return apiClient.get("/notifications/alerts")
  },

  createPriceAlert: async (data: { commodity_id: number, target_price: number, condition: string }) => {
    return apiClient.post("/notifications/alerts", data)
  },

  deletePriceAlert: async (id: number) => {
    return apiClient.delete(`/notifications/alerts/${id}`)
  },

  togglePriceAlert: async (id: number) => {
    return apiClient.patch(`/notifications/alerts/${id}/toggle`)
  },

  evaluatePriceAlerts: async () => {
    return apiClient.post("/notifications/alerts/evaluate")
  },

  subscribePush: async (sub: any) => {
    return apiClient.post("/notifications/push/subscribe", sub)
  },

  getVapidKey: async () => {
    return apiClient.get<{ public_key: string }>("/notifications/push/vapid-key")
  }
}
