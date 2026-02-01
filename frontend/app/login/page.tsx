'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
    const router = useRouter()
    const [redirectUrl, setRedirectUrl] = useState('')

    useEffect(() => {
        setIsClient(true)
        setRedirectUrl(`${window.location.origin}/update-password`)

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                router.push('/')
            }
        })

        return () => subscription.unsubscribe()
    }, [router])

    if (!isClient) return null

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or create a new account to get started
                    </p>
                </div>
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    theme="default"
                    providers={[]}
                    redirectTo={redirectUrl}
                />
            </div>
        </div>
    )
}
