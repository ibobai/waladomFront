import { useAuth } from '../contexts/AuthContext';

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const refreshTokens = async (): Promise<RefreshResponse> => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch('https://www.waladom.club/api/auth/refresh', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${refreshToken}`,
      'Content-Type' : 'application/json'

    }
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  return data;
};

export const createAuthenticatedFetch = () => {
  let isRefreshing = false;
  let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void; }[] = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token!);
      }
    });
    
    failedQueue = [];
  };

  return async (url: string, options: RequestInit = {}) => {
    // Add auth header if we have a token
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      };
    }

    try {
      const response = await fetch(url, options);

      // If the request was successful, return it
      if (response.ok) {
        return response;
      }

      // If we get a 401 and have a refresh token, try to refresh
      if (response.status === 401 && localStorage.getItem('refreshToken')) {
        if (isRefreshing) {
          // If we're already refreshing, wait for the new token
          try {
            const token = await new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            
            // Retry the request with the new token
            options.headers = {
              ...options.headers,
              'Authorization': `Bearer ${token}`
            };
            return fetch(url, options);
          } catch (err) {
            throw err;
          }
        }

        isRefreshing = true;

        try {
          const { accessToken, refreshToken } = await refreshTokens();
          
          // Store new tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          // Update auth header with new token
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`
          };

          // Process queued requests
          processQueue(null, accessToken);
          
          // Retry the request with the new token
          return fetch(url, options);
        } catch (error) {
          processQueue(error, null);
          throw error;
        } finally {
          isRefreshing = false;
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  };
};

export const authenticatedFetch = createAuthenticatedFetch();