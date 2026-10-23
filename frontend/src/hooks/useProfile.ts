import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../api/services/profile.service';

export const useProfile = () => {
  const queryClient = useQueryClient();

  const useProfileQuery = () => {
    return useQuery({
      queryKey: ['profile'],
      queryFn: () => profileService.getProfile(),
    });
  };

  const updateProfileMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: profileService.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    useProfileQuery,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    isUploading: uploadAvatarMutation.isPending,
  };
};
