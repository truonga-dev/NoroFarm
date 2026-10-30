import { Metadata } from "next"
import { AdminHeader } from "@/features/admin/components/admin-header"
import { AdminGuard } from "@/features/admin/components/admin-guard"
import "react-quill/dist/quill.snow.css"
import { AdminSidebar } from "@/features/admin/components/admin-sidebar"

export const metadata: Metadata = {
  title: "Admin CMS | NoroFarm",
  description: "Trung tâm quản trị hệ thống NoroFarm",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-muted/30">
        <AdminSidebar />
        <main className="min-w-0 md:pl-60">
          <AdminHeader />
          <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
