import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import { RootState } from '../../store';

const baseQuery = fetchBaseQuery({
  // baseUrl: process.env.api_url,
  baseUrl : '/',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authentication', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 0 })

export const api = createApi({

  reducerPath: 'cybercrm-core',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Login', 'Register'],
  endpoints: () => ({}),
})

export const enhancedApi = api.enhanceEndpoints({
  endpoints: () => ({
    login   : ()  => 'login',
    register: ()  => 'register',
  }),
})
