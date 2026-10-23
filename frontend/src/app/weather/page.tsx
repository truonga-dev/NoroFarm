"use client";

import { useState, useEffect } from "react";
import { PageTransition } from "@/components/layout/page-transition"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { PageTitle } from "@/components/layout/page-title"
import { weatherService } from "@/api/services/weather.service"
import { useQuery } from "@tanstack/react-query"
import { Sun, CloudRain, Cloud, Wind, Droplets, MapPin, AlertTriangle, AlertOctagon } from "lucide-react"

const EMPTY_LOCATIONS: any[] = []

export default function WeatherPage() {
  const [selectedCode, setSelectedCode] = useState<string>("");

  // 1. Lấy danh sách các vị trí đang hoạt động từ DB
  const { data: locationsRes, isLoading: isLocLoading, isError: isLocError } = useQuery({
    queryKey: ['weatherLocations'],
    queryFn: () => weatherService.getLocations()
  });

  const locations = locationsRes?.data || EMPTY_LOCATIONS;

  // Tự động chọn vị trí đầu tiên khi tải xong danh sách
  useEffect(() => {
    if (locations.length > 0 && !selectedCode) {
      setSelectedCode(locations[0].code);
    }
  }, [locations, selectedCode]);

  const selectedLocation = locations.find((l: any) => l.code === selectedCode);

  // 2. Lấy thời tiết thời gian thực cho vị trí đang chọn (sử dụng GPS)
  const { data: currentWeatherRes, isLoading: isCurrentLoading, isError: isCurrentError } = useQuery({
    queryKey: ['currentWeather', selectedCode],
    queryFn: () => weatherService.getCurrentWeather(undefined, selectedLocation?.latitude, selectedLocation?.longitude),
    enabled: !!selectedLocation && selectedLocation.latitude !== undefined && selectedLocation.longitude !== undefined
  });

  const currentWeather = currentWeatherRes?.data;

  // 3. Lấy dữ liệu dự báo 5 ngày cho vị trí đang chọn
  const { data: forecastRes, isLoading: isForecastLoading, isError: isForecastError } = useQuery({
    queryKey: ['weatherForecast', selectedCode],
    queryFn: () => weatherService.getForecast(selectedCode),
    enabled: !!selectedCode
  });

  const forecasts = forecastRes?.data || [];

  // 4. Lấy danh sách cảnh báo thời tiết xấu của khu vực đó
  const { data: alertsRes } = useQuery({
    queryKey: ['weatherAlerts', selectedCode],
    queryFn: () => weatherService.getAlerts(selectedCode),
    enabled: !!selectedCode
  });

  const alerts = alertsRes?.data || [];

  const isLoading = isLocLoading || (!!selectedCode && (isCurrentLoading || isForecastLoading));
  const isError = isLocError || (isCurrentError && isForecastError);
  const firstForecast = forecasts[0];
  const hasCurrentTemperature = typeof currentWeather?.temperature === "number" && Number.isFinite(currentWeather.temperature);
  const hasForecastTemperature = typeof firstForecast?.temperature_min === "number" && typeof firstForecast?.temperature_max === "number";
  const temperature = hasCurrentTemperature
    ? Math.round(currentWeather.temperature)
    : hasForecastTemperature
      ? Math.round((firstForecast.temperature_min + firstForecast.temperature_max) / 2)
      : null;
  const temperatureLabel = hasCurrentTemperature ? "Thời tiết hiện tại" : hasForecastTemperature ? "Ước tính theo dự báo" : "Chưa có dữ liệu thời tiết";

  if (isLoading) {
    return (
      <PageTransition>
        <Section>
          <Container>
            <PageTitle 
              title="Thời tiết Nông vụ" 
              description="Thông tin thời tiết chuyên sâu phục vụ canh tác nông nghiệp tại các vùng trồng."
            />
            <div className="w-full h-14 bg-muted/40 rounded-2xl animate-pulse mt-8 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-[280px] bg-muted/40 rounded-3xl animate-pulse" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-28 bg-muted/40 rounded-2xl animate-pulse" />
                  ))}
                </div>
              </div>
              <div className="h-[450px] bg-muted/40 rounded-2xl animate-pulse" />
            </div>
          </Container>
        </Section>
      </PageTransition>
    );
  }

  if (isError) {
    return (
      <PageTransition>
        <Section>
          <Container>
            <PageTitle 
              title="Thời tiết Nông vụ" 
              description="Thông tin thời tiết chuyên sâu phục vụ canh tác nông nghiệp tại các vùng trồng."
            />
            <div className="flex flex-col items-center justify-center text-center p-12 min-h-[400px] border border-dashed rounded-3xl mt-8">
              <div className="bg-red-500/10 p-4 rounded-full text-red-500 mb-4">
                <AlertOctagon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Đã xảy ra lỗi tải dữ liệu</h3>
              <p className="text-muted-foreground max-w-md">
                Không thể kết nối đến máy chủ thời tiết hoặc chưa có dữ liệu đồng bộ cho khu vực này.
                Vui lòng thử lại sau.
              </p>
            </div>
          </Container>
        </Section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Section>
        <Container>
          <PageTitle 
            title="Thời tiết Nông vụ" 
            description="Thông tin thời tiết chuyên sâu phục vụ canh tác nông nghiệp tại các vùng trồng."
          />
          
          {/* Tabs lựa chọn vùng nông nghiệp */}
          {locations.length > 0 && (
            <div className="flex flex-wrap gap-2.5 p-2 rounded-2xl bg-muted/30 border border-muted-foreground/10 mt-8 mb-8 max-w-fit">
              {locations.map((loc: any) => (
                <button
                  key={loc.code}
                  onClick={() => setSelectedCode(loc.code)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    selectedCode === loc.code
                      ? "bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              
              {/* Cảnh báo thiên tai/Thời tiết nguy hại */}
              {alerts.length > 0 && (
                <div className="space-y-4">
                  {alerts.map((alert: any) => (
                    <div 
                      key={alert.id} 
                      className="flex gap-4 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-300 animate-pulse"
                    >
                      <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
                      <div>
                        <div className="font-bold text-base leading-tight mb-1">{alert.title}</div>
                        <div className="text-sm text-amber-700/90 dark:text-amber-300/80 mb-2">{alert.description}</div>
                        <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                          Hiệu lực từ: {new Date(alert.start_time).toLocaleDateString("vi-VN")} - {new Date(alert.end_time).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Thẻ thời tiết hiện tại */}
              <div className="rounded-3xl bg-gradient-to-br from-primary to-emerald-800 p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20 border border-emerald-500/10">
                <div className="absolute top-0 right-0 opacity-20 pointer-events-none p-4">
                  {currentWeather?.icon_url ? (
                    <img 
                      src={currentWeather.icon_url} 
                      alt="" 
                      className="w-48 h-48 filter brightness-125 select-none"
                    />
                  ) : (
                    <Cloud className="w-48 h-48" />
                  )}
                </div>
                
                <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px]">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full w-fit">
                    <MapPin className="h-4 w-4 text-emerald-300" />
                    <span className="font-semibold text-sm tracking-wide">{selectedLocation?.name}</span>
                  </div>
                  
                  <div className="flex items-end gap-6 mt-8">
                    <div className="text-7xl sm:text-8xl font-black tracking-tighter leading-none">
                      {temperature != null ? `${temperature}°` : "—"}
                    </div>
                    <div className="mb-3">
                      <div className="text-2xl font-bold tracking-tight">{currentWeather?.condition || firstForecast?.condition || "Chưa có dữ liệu"}</div>
                      <div className="text-white/80 text-sm mt-0.5 font-medium">{temperatureLabel}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Thẻ thông số chi tiết */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl border bg-card p-5 flex flex-col items-center justify-center text-center gap-2 hover:shadow-md transition-shadow">
                  <Droplets className="h-7 w-7 text-blue-500" />
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Độ ẩm</div>
                  <div className="text-xl font-bold text-foreground">
                    {(currentWeather?.humidity ?? firstForecast?.humidity) != null ? `${Math.round(currentWeather?.humidity ?? firstForecast.humidity)}%` : "—"}
                  </div>
                </div>
                
                <div className="rounded-2xl border bg-card p-5 flex flex-col items-center justify-center text-center gap-2 hover:shadow-md transition-shadow">
                  <Wind className="h-7 w-7 text-teal-500" />
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sức gió</div>
                  <div className="text-xl font-bold text-foreground">
                    {(currentWeather?.wind_speed ?? firstForecast?.wind_speed) != null ? `${currentWeather?.wind_speed ?? firstForecast.wind_speed} m/s` : "—"}
                  </div>
                </div>

                <div className="rounded-2xl border bg-card p-5 flex flex-col items-center justify-center text-center gap-2 hover:shadow-md transition-shadow">
                  <CloudRain className="h-7 w-7 text-sky-500" />
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lượng mưa</div>
                  <div className="text-xl font-bold text-foreground">
                    {firstForecast?.precipitation != null ? `${firstForecast.precipitation} mm` : "—"}
                  </div>
                </div>

                <div className="rounded-2xl border bg-card p-5 flex flex-col items-center justify-center text-center gap-2 hover:shadow-md transition-shadow">
                  <Sun className="h-7 w-7 text-amber-500" />
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nhiệt độ ngày</div>
                  <div className="text-sm font-bold text-foreground">
                    {hasForecastTemperature ? `${Math.round(firstForecast.temperature_min)}° - ${Math.round(firstForecast.temperature_max)}°` : "—"}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cột hiển thị Dự báo 5 ngày tiếp theo */}
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-6 border-b pb-3 text-foreground flex items-center justify-between">
                <span>Dự báo 5 ngày tới</span>
                <span className="text-xs text-muted-foreground font-normal">{forecasts.length > 0 ? "Theo dữ liệu dự báo" : "Chưa có dữ liệu"}</span>
              </h3>
              
              <div className="space-y-4">
                {forecasts.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">Chưa có dự báo cho khu vực này. Vui lòng thử lại sau.</p>}
                {forecasts.map((day: any, i: number) => {
                  const dateObj = new Date(day.forecast_date);
                  const dateStr = dateObj.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "numeric" });
                  
                  return (
                    <div 
                      key={day.id || i} 
                      className="flex items-center justify-between p-3.5 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-muted-foreground/10"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-sm capitalize text-foreground">{dateStr}</span>
                        <span className="text-xs text-muted-foreground">{day.condition}</span>
                      </div>
                      
                      {day.icon_url ? (
                        <img 
                          src={day.icon_url} 
                          alt={day.condition} 
                          className="w-12 h-12 select-none"
                        />
                      ) : (
                        <Cloud className="h-6 w-6 text-muted-foreground/50" />
                      )}
                      
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="font-bold text-sm text-foreground">
                          {Math.round(day.temperature_min)}° - {Math.round(day.temperature_max)}°C
                        </span>
                        {day.precipitation > 0 && (
                          <span className="text-[10px] text-blue-500 font-bold bg-blue-500/5 px-1.5 py-0.5 rounded">
                            Mưa: {day.precipitation}mm
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </PageTransition>
  )
}
