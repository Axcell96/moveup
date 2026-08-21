"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const supabase = createClient()

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState('atleta')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

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
        router.push('/login')
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-4 bg-slate-950">
            <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-xl">
                <h1 className="text-2xl font-bold text-white mb-2">
                    Crear cuenta
                </h1>
                <p className="text-slate-400 mb-8">
                    Únete a MoveUp
                </p>
                {error && (
                    <p className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
                        {error}
                    </p>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={fullName} onChange={e => setFullName(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={email} onChange={e => setEmail(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    />
                    <select
                        value={role} onChange={e => setRole(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500"
                    >
                        <option value="atleta">Atleta</option>
                        <option value="coach">Coach</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Registrarme
                    </button>
                </form>
            </div>
        </section>
    )
}