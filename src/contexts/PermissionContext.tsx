'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { permissionGroups, roles, type Role } from '@/config/permissions';

export type PermissionMap = Record<string, boolean>;
export type UserPermissionsOverridesByBranch = Record<string, Record<string, PermissionMap>>; // userId -> branchId -> perms
export type RolePermissions = Record<Role, PermissionMap>;
export type UserRolesByBranch = Record<string, Record<string, Role[]>>; // userId -> branchId -> roles

interface PermissionContextType {
  // Role-level permissions
  getRolePermissions: (role: Role) => PermissionMap;
  setRolePermission: (role: Role, key: string, value: boolean) => void;

  // User-level roles and overrides
  getUserRoles: (userId: string, fallbackRoles?: Role[], branchId?: string) => Role[];
  setUserRoles: (userId: string, roles: Role[], branchId?: string) => void;
  toggleUserRole: (userId: string, role: Role, branchId?: string) => void;
  getUserPermissions: (userId: string, role?: Role, branchId?: string) => PermissionMap; // role param kept for backward compat
  setPermission: (userId: string, key: string, value: boolean, branchId?: string) => void;

  // Access checks
  canAccess: (userId: string, key: string, roles?: Role[] | Role, branchId?: string) => boolean;
  canCurrentAccess: (key: string) => boolean;
}

const STORAGE_KEY = 'pos.permissions.v7';

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
  const [userOverrides, setUserOverrides] = useState<UserPermissionsOverridesByBranch>({});
  const [userRoles, setUserRolesState] = useState<UserRolesByBranch>({});

  useEffect(() => {
    try {
      // Try current version
      let raw = localStorage.getItem(STORAGE_KEY);
      // Migrate from previous versions if needed (v6 -> v7)
      if (!raw) {
        const prev6 = localStorage.getItem('pos.permissions.v6');
        if (prev6) raw = prev6;
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
        // v7 stores overrides/roles per branch; migrate if flat
        if (parsed.userOverrides && !parsed.userOverridesByBranch) {
          const byBranch: UserPermissionsOverridesByBranch = {};
          Object.keys(parsed.userOverrides as Record<string, PermissionMap>).forEach((uid) => {
            byBranch[uid] = { main: parsed.userOverrides[uid] };
          });
          setUserOverrides(byBranch);
        } else if (parsed.userOverridesByBranch) {
          setUserOverrides(parsed.userOverridesByBranch);
        }
        if (parsed.userRoles && !parsed.userRolesByBranch) {
          const byBranch: UserRolesByBranch = {};
          Object.keys(parsed.userRoles as Record<string, Role[]>).forEach((uid) => {
            byBranch[uid] = { main: parsed.userRoles[uid] };
          });
          setUserRolesState(byBranch);
        } else if (parsed.userRolesByBranch) {
          setUserRolesState(parsed.userRolesByBranch);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ rolePermissions, userOverridesByBranch: userOverrides, userRolesByBranch: userRoles })
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

  const getUserRoles = (userId: string, fallback: Role[] = ['staff' as Role], branchId = 'main'): Role[] => {
    const saved = userRoles[userId]?.[branchId];
    return saved && saved.length ? saved : fallback;
  };

  const setUserRoles = (userId: string, rolesArr: Role[], branchId = 'main') => {
    setUserRolesState((prev) => ({ ...prev, [userId]: { ...(prev[userId] ?? {}), [branchId]: rolesArr } }));
  };

  const toggleUserRole = (userId: string, role: Role, branchId = 'main') => {
    setUserRolesState((prev) => {
      const list = prev[userId]?.[branchId] ?? [];
      const current = new Set(list);
      if (current.has(role)) current.delete(role);
      else current.add(role);
      return { ...prev, [userId]: { ...(prev[userId] ?? {}), [branchId]: Array.from(current) } };
    });
  };

  const getUserPermissions = (userId: string, maybeRole?: Role, branchId = 'main'): PermissionMap => {
    // Back-compat: if maybeRole provided and no saved roles, use it as fallback
    const assigned = getUserRoles(userId, maybeRole ? [maybeRole] : undefined, branchId);
    // Union across roles
    const base: PermissionMap = {};
    assigned.forEach((r) => {
      const rp = getRolePermissions(r);
      Object.keys(rp).forEach((k) => {
        base[k] = base[k] || rp[k];
      });
    });
    // Apply per-user overrides
    const overrides = userOverrides[userId]?.[branchId] ?? {};
    const result = { ...base, ...overrides };
    console.log('PermissionContext getUserPermissions:', { userId, branchId, assigned, base, overrides, result });
    return result;
  };

  const setPermission = (userId: string, key: string, value: boolean, branchId = 'main') => {
    setUserOverrides((prev) => {
      const currentForUser = prev[userId] ?? {};
      const current = currentForUser[branchId] ?? {};
      return { ...prev, [userId]: { ...currentForUser, [branchId]: { ...current, [key]: value } } };
    });
  };

  const canAccess = (userId: string, key: string, roleOrRoles?: Role[] | Role, branchId = 'main') => {
    const rolesArr = Array.isArray(roleOrRoles)
      ? roleOrRoles
      : roleOrRoles
      ? [roleOrRoles]
      : undefined;
    const p = getUserPermissions(userId, rolesArr && rolesArr[0], branchId);
    return !!p[key];
  };

  // Lazy inject current user via dynamic import to avoid circular
  const canCurrentAccess = (key: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { useAuth } = require('./AuthContext');
      const { useBranch } = require('./BranchContext');
      const { user } = useAuth();
      const { currentBranchId } = useBranch();
      const userId = user?.id ?? 'anonymous';
      const rolesFromAuth: Role[] | undefined = Array.isArray(user?.roles)
        ? (user.roles as Role[])
        : user?.role
        ? [user.role as Role]
        : undefined;
      const assigned = getUserRoles(userId, rolesFromAuth ?? ['staff' as Role], currentBranchId ?? 'main');
      const p = getUserPermissions(userId, assigned[0], currentBranchId ?? 'main');
      return !!p[key];
    } catch {
      return false;
    }
  };

  // API methods to accept branchId and manage permissions
  function getUserRolesByBranch(userId: string, branchId: string) {
    // logic to get user roles by branch
  }

  function getUserOverridesByBranch(userId: string, branchId: string) {
    // logic to get user overrides by branch
  }

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
