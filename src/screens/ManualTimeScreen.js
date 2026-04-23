import React, { useState } from 'react';
import { Platform, View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Dimensions } from 'react-native';
import { Undo2, Home, Users, User } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';

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
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1A1A1A' : '#A8C3C0' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#2D2D2D' : '#A8C3C0' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Undo2 size={40} color={isDark ? '#FFF' : '#1E234C'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#1E234C' }]}>Configuración de Bloqueo</Text>
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' }]}>
      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#1E234C' }]}>Limites de Tiempo:</Text>

        <View style={styles.pickerContainer}>
          <View style={[styles.pickerBackground, { backgroundColor: isDark ? '#333' : '#FFF' }]}>
            <View style={[styles.selectionBar, { backgroundColor: isDark ? '#4FB3C3' : '#6C5CE7' }]} />
            <View style={styles.pickerWrapper}>
              <PickerColumn options={hourOptions} selectedValue={hours} onSelect={setHours} />
              <Text style={[styles.separator, { color: isDark ? '#FFF' : '#000' }]}>:</Text>
              <PickerColumn options={minuteOptions} selectedValue={minutes} onSelect={setMinutes} />
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: isDark ? '#4FB3C3' : '#6C5CE7' }]} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
      </View>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { backgroundColor: isDark ? '#2D2D2D' : '#B0B0B0' }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={32} color={isDark ? '#FFF' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#FFF' : '#000' }]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Rooms')}>
          <Users size={32} color={isDark ? '#FFF' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#FFF' : '#000' }]}>Salas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
          <User size={32} color={isDark ? '#FFF' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#FFF' : '#000' }]}>Cuenta</Text>
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
    shadowColor: '#6C5CE7',
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
    height: 100,
    backgroundColor: '#B0B0B0',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#000',
  },
});

export default ManualTimeScreen;
