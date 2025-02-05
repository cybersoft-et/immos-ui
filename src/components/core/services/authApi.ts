import { api } from '../../../shared/services/api';
import { LoginUser, RegisteringUser } from '../state/auth';


export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{ token: string; user: LoginUser }, any>({
      query: ( loginUser: LoginUser) => ({
        url: 'https://localhost:5400/api/User/authenticate',
        method: 'POST',
        body: loginUser,
      }),
      invalidatesTags: [{ type: 'Login', id: '' }],
      extraOptions: {
      },
    }),
    register: build.mutation<{ token: string; user: RegisteringUser }, any>({
      query: ( registeringUser: RegisteringUser) => ({
        url: 'https://localhost:5400/api/User/register',
        method: 'POST',
        body: registeringUser,
      }),
      invalidatesTags: [{ type: 'Register', id: '' }],
      extraOptions: {
      },
    }),
  }),
})

export const {
  useLoginMutation
  , useRegisterMutation
} = authApi;


export const { endpoints: { login }, } = authApi
