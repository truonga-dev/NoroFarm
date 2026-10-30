"use client"

import { motion } from "framer-motion"
import { MapPin, Cloud, CloudRain, Wind, Droplets } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { weatherService } from "@/api/services/weather.service"
import { Skeleton } from "@/components/ui/skeleton"

export function WeatherPreview() {
  const locations = [
    { label: "Vị trí hiện tại", query: "" },
    { label: "Đắk Lắk", query: "Đắk Lắk" },
    { label: "Gia Lai", query: "Gia Lai" },
    { label: "Kon Tum", query: "Kon Tum" },
  ];
  
  const [activeLocIndex, setActiveLocIndex] = useState(0);
  const activeLoc = locations[activeLocIndex];

  const [coords, setCoords] = useState<{lat?: number, lon?: number}>({});

  useEffect(() => {
    if (activeLoc.query === "") {
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => setCoords({ lat: position.coords.latitude, lon: position.coords.longitude }),
          (error) => console.log("Lỗi lấy vị trí: ", error)
        );
      }
    }
  }, [activeLoc.query]);

  const { data: weatherData, isLoading } = useQuery({
    queryKey: ["weather-preview", activeLoc.query, coords.lat, coords.lon],
    queryFn: () => weatherService.getCurrentWeather(
      activeLoc.query || undefined,
      activeLoc.query ? undefined : coords.lat,
      activeLoc.query ? undefined : coords.lon
    ),
  });

  const weather = weatherData?.data || weatherData;

  return (
    <Section className="bg-gradient-to-b from-amber-50/40 via-emerald-50/20 to-white dark:from-muted/20 dark:to-background border-y border-emerald-100/80 dark:border-border">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-900 mb-3">
              Khí tượng Canh tác Chuyên sâu
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-foreground">Dự báo Thời tiết Nông vụ</h2>
            <p className="text-base text-muted-foreground mb-7 leading-relaxed">
              Theo dõi diễn biến nhiệt ẩm, lượng mưa tại các vùng trồng trọng điểm để đưa ra quyết định phơi sấy, tưới tiêu và bón phân kịp thời.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {locations.map((loc, i) => (
                <div 
                  key={loc.label} 
                  onClick={() => setActiveLocIndex(i)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activeLocIndex === i
                      ? "bg-amber-50/90 border-amber-300 shadow-xs dark:bg-primary/15 dark:border-primary"
                      : "bg-white dark:bg-card hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${activeLocIndex === i ? "bg-primary text-white" : "bg-emerald-50 text-primary dark:bg-muted"}`}>
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className={`text-sm font-bold ${activeLocIndex === i ? "text-emerald-950 dark:text-primary" : "text-foreground"}`}>{loc.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gradient-to-br from-emerald-800 via-primary to-emerald-900 p-8 text-white overflow-hidden shadow-xl shadow-emerald-900/15 border border-emerald-600/30"
          >
            <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 p-8 opacity-20">
              {weather?.icon_url ? (
                <img src={weather.icon_url} alt="weather" className="w-44 h-44" />
              ) : (
                <Cloud className="h-44 w-44" />
              )}
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-8 bg-amber-100/95 text-amber-950 px-3.5 py-1 rounded-full text-xs font-extrabold shadow-xs">
                <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                <span>{isLoading ? "Đang tải..." : (weather?.location || activeLoc.label)}</span>
              </div>
              
              <div className="flex items-end gap-4 mb-10">
                <span className="text-7xl font-black tracking-tighter tabular-nums text-white">
                  {isLoading ? "--" : (weather?.temperature != null ? Math.round(weather.temperature) : "--")}°
                </span>
                <span className="text-xl font-semibold text-amber-100 mb-2">
                  {isLoading ? "..." : (weather?.condition || "Thời tiết ổn định")}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
                <div className="rounded-xl bg-white/10 backdrop-blur-xs p-3 flex flex-col gap-1">
                  <span className="text-emerald-100 text-xs">Độ ẩm</span>
                  <div className="flex items-center gap-1.5 font-bold text-amber-100">
                    <Droplets className="h-4 w-4" /> {isLoading ? "--" : (weather?.humidity ?? "--")}%
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur-xs p-3 flex flex-col gap-1">
                  <span className="text-emerald-100 text-xs">Sức gió</span>
                  <div className="flex items-center gap-1.5 font-bold text-amber-100">
                    <Wind className="h-4 w-4" /> {isLoading ? "--" : (weather?.wind_speed ?? "--")} m/s
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur-xs p-3 flex flex-col gap-1">
                  <span className="text-emerald-100 text-xs">Khuyến nghị</span>
                  <div className="flex items-center gap-1.5 font-bold text-amber-200 text-xs">
                    <CloudRain className="h-4 w-4 shrink-0" /> Thuận lợi canh tác
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
