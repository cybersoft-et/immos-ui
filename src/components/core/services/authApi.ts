import axios from 'axios';
import { useMutation } from 'react-query';

export const login = async ({ email, password }: { email: string; password: string }) => {
  const response = await axios.post('/api/login', { email, password });
  return response.data;
};

export const register = async ({ email, password, confirmPassword }: { email: string; password: string; confirmPassword: string }) => {
  const response = await axios.post('/api/register', { email, password, confirmPassword });
  return response.data;
};

export const useLogin = () => {
  return useMutation(login);
};

export const useRegister = () => {
  return useMutation(register);
};

