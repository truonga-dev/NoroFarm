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
    <Section className="bg-muted/30">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Dự báo Nông vụ</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Theo dõi diễn biến thời tiết tại các vùng trồng trọng điểm để đưa ra quyết định tưới tiêu, bón phân kịp thời, tối ưu chi phí và tăng năng suất.
            </p>
            <div className="flex flex-col gap-4">
              {locations.map((loc, i) => (
                <div 
                  key={loc.label} 
                  onClick={() => setActiveLocIndex(i)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-colors cursor-pointer ${activeLocIndex === i ? 'bg-primary/10 border-primary' : 'bg-background hover:border-primary/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className={`h-5 w-5 ${activeLocIndex === i ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`font-medium ${activeLocIndex === i ? 'text-primary' : ''}`}>{loc.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[2.5rem] bg-gradient-to-br from-primary to-emerald-700 p-8 text-white overflow-hidden shadow-2xl shadow-primary/20"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20">
              {weather?.icon_url ? (
                <img src={weather.icon_url} alt="weather" className="w-48 h-48" />
              ) : (
                <Cloud className="h-48 w-48" />
              )}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8 opacity-90">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">{isLoading ? "Đang tải..." : (weather?.location || activeLoc.label)}</span>
              </div>
              
              <div className="flex items-end gap-4 mb-12">
                <span className="text-7xl font-bold tracking-tighter">
                  {isLoading ? "--" : (weather?.temperature != null ? Math.round(weather.temperature) : "--")}°
                </span>
                <span className="text-2xl font-medium opacity-90 mb-2">
                  {isLoading ? "..." : (weather?.condition || "Không có dữ liệu")}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-8">
                <div className="flex flex-col gap-1">
                  <span className="opacity-70 text-sm">Độ ẩm</span>
                  <div className="flex items-center gap-2 font-medium">
                    <Droplets className="h-4 w-4" /> {isLoading ? "--" : (weather?.humidity ?? "--")}%
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="opacity-70 text-sm">Gió</span>
                  <div className="flex items-center gap-2 font-medium">
                    <Wind className="h-4 w-4" /> {isLoading ? "--" : (weather?.wind_speed ?? "--")} m/s
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="opacity-70 text-sm">Lượng mưa</span>
                  <div className="flex items-center gap-2 font-medium">
                    <CloudRain className="h-4 w-4" /> Chưa có dữ liệu
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
