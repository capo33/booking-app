import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as apiClient from '../api-client';
import { useAppContext } from '../hooks/useAppContext';
import { useNavigate } from 'react-router-dom';

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async() => {
      showToast({
        message: 'Account created successfully',
        type: 'SUCCESS',
      });
      await queryClient.invalidateQueries('validateToken');
      navigate('/');
    },
    onError: (error: Error) => {
      showToast({
        message: error.message,
        type: 'ERROR',
      });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className='flex flex-col gap-5' onSubmit={onSubmit}>
      <h2 className='text-3xl font-bold'>Create an Account</h2>
      <div className='flex flex-col md:flex-row gap-5'>
        <label className='text-gray-700 text-sm font-bold flex-1'>
          First Name
          <input
            className='border rounded w-full py-1 px-2 font-normal'
            {...register('firstName', { required: 'this field is required' })}
          />
          {errors.firstName && (
            <span className='text-red-600'>{errors.firstName.message}</span>
          )}
        </label>
        <label className='text-gray-700 text-sm font-bold flex-1'>
          Last Name
          <input
            className='border rounded w-full py-1 px-2 font-normal'
            {...register('lastName', { required: 'this field is required' })}
          />
          {errors.lastName && (
            <span className='text-red-600'>{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label className='text-gray-700 text-sm font-bold flex-1'>
        Email
        <input
          type='email'
          className='border rounded w-full py-1 px-2 font-normal'
          {...register('email', { required: 'this field is required' })}
        />
        {errors.email && (
          <span className='text-red-600'>{errors.email.message}</span>
        )}
      </label>
      <label className='text-gray-700 text-sm font-bold flex-1'>
        Password
        <input
          type='password'
          className='border rounded w-full py-1 px-2 font-normal'
          {...register('password', {
            required: 'this field is required',
            minLength: {
              value: 6,
              message: 'password must be at least 6 characters',
            },
          })}
        />
        {errors.password && (
          <span className='text-red-600'>{errors.password.message}</span>
        )}
      </label>
      <label className='text-gray-700 text-sm font-bold flex-1'>
        Confirm Password
        <input
          type='password'
          className='border rounded w-full py-1 px-2 font-normal'
          {...register('confirmPassword', {
            validate: (value) => {
              if (!value) {
                return 'this field is required';
              } else if (watch('password') !== value) {
                return 'passwords do not match';
              }
            },
          })}
        />
        {errors.confirmPassword && (
          <span className='text-red-600'>{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        <button
          type='submit'
          className='bg-blue-600 text-white p-2 font-bold hover:bg-slate-500 text-xl'
        >
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;
