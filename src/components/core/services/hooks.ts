import { useMutation } from "react-query";
import { login, register } from "./authApi";

export const useLogin = () => {
    return useMutation(login);
  };
  
  export const useRegister = () => {
    return useMutation(register);
  };