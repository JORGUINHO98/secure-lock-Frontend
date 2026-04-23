import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Reemplazar TU_IP con la IP de la máquina donde corre el backend de Django
const BASE_URL = 'http://192.168.1.100:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Interceptor para inyectar el token JWT en cada petición
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log('Error obteniendo el token de AsyncStorage', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
