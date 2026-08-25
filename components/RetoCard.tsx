import Link from "next/link"

interface RetoCardProps {
    id: string
    titulo: string
    descripcion: string | null
    tipo: string
    duracion_dias:number
}
export default function RetoCard ({id, titulo, descripcion, tipo, duracion_dias}: RetoCardProps){
    return (
        <div className="bg-gym-card rounded-xl p-6 border border-gym-green/20 flex flex-col">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-gym-neon/15 text-gym-neon w-fit uppercase tracking-wide">
                {tipo}
            </span>
            <h2 className="text-lg font-bold text-foreground mt-3">{titulo}</h2>
            {descripcion && (
                <p className="text-foreground/60 text-sm mt-2 line-clamp-2">{descripcion}</p>
            )}
            <p className="text-foreground/50 text-xs mt-3">{duracion_dias} días de duración</p>
            <Link
                href={`/retos/${id}`}
                className="mt-4 block text-center w-full bg-gym-neon hover:bg-gym-green text-black font-bold py-2 rounded-lg transition-colors text-sm uppercase tracking-wide"
            >
                Ver detalles &rarr;
            </Link>
        </div>
    )
}