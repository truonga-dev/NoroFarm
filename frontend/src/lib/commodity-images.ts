/**
 * Thư viện ảnh nông sản dự phòng thông minh (Fallback Images)
 * Tự động gán hình ảnh độ phân giải cao theo tên mặt hàng hoặc tiêu đề tin đăng
 */

interface CommodityImageMap {
  keywords: string[]
  imageUrl: string
  label: string
}

const COMMODITY_IMAGES: CommodityImageMap[] = [
  {
    keywords: ["lúa", "gạo", "st25", "thóc", "nếp", "paddy", "rice"],
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&auto=format&fit=crop&q=80",
    label: "Lúa gạo",
  },
  {
    keywords: ["tiêu", "hồ tiêu", "tiêu đen", "tiêu sọ", "pepper"],
    imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=700&auto=format&fit=crop&q=80",
    label: "Hồ tiêu",
  },
  {
    keywords: ["sầu riêng", "dona", "ri6", "musang king", "durian"],
    imageUrl: "https://images.unsplash.com/photo-1587334274328-64186a80aeee?w=700&auto=format&fit=crop&q=80",
    label: "Sầu riêng",
  },
  {
    keywords: ["bưởi", "bưởi da xanh", "năm roi", "pomelo", "bưởi đường"],
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=700&auto=format&fit=crop&q=80",
    label: "Bưởi da xanh",
  },
  {
    keywords: ["cà phê", "cafe", "coffee", "robusta", "arabica"],
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&auto=format&fit=crop&q=80",
    label: "Cà phê",
  },
  {
    keywords: ["cao su", "mủ", "rubber"],
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700&auto=format&fit=crop&q=80",
    label: "Cao su",
  },
  {
    keywords: ["chuối", "banana", "chuối già"],
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=700&auto=format&fit=crop&q=80",
    label: "Chuối",
  },
  {
    keywords: ["chè", "trà", "tea"],
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=700&auto=format&fit=crop&q=80",
    label: "Chè búp",
  },
  {
    keywords: ["điều", "hạt điều", "cashew"],
    imageUrl: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=700&auto=format&fit=crop&q=80",
    label: "Hạt điều",
  },
]

const DEFAULT_AGRICULTURE_IMAGE =
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=700&auto=format&fit=crop&q=80"

/**
 * Lấy URL ảnh nông sản chuẩn xác theo tên mặt hàng hoặc tiêu đề tin
 */
export function getCommodityImage(
  title?: string | null,
  commodityName?: string | null,
  customImageUrl?: string | null
): string {
  if (customImageUrl && customImageUrl.trim().length > 5) {
    return customImageUrl
  }

  const query = `${commodityName || ""} ${title || ""}`.toLowerCase()

  for (const item of COMMODITY_IMAGES) {
    for (const kw of item.keywords) {
      if (query.includes(kw)) {
        return item.imageUrl
      }
    }
  }

  return DEFAULT_AGRICULTURE_IMAGE
}
