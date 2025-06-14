import axios from 'axios';

export const login = async ({ userName, password }: { userName: string; password: string }) => {
  const response = await axios.post('https://localhost:8000/api/Auth/authenticate', { userName, password });
  return response.data;
};

export const register = async ({ email, password, confirmPassword }: { email: string; password: string; confirmPassword: string }) => {
  const response = await axios.post('/api/register', { email, password, confirmPassword });
  return response.data;
};



