'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
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
        <div className="flex min-h-screen flex-col items-center justify-center p-6 relative">
            {/* Background Glows explicitly for Login if layout doesn't cover enough */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -z-10" />

            <div className="w-full max-w-sm space-y-8 glass-card p-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                        Voice<span className="text-blue-400">AI</span>
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Enterprise Document Agent
                    </p>
                </div>

                <div className="supabase-auth-container">
                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: '#3b82f6',
                                        brandAccent: '#2563eb',
                                        inputBackground: 'rgba(255, 255, 255, 0.05)',
                                        inputBorder: 'rgba(255, 255, 255, 0.1)',
                                        inputText: 'white',
                                        inputPlaceholder: 'rgba(255, 255, 255, 0.3)',
                                    }
                                }
                            },
                            className: {
                                button: 'w-full !rounded-xl !py-3 !font-semibold !transition-all !duration-200',
                                input: '!rounded-xl !border-slate-800 !bg-slate-900/50 !text-white focus:!border-blue-500 focus:!ring-1 focus:!ring-blue-500',
                                label: '!text-slate-400 !text-xs !font-medium !uppercase !tracking-wider !mb-1',
                                anchor: '!text-blue-400 hover:!text-blue-300 !text-sm !font-medium',
                                message: '!text-red-400 !text-sm !mt-1',
                            }
                        }}
                        theme="dark"
                        providers={[]}
                        redirectTo={redirectUrl}
                    />
                </div>
            </div>

            <p className="mt-8 text-slate-500 text-xs text-center border-t border-slate-800 pt-4 w-64">
                Secure enterprise-grade encryption for all voice data.
            </p>
        </div>
    )
}
