import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://3.139.201.71:8000/api/';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Rutas públicas que NO deben llevar token de autorización
const PUBLIC_ROUTES = ['/auth/token/', '/users/register/'];

// Interceptor para inyectar el token JWT en cada petición
apiClient.interceptors.request.use(
  async (config) => {
    // No inyectar token en rutas públicas (login, registro)
    const isPublic = PUBLIC_ROUTES.some(route => config.url?.includes(route));
    if (isPublic) {
      return config;
    }

    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log('Error obteniendo el token de SecureStore', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
