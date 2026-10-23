import { Metadata } from "next"
import { AdminHeader } from "@/features/admin/components/admin-header"
import { AdminGuard } from "@/features/admin/components/admin-guard"
import "react-quill/dist/quill.snow.css"
import { AdminSidebar } from "@/features/admin/components/admin-sidebar"

export const metadata: Metadata = {
  title: "Admin CMS | NoroFarm",
  description: "Quản trị hệ thống NoroFarm",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-muted/40">
        <AdminSidebar />
        <main className="flex-1 pl-64">
          <AdminHeader />
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
