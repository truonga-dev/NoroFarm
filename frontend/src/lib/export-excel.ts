/**
 * Module xuất báo cáo Excel & CSV chuẩn mực dành cho Quản trị viên NoroFarm
 * Xuất file Excel (.xls - Microsoft XML Spreadsheet 2003) với định dạng bảng biểu,
 * màu sắc thương hiệu NoroFarm, viền ô, căn lề và định dạng số chuyên nghiệp.
 */

function escapeXml(unsafe: any): string {
  if (unsafe === null || unsafe === undefined) return ""
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export function exportAdminReportToExcel(analytics: any, dateRangeText: string = "Tuần này") {
  const now = new Date()
  const exportDateStr = now.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  const fileDateStr = now.toISOString().split("T")[0]

  const totalArticles = Number(analytics?.total_articles ?? 0)
  const totalCommodities = Number(analytics?.total_commodities ?? 0)
  const activeAnnouncements = Number(analytics?.active_announcements ?? 0)
  const totalUsers = Number(analytics?.total_users ?? 0)

  const trafficData = Array.isArray(analytics?.traffic_data) ? analytics.traffic_data : []
  const totalViews = trafficData.reduce((sum: number, t: any) => sum + Number(t.views || 0), 0)
  const totalVisitors = trafficData.reduce((sum: number, t: any) => sum + Number(t.users || 0), 0)

  // Map ngày tiếng Việt chuẩn
  const dayNames: Record<string, string> = {
    T2: "Thứ Hai",
    T3: "Thứ Ba",
    T4: "Thứ Tư",
    T5: "Thứ Năm",
    T6: "Thứ Sáu",
    T7: "Thứ Bảy",
    CN: "Chủ Nhật",
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>Báo cáo vận hành NoroFarm</Title>
  <Subject>Báo cáo quản trị hệ thống</Subject>
  <Author>NoroFarm Admin</Author>
  <Company>NoroFarm Nông Nghiệp Số</Company>
  <Created>${now.toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <!-- Main Title -->
  <Style ss:ID="MainTitle">
   <Font ss:FontName="Segoe UI" ss:Size="16" ss:Bold="1" ss:Color="#166534"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <!-- Subtitle -->
  <Style ss:ID="SubTitle">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Italic="1" ss:Color="#64748B"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <!-- Section Title -->
  <Style ss:ID="SectionHeader">
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <!-- Table Header -->
  <Style ss:ID="TableHeader">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#15803D" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#14532D"/>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#14532D"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#14532D"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#14532D"/>
   </Borders>
  </Style>
  <!-- Data Cells -->
  <Style ss:ID="CellLeft">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellCenter">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="CellNumber">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <!-- Zebra Rows -->
  <Style ss:ID="ZebraLeft">
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="ZebraCenter">
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="ZebraNumber">
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <!-- Total Summary Row -->
  <Style ss:ID="TotalLabel">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#0F172A"/>
   <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#94A3B8"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="TotalNumber">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#166534"/>
   <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#94A3B8"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="BaoCaoTongQuan">
  <Table ss:DefaultRowHeight="22">
   <!-- Set professional column widths -->
   <Column ss:Width="45"/>
   <Column ss:Width="230"/>
   <Column ss:Width="110"/>
   <Column ss:Width="100"/>
   <Column ss:Width="130"/>
   <Column ss:Width="240"/>

   <!-- Title Header Block -->
   <Row ss:Height="26">
    <Cell ss:MergeAcross="5" ss:StyleID="MainTitle"><Data ss:Type="String">BÁO CÁO VẬN HÀNH HỆ THỐNG NÔNG NGHIỆP SỐ NOROFARM</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="5" ss:StyleID="SubTitle"><Data ss:Type="String">Kỳ báo cáo: ${escapeXml(dateRangeText)}  |  Thời gian xuất: ${escapeXml(exportDateStr)}  |  Người trích xuất: Quản trị viên (Admin)</Data></Cell>
   </Row>
   <Row ss:Height="12"></Row>

   <!-- SECTION 1: SYSTEM STATS -->
   <Row ss:Height="24">
    <Cell ss:MergeAcross="5" ss:StyleID="SectionHeader"><Data ss:Type="String">1. CÁC CHỈ SỐ HOẠT ĐỘNG CỐT LÕI</Data></Cell>
   </Row>
   <Row ss:Height="24">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">STT</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Chỉ số vận hành</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Số lượng</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Đơn vị tính</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Trạng thái</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Mô tả / Ghi chú</Data></Cell>
   </Row>

   <Row>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="Number">1</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">Tổng bài viết cẩm nang &amp; tin tức</Data></Cell>
    <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${totalArticles}</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">Bài viết</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">Đang hoạt động</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">Kho tri thức &amp; cẩm nang kỹ thuật canh tác</Data></Cell>
   </Row>

   <Row>
    <Cell ss:StyleID="ZebraCenter"><Data ss:Type="Number">2</Data></Cell>
    <Cell ss:StyleID="ZebraLeft"><Data ss:Type="String">Mặt hàng nông sản theo dõi giá</Data></Cell>
    <Cell ss:StyleID="ZebraNumber"><Data ss:Type="Number">${totalCommodities}</Data></Cell>
    <Cell ss:StyleID="ZebraCenter"><Data ss:Type="String">Mặt hàng</Data></Cell>
    <Cell ss:StyleID="ZebraCenter"><Data ss:Type="String">Đang cập nhật</Data></Cell>
    <Cell ss:StyleID="ZebraLeft"><Data ss:Type="String">Giá thu mua tại vườn và sàn giao dịch 2026</Data></Cell>
   </Row>

   <Row>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="Number">3</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">Thông báo &amp; Cảnh báo hệ thống</Data></Cell>
    <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${activeAnnouncements}</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">Thông báo</Data></Cell>
    <Cell ss:StyleID="CellCenter"><Data ss:Type="String">Hiển thị</Data></Cell>
    <Cell ss:StyleID="CellLeft"><Data ss:Type="String">Cảnh báo biến động giá và thời tiết nông vụ</Data></Cell>
   </Row>

   <Row>
    <Cell ss:StyleID="ZebraCenter"><Data ss:Type="Number">4</Data></Cell>
    <Cell ss:StyleID="ZebraLeft"><Data ss:Type="String">Tổng thành viên đăng ký</Data></Cell>
    <Cell ss:StyleID="ZebraNumber"><Data ss:Type="Number">${totalUsers}</Data></Cell>
    <Cell ss:StyleID="ZebraCenter"><Data ss:Type="String">Tài khoản</Data></Cell>
    <Cell ss:StyleID="ZebraCenter"><Data ss:Type="String">Đã xác thực</Data></Cell>
    <Cell ss:StyleID="ZebraLeft"><Data ss:Type="String">Nông dân, Hợp tác xã và Thương lái</Data></Cell>
   </Row>

   <Row ss:Height="14"></Row>

   <!-- SECTION 2: TRAFFIC & ENGAGEMENT -->
   <Row ss:Height="24">
    <Cell ss:MergeAcross="5" ss:StyleID="SectionHeader"><Data ss:Type="String">2. THỐNG KÊ LƯU LƯỢNG TRUY CẬP (TRAFFIC)</Data></Cell>
   </Row>
   <Row ss:Height="24">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">STT</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Thời gian / Ngày</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Lượt xem (Views)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Người dùng (Users)</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Tỷ lệ tương tác</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Đánh giá lưu lượng</Data></Cell>
   </Row>

   ${trafficData
     .map((t: any, index: number) => {
       const isZebra = index % 2 === 1
       const views = Number(t.views || 0)
       const users = Number(t.users || 0)
       const ratio = users > 0 ? (views / users).toFixed(2) + "x" : "--"
       const dayLabel = dayNames[t.name] || t.name || `Ngày ${index + 1}`
       const note =
         views >= 800 ? "Lưu lượng cao điểm" : views >= 500 ? "Lưu lượng tốt" : "Mức ổn định"

       return `
   <Row>
    <Cell ss:StyleID="${isZebra ? "ZebraCenter" : "CellCenter"}"><Data ss:Type="Number">${index + 1}</Data></Cell>
    <Cell ss:StyleID="${isZebra ? "ZebraLeft" : "CellLeft"}"><Data ss:Type="String">${escapeXml(dayLabel)}</Data></Cell>
    <Cell ss:StyleID="${isZebra ? "ZebraNumber" : "CellNumber"}"><Data ss:Type="Number">${views}</Data></Cell>
    <Cell ss:StyleID="${isZebra ? "ZebraNumber" : "CellNumber"}"><Data ss:Type="Number">${users}</Data></Cell>
    <Cell ss:StyleID="${isZebra ? "ZebraCenter" : "CellCenter"}"><Data ss:Type="String">${ratio}</Data></Cell>
    <Cell ss:StyleID="${isZebra ? "ZebraLeft" : "CellLeft"}"><Data ss:Type="String">${note}</Data></Cell>
   </Row>`
     })
     .join("")}

   <!-- Total Row -->
   <Row ss:Height="24">
    <Cell ss:MergeAcross="1" ss:StyleID="TotalLabel"><Data ss:Type="String">TỔNG CỘNG TRONG KỲ</Data></Cell>
    <Cell ss:StyleID="TotalNumber"><Data ss:Type="Number">${totalViews}</Data></Cell>
    <Cell ss:StyleID="TotalNumber"><Data ss:Type="Number">${totalVisitors}</Data></Cell>
    <Cell ss:StyleID="TotalLabel"><Data ss:Type="String">${totalVisitors > 0 ? (totalViews / totalVisitors).toFixed(2) + "x" : "--"}</Data></Cell>
    <Cell ss:StyleID="TotalLabel"><Data ss:Type="String">Hoàn thành thống kê</Data></Cell>
   </Row>

   <Row ss:Height="16"></Row>
   <Row>
    <Cell ss:MergeAcross="5" ss:StyleID="SubTitle"><Data ss:Type="String">© 2026 NoroFarm - Nền tảng số hóa nông nghiệp toàn diện Việt Nam. Báo cáo lưu hành nội bộ.</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`

  // Xuất file .xls
  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `bao-cao-quan-tri-norofarm-${fileDateStr}.xls`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportAdminReportToCsv(analytics: any, dateRangeText: string = "Tuần này") {
  const now = new Date()
  const exportDateStr = now.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  const fileDateStr = now.toISOString().split("T")[0]

  const trafficData = Array.isArray(analytics?.traffic_data) ? analytics.traffic_data : []
  const totalViews = trafficData.reduce((sum: number, t: any) => sum + Number(t.views || 0), 0)
  const totalVisitors = trafficData.reduce((sum: number, t: any) => sum + Number(t.users || 0), 0)

  const dayNames: Record<string, string> = {
    T2: "Thứ Hai",
    T3: "Thứ Ba",
    T4: "Thứ Tư",
    T5: "Thứ Năm",
    T6: "Thứ Sáu",
    T7: "Thứ Bảy",
    CN: "Chủ Nhật",
  }

  // sep=, ở đầu file giúp Microsoft Excel trên mọi phiên bản Windows tự động chia cột
  const lines: string[] = [
    "sep=,",
    `"BÁO CÁO VẬN HÀNH HỆ THỐNG NÔNG NGHIỆP SỐ NOROFARM"`,
    `"Kỳ báo cáo: ${dateRangeText}","Thời gian xuất: ${exportDateStr}","Trích xuất: Quản trị viên (Admin)"`,
    "",
    `"1. CÁC CHỈ SỐ HOẠT ĐỘNG CỐT LÕI"`,
    `"STT","Chỉ số vận hành","Số lượng","Đơn vị tính","Trạng thái","Mô tả / Ghi chú"`,
    `1,"Tổng bài viết cẩm nang & tin tức",${Number(analytics?.total_articles ?? 0)},"Bài viết","Đang hoạt động","Kho tri thức & cẩm nang kỹ thuật canh tác"`,
    `2,"Mặt hàng nông sản theo dõi giá",${Number(analytics?.total_commodities ?? 0)},"Mặt hàng","Đang cập nhật","Giá thu mua tại vườn và sàn giao dịch 2026"`,
    `3,"Thông báo & Cảnh báo hệ thống",${Number(analytics?.active_announcements ?? 0)},"Thông báo","Hiển thị","Cảnh báo biến động giá và thời tiết nông vụ"`,
    `4,"Tổng thành viên đăng ký",${Number(analytics?.total_users ?? 0)},"Tài khoản","Đã xác thực","Nông dân, Hợp tác xã và Thương lái"`,
    "",
    `"2. THỐNG KÊ LƯU LƯỢNG TRUY CẬP (TRAFFIC)"`,
    `"STT","Thời gian / Ngày","Lượt xem (Views)","Người dùng (Users)","Tỷ lệ tương tác","Đánh giá lưu lượng"`,
    ...trafficData.map((t: any, index: number) => {
      const views = Number(t.views || 0)
      const users = Number(t.users || 0)
      const ratio = users > 0 ? (views / users).toFixed(2) + "x" : "--"
      const dayLabel = dayNames[t.name] || t.name || `Ngày ${index + 1}`
      const note = views >= 800 ? "Lưu lượng cao điểm" : views >= 500 ? "Lưu lượng tốt" : "Mức ổn định"
      return `${index + 1},"${dayLabel}",${views},${users},"${ratio}","${note}"`
    }),
    `"","TỔNG CỘNG TRONG KỲ",${totalViews},${totalVisitors},"${totalVisitors > 0 ? (totalViews / totalVisitors).toFixed(2) + "x" : "--"}","Hoàn thành thống kê"`,
    "",
    `"© 2026 NoroFarm - Nền tảng số hóa nông nghiệp toàn diện Việt Nam. Báo cáo lưu hành nội bộ."`,
  ]

  const csvContent = "\uFEFF" + lines.join("\r\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `bao-cao-quan-tri-norofarm-${fileDateStr}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
