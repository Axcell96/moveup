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
        <nav className="bg-black border-b border-gym-green/20 px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-gym-neon tracking-wide hover:text-gym-green transition-colors">
                MOVEUP
            </Link>

            <div className="flex items-center gap-6">
                <Link href="/" className="text-foreground/70 hover:text-gym-neon transition-colors">
                    Inicio
                </Link>
                <Link href="/retos" className="text-foreground/70 hover:text-gym-neon transition-colors">
                    Retos
                </Link>
                <Link href="/dashboard" className="text-foreground/70 hover:text-gym-neon transition-colors">
                    Mi panel
                </Link>

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-foreground/80 text-sm">
                            {fullName ?? user.email}
                        </span>
                        <form action={signOut}>
                            <button
                                type="submit"
                                className="bg-gym-card hover:bg-gym-card/70 text-foreground font-semibold px-4 py-2 rounded-lg border border-gym-green/30 transition-colors"
                            >
                                Cerrar sesión
                            </button>
                        </form>
                    </div>
                ) : (
                    <Link href="/login" className="bg-gym-neon hover:bg-gym-green text-black font-bold px-4 py-2 rounded-lg transition-colors">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    )
}