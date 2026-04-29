import { Platform } from 'react-native';
import logger from '../utils/logger';

class SocketService {
  constructor() {
    this.socket = null;
    this.reconnectTimeout = null;
    this.shouldReconnect = true;
    this.onMessageCallback = null;
    this.connectionParams = { id_unico: null, token: null };
    // Usar la IP del backend (ajustar si es necesario)
    this.WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'ws://3.139.201.71:8000/ws/devices';
  }

  connect(id_unico, token, onMessageCallback) {
    this.shouldReconnect = true;
    this.onMessageCallback = onMessageCallback;
    this.connectionParams = { id_unico, token };

    const url = `${this.WS_URL}/${id_unico}/?token=${token}`;
    logger.log('Intentando conectar WebSocket a:', url);

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      logger.log('✅ WebSocket Conectado');
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        logger.log('📩 Mensaje recibido:', data);
        if (this.onMessageCallback) {
          this.onMessageCallback(data);
        }
      } catch (error) {
        logger.error('❌ Error al parsear mensaje:', error);
      }
    };

    this.socket.onerror = (error) => {
      logger.error('⚠️ Error en WebSocket:', error.message);
    };

    this.socket.onclose = (event) => {
      logger.log('🔌 WebSocket Cerrado:', event.reason);
      
      // Reconexión automática si no fue un cierre intencional
      if (this.shouldReconnect) {
        logger.log('🔄 Intentando reconectar en 5 segundos...');
        this.reconnectTimeout = setTimeout(() => {
          this.connect(id_unico, token, onMessageCallback);
        }, 5000);
      }
    };
  }

  disconnect() {
    logger.log('🚫 Desconectando WebSocket manualmente...');
    this.shouldReconnect = false;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default new SocketService();


