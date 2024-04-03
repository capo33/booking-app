import { useMutation, useQueryClient } from 'react-query';

import * as apiClient from '../api-client';
import { useAppContext } from '../hooks/useAppContext';

const SignOutButton = () => {
  const queryClient = useQueryClient()
  const { showToast } = useAppContext();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries('validateToken'); // this will refetch the user data
      showToast({
        message: 'User signed out successfully',
        type: 'SUCCESS',
      });
    },
    onError: (error: Error) => {
      showToast({
        message: error.message,
        type: 'ERROR',
      });
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <button
      onClick={handleLogout}
      className='text-blue-600 px-3 font-bold bg-white hover:bg-gray-100'
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
