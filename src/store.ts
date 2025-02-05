import { AuthReducer, RegistrationReducer } from './components/core/state'
import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'
import { api } from './shared/services/api'

export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined
) =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      auth     : AuthReducer,
      register : RegistrationReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    ...options,
  })

export const store = createStore()
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
