'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { AdminMobileSidebar } from '@/components/admin/admin-mobile-sidebar'
export default function AdminAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar */}
      <AdminMobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content */}
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        <AdminTopbar onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
