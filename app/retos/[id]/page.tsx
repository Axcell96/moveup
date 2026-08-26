import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { buscarEjerciciosWger } from "@/lib/wger"

interface RetoDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function RetoDetailPage({ params }: RetoDetailPageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: reto } = await supabase
        .from("retos")
        .select("*")
        .eq("id", id)
        .single()

    if (!reto) notFound()

    const {ejercicios, error: errorEjercicios} = await buscarEjerciciosWger (reto.tipo)

    const { data: { user } } = await supabase.auth.getUser()

    let esAtleta = false
    let yaParticipa = false

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        esAtleta = profile?.role === 'atleta'

        if (esAtleta) {
            const { data: participacion } = await supabase
                .from('participaciones')
                .select('id')
                .eq('reto_id', id)
                .eq('atleta_id', user.id)
                .maybeSingle()

            yaParticipa = !!participacion
        }
    }

    // Server Action definida DENTRO del componente
    async function unirme() {
        "use server"

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) redirect('/login')

        await supabase.from('participaciones').insert({
            reto_id: id,
            atleta_id: user.id,
        })

        revalidatePath(`/retos/${id}`)
        revalidatePath('/dashboard')
        redirect(`/retos/${id}`)
    }

    return (
        <main className="max-w-2xl mx-auto px-6 py-10">
            <Link href="/retos" className="text-gym-neon hover:text-gym-green mb-6 inline-block">
                &larr; Volver a retos
            </Link>

            <div className="bg-gym-card rounded-2xl p-8 border border-gym-green/20">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gym-neon/15 text-gym-neon uppercase tracking-wide">
                    {reto.tipo}
                </span>

                <h1 className="text-3xl font-bold text-foreground mt-4 mb-1">{reto.titulo}</h1>
                <p className="text-foreground/60 mb-6">{reto.duracion_dias} días de duración</p>

                {reto.descripcion && (
                    <p className="text-foreground/80 mb-6 leading-relaxed whitespace-pre-line">{reto.descripcion}</p>
                )}

                <div className="mt-8 pt-6 border-t border-gym-green/20">
                    <h2 className="text-lg font-bold text-foreground mb-3">Ejercicios sugeridos</h2>
                    {errorEjercicios ? (
                        <p className="text-foreground/50 text-sm">No pudimos cargar sugerencias de ejercicios en este momento.</p>
                    ) : ejercicios.length === 0 ? (
                        <p className="text-foreground/50 text-sm">No encontramos ejercicios sugeridos para este tipo de reto.</p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {ejercicios.map((ej, i) => (
                                <li key={i} className="bg-black/30 rounded-lg px-4 py-2.5 text-sm text-foreground/80">
                                    {ej.nombre}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {esAtleta && (
                    yaParticipa ? (
                        <p className="mt-6 bg-gym-green/10 border border-gym-green/50 text-gym-green text-sm rounded-lg px-4 py-3">
                            Ya te uniste a este reto
                        </p>
                    ) : (
                        <form action={unirme} className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-gym-neon hover:bg-gym-green text-black font-bold uppercase tracking-wide py-3 rounded-lg transition-colors"
                            >
                                Unirme al reto
                            </button>
                        </form>
                    )
                )}
            </div>
        </main>
    )
}