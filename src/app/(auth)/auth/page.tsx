'use client'

import { Suspense } from 'react'
import { AuthForm } from '@/components/features/auth/auth-form'
import { AuthHero } from '@/components/features/auth/auth-hero'

export default function AuthPage() {
  return (
    <main className="fixed inset-0 bg-[#0d0d0f] flex flex-col md:flex-row">
      <Suspense fallback={null}>
        <AuthForm />
      </Suspense>
      <AuthHero />
    </main>
  )
}
