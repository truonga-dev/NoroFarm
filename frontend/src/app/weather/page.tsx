'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  AlertTriangle,
  Cloud,
  CloudRain,
  Droplets,
  LocateFixed,
  MapPin,
  RefreshCw,
  Sprout,
  Sun,
  Wind,
} from 'lucide-react'

import { weatherService } from '@/api/services/weather.service'
import { DataState } from '@/components/data-display/data-state'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface Location {
  code: string
  name: string
  latitude?: number
  longitude?: number
}
interface Forecast {
  id?: number
  forecast_date: string
  temperature_min: number
  temperature_max: number
  humidity?: number
  wind_speed?: number
  precipitation?: number
  condition?: string
}
interface WeatherAlert {
  id: number
  title: string
  description: string
  start_time: string
  end_time: string
  severity?: string
}

const CROPS = [
  { id: 'coffee', label: 'Cà phê' },
  { id: 'pepper', label: 'Hồ tiêu' },
  { id: 'durian', label: 'Sầu riêng' },
  { id: 'rice', label: 'Lúa gạo' },
]

const cropNames: Record<string, string> = {
  coffee: 'cà phê',
  pepper: 'hồ tiêu',
  durian: 'sầu riêng',
  rice: 'lúa',
}

function WeatherMark({
  condition,
  className,
}: {
  condition?: string
  className?: string
}) {
  const value = condition?.toLowerCase() || ''
  if (value.includes('mưa') || value.includes('rain'))
    return <CloudRain className={className} />
  if (value.includes('mây') || value.includes('cloud'))
    return <Cloud className={className} />
  return <Sun className={className} />
}

function adviceForWeather(
  crop: string,
  temperature: number,
  humidity: number,
  wind: number,
  rain: number
) {
  const cropName = cropNames[crop] || 'cây trồng'
  return [
    rain > 3 || humidity > 82
      ? {
          level: 'Cảnh báo',
          tone: 'danger',
          category: 'Phơi và bảo quản',
          title: 'Không nên phơi nông sản ngoài trời',
          description: `Độ ẩm ${Math.round(humidity)}% và lượng mưa ${rain} mm làm tăng nguy cơ ẩm mốc. Ưu tiên mái che hoặc thiết bị sấy.`,
        }
      : humidity > 72 || rain > 0.5
        ? {
            level: 'Lưu ý',
            tone: 'warning',
            category: 'Phơi và bảo quản',
            title: 'Phơi mỏng, chuẩn bị bạt che',
            description:
              'Đảo nông sản định kỳ và thu gom sớm nếu xuất hiện mây đối lưu vào buổi chiều.',
          }
        : {
            level: 'Thuận lợi',
            tone: 'good',
            category: 'Phơi và bảo quản',
            title: 'Điều kiện phù hợp để phơi',
            description: `Nhiệt độ ${temperature}°C và độ ẩm ${Math.round(humidity)}% phù hợp để hong phơi, cần kiểm tra độ ẩm thành phẩm.`,
          },
    wind > 5.5 || rain > 2
      ? {
          level: 'Tạm hoãn',
          tone: 'danger',
          category: 'Phun và bón',
          title: 'Hoãn phun thuốc và bón phân',
          description: `Gió ${wind} m/s hoặc mưa có thể làm phát tán thuốc và rửa trôi phân bón.`,
        }
      : {
          level: 'Có thể thực hiện',
          tone: 'good',
          category: 'Phun và bón',
          title: 'Ưu tiên sáng sớm hoặc chiều mát',
          description:
            'Gió nhẹ và lượng mưa thấp. Tránh phun vào giờ nắng gắt để giảm thất thoát.',
        },
    humidity >= 80 && temperature >= 24
      ? {
          level: 'Nguy cơ cao',
          tone: 'warning',
          category: 'Sâu bệnh',
          title: `Theo dõi bệnh nấm trên ${cropName}`,
          description:
            'Nhiệt độ và ẩm độ hiện tại thuận lợi cho nấm bệnh. Kiểm tra thoát nước và tỉa cành thông thoáng.',
        }
      : {
          level: 'Nguy cơ thấp',
          tone: 'good',
          category: 'Sâu bệnh',
          title: 'Duy trì thăm vườn định kỳ',
          description:
            'Chưa ghi nhận điều kiện thời tiết bất lợi rõ rệt. Tiếp tục kiểm tra cây trồng mỗi 3–5 ngày.',
        },
    rain >= 5
      ? {
          level: 'Tạm ngưng tưới',
          tone: 'neutral',
          category: 'Nước tưới',
          title: 'Kiểm tra thoát úng',
          description: `Lượng mưa ${rain} mm đã bổ sung ẩm cho tầng đất mặt. Khơi thông rãnh để bảo vệ bộ rễ.`,
        }
      : temperature >= 31 && humidity < 65
        ? {
            level: 'Cần bổ sung',
            tone: 'warning',
            category: 'Nước tưới',
            title: 'Tăng cường giữ ẩm gốc',
            description:
              'Nhiệt độ cao làm bốc hơi nhanh. Tưới vào sáng sớm và duy trì lớp phủ thực vật.',
          }
        : {
            level: 'Ổn định',
            tone: 'good',
            category: 'Nước tưới',
            title: 'Duy trì lịch tưới hiện tại',
            description:
              'Điều kiện nhiệt ẩm tương đối cân bằng, chưa cần điều chỉnh lớn lượng nước tưới.',
          },
  ]
}

