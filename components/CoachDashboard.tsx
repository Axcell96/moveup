import Link from "next/link"

interface CoachDashboardProps {
    profile: { full_name: string | null, bio: string | null }
    totalRetos: number
    totalParticipantes: number
}

export default function CoachDashboard({
    profile,totalRetos,totalParticipantes,}: CoachDashboardProps) {
    return (
        <main className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Hola, {profile.full_name}
                    </h1>
                    <p className="text-foreground/60">
                        {profile.bio ?? 'Panel de coach'}
                    </p>
                </div>
                <Link href="/dashboard/nueva-reto"
                    className="bg-gym-neon hover:bg-gym-green
                        text-black font-bold uppercase tracking-wide
                        px-5 py-3 rounded-lg transition-colors">
                    + Publicar reto
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gym-card rounded-xl p-6 border border-gym-green/20">
                    <p className="text-foreground/60 text-sm mb-1">Mis retos</p>
                    <p className="text-3xl font-bold text-gym-neon">{totalRetos}</p>
                </div>
                <Link href="/dashboard/mis-retos"
                    className="bg-gym-card rounded-xl p-6 border border-gym-green/20 hover:border-gym-neon transition-colors block">
                    <p className="text-foreground/60 text-sm mb-1">Participantes totales</p>
                    <p className="text-3xl font-bold text-gym-neon">{totalParticipantes}</p>
                </Link>
            </div>
        </main>
    )
}