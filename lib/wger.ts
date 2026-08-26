export type EjercicioSugerido = {
  nombre: string
}

type WgerTranslation = {
  name?: string
  language?: number
}

type WgerListResponse = {
  results?: WgerTranslation[]
}

const OFFSET_POR_TIPO: Record<string, number> = {
  Cardio: 0,
  Fuerza: 200,
  Flexibilidad: 400,
  Resistencia: 600,
}

export async function buscarEjerciciosWger(tipo: string): Promise<{
  ejercicios: EjercicioSugerido[]
  error: boolean
}> {
  const offset = OFFSET_POR_TIPO[tipo] ?? 0

  try {
    const res = await fetch(
      `https://wger.de/api/v2/exercise-translation/?limit=100&offset=${offset}&format=json`
    )

    if (!res.ok) {
      return { ejercicios: [], error: true }
    }

    const data = (await res.json()) as WgerListResponse
    const resultados = Array.isArray(data.results) ? data.results : []

    const ejercicios: EjercicioSugerido[] = resultados
      .filter((r) => r.language === 2 && Boolean(r.name))
      .map((r) => ({ nombre: r.name as string }))
      .slice(0, 5)

    return { ejercicios, error: false }
  } catch {
    return { ejercicios: [], error: true }
  }
}