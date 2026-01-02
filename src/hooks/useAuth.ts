import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const store = useAuthStore();
  
  const isAdmin = store.user?.role === 'ADMIN';
  const isTeacher = store.user?.role === 'TEACHER';
  const isTeam = store.user?.role === 'TEAM';
  const canManage = isAdmin || isTeacher;
  
  return {
    ...store,
    isAdmin,
    isTeacher,
    isTeam,
    canManage,
  };
};
