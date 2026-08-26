"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase"

const supabase = createClient()

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState('atleta')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        const { error } = await supabase.auth.signUp({
            email, password,
            options: { data: { full_name: fullName, role } }
        })
        if (error) {
            setError(error.message)
            return
        }
        setSuccess(true)
        setTimeout(() => {
            // eslint-disable-next-line
            window.location.href = '/'
        }, 1800)
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-gym-card rounded-2xl p-8 shadow-xl border border-gym-green/20">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                    Crear cuenta
                </h1>
                <p className="text-foreground/60 mb-8">
                    Únete a MoveUp
                </p>
                {error && (
                    <p className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
                        {error}
                    </p>
                )}
                {success ? (
                    <p className="bg-gym-green/10 border border-gym-green/50 text-gym-green text-sm rounded-lg px-4 py-4 text-center">
                        ¡Cuenta creada correctamente! Redirigiendo al inicio...
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={fullName} onChange={e => setFullName(e.target.value)}
                            className="bg-black/40 text-foreground placeholder:text-foreground/40 rounded-lg px-4 py-3 border border-gym-green/30 focus:outline-none focus:border-gym-neon"
                        />
                        <input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            value={email} onChange={e => setEmail(e.target.value)}
                            className="bg-black/40 text-foreground placeholder:text-foreground/40 rounded-lg px-4 py-3 border border-gym-green/30 focus:outline-none focus:border-gym-neon"
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="bg-black/40 text-foreground placeholder:text-foreground/40 rounded-lg px-4 py-3 border border-gym-green/30 focus:outline-none focus:border-gym-neon"
                        />
                        <select
                            value={role} onChange={e => setRole(e.target.value)}
                            className="bg-black/40 text-foreground rounded-lg px-4 py-3 border border-gym-green/30 focus:outline-none focus:border-gym-neon"
                        >
                            <option value="atleta">Atleta</option>
                            <option value="coach">Coach</option>
                        </select>
                        <button
                            type="submit"
                            className="bg-gym-neon hover:bg-gym-green text-black font-bold uppercase tracking-wide py-3 rounded-lg transition-colors"
                        >
                            Registrarme
                        </button>
                    </form>
                )}
            </div>
        </section>
    )
}