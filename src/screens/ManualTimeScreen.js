import React, { useState } from 'react';
import { Platform, View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  ScrollView,
  Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Undo2, Home, Users, User } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const ManualTimeScreen = ({ route, navigation }) => {
  const { roomId, deviceId } = route.params;
  const { setDeviceSchedule, theme } = useAppContext();
  const isDark = theme === 'dark';
  
  const [hours, setHours] = useState('01');
  const [minutes, setMinutes] = useState('00');

  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleSave = () => {
    const formattedTime = `${hours}:${minutes} hs`;
    setDeviceSchedule(roomId, deviceId, formattedTime);
    // Navigate back to DeviceControl (going back twice or using navigate)
    navigation.navigate('DeviceControl', { roomId, deviceId });
  };

  const PickerColumn = ({ options, selectedValue, onSelect }) => {
    const handleScroll = (e) => {
      const index = Math.round(e.nativeEvent.contentOffset.y / 60);
      if (options[index] && options[index] !== selectedValue) {
        onSelect(options[index]);
      }
    };

    return (
      <View style={styles.pickerColumn}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          snapToInterval={60}
          decelerationRate="fast"
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingVertical: 120 }}
          onMomentumScrollEnd={handleScroll}
          onScrollEndDrag={handleScroll}
        >
          {options.map((opt) => (
            <View key={opt} style={styles.optionItem}>
              <Text style={[
                styles.optionText, 
                selectedValue === opt && styles.selectedOptionText
              ]}>
                {opt}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Undo2 size={36} color={COLORS.text.white} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.text.white }]}>Configuración de Bloqueo</Text>
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A2E' : COLORS.background.main }]}>
      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: isDark ? COLORS.text.white : COLORS.secondary }]}>Limites de Tiempo:</Text>

        <View style={styles.pickerContainer}>
          <View style={[styles.pickerBackground, { backgroundColor: isDark ? '#333' : '#FFF' }]}>
            <View style={[styles.selectionBar, { backgroundColor: isDark ? COLORS.accent : COLORS.primary }]} />
            <View style={styles.pickerWrapper}>
              <PickerColumn options={hourOptions} selectedValue={hours} onSelect={setHours} />
              <Text style={[styles.separator, { color: isDark ? '#FFF' : '#000' }]}>:</Text>
              <PickerColumn options={minuteOptions} selectedValue={minutes} onSelect={setMinutes} />
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: isDark ? COLORS.accent : COLORS.primary }]} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
      </View>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { backgroundColor: isDark ? '#1A1A2E' : COLORS.background.surface }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={28} color={isDark ? COLORS.text.secondary : COLORS.secondary} />
          <Text style={[styles.navText, { color: isDark ? COLORS.text.secondary : COLORS.secondary }]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Rooms')}>
          <Users size={28} color={isDark ? COLORS.text.secondary : COLORS.secondary} />
          <Text style={[styles.navText, { color: isDark ? COLORS.text.secondary : COLORS.secondary }]}>Salas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
          <User size={28} color={isDark ? COLORS.text.secondary : COLORS.secondary} />
          <Text style={[styles.navText, { color: isDark ? COLORS.text.secondary : COLORS.secondary }]}>Cuenta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  backButton: {
    padding: 5,
  },
  contentWrapper: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  pickerContainer: {
    width: width * 0.7,
    height: 400,
    marginBottom: 50,
  },
  pickerBackground: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  selectionBar: {
    position: 'absolute',
    top: '50%',
    marginTop: -30,
    width: '100%',
    height: 60,
    opacity: 0.2,
    zIndex: 1,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  pickerColumn: {
    width: 80,
    height: 300,
  },
  optionItem: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
    opacity: 0.3,
  },
  selectedOptionText: {
    opacity: 1,
  },
  separator: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 10,
  },
  saveButton: {
    width: width * 0.6,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 90,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default ManualTimeScreen;
