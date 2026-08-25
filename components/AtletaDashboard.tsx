interface AtletaDashboardProps {
    profile: {full_name: string | null}
    totalParticipaciones: number
}

export default function AtletaDashboard({
    profile, totalParticipaciones,}:AtletaDashboardProps){
        return (
        <main className="max-w-4xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">
                Hola, {profile.full_name}
            </h1>
            <p className="text-foreground/60 mb-8">
                Este es tu panel como atleta
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gym-card rounded-xl p-6 border border-gym-green/20">
                    <p className="text-foreground/60 text-sm mb-1">Mis retos activos</p>
                    <p className="text-3xl font-bold text-gym-neon">{totalParticipaciones}</p>
                </div>
                <div className="bg-gym-card rounded-xl p-6 border border-gym-green/20">
                    <p className="text-foreground/60 text-sm mb-1">Retos completados</p>
                    <p className="text-3xl font-bold text-gym-neon">0</p>
                </div>
            </div>
        </main>
    )
}