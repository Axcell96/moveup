import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export default function NuevoRetoPage() {
    async function crearReto(formData: FormData) {
        "use server"

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) redirect('/login')
        
        const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

        if (profile?.role !== 'coach') redirect('/dashboard')

        const titulo = formData.get('titulo') as string
        const descripcion = formData.get('descripcion') as string
        const tipo = formData.get('tipo') as string
        const duracionDias = Number(formData.get('duracion_dias'))

        
        const { error } = await supabase.from('retos').insert({
            coach_id: user.id,
            titulo,
            descripcion,
            tipo,
            duracion_dias: duracionDias,
        })

        if (error) {
          throw new Error(error.message)
        }

        revalidatePath('/retos')
        revalidatePath('/dashboard')
        redirect('/dashboard')
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-2xl bg-gym-card rounded-2xl p-8 shadow-xl border border-gym-green/20">
                <h1 className="text-2xl font-bold text-foreground mb-1">
                    Publicar nuevo reto
                </h1>
                <p className="text-foreground/60 mb-8">
                    Completa los detalles para que los atletas puedan unirse
                </p>

                <form action={crearReto} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-foreground/80 text-sm font-semibold mb-2">
                            Título
                        </label>
                        <input name="titulo" placeholder="Ej: 21 días de cardio en casa"
                            required
                            className="w-full bg-black/40 text-foreground placeholder:text-foreground/40 rounded-lg px-4 py-3.5 text-base
                                border border-gym-green/30 focus:outline-none focus:border-gym-neon" />
                    </div>

                    <div>
                        <label className="block text-foreground/80 text-sm font-semibold mb-2">
                            Descripción
                        </label>
                        <textarea name="descripcion"
                            placeholder="Explica en qué consiste el reto, la rutina a seguir, reglas, nivel recomendado..."
                            rows={7}
                            className="w-full bg-black/40 text-foreground placeholder:text-foreground/40 rounded-lg px-4 py-3.5 text-base
                                border border-gym-green/30 focus:outline-none focus:border-gym-neon resize-y" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-foreground/80 text-sm font-semibold mb-2">
                                Tipo
                            </label>
                            <select name="tipo"
                                className="w-full bg-black/40 text-foreground rounded-lg px-4 py-3.5 text-base
                                    border border-gym-green/30 focus:outline-none focus:border-gym-neon">
                                <option value="Cardio">Cardio</option>
                                <option value="Fuerza">Fuerza</option>
                                <option value="Flexibilidad">Flexibilidad</option>
                                <option value="Resistencia">Resistencia</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-foreground/80 text-sm font-semibold mb-2">
                                Duración (días)
                            </label>
                            <input name="duracion_dias" type="number"
                                defaultValue={7} min={1}
                                className="w-full bg-black/40 text-foreground rounded-lg px-4 py-3.5 text-base
                                    border border-gym-green/30 focus:outline-none focus:border-gym-neon" />
                        </div>
                    </div>

                    <button type="submit"
                        className="bg-gym-neon hover:bg-gym-green
                            text-black font-bold uppercase tracking-wide py-3.5 text-base
                            rounded-lg transition-colors mt-2">
                        Publicar reto
                    </button>
                </form>
            </div>
        </section>
    )
}