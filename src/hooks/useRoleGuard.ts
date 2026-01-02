import type { UserRole } from '../types';
import { useAuth } from './useAuth';

export const useRoleGuard = (requiredRoles?: UserRole[]) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return { hasAccess: false, isLoading: false };
  }
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return { hasAccess: true, isLoading: false };
  }
  
  const hasAccess = requiredRoles.includes(user.role);
  
  return { hasAccess, isLoading: false };
};
