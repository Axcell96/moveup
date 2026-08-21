import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import AtletaDashboard from "@/components/AtletaDashboard"
import CoachDashboard from "@/components/CoachDashboard"

export default async function DashboardPage() {
    const supabase = await createClient()
    const {data:{user}} = await supabase.auth.getUser()

    //El proxi ya protege esta ruta, pero verificamos igual
    if (!user) redirect ('/login')

    const {data:profile} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()
        
    if (profile?.role === 'coach'){
        const {data: misRetos} = await supabase
            .from('retos')
            .select('id')
            .eq('coach_id', user!.id)

        const idsDeMisRetos = misRetos?.map(reto => reto.id)??[]

        //cuantas participaciones recibieron esos retos en total
        const { count: totalParticipantes } = idsDeMisRetos.length>0? await supabase
            .from('participaciones')
            .select('*',{count:'exact', head: true})
            .in('reto_id',idsDeMisRetos):
            {count: 0}

        return (
            <CoachDashboard
                profile={profile}
                totalRetos={idsDeMisRetos.length}
                totalParticipantes={totalParticipantes ?? 0}
            />
        )

    }
    
    // Cuantas veces se unio este atleta a un reto
    const { count: totalParticipaciones } = await supabase
        .from('participaciones')
        .select('*', { count: 'exact', head: true })
        .eq('atleta_id', user!.id)

    return (
        <AtletaDashboard
            profile={profile}
            totalParticipaciones={totalParticipaciones ?? 0}
        />
    ) 
}