"use server"

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function actualizarReto(retoId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: reto } = await supabase
        .from("retos")
        .select("coach_id")
        .eq("id", retoId)
        .single()

    if (!reto || reto.coach_id !== user.id) {
        throw new Error("No tienes permiso para editar este reto")
    }

    const { error } = await supabase
        .from("retos")
        .update({
            titulo: formData.get("titulo") as string,
            descripcion: formData.get("descripcion") as string,
            tipo: formData.get("tipo") as string,
            duracion_dias: Number(formData.get("duracion_dias")),
        })
        .eq("id", retoId)

    if (error) throw new Error(error.message)

    revalidatePath("/dashboard/mis-retos")
    revalidatePath(`/retos/${retoId}`)
    redirect("/dashboard/mis-retos")
}

export async function eliminarReto(retoId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: reto } = await supabase
        .from("retos")
        .select("coach_id")
        .eq("id", retoId)
        .single()

    if (!reto || reto.coach_id !== user.id) {
        throw new Error("No tienes permiso para eliminar este reto")
    }

    const { error } = await supabase.from("retos").delete().eq("id", retoId)
    if (error) throw new Error(error.message)

    revalidatePath("/dashboard/mis-retos")
}