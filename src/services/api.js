import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import logger from '../utils/logger';

const BASE_URL = 'http://3.139.201.71:8000/api/';
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
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
      logger.log('Error obteniendo el token de SecureStore', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Función para refrescar el token
const refreshAuthToken = async () => {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await axios.post(`${BASE_URL}auth/token/refresh/`, {
      refresh: refreshToken,
    });

    const { access } = response.data;
    await SecureStore.setItemAsync('userToken', access);
    return access;
  } catch (error) {
    logger.error('Error al refrescar el token:', error);
    // Si falla el refresco, limpiamos todo para forzar login
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userData');
    throw error;
  }
};

// Interceptor para manejar errores (ej. 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const method = originalRequest?.method?.toLowerCase();

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Evitar bucles infinitos si la ruta es el propio refresh
      if (originalRequest.url.includes('auth/token/refresh/')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        const newToken = await refreshAuthToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // El refresco falló, redirigir al usuario o manejar el error
        error.friendlyMessage = 'Su sesión ha expirado definitivamente. Por favor, inicie sesión de nuevo.';
        return Promise.reject(error);
      }
    }

    // Retry con backoff exponencial para errores de servidor en requests seguras
    const shouldRetry500 =
      error.response?.status >= 500 &&
      error.response?.status < 600 &&
      ['get', 'head', 'options'].includes(method);

    if (shouldRetry500) {
      originalRequest._retry500Count = originalRequest._retry500Count || 0;
      if (originalRequest._retry500Count < 3) {
        originalRequest._retry500Count += 1;
        const delayMs = 500 * (2 ** (originalRequest._retry500Count - 1));
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return apiClient(originalRequest);
      }
    }

    // Traducir errores comunes a mensajes amigables
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        error.friendlyMessage = 'El servidor tarda demasiado en responder. Reintenta más tarde.';
      } else {
        error.friendlyMessage = 'No hay conexión a internet o el servidor está caído.';
      }
    } else {
      const status = error.response.status;
      switch (status) {
        case 401:
          error.friendlyMessage = 'Sesión expirada. Por favor, ingresa de nuevo.';
          break;
        case 402:
          error.friendlyMessage = 'Función Premium. Por favor, adquiere una suscripción para continuar.';
          break;
        case 403:
          error.friendlyMessage = 'No tienes permiso para realizar esta acción.';
          break;
        case 404:
          error.friendlyMessage = 'El recurso solicitado no existe.';
          break;
        case 500:
          error.friendlyMessage = 'Error interno del servidor. Estamos trabajando en ello.';
          break;
        default:
          error.friendlyMessage = error.response.data?.detail || error.response.data?.error || 'Ocurrió un error inesperado.';
      }
    }

    return Promise.reject(error);
  }
);


export default apiClient;

