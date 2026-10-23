import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/services/auth.service';
import { useAuthStore } from '../store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';

export const useAuth = () => {
  const { setAuth, logout, updateUser, user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async () => {
      // Fetch user profile after login (cookie is now set by backend)
      try {
        const response = await authService.getMe();
        const userData = response?.data || response;
        if (userData) setAuth(userData);
        const isAdmin = userData?.roles?.some((r: any) => r.name === 'admin') || userData?.is_superuser;
        const redirect = searchParams.get('redirect');
        
        if (redirect) {
          router.push(redirect);
        } else if (isAdmin) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } catch (e) {
        console.error('Failed to fetch user profile', e);
        // Đăng nhập thành công nhưng không lấy được profile -> có thể lỗi mạng hoặc cookie bị chặn
        throw new Error('Không thể xác thực phiên đăng nhập. Vui lòng thử lại.');
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      router.push('/login');
    },
  });

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout failed on backend', e);
    }
    logout();
    queryClient.clear();
    window.location.href = '/login';
  };

  // Helper: extract error message from native fetch ApiError
  const getErrorMessage = (err: any): string => {
    // err.data comes from ApiError in client.ts: errorData?.detail || errorData?.message
    return (
      err?.data?.detail ||
      err?.data?.message ||
      err?.message ||
      'Đã xảy ra lỗi. Vui lòng thử lại.'
    );
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    getErrorMessage,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: handleLogout,
    updateUser,
  };
};

/**
 * Hook riêng để lấy thông tin user hiện tại từ server.
 * Dùng trong các component cần dữ liệu profile mới nhất.
 */
export const useCurrentUser = () => {
  const { setAuth, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await authService.getMe();
      const userData = response?.data || response;
      if (userData) setAuth(userData);
      return userData;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: 1,
  });
};