export default function WeatherPage() {
  const [selectedCode, setSelectedCode] = React.useState('')
  const [selectedCrop, setSelectedCrop] = React.useState('coffee')
  const [gpsCoords, setGpsCoords] = React.useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [gpsStatus, setGpsStatus] = React.useState<
    'idle' | 'loading' | 'active' | 'denied' | 'unavailable'
  >('idle')

  const locationsQuery = useQuery({
    queryKey: ['weather-locations'],
    queryFn: () => weatherService.getLocations(),
  })
  const locations: Location[] = React.useMemo(
    () =>
      Array.isArray(locationsQuery.data)
        ? locationsQuery.data
        : locationsQuery.data?.data || [],
    [locationsQuery.data]
  )

  React.useEffect(() => {
    if (!selectedCode && locations.length) setSelectedCode(locations[0].code)
  }, [locations, selectedCode])

  const selectedLocation = locations.find(
    (location) => location.code === selectedCode
  )
  const activeCoordinates =
    gpsCoords ||
    (selectedLocation?.latitude !== undefined &&
    selectedLocation?.longitude !== undefined
      ? {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        }
      : null)

  const currentQuery = useQuery({
    queryKey: [
      'current-weather',
      selectedCode,
      gpsCoords?.latitude,
      gpsCoords?.longitude,
    ],
    queryFn: () =>
      weatherService.getCurrentWeather(
        undefined,
        activeCoordinates!.latitude,
        activeCoordinates!.longitude
      ),
    enabled: Boolean(activeCoordinates),
  })
  const forecastQuery = useQuery({
    queryKey: ['weather-forecast', selectedCode],
    queryFn: () => weatherService.getForecast(selectedCode),
    enabled: Boolean(selectedCode) && !gpsCoords,
  })
  const alertsQuery = useQuery({
    queryKey: ['weather-alerts', selectedCode],
    queryFn: () => weatherService.getAlerts(selectedCode),
    enabled: Boolean(selectedCode) && !gpsCoords,
  })

  const current = currentQuery.data?.data || currentQuery.data
  const forecasts: Forecast[] = Array.isArray(forecastQuery.data)
    ? forecastQuery.data
    : forecastQuery.data?.data || []
  const alerts: WeatherAlert[] = Array.isArray(alertsQuery.data)
    ? alertsQuery.data
    : alertsQuery.data?.data || []
  const firstForecast = forecasts[0]
  const currentTemperature = Number(current?.temperature)
  const hasCurrentTemperature = Number.isFinite(currentTemperature)
  const hasForecastTemperature =
    Number.isFinite(firstForecast?.temperature_min) &&
    Number.isFinite(firstForecast?.temperature_max)
  const temperature = hasCurrentTemperature
    ? Math.round(currentTemperature)
    : hasForecastTemperature
      ? Math.round(
          (firstForecast.temperature_min + firstForecast.temperature_max) / 2
        )
      : null
  const humidity = Number(current?.humidity ?? firstForecast?.humidity ?? 70)
  const wind = Number(current?.wind_speed ?? firstForecast?.wind_speed ?? 0)
  const rain = Number(firstForecast?.precipitation ?? 0)
  const advice = adviceForWeather(
    selectedCrop,
    temperature ?? 27,
    humidity,
    wind,
    rain
  )
  const locationLabel = gpsCoords
    ? 'Vị trí hiện tại'
    : selectedLocation?.name || 'Chưa chọn khu vực'
  const isWeatherLoading =
    currentQuery.isLoading || (!gpsCoords && forecastQuery.isLoading)
  const isWeatherError =
    currentQuery.isError && (gpsCoords || forecastQuery.isError)

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('unavailable')
      return
    }
    setGpsStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setGpsStatus('active')
      },
      (error) => {
        setGpsStatus(
          error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable'
        )
        setGpsCoords(null)
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 10 * 60 * 1000 }
    )
  }

  const selectManualLocation = (code: string) => {
    setSelectedCode(code)
    setGpsCoords(null)
    setGpsStatus('idle')
  }

  return (
    <main className="pb-16 md:pb-20">
      <div className="border-border bg-card border-b">
        <Container className="py-7 md:py-10">
          <p className="text-primary text-sm font-semibold">
            Thông tin canh tác
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] md:text-5xl">
            Thời tiết nông vụ
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl leading-7">
            Dự báo và khuyến nghị thực hành cho các vùng sản xuất nông nghiệp.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="weather-location" className="sr-only">
              Chọn tỉnh hoặc vùng
            </label>
            <select
              id="weather-location"
              value={gpsCoords ? '' : selectedCode}
              onChange={(event) => selectManualLocation(event.target.value)}
              className="border-input bg-background focus-visible:ring-ring h-10 min-w-60 rounded-lg border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
              disabled={locationsQuery.isLoading}
            >
              {gpsCoords && <option value="">Vị trí hiện tại</option>}
              {locations.map((location) => (
                <option key={location.code} value={location.code}>
                  {location.name}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={useMyLocation}
              disabled={gpsStatus === 'loading'}
            >
              {gpsStatus === 'loading' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <LocateFixed className="h-4 w-4" />
              )}
              {gpsStatus === 'loading'
                ? 'Đang xác định...'
                : 'Dùng vị trí của tôi'}
            </Button>
            <span className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5" />
              {locationLabel}
            </span>
          </div>

          {(gpsStatus === 'denied' || gpsStatus === 'unavailable') && (
            <div className="border-border bg-muted/50 mt-4 flex max-w-2xl items-start gap-3 rounded-lg border px-4 py-3 text-sm">
              <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              <p>
                <strong>
                  {gpsStatus === 'denied'
                    ? 'Quyền định vị chưa được cấp.'
                    : 'Không thể xác định vị trí.'}
                </strong>{' '}
                Bạn vẫn có thể chọn tỉnh hoặc vùng trong danh sách phía trên.
              </p>
            </div>
          )}
        </Container>
      </div>

      <Container className="py-7 md:py-10">
        {locationsQuery.isLoading ? (
          <div className="space-y-5">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : locationsQuery.isError ? (
          <DataState
            title="Không thể tải danh sách khu vực"
            description="Vui lòng kiểm tra kết nối và thử lại."
            action={
              <Button onClick={() => locationsQuery.refetch()}>Thử lại</Button>
            }
          />
        ) : isWeatherError ? (
          <DataState
            title="Không thể tải dữ liệu thời tiết"
            description="Máy chủ thời tiết chưa phản hồi cho khu vực này."
            action={
              <Button
                onClick={() => {
                  currentQuery.refetch()
                  forecastQuery.refetch()
                }}
              >
                Thử lại
              </Button>
            }
          />
        ) : isWeatherLoading ? (
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-5">
              <Skeleton className="h-72 w-full" />
              <Skeleton className="h-36 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <div className="space-y-7">
            {alerts.length > 0 && (
              <section aria-label="Cảnh báo thời tiết" className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3.5 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100"
                  >
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <h2 className="font-semibold">{alert.title}</h2>
                      <p className="mt-1 text-sm leading-6 opacity-90">
                        {alert.description}
                      </p>
                      <p className="mt-1.5 text-xs font-medium">
                        Hiệu lực{' '}
                        {new Date(alert.start_time).toLocaleDateString('vi-VN')}{' '}
                        – {new Date(alert.end_time).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </section>
            )}

            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-7">
                <section className="border-border bg-card rounded-xl border">
                  <div className="grid gap-6 px-5 py-6 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] sm:items-center md:px-7 md:py-8">
                    <div>
                      <p className="text-muted-foreground inline-flex items-center gap-1.5 text-sm font-medium">
                        <MapPin className="h-4 w-4" />
                        {locationLabel}
                      </p>
                      <div className="mt-5 flex items-end gap-4">
                        <span className="text-6xl font-bold tracking-[-0.06em] tabular-nums md:text-7xl">
                          {temperature !== null ? `${temperature}°` : '—'}
                        </span>
                        <div className="pb-1">
                          <p className="text-xl font-semibold">
                            {current?.condition ||
                              firstForecast?.condition ||
                              'Chưa có mô tả'}
                          </p>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {hasCurrentTemperature
                              ? 'Thời tiết hiện tại'
                              : 'Ước tính từ dự báo'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border-border grid grid-cols-2 border-t pt-5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
                      <div className="border-border border-r border-b p-3">
                        <Droplets className="h-4 w-4 text-sky-700 dark:text-sky-400" />
                        <p className="text-muted-foreground mt-2 text-xs">
                          Độ ẩm
                        </p>
                        <p className="mt-0.5 font-semibold">
                          {Number.isFinite(humidity)
                            ? `${Math.round(humidity)}%`
                            : '—'}
                        </p>
                      </div>
                      <div className="border-border border-b p-3">
                        <Wind className="h-4 w-4 text-teal-700 dark:text-teal-400" />
                        <p className="text-muted-foreground mt-2 text-xs">
                          Sức gió
                        </p>
                        <p className="mt-0.5 font-semibold">
                          {Number.isFinite(wind) ? `${wind} m/s` : '—'}
                        </p>
                      </div>
                      <div className="border-border border-r p-3">
                        <CloudRain className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                        <p className="text-muted-foreground mt-2 text-xs">
                          Lượng mưa
                        </p>
                        <p className="mt-0.5 font-semibold">
                          {Number.isFinite(rain) ? `${rain} mm` : '—'}
                        </p>
                      </div>
                      <div className="p-3">
                        <Sun className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                        <p className="text-muted-foreground mt-2 text-xs">
                          Trong ngày
                        </p>
                        <p className="mt-0.5 font-semibold">
                          {hasForecastTemperature
                            ? `${Math.round(firstForecast.temperature_min)}°–${Math.round(firstForecast.temperature_max)}°`
                            : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="border-border bg-card rounded-xl border">
                  <div className="border-border flex flex-col justify-between gap-4 border-b px-5 py-4 sm:flex-row sm:items-center md:px-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sprout className="text-primary h-4 w-4" />
                        <h2 className="font-semibold">Khuyến nghị canh tác</h2>
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Theo điều kiện tại {locationLabel}
                      </p>
                    </div>
                    <div className="bg-muted flex max-w-full gap-1 overflow-x-auto rounded-lg p-1">
                      {CROPS.map((crop) => (
                        <button
                          key={crop.id}
                          onClick={() => setSelectedCrop(crop.id)}
                          className={cn(
                            'shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold',
                            selectedCrop === crop.id
                              ? 'bg-background text-foreground shadow-sm'
                              : 'text-muted-foreground'
                          )}
                        >
                          {crop.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="divide-border divide-y">
                    {advice.map((item) => (
                      <article
                        key={item.category}
                        className="grid gap-2 px-5 py-4 sm:grid-cols-[150px_minmax(0,1fr)] md:px-6"
                      >
                        <div>
                          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            {item.category}
                          </p>
                          <span
                            className={cn(
                              'mt-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold',
                              item.tone === 'danger' &&
                                'border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300',
                              item.tone === 'warning' &&
                                'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300',
                              item.tone === 'good' &&
                                'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300',
                              item.tone === 'neutral' &&
                                'border-border bg-muted text-foreground'
                            )}
                          >
                            {item.level}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground mt-1 text-sm leading-6">
                            {item.description}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="border-border bg-card h-fit rounded-xl border">
                <div className="border-border border-b px-5 py-4">
                  <h2 className="font-semibold">Dự báo những ngày tới</h2>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {gpsCoords
                      ? 'Chọn tỉnh để xem dự báo dài ngày'
                      : `${forecasts.length} ngày dự báo`}
                  </p>
                </div>
                {gpsCoords ? (
                  <div className="px-5 py-8 text-center">
                    <MapPin className="text-muted-foreground mx-auto h-5 w-5" />
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      Dự báo dài ngày hiện được cung cấp theo khu vực đã lưu.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() =>
                        locations[0] && selectManualLocation(locations[0].code)
                      }
                    >
                      Chọn khu vực
                    </Button>
                  </div>
                ) : forecasts.length ? (
                  <div className="divide-border divide-y">
                    {forecasts.map((day, index) => (
                      <div
                        key={day.id || `${day.forecast_date}-${index}`}
                        className="flex items-center gap-3 px-5 py-4"
                      >
                        <WeatherMark
                          condition={day.condition}
                          className="text-muted-foreground h-5 w-5 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium capitalize">
                            {new Date(day.forecast_date).toLocaleDateString(
                              'vi-VN',
                              {
                                weekday: 'long',
                                day: '2-digit',
                                month: '2-digit',
                              }
                            )}
                          </p>
                          <p className="text-muted-foreground mt-0.5 truncate text-xs">
                            {day.condition || 'Chưa có mô tả'}
                            {day.precipitation
                              ? ` · Mưa ${day.precipitation} mm`
                              : ''}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold tabular-nums">
                          {Math.round(day.temperature_min)}° /{' '}
                          {Math.round(day.temperature_max)}°
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-10 text-center">
                    <Cloud className="text-muted-foreground mx-auto h-5 w-5" />
                    <p className="text-muted-foreground mt-2 text-sm">
                      Chưa có dữ liệu dự báo.
                    </p>
                  </div>
                )}
              </aside>
            </div>
          </div>
        )}
      </Container>
    </main>
  )
}
