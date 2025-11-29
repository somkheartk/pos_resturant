'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { permissionGroups, roles, type Role } from '@/config/permissions';

export type PermissionMap = Record<string, boolean>;
export type UserPermissionsOverrides = Record<string, PermissionMap>;
export type RolePermissions = Record<Role, PermissionMap>;
export type UserRolesMap = Record<string, Role[]>;

interface PermissionContextType {
  // Role-level permissions
  getRolePermissions: (role: Role) => PermissionMap;
  setRolePermission: (role: Role, key: string, value: boolean) => void;

  // User-level roles and overrides
  getUserRoles: (userId: string, fallbackRoles?: Role[]) => Role[];
  setUserRoles: (userId: string, roles: Role[]) => void;
  toggleUserRole: (userId: string, role: Role) => void;
  getUserPermissions: (userId: string, role?: Role) => PermissionMap; // role param kept for backward compat
  setPermission: (userId: string, key: string, value: boolean) => void;

  // Access checks
  canAccess: (userId: string, key: string, roles?: Role[] | Role) => boolean;
  canCurrentAccess: (key: string) => boolean;
}

const STORAGE_KEY = 'pos.permissions.v6';

const defaultRolePermissions = (): RolePermissions => {
  const initial: Partial<RolePermissions> = {};
  roles.forEach((r) => {
    const map: PermissionMap = {};
    permissionGroups.forEach((group) => {
      group.items.forEach((item) => {
        const def = item.defaults?.[r.key as Role] ?? false;
        map[item.key] = !!def;
      });
    });
    initial[r.key as Role] = map;
  });
  return initial as RolePermissions;
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(() => defaultRolePermissions());
  const [userOverrides, setUserOverrides] = useState<UserPermissionsOverrides>({});
  const [userRoles, setUserRolesState] = useState<UserRolesMap>({});

  useEffect(() => {
    try {
      // Try current version
      let raw = localStorage.getItem(STORAGE_KEY);
      // Migrate from previous version if needed
      if (!raw) {
        const prev = localStorage.getItem('pos.permissions.v5');
        if (prev) raw = prev;
      }
      if (raw) {
        const parsed = JSON.parse(raw);
        // Merge saved permissions with new defaults to include any new permissions
        const merged: RolePermissions = defaultRolePermissions();
        if (parsed.rolePermissions) {
          Object.keys(parsed.rolePermissions).forEach((role) => {
            merged[role as Role] = { ...merged[role as Role], ...parsed.rolePermissions[role] };
          });
          setRolePermissions(merged);
        } else {
          setRolePermissions(merged);
        }
        if (parsed.userOverrides) setUserOverrides(parsed.userOverrides);
        if (parsed.userRoles) setUserRolesState(parsed.userRoles);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ rolePermissions, userOverrides, userRoles })
      );
    } catch {}
  }, [rolePermissions, userOverrides, userRoles]);

  const getRolePermissions = (role: Role): PermissionMap => {
    return rolePermissions[role] ?? (defaultRolePermissions()[role] ?? {});
  };

  const setRolePermission = (role: Role, key: string, value: boolean) => {
    setRolePermissions((prev) => ({
      ...prev,
      [role]: { ...(prev[role] ?? {}), [key]: value },
    }));
  };

  const getUserRoles = (userId: string, fallback: Role[] = ['staff' as Role]): Role[] => {
    const saved = userRoles[userId];
    return saved && saved.length ? saved : fallback;
  };

  const setUserRoles = (userId: string, rolesArr: Role[]) => {
    setUserRolesState((prev) => ({ ...prev, [userId]: rolesArr }));
  };

  const toggleUserRole = (userId: string, role: Role) => {
    setUserRolesState((prev) => {
      const current = new Set(prev[userId] ?? []);
      if (current.has(role)) current.delete(role);
      else current.add(role);
      return { ...prev, [userId]: Array.from(current) };
    });
  };

  const getUserPermissions = (userId: string, maybeRole?: Role): PermissionMap => {
    // Back-compat: if maybeRole provided and no saved roles, use it as fallback
    const assigned = getUserRoles(userId, maybeRole ? [maybeRole] : undefined);
    // Union across roles
    const base: PermissionMap = {};
    assigned.forEach((r) => {
      const rp = getRolePermissions(r);
      Object.keys(rp).forEach((k) => {
        base[k] = base[k] || rp[k];
      });
    });
    // Apply per-user overrides
    const overrides = userOverrides[userId] ?? {};
    const result = { ...base, ...overrides };
    console.log('PermissionContext getUserPermissions:', { userId, assigned, base, overrides, result });
    return result;
  };

  const setPermission = (userId: string, key: string, value: boolean) => {
    setUserOverrides((prev) => {
      const current = prev[userId] ?? {};
      return { ...prev, [userId]: { ...current, [key]: value } };
    });
  };

  const canAccess = (userId: string, key: string, roleOrRoles?: Role[] | Role) => {
    const rolesArr = Array.isArray(roleOrRoles)
      ? roleOrRoles
      : roleOrRoles
      ? [roleOrRoles]
      : undefined;
    const p = getUserPermissions(userId, rolesArr && rolesArr[0]);
    return !!p[key];
  };

  // Lazy inject current user via dynamic import to avoid circular
  const canCurrentAccess = (key: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { useAuth } = require('./AuthContext');
      const { user } = useAuth();
      const userId = user?.id ?? 'anonymous';
      const rolesFromAuth: Role[] | undefined = Array.isArray(user?.roles)
        ? (user.roles as Role[])
        : user?.role
        ? [user.role as Role]
        : undefined;
      const assigned = getUserRoles(userId, rolesFromAuth ?? ['staff' as Role]);
      const p = getUserPermissions(userId, assigned[0]);
      return !!p[key];
    } catch {
      return false;
    }
  };

  const value = useMemo(
    () => ({
      getRolePermissions,
      setRolePermission,
      getUserRoles,
      setUserRoles,
      toggleUserRole,
      getUserPermissions,
      setPermission,
      canAccess,
      canCurrentAccess,
    }),
    [rolePermissions, userOverrides, userRoles]
  );

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermissions() {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error('usePermissions must be used within PermissionProvider');
  return ctx;
}
