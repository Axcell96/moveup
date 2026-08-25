import { createClient } from "@/lib/supabase-server"
import RetosListClient from "@/components/RetosListClient"

export default async function RetosPage() {
    const supabase = await createClient()

    const {data:retos}= await supabase
    .from('retos')
    .select('*')
    .order('created_at',{ascending: false})

    return (
        <main className="max-w-5xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">
                Retos disponibles
            </h1>
            <p className="text-foreground/60 mb-8">
                Explora los retos publicados por nuestros coaches y únete al que más te motive
            </p>
            <RetosListClient retos={retos ?? []} />
        </main>
    )
}