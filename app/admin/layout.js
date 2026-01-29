'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import { onAdminAuthChanged } from '@/lib/auth'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    // Skip authentication check for login page
    if (pathname === '/admin/login') return

    const unsubscribe = onAdminAuthChanged((user, isAdmin) => {
      if (!user || !isAdmin) {
        router.push('/admin/login')
      }
      setCheckingAuth(false)
    })

    return () => unsubscribe()
  }, [pathname, router])

  // Don't show nav on login page
  if (pathname === '/admin/login') {
    return children
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Verificando sesión...</div>
      </div>
    )
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
