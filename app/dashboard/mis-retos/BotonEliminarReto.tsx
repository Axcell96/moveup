"use client"

export default function BotonEliminarReto({
  retoId,
  onDelete,
}: {
  retoId: string
  onDelete: (id: string) => Promise<void>
}) {
  return (
    <button
      onClick={() => {
        if (confirm("¿Seguro que quieres eliminar este reto? Esta acción no se puede deshacer.")) {
          onDelete(retoId)
        }
      }}
      className="text-red-400 hover:underline text-sm font-semibold"
    >
      Eliminar
    </button>
  )
}