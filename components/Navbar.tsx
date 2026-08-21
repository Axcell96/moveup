import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function Navbar() {
    const supabase = await createClient()
    const {data: {user}}= await supabase.auth.getUser()

    let fullName: string | null = null
    if (user){
        const {data: profile}= await supabase
            .from('profiles')
            .select('full_name')
            .eq('id',user.id)
            .single()
        fullName = profile?.full_name ?? null
    }

    async function signOut() {
        "use server"
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    return (
        <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                MoveUp
            </Link>

            <div className="flex items-center gap-6">
                <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                    Inicio
                </Link>
                <Link href="/retos" className="text-slate-400 hover:text-white transition-colors">
                    Retos
                </Link>
                <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                    Dashboard
                </Link>

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-slate-300 text-sm">
                            {fullName ?? user.email}
                        </span>
                        <form action={signOut}>
                            <button
                                type="submit"
                                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                Cerrar sesión
                            </button>
                        </form>
                    </div>
                ) : (
                    <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    )
}