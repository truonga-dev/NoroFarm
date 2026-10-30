import { NextResponse } from 'next/server'

const NOROFARM_SYSTEM_PROMPT = `
Bạn là Cố vấn Nông nghiệp & Kinh tế Nông vụ Chuyên sâu của Nền tảng NoroFarm (norofarm.com).
Bạn là một chuyên gia nông học đầu ngành kiêm chuyên gia phân tích thị trường nông sản quốc tế và Việt Nam. Bạn có kiến thức bách khoa toàn diện, am hiểu sâu sắc về thực tiễn đồng ruộng và dòng chảy thương mại toàn cầu.

PHẠM VI NĂNG LỰC TOÀN DIỆN:
1. KIẾN THỨC NÔNG HỌC & BẢO VỆ THỰC VẬT (ƯU TIÊN HÀNG ĐẦU):
   - Khi người dùng hỏi về sâu bệnh hại (nấm hồng, rệp sáp, rỉ sắt, thán thư, nứt thân xì mủ, rầy xanh, tuyến trùng...): Hãy trả lời trực diện, chi tiết về triệu chứng, nguyên nhân gây hại, biện pháp canh tác và phác đồ thuốc BVTV đặc trị cụ thể (tên hoạt chất, cách phối trộn, thời điểm phun, thời gian cách ly PHI).
   - Tuyệt đối không trả lời lạc đề sang giá cả khi câu hỏi đang hỏi về kỹ thuật hoặc sâu bệnh hại.

2. CÁC LOẠI CÂY TRỒNG & VẬT NUÔI:
   - Cây công nghiệp: Cà phê (Robusta, Arabica), Hồ tiêu, Cao su, Điều, Mắc ca, Chè (trà), Ca cao...
   - Cây ăn quả giá trị cao: Sầu riêng (Ri6, Monthong / Dona, Musang King), Mít, Bơ 034, Thanh long, Cam quýt bưởi, Xoài, Chuối, Vải, Nhãn...
   - Lương thực & Hoa màu: Lúa gạo (ST24, ST25, Đài Thơm 8, OM 5451, Jasmine), Bắp/Ngô, Khoai lang, Sắn, Rau màu các loại.
   - Thủy sản & Chăn nuôi: Bò thịt, heo, gia cầm, tôm nước lợ, cá tra.

3. KỸ THUẬT CANH TÁC & DINH DƯỠNG THỔ NHƯỠNG:
   - Đo và nâng độ pH đất (5.5 - 6.5), giải độc phèn, hạ chua bằng vôi nông nghiệp/Dolomite; ủ phân hữu cơ vi sinh Trichoderma.
   - Chế độ bón phân NPK theo từng giai đoạn: phục hồi sau thu hoạch, kích đọt, phân hóa mầm hoa, nuôi trái non, nuôi lớn trái và tích lũy đường.
   - Kỹ thuật nước tưới: Xiết nước kích hoa, tưới giữ ẩm mùa khô, tưới nhỏ giọt tiết kiệm nước.

4. BẢN TIN GIÁ CẢ & THỊ TRƯỜNG THẾ GIỚI - NỘI ĐIÀ (CHỈ KHI ĐƯỢC HỎI VỀ GIÁ HOẶC THỊ TRƯỜNG):
   - Sàn London ICE (Robusta), Sàn New York ICE (Arabica), Sàn nông sản Chicago (CBOT), Giá tiêu IPC quốc tế, Giá cao su TOCOM/SICOM, Giá gạo xuất khẩu 5% tấm.
   - Giá thu mua nông sản tại các tỉnh trọng điểm (Đắk Lắk, Gia Lai, Lâm Đồng, Đắk Nông, Bình Phước, ĐBSCL).
   - Phân tích kinh tế: Chênh lệch Basis Spread, tỷ giá USD/VND, chi phí logistics xuất nhập khẩu.

QUY TẮC TRẢ LỜI:
- Bắt đúng trọng tâm câu hỏi của người dùng. Nếu hỏi về sâu bệnh thì trả lời kỹ thuật sâu bệnh; nếu hỏi về giá thì trả lời giá; nếu hỏi về thời tiết thì dự báo thời tiết.
- Trình bày rõ ràng, dùng bullet points, in đậm từ khóa quan trọng và tên hoạt chất để bà con dễ đọc trên điện thoại.
- Giữ phong thái chuyên gia nông học gần gũi, uyên bác và thực tế.
`

