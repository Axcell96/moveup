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
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Hola, {profile.full_name}
                    </h1>
                    <p className="text-slate-400">
                        {profile.bio ?? 'Panel de coach'}
                    </p>
                </div>
                <Link href="/dashboard/nueva-reto"
                    className="bg-blue-500 hover:bg-blue-600
                        text-white font-semibold
                        px-5 py-3 rounded-lg transition-colors">
                    + Publicar reto
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-xl p-6">
                    <p className="text-slate-400 text-sm mb-1">Mis retos</p>
                    <p className="text-3xl font-bold text-white">{totalRetos}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6">
                    <p className="text-slate-400 text-sm mb-1">Participantes totales</p>
                    <p className="text-3xl font-bold text-white">{totalParticipantes}</p>
                </div>
            </div>
        </main>
    )
}