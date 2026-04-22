import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import QRCodeScreen from '../screens/QRCodeScreen';
import RoomsScreen from '../screens/RoomsScreen';
import RoomDetailsScreen from '../screens/RoomDetailsScreen';
import CameraScannerScreen from '../screens/CameraScannerScreen';
import DeviceControlScreen from '../screens/DeviceControlScreen';
import LockConfigScreen from '../screens/LockConfigScreen';
import ManualTimeScreen from '../screens/ManualTimeScreen';
import TargetLockScreen from '../screens/TargetLockScreen';
import AccountScreen from '../screens/AccountScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="QRCode" component={QRCodeScreen} />
        <Stack.Screen name="Rooms" component={RoomsScreen} />
        <Stack.Screen name="RoomDetails" component={RoomDetailsScreen} />
        <Stack.Screen name="CameraScanner" component={CameraScannerScreen} />
        <Stack.Screen name="DeviceControl" component={DeviceControlScreen} />
        <Stack.Screen name="LockConfig" component={LockConfigScreen} />
        <Stack.Screen name="ManualTime" component={ManualTimeScreen} />
        <Stack.Screen name="TargetLock" component={TargetLockScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
