const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

export const apiRequest = async (endpoint: string, options: ApiOptions = {}) => {
  const { requireAuth = true, ...fetchOptions } = options;
  
  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  };

  // Add authorization header if required
  if (requireAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle unauthorized responses
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Helper functions for common HTTP methods
export const API_BASE = {
  get: (endpoint: string, options?: ApiOptions) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, data?: any, options?: ApiOptions) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: (endpoint: string, data?: any, options?: ApiOptions) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: (endpoint: string, options?: ApiOptions) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};