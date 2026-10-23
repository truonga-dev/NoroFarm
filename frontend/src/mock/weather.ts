export const WEATHER_CURRENT = {
  temp: 28,
  condition: "Nắng nhẹ",
  humidity: 75,
  wind: 12,
  rain: 0,
  uv: 6,
  pressure: 1012,
  sunrise: "05:30",
  sunset: "18:15",
  location: "TP. Buôn Ma Thuột, Đắk Lắk"
}

export const WEATHER_HOURLY = [
  { time: "08:00", temp: 24, icon: "sun" },
  { time: "10:00", temp: 26, icon: "sun" },
  { time: "12:00", temp: 29, icon: "sun" },
  { time: "14:00", temp: 31, icon: "cloud" },
  { time: "16:00", temp: 28, icon: "rain" },
  { time: "18:00", temp: 26, icon: "cloud" },
]

export const WEATHER_DAILY = [
  { day: "Thứ 2", tempMax: 30, tempMin: 22, icon: "sun" },
  { day: "Thứ 3", tempMax: 31, tempMin: 23, icon: "sun" },
  { day: "Thứ 4", tempMax: 28, tempMin: 22, icon: "rain" },
  { day: "Thứ 5", tempMax: 29, tempMin: 22, icon: "cloud" },
  { day: "Thứ 6", tempMax: 32, tempMin: 24, icon: "sun" },
  { day: "Thứ 7", tempMax: 33, tempMin: 25, icon: "sun" },
  { day: "CN", tempMax: 30, tempMin: 23, icon: "cloud" },
]
