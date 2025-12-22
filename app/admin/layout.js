'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import { isAdminAuthenticated } from '@/lib/auth'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip authentication check for login page
    if (pathname === '/admin/login') return

    // Check if user is authenticated
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
    }
  }, [pathname, router])

  // Don't show nav on login page
  if (pathname === '/admin/login') {
    return children
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="py-8">
        {children}
      </main>
    </div>
  )
}
