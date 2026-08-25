"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

const supabase = createClient()

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        const { error } = await supabase.auth.signInWithPassword({
            email, password
        })
        if (error) {
            setError(error.message)
            return
        }
        router.push('/dashboard')
        router.refresh()
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-gym-card rounded-2xl p-8 shadow-xl border border-gym-green/20">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                    Iniciar sesión
                </h1>
                <p className="text-foreground/60 mb-8">
                    Accede a tu cuenta de MoveUp
                </p>
                {error && (
                    <p className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
                        {error}
                    </p>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={email} onChange={e => setEmail(e.target.value)}
                        className="bg-black/40 text-foreground placeholder:text-foreground/40 rounded-lg px-4 py-3 border border-gym-green/30 focus:outline-none focus:border-gym-neon"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password} onChange={e => setPassword(e.target.value)}
                        className="bg-black/40 text-foreground placeholder:text-foreground/40 rounded-lg px-4 py-3 border border-gym-green/30 focus:outline-none focus:border-gym-neon"
                    />
                    <button
                        type="submit"
                        className="bg-gym-neon hover:bg-gym-green text-black font-bold uppercase tracking-wide py-3 rounded-lg transition-colors"
                    >
                        Iniciar sesión
                    </button>
                </form>
                <p className="text-foreground/60 text-center mt-6">
                    ¿No tienes cuenta?{" "}
                    <Link href="/register" className="text-gym-neon hover:text-gym-green font-semibold">
                        Regístrate
                    </Link>
                </p>
            </div>
        </section>
    )
}