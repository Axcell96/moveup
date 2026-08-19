-- 1. profiles: extiende auth.users
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    role text not null default 'atleta',
    bio text,
    created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "lectura_publica_profiles" on profiles
    for select using (true);

create policy "usuario_edita_su_perfil" on profiles
    for update using (auth.uid() = id);

-- 2. retos: el recurso principal
create table public.retos (
    id uuid primary key default gen_random_uuid(),
    coach_id uuid not null references auth.users(id) on delete cascade,
    titulo text not null,
    descripcion text,
    tipo text not null,
    duracion_dias int not null default 7,
    created_at timestamptz not null default now()
);

alter table public.retos enable row level security;

create policy "lectura_publica_retos" on retos
    for select using (true);

create policy "solo_coach_publica_retos" on retos
    for insert with check (
        auth.uid() = coach_id
        and (select role from profiles where id = auth.uid()) = 'coach'
    );

create policy "solo_autor_edita_reto" on retos
    for update using (auth.uid() = coach_id);

create policy "solo_autor_elimina_reto" on retos
    for delete using (auth.uid() = coach_id);

-- 3. participaciones: tabla intermedia (un atleta se une a un reto)
create table public.participaciones (
    id uuid primary key default gen_random_uuid(),
    reto_id uuid not null references public.retos(id) on delete cascade,
    atleta_id uuid not null references auth.users(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique (reto_id, atleta_id)
);

alter table public.participaciones enable row level security;

create policy "atleta_ve_sus_participaciones" on participaciones
    for select using (auth.uid() = atleta_id);

create policy "coach_ve_participaciones_de_sus_retos" on participaciones
    for select using (
        auth.uid() = (select coach_id from retos where retos.id = participaciones.reto_id)
    );

create policy "atleta_se_une_a_reto" on participaciones
    for insert with check (
        auth.uid() = atleta_id
        and (select role from profiles where id = auth.uid()) = 'atleta'
    );

-- 4. Trigger: crear la fila en profiles automáticamente al registrarse
create function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, role)
    values (
        new.id,
        new.raw_user_meta_data->>'full_name',
        coalesce(new.raw_user_meta_data->>'role', 'atleta')
    );
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();