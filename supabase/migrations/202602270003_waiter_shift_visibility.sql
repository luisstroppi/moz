drop policy if exists "shifts_waiter_select_open" on public.shifts;

create policy "shifts_waiter_select_relevant" on public.shifts
  for select to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
      and p.role = 'waiter'
    )
    and (
      status = 'open'
      or hired_waiter_id = auth.uid()
      or exists (
        select 1
        from public.applications a
        where a.shift_id = shifts.id
        and a.waiter_id = auth.uid()
      )
    )
  );