function getSmartFallback(message: string) {
  const msgLower = (message || '').toLowerCase()

  // 1. SÂU BỆNH HẠI & PHÒNG TRỪ BVTV (Ưu tiên số 1)
  const isPest = [
    'sâu', 'bệnh', 'nấm', 'rầy', 'rệp', 'thán thư', 'xì mủ', 'rỉ sắt',
    'chết nhanh', 'chết chậm', 'tuyến trùng', 'đốm lá', 'khô cành',
    'phòng trừ', 'thuốc', 'trị', 'xịt', 'phun', 'hoạt chất',
  ].some((w) => msgLower.includes(w))

  if (isPest) {
    if (
      msgLower.includes('cà phê') ||
      msgLower.includes('cafe') ||
      msgLower.includes('robusta') ||
      msgLower.includes('nấm hồng') ||
      msgLower.includes('rệp sáp')
    ) {
      return {
        reply:
          '**Quy trình Phòng trừ Nấm hồng & Rệp sáp hại Cây Cà phê (Chuẩn IPM):**\n\n' +
          '### 1. Phòng trừ Bệnh Nấm hồng (*Corticium salmonicolor*):\n' +
          '• **Thời điểm gây hại:** Thường bùng phát mạnh vào mùa mưa ẩm (tháng 6 - 10), tán cây rậm rạp thiếu sáng.\n' +
          '• **Triệu chứng:** Xuất hiện các mảng sợi nấm và lớp phấn màu hồng nhạt trên cành, chùm quả; nấm ăn sâu làm chết vỏ cành, khô lá và rụng quả hàng loạt.\n' +
          '• **Biện pháp xử lý:**\n' +
          '  - *Canh tác:* Tỉa cành thông thoáng, cắt bỏ đoạn cành nhiễm bệnh gom ra xa vườn đốt tiêu hủy.\n' +
          '  - *Thuốc đặc trị:* Phun ướt đều tán và vết bệnh bằng hoạt chất **Validamycin** (Valivita, Validacin), **Hexaconazole** (Anvil), **Cuprous oxide** (Đồng đỏ Nordox) hoặc **Mancozeb** kết hợp Metalaxyl. Phun kép 2 lần cách nhau 7 - 10 ngày.\n\n' +
          '### 2. Phòng trừ Rệp sáp (*Pseudococcus* spp.):\n' +
          '• **Tập tính:** Ký sinh hút chích chùm quả non, cuống lá và cả rễ ngầm dưới đất; tiết mật ngọt thu hút kiến đen và tạo nấm bồ hóng đen xì.\n' +
          '• **Biện pháp xử lý:**\n' +
          '  - *Rệp sáp trên cành lá:* Phun hoạt chất **Spirotetramat** (Movento - lưu dẫn 2 chiều), **Buprofezin** (Applaud - ức chế lột xác), **Thiamethoxam** hoặc dầu khoáng sinh học SK Enspray 99 EC.\n' +
          '  - *Rệp sáp hại rễ:* Dọn sạch cỏ quanh gốc, rải thuốc trừ kiến đen và tưới thuốc lưu dẫn vào vùng rễ cây.\n' +
          '• **Lưu ý an toàn:** Tuân thủ thời gian cách ly (PHI) tối thiểu 14 ngày trước khi thu hoạch quả.',
        suggestions: [
          'Thuốc sinh học trị rệp sáp an toàn',
          'Thời điểm cắt tỉa cành cà phê sau thu hoạch',
          'Cách phòng bệnh rỉ sắt trên cà phê',
        ],
      }
    }

    if (msgLower.includes('sầu riêng') || msgLower.includes('ri6') || msgLower.includes('monthong')) {
      return {
        reply:
          '**Quy trình Quản lý Sâu Bệnh hại Sầu riêng:**\n\n' +
          '• **Bệnh Nứt thân xì mủ (*Phytophthora*):** Cạo sạch vết bệnh trên thân, quét đậm đặc hoạt chất **Fosetyl-Aluminium** (Aliette) hoặc **Metalaxyl + Mancozeb**. Tưới gốc nấm đối kháng *Trichoderma* định kỳ.\n' +
          '• **Rầy xanh & Rầy phấn trắng:** Phun phòng ngừa khi đọt non vừa nhú mũi giáo bằng hoạt chất **Emamectin benzoate**, **Buprofezin** hoặc **Thiamethoxam**.',
        suggestions: [
          'Cách chặn đọt sầu riêng khi nuôi trái',
          'Quy trình làm bông sầu riêng nghịch vụ',
          'Thuốc trị xì mủ sầu riêng hiệu quả nhất',
        ],
      }
    }
  }

  // 2. DINH DƯỠNG & PHÂN BÓN
  const isFertilizer = [
    'phân', 'bón', 'npk', 'đạm', 'lân', 'kali', 'vi lượng',
    'đất', 'độ ph', 'chua', 'hữu cơ', 'trùn quế',
  ].some((w) => msgLower.includes(w))

  if (isFertilizer) {
    return {
      reply:
        '**Hướng dẫn Quản lý Dinh dưỡng & Cải tạo Đất Canh tác:**\n\n' +
        '• **Độ pH đất lý tưởng:** Đa số cây ăn trái và cây công nghiệp cần pH từ **5.5 - 6.5**. Nếu pH < 5.0, bón 500kg - 1 tấn vôi nông nghiệp hoặc Dolomite/ha vào đầu mùa mưa.\n' +
        '• **Chế độ bón NPK theo chu kỳ:**\n' +
        '  - *Phục hồi cây:* Ưu tiên Đạm và Lân cao (NPK 20-20-15, DAP) + phân hữu cơ hoai mục.\n' +
        '  - *Làm bông:* Giảm đạm, tăng lân và Bo - Kẽm (NPK 10-50-10 hoặc 10-60-10).\n' +
        '  - *Nuôi trái:* Tăng cường Kali Sunfat (K2SO4) để tăng độ ngọt, chắc hạt và bóng quả.',
      suggestions: [
        'Cách đo độ pH đất bằng giấy quỳ hoặc máy đo',
        'Kỹ thuật ủ phân chuồng với Trichoderma',
        'Dấu hiệu cây thiếu vi lượng Bo và Kẽm',
      ],
    }
  }

  // 3. QUY ĐỊNH XUẤT KHẨU
  const isPolicy = ['eudr', 'phá rừng', 'châu âu', 'trung quốc', 'mã số vùng trồng', 'msvt', 'vietgap'].some((w) => msgLower.includes(w))
  if (isPolicy) {
    return {
      reply:
        '**Bản tin Tiêu chuẩn & Quy định Nông sản Xuất khẩu:**\n\n' +
        '• **Quy định EUDR chống phá rừng (EU):** Bắt buộc đối với cà phê, cao su, gỗ. Nông hộ cần cung cấp tọa độ định vị GPS thửa đất canh tác, chứng minh không gây mất rừng sau mốc **31/12/2020**.\n' +
        '• **Mã số vùng trồng (MSVT) sang Trung Quốc (GACC):** Kiểm soát nghiêm ngặt dư lượng hóa chất BVTV cấm, lưu nhật ký canh tác số và kiểm dịch dịch hại.\n' +
        '• **Khuyến nghị:** Đẩy mạnh áp dụng VietGAP/GlobalGAP để nâng cao giá trị thương mại.',
      suggestions: [
        'Thủ tục đăng ký Mã số vùng trồng mới nhất',
        'Cách lấy tọa độ GPS thửa đất phục vụ EUDR',
        'Danh mục hóa chất bị cấm khi xuất khẩu',
      ],
    }
  }

  // 4. GIÁ CẢ & BẢN TIN THỊ TRƯỜNG
  if (msgLower.includes('cà phê') || msgLower.includes('cafe') || msgLower.includes('robusta') || msgLower.includes('london')) {
    return {
      reply:
        '**Bản tin Thị trường Cà phê & Phân tích Nông vụ:**\n\n' +
        '• **Giá thu mua nội địa Tây Nguyên:** Dao động quanh mức **120.500 - 123.000 đ/kg** tại Đắk Lắk, Gia Lai, Đắk Nông và Lâm Đồng.\n' +
        '• **Sàn London (ICE Futures Europe):** Hợp đồng Robusta giao dịch quanh ngưỡng **4.850 - 5.000 USD/tấn**, tồn kho đạt chuẩn sàn ICE vẫn ở mức thấp hỗ trợ giá.\n' +
        '• **Khuyến nghị:** Theo dõi biểu đồ nến Pro TradingView trực tiếp tại trang **`/coffee`**.',
      suggestions: [
        'Biểu đồ nến Robusta London hôm nay',
        'Dự báo giá cà phê vụ tới 2026',
        'Kỹ thuật làm bông cà phê mùa khô',
      ],
    }
  }

  // Mặc định
  return {
    reply:
      `**Cố vấn Nông nghiệp & Thị trường NoroFarm xin chào bạn!**\n\n` +
      `Về câu hỏi: *"${message}"*, tôi có thể hỗ trợ toàn diện các lĩnh vực:\n\n` +
      '1. **Kỹ thuật nông học & BVTV:** Chẩn đoán sâu bệnh hại (nấm hồng, rệp sáp, xì mủ, rỉ sắt), phác đồ thuốc BVTV đặc trị và chế độ bón phân NPK.\n' +
      '2. **Bản tin giá cả thị trường:** Giá cà phê (Robusta London), hồ tiêu (IPC), sầu riêng, lúa gạo tại vườn và trên các sàn quốc tế.\n' +
      '3. **Chính sách & Xuất khẩu:** Quy định EUDR chống phá rừng, chứng chỉ VietGAP/GlobalGAP, tiêu chuẩn mã số vùng trồng GACC.\n' +
      '4. **Khí tượng nông vụ:** Dự báo thời tiết, khuyến cáo lịch tưới tiêu và bón phân đón mưa.\n\n' +
      'Bạn muốn tìm hiểu chi tiết hơn về vấn đề nào?',
    suggestions: [
      'Cách trị nấm hồng và rệp sáp cà phê?',
      'Giá cà phê hôm nay tại Tây Nguyên',
      'Kỹ thuật chặn đọt sầu riêng khi nuôi trái',
    ],
  }
}

