import React from 'react';
import { AuthProvider } from './AuthContext';
import { RoomProvider } from './RoomContext';
import { DeviceProvider } from './DeviceContext';
import { ThemeProvider } from './ThemeContext';

export const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RoomProvider>
          <DeviceProvider>
            {children}
          </DeviceProvider>
        </RoomProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export * from './AuthContext';
export * from './RoomContext';
export * from './DeviceContext';
export * from './ThemeContext';
export * from '../hooks/useAuth';
export * from '../hooks/useRooms';
export * from '../hooks/useDevices';
export * from '../hooks/useTheme';

