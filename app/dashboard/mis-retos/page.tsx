import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { eliminarReto } from "@/app/dashboard/actions"
import BotonEliminarReto from "./BotonEliminarReto"

export default async function MisRetosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role === "coach") {
    const { data: retos } = await supabase
      .from("retos")
      .select("*, participaciones(atleta_id)")
      .eq("coach_id", user.id)
      .order("created_at", { ascending: false })

    const atletaIds = Array.from(
      new Set(
        retos?.flatMap((r) => r.participaciones?.map((p: { atleta_id: string }) => p.atleta_id) ?? []) ?? []
      )
    )

    const { data: atletas } = atletaIds.length
      ? await supabase.from("profiles").select("id, full_name").in("id", atletaIds)
      : { data: [] }

    const nombrePorId = new Map(atletas?.map((a) => [a.id, a.full_name]) ?? [])

    return (
      <section className="min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-8">Mis retos publicados</h1>

          {(!retos || retos.length === 0) && (
            <p className="text-foreground/60">Todavía no has publicado ningún reto.</p>
          )}

          <div className="flex flex-col gap-6">
            {retos?.map((reto) => (
              <div key={reto.id} className="bg-gym-card rounded-2xl p-6 border border-gym-green/20">
                <h2 className="text-xl font-bold text-foreground mb-1">{reto.titulo}</h2>
                <p className="text-foreground/60 mb-4">{reto.duracion_dias} días de duración</p>

                <p className="text-foreground/80 text-sm font-semibold mb-2">
                  Participantes ({reto.participaciones?.length ?? 0})
                </p>
                {reto.participaciones?.length ? (
                  <ul className="text-foreground/60 text-sm mb-4 list-disc list-inside">
                    {reto.participaciones.map((p: { atleta_id: string }) => (
                      <li key={p.atleta_id}>{nombrePorId.get(p.atleta_id) ?? "Atleta"}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-foreground/40 text-sm mb-4">Nadie se ha unido todavía.</p>
                )}

                <div className="flex gap-4">
                  <Link
                    href={`/dashboard/mis-retos/${reto.id}/editar`}
                    className="text-gym-neon hover:underline text-sm font-semibold"
                  >
                    Editar
                  </Link>
                  <BotonEliminarReto retoId={reto.id} onDelete={eliminarReto} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const { data: participaciones } = await supabase
    .from("participaciones")
    .select("reto_id, retos(*)")
    .eq("atleta_id", user.id)

  return (
    <section className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">Mis retos activos</h1>

        {(!participaciones || participaciones.length === 0) && (
          <p className="text-foreground/60">Todavía no te has unido a ningún reto.</p>
        )}

        <div className="flex flex-col gap-6">
          {participaciones?.map((p) => {
            const reto = p.retos as unknown as { titulo: string; duracion_dias: number } | null
            return (
              <Link
                key={p.reto_id}
                href={`/retos/${p.reto_id}`}
                className="block bg-gym-card rounded-2xl p-6 border border-gym-green/20 hover:border-gym-neon transition-colors"
              >
                <h2 className="text-xl font-bold text-foreground">{reto?.titulo}</h2>
                <p className="text-foreground/60">{reto?.duracion_dias} días de duración</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}