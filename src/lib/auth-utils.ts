import { Session } from 'next-auth';
import { Role } from '@prisma/client';

/**
 * Check if the current user has admin role
 * @param session The user's session object
 * @returns Boolean indicating if user has admin role
 */
export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === 'ADMIN';
}

/**
 * Check if the current user has manager role or higher
 * @param session The user's session object
 * @returns Boolean indicating if user has manager role or higher
 */
export function isManagerOrAbove(session: Session | null): boolean {
  const role = session?.user?.role;
  return role === 'ADMIN' || role === 'MANAGER';
}

/**
 * Check if the current user has donor role or higher
 * @param session The user's session object
 * @returns Boolean indicating if user has donor role or higher
 */
export function isDonorOrAbove(session: Session | null): boolean {
  const role = session?.user?.role;
  return role === 'ADMIN' || role === 'MANAGER' || role === 'DONOR';
}

/**
 * Get a display-friendly role name
 * @param role The role string from the database
 * @returns Formatted role name for display
 */
export function formatRoleName(role: Role | string | null | undefined): string {
  if (!role) return "Guest";
  
  // Convert to lowercase first, then capitalize first letter
  return role.toString().toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Get all available roles
 * @returns Array of all available roles
 */
export function getAvailableRoles(): Role[] {
  return ["ADMIN", "MANAGER", "DONOR", "GUEST"];
}