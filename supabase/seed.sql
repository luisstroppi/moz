-- Seed opcional: requiere dos usuarios ya registrados (1 restaurante y 1 mozo)
-- Ejecutar luego de crear cuentas reales y perfiles.

with restaurante as (
  select p.id
  from public.profiles p
  where p.role = 'restaurant'
  order by p.created_at asc
  limit 1
),
mozo as (
  select p.id
  from public.profiles p
  where p.role = 'waiter'
  order by p.created_at asc
  limit 1
)
insert into public.restaurants (id, name, address, phone, description)
select r.id, 'Parrilla Central', 'Av. Siempre Viva 123', '+54 11 5555-0000', 'Restaurante familiar en zona céntrica'
from restaurante r
on conflict (id) do update set
  name = excluded.name,
  address = excluded.address,
  phone = excluded.phone,
  description = excluded.description;

with mozo as (
  select p.id
  from public.profiles p
  where p.role = 'waiter'
  order by p.created_at asc
  limit 1
)
insert into public.waiters (id, full_name, phone, city, bio, experience, preferred_areas)
select m.id, 'Juan Pérez', '+54 11 4444-0000', 'Buenos Aires', 'Mozo responsable y puntual', '3 años en gastronomía', 'Centro, Palermo'
from mozo m
on conflict (id) do update set
  full_name = excluded.full_name,
  phone = excluded.phone,
  city = excluded.city,
  bio = excluded.bio,
  experience = excluded.experience,
  preferred_areas = excluded.preferred_areas;

with restaurante as (
  select p.id
  from public.profiles p
  where p.role = 'restaurant'
  order by p.created_at asc
  limit 1
)
insert into public.instructions (restaurant_id, title, youtube_url, notes)
select r.id, 'Protocolo de apertura', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Revisar mise en place y checklist'
from restaurante r
where not exists (
  select 1 from public.instructions i where i.restaurant_id = r.id
);

with restaurante as (
  select p.id
  from public.profiles p
  where p.role = 'restaurant'
  order by p.created_at asc
  limit 1
)
insert into public.shifts (restaurant_id, title, start_at, end_at, requirements, status)
select r.id, 'Turno almuerzo', now() + interval '1 day', now() + interval '1 day 4 hours', 'Experiencia en salón', 'open'
from restaurante r
union all
select r.id, 'Turno noche', now() + interval '2 day', now() + interval '2 day 5 hours', 'Buena atención al cliente', 'open'
from restaurante r;
