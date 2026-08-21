import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export default function NuevoRetoPage() {
    // Server Action definida DENTRO del componente
    async function crearReto(formData: FormData) {
        "use server"

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) redirect('/login')

        const titulo = formData.get('titulo') as string
        const descripcion = formData.get('descripcion') as string
        const tipo = formData.get('tipo') as string
        const duracionDias = Number(formData.get('duracion_dias'))

        await supabase.from('retos').insert({
            coach_id: user!.id,
            titulo,
            descripcion,
            tipo,
            duracion_dias: duracionDias,
        })

        revalidatePath('/retos')
        revalidatePath('/dashboard')
        redirect('/dashboard')
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-950">
            <div className="w-full max-w-2xl bg-slate-800 rounded-2xl p-8 shadow-xl">
                <h1 className="text-2xl font-bold text-white mb-1">
                    Publicar nuevo reto
                </h1>
                <p className="text-slate-400 mb-8">
                    Completa los detalles para que los atletas puedan unirse
                </p>

                <form action={crearReto} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">
                            Título
                        </label>
                        <input name="titulo" placeholder="Ej: 21 días de cardio en casa"
                            required
                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-3.5 text-base
                                border border-slate-600 focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">
                            Descripción
                        </label>
                        <textarea name="descripcion"
                            placeholder="Explica en qué consiste el reto, la rutina a seguir, reglas, nivel recomendado..."
                            rows={7}
                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-3.5 text-base
                                border border-slate-600 focus:outline-none focus:border-blue-500 resize-y" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-300 text-sm font-semibold mb-2">
                                Tipo
                            </label>
                            <select name="tipo"
                                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3.5 text-base
                                    border border-slate-600 focus:outline-none focus:border-blue-500">
                                <option value="Cardio">Cardio</option>
                                <option value="Fuerza">Fuerza</option>
                                <option value="Flexibilidad">Flexibilidad</option>
                                <option value="Resistencia">Resistencia</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-300 text-sm font-semibold mb-2">
                                Duración (días)
                            </label>
                            <input name="duracion_dias" type="number"
                                defaultValue={7} min={1}
                                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3.5 text-base
                                    border border-slate-600 focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <button type="submit"
                        className="bg-blue-500 hover:bg-blue-600
                            text-white font-semibold py-3.5 text-base
                            rounded-lg transition-colors mt-2">
                        Publicar reto
                    </button>
                </form>
            </div>
        </section>
    )
}