import { useContext } from 'react';
import { DeviceContext } from '../context/DeviceContext';

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevices debe ser usado dentro de un DeviceProvider');
  }
  return context;
};