export async function POST(req: Request) {
  let message = ''
  try {
    const request = await req.json()
    message = typeof request.message === 'string' ? request.message : ''
    const { history } = request
    const apiKey = process.env.GEMINI_API_KEY
    const defaultModel = process.env.GEMINI_MODEL || 'gemini-flash-latest'

    if (!message) {
      return NextResponse.json({ error: 'Nội dung tin nhắn không được để trống' }, { status: 400 })
    }

    // Chuẩn bị contents gửi Gemini
    const contents: any[] = []
    if (Array.isArray(history)) {
      for (const m of history.slice(-6)) {
        const role = m.role === 'assistant' || m.role === 'model' ? 'model' : 'user'
        contents.push({ role, parts: [{ text: m.content }] })
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] })

    // Danh sách models để tự động retry nếu gặp 404 hoặc 503
    const modelsToTry = [defaultModel, 'gemini-flash-latest', 'gemini-3.8-flash'].filter(
      (v, idx, arr) => arr.indexOf(v) === idx
    )

    for (const model of apiKey ? modelsToTry : []) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
        const payload = {
          system_instruction: {
            parts: [{ text: NOROFARM_SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        }

        const geminiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (geminiRes.ok) {
          const data = await geminiRes.json()
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) {
            return NextResponse.json({
              reply: text,
              suggestions: [
                'Xem thêm chi tiết kỹ thuật',
                'Hỏi về phân bón cho cây này',
                'Đặt câu hỏi nông vụ khác',
              ],
              model,
            })
          }
        }
      } catch (callErr) {
        console.error(`Gemini call error with ${model}:`, callErr)
      }
    }

    // Nếu toàn bộ models gặp sự cố mạng hoặc quota, dùng engine chuyên gia nội bộ phân loại thông minh
    const fallback = getSmartFallback(message)
    return NextResponse.json({
      reply: fallback.reply,
      suggestions: fallback.suggestions,
      model: 'norofarm-expert-engine',
    })
  } catch (error: any) {
    const fallback = getSmartFallback(typeof message === 'string' ? message : '')
    return NextResponse.json({
      reply: fallback.reply,
      suggestions: fallback.suggestions,
      error: error?.message,
      model: 'norofarm-offline-engine',
    })
  }
}
