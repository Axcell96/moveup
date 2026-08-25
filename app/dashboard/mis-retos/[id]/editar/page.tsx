import { createClient } from "@/lib/supabase-server"
import { notFound, redirect } from "next/navigation"
import { actualizarReto } from "@/app/dashboard/actions"

export default async function EditarRetoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: reto } = await supabase
    .from("retos")
    .select("*")
    .eq("id", id)
    .single()

  if (!reto) notFound()
  if (reto.coach_id !== user.id) redirect("/dashboard/mis-retos")

  const actualizarRetoConId = actualizarReto.bind(null, reto.id)

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-gym-card rounded-2xl p-8 shadow-xl border border-gym-green/20">
        <h1 className="text-2xl font-bold text-foreground mb-8">Editar reto</h1>

        <form action={actualizarRetoConId} className="flex flex-col gap-6">
          <div>
            <label className="block text-foreground/80 text-sm font-semibold mb-2">Título</label>
            <input name="titulo" defaultValue={reto.titulo} required
              className="w-full bg-black/40 text-foreground rounded-lg px-4 py-3.5 text-base border border-gym-green/30 focus:outline-none focus:border-gym-neon" />
          </div>

          <div>
            <label className="block text-foreground/80 text-sm font-semibold mb-2">Descripción</label>
            <textarea name="descripcion" defaultValue={reto.descripcion} rows={7}
              className="w-full bg-black/40 text-foreground rounded-lg px-4 py-3.5 text-base border border-gym-green/30 focus:outline-none focus:border-gym-neon resize-y" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-foreground/80 text-sm font-semibold mb-2">Tipo</label>
              <select name="tipo" defaultValue={reto.tipo}
                className="w-full bg-black/40 text-foreground rounded-lg px-4 py-3.5 text-base border border-gym-green/30 focus:outline-none focus:border-gym-neon">
                <option value="Cardio">Cardio</option>
                <option value="Fuerza">Fuerza</option>
                <option value="Flexibilidad">Flexibilidad</option>
                <option value="Resistencia">Resistencia</option>
              </select>
            </div>

            <div>
              <label className="block text-foreground/80 text-sm font-semibold mb-2">Duración (días)</label>
              <input name="duracion_dias" type="number" defaultValue={reto.duracion_dias} min={1}
                className="w-full bg-black/40 text-foreground rounded-lg px-4 py-3.5 text-base border border-gym-green/30 focus:outline-none focus:border-gym-neon" />
            </div>
          </div>

          <button type="submit"
            className="bg-gym-neon hover:bg-gym-green text-black font-bold uppercase tracking-wide py-3.5 text-base rounded-lg transition-colors mt-2">
            Guardar cambios
          </button>
        </form>
      </div>
    </section>
  )
}