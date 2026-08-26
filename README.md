# MoveUp

Aplicación web de retos de entrenamiento con comunidad. Un `coach` publica retos de ejercicio y un `atleta` se une a los retos que le interesan, sigue su progreso y entrena junto a otros usuarios.

Proyecto Integrador — Aplicaciones Web, Instituto Axcell.

**Demo en producción:** https://moveup-gold.vercel.app
**Repositorio:** https://github.com/Axcell96/moveup

## Roles

- **atleta** — se une a retos, ve sus retos activos en su dashboard.
- **coach** — publica retos, ve sus retos publicados, edita, elimina y consulta los participantes de cada uno.

El rol se guarda en la base de datos (tabla `profiles`), no está hardcodeado en el frontend.

## Funcionalidades principales

- Registro e inicio de sesión con Supabase Auth.
- Roles diferenciados con dashboards distintos para atleta y coach.
- CRUD completo de retos: crear, listar, ver detalle, editar y eliminar (solo el coach dueño del reto puede editarlo o eliminarlo).
- Los atletas pueden unirse a un reto y ver los retos a los que ya están unidos.
- Los coaches pueden ver la lista de atletas participantes en cada uno de sus retos.
- Búsqueda de retos por texto en `/retos` (componente interactivo con `useState`).
- Sugerencia de ejercicios relacionados con el tipo de reto, obtenidos en tiempo real desde la API pública de [wger.de](https://wger.de/api/v2/) mediante `fetch` + `async/await`, con manejo de errores de red y de la API.
- Row Level Security (RLS) activado en Supabase para las tres tablas principales.

## Rutas

| Ruta | Tipo | Descripción |
|---|---|---|
| `/` | Pública | Página de inicio |
| `/retos` | Pública | Listado de retos publicados, con buscador |
| `/retos/[id]` | Pública/dinámica | Detalle de un reto + ejercicios sugeridos (wger.de) |
| `/login`, `/register` | Pública | Autenticación |
| `/dashboard` | Privada | Panel según rol (coach o atleta) |
| `/dashboard/nueva-reto` | Privada (coach) | Publicar un nuevo reto |
| `/dashboard/mis-retos` | Privada | Coach: gestionar sus retos. Atleta: ver retos activos |
| `/dashboard/mis-retos/[id]/editar` | Privada (coach) | Editar un reto propio |

## Modelo de datos (Supabase / PostgreSQL)

```
auth.users (Supabase Auth)
    │
    ├─▶ profiles          (id = auth.users.id, full_name, role, bio)
    │
    ├─▶ retos             (coach_id → auth.users.id, titulo, descripcion, tipo, duracion_dias)
    │       │
    │       └─▶ participaciones  (reto_id → retos.id, atleta_id → auth.users.id)
```

- Un coach tiene muchos retos (relación uno-a-muchos).
- Un reto tiene muchos participantes a través de la tabla intermedia `participaciones` (relación muchos-a-muchos entre atletas y retos).
- `participaciones.reto_id` tiene `ON DELETE CASCADE`: al eliminar un reto se eliminan automáticamente sus participaciones.

## Stack técnico

- **Frontend / Backend:** Next.js 15 (App Router), React, TypeScript
- **Estilos:** Tailwind CSS
- **Base de datos y autenticación:** Supabase (PostgreSQL + Auth + RLS)
- **API externa:** [wger.de API v2](https://wger.de/api/v2/) — catálogo de ejercicios
- **Despliegue:** Vercel

## Correr el proyecto localmente

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Axcell96/moveup.git
   cd moveup
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables (obtenerlas desde el panel de tu proyecto en Supabase → Project Settings → API):

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   ```

4. Ejecutar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir [http://localhost:3000](http://localhost:3000).

## Notas

- La API de wger.de es una fuente de datos externa e independiente de Supabase (Supabase almacena usuarios, retos y participaciones; wger.de solo aporta el catálogo de ejercicios sugeridos).
- El archivo `.env.local` no se sube al repositorio (está en `.gitignore`); en producción, las variables de entorno se configuran directamente en Vercel.
