export type Role = "restaurant" | "waiter";

export type Profile = {
  id: string;
  role: Role;
  created_at: string;
};
