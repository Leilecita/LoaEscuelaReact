// src/hooks/useUsers.ts
import { useState, useEffect } from "react";
import api from "../services/axiosClient";

export type UserOption = { label: string; value: number };
export type UserOptionRaw = { id?: number; userId?: number; value?: number; name?: string; nombre?: string };

export const useUsers = (isAdmin: boolean, userId?: number) => {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    if (!isAdmin) return;

    try {
      const { data } = await api.get<{ data: UserOptionRaw[] }>("/users.php", { params: { method: "getAll" } });

      if (Array.isArray(data.data)) {
        const formatted: UserOption[] = data.data.map((u) => ({
          label: u.name || u.nombre || "Sin nombre",
          value: Number(u.id || u.userId || u.value),
        }));
        setUsers(formatted);
      }
    } catch (error) {
      console.error("Error cargando usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isAdmin]);

  return { users, loading, fetchUsers, setUsers };
};
