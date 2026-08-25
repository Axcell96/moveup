"use client"
import { useState } from "react"
import RetoCard from "./RetoCard"

interface Reto {
    id: string
    titulo: string
    descripcion: string | null
    tipo: string
    duracion_dias: number
}

interface RetosListClientProps {
    retos: Reto[]
}

export default function RetosListClient({ retos }: RetosListClientProps) {
    const [busqueda, setBusqueda] = useState('')

    const retosFiltrados = retos.filter(reto =>
        reto.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        reto.tipo.toLowerCase().includes(busqueda.toLowerCase())
    )

    return (
        <div>
            <input
                type="text"
                placeholder="Buscar por título o tipo (Cardio, Fuerza...)"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full bg-black/40 text-foreground placeholder:text-foreground/40 rounded-lg px-4 py-3 border border-gym-green/30 mb-8 focus:outline-none focus:border-gym-neon"
            />

            {retosFiltrados.length === 0 && (
                <p className="text-foreground/60">No se encontraron retos.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {retosFiltrados.map(reto => (
                    <RetoCard key={reto.id} {...reto} />
                ))}
            </div>
        </div>
    )
}