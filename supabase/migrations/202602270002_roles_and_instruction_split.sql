alter table public.shifts
  add column if not exists waiter_role text
  check (waiter_role in ('mozo', 'runner', 'bacha', 'cafetero', 'mozo_mostrador'));

alter table public.instructions
  add column if not exists kind text not null default 'company'
  check (kind in ('company', 'role'));

alter table public.instructions
  add column if not exists waiter_role text
  check (waiter_role in ('mozo', 'runner', 'bacha', 'cafetero', 'mozo_mostrador'));

comment on column public.instructions.kind is 'company: politicas/cultura del restaurante, role: instructivo tecnico por puesto';
comment on column public.instructions.waiter_role is 'Requerido cuando kind=role';
