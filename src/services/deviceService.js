import api from './api';
import logger from '../utils/logger';

/**
 * Servicio para la gestión de dispositivos y sus estados.
 */
export const deviceService = {
  /**
   * Bloquea un dispositivo.
   * @param {string|number} deviceId - ID del dispositivo.
   * @param {boolean} allowEmergencyCalls - Si se permiten llamadas de emergencia.
   */
  lockDevice: async (deviceId, allowEmergencyCalls = true) => {
    try {
      const response = await api.post(`/dispositivos/${deviceId}/lock/`, {
        allow_emergency_calls: allowEmergencyCalls,
      });
      return response.data;
    } catch (error) {
      logger.error(`Error al bloquear dispositivo ${deviceId}:`, error);
      throw error;
    }
  },

  /**
   * Desbloquea un dispositivo.
   * @param {string|number} deviceId - ID del dispositivo.
   */
  unlockDevice: async (deviceId) => {
    try {
      const response = await api.post(`/dispositivos/${deviceId}/unlock/`);
      return response.data;
    } catch (error) {
      logger.error(`Error al desbloquear dispositivo ${deviceId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene el historial de eventos de un dispositivo.
   * @param {string|number} deviceId - ID del dispositivo.
   */
  getDeviceEvents: async (deviceId) => {
    try {
      const response = await api.get(`/dispositivos/${deviceId}/events/`);
      return response.data;
    } catch (error) {
      logger.error(`Error al obtener eventos del dispositivo ${deviceId}:`, error);
      throw error;
    }
  },

  /**
   * Verifica el estado premium del usuario actual.
   */
  checkPremiumStatus: async () => {
    try {
      const response = await api.get('/suscripciones/premium-status/');
      return response.data; // { has_active_premium: boolean, plan: string, ... }
    } catch (error) {
      logger.error('Error al verificar status premium:', error);
      throw error;
    }
  },

  /**
   * Actualiza la suscripción a premium.
   */
  upgradeToPremium: async (planId) => {
    try {
      const response = await api.post('/suscripciones/upgrade/', { plan_id: planId });
      return response.data;
    } catch (error) {
      logger.error('Error al procesar upgrade premium:', error);
      throw error;
    }
  }
};

export default deviceService;
