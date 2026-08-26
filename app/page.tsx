import Link from "next/link"

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-20">
    <div className="fixed inset-0 -z-10 bg-[url('/fondo-inicio.png')] bg-cover bg-center bg-no-repeat" />
    <div className="fixed inset-0 -z-10 bg-black/70" />
    <div className="max-w-3xl text-center relative z-10">
        <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-gym-neon/15 text-gym-neon uppercase tracking-wide mb-6">
          Comunidad fitness
        </span>

        <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight">
          <span className="text-foreground">MOVE</span>
          <span className="text-gym-neon">UP</span>
        </h1>

        <p className="text-xl text-foreground/80 mb-2">
          Retos de entrenamiento con comunidad.
        </p>
        <p className="text-foreground/60 mb-10 max-w-lg mx-auto">
          Únete a los retos que publican los coaches, entrena a tu ritmo y sigue tu progreso junto a otros atletas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/retos"
            className="bg-gym-neon hover:bg-gym-green text-black font-bold uppercase tracking-wide px-8 py-3.5 rounded-lg transition-colors"
          >
            Ver retos
          </Link>
          <Link
            href="/register"
            className="border border-gym-green/40 hover:border-gym-neon text-foreground font-bold uppercase tracking-wide px-8 py-3.5 rounded-lg transition-colors"
          >
            Crear cuenta
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="bg-gym-card rounded-xl p-5 border border-gym-green/20">
            <p className="text-gym-neon font-bold mb-1">Retos variados</p>
            <p className="text-foreground/60 text-sm">Cardio, fuerza, flexibilidad y resistencia, publicados por coaches reales.</p>
          </div>
          <div className="bg-gym-card rounded-xl p-5 border border-gym-green/20">
            <p className="text-gym-neon font-bold mb-1">Comunidad</p>
            <p className="text-foreground/60 text-sm">Entrena junto a otros atletas unidos al mismo reto que tú.</p>
          </div>
          <div className="bg-gym-card rounded-xl p-5 border border-gym-green/20">
            <p className="text-gym-neon font-bold mb-1">Tu progreso</p>
            <p className="text-foreground/60 text-sm">Sigue tus retos activos y tu historial desde tu dashboard.</p>
          </div>
        </div>
      </div>
    </main>
  )
}