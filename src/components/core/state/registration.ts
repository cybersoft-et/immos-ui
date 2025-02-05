import { createSlice } from '@reduxjs/toolkit'
import { authApi } from '../services/authApi';

export interface RegisteringUser {
  id?: string | null,
  password : string,
  confirmPassword : string,
  email : string
}

export interface RegistrationState {
  registeringUser : RegisteringUser ,
  registrationStatus : boolean | string,
  registrationMessage : string | null,
  error?: string | null | Error
}

const initialState: RegistrationState = {
  registeringUser : {
    confirmPassword : '',
    email : '',
    password : '',
    id: null,
  },
  registrationStatus : false,
  registrationMessage: null,
  error: null
}

export const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.register.matchPending, (state, action) => {
        console.log('pending', action)
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action: any) => {
        console.log('fulfilled', action)
        state.registrationStatus  = action.payload.data.Succeeded;
        state.registrationMessage = action.payload.data.Message;
        state.registeringUser.id  = action.payload.data.Data;
        state.error               = action.payload.data.error;
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action: any) => {
        console.log('rejected #2', action.payload.data)
        state.registrationStatus  = action.payload.data.Succeeded;
        state.registeringUser.id  = null;
        state.registrationMessage = action.payload.data.Message;
        state.error               = action.payload.data.Errors
      })
  },
})


export default registrationSlice.reducer

export const getStatus = (state: any) => state.registrationStatus;
export const getRegistrationError = (state: any) => state.error;

