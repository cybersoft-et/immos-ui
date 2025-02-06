import { useMutation } from 'react-query';
import { login, register } from './api';


export const useLogin = () => {
return useMutation(login);
};
  
export const useRegister = () => {
return useMutation(register);
};