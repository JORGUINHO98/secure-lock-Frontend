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
  const { setDeviceSchedule } = useAppContext();
  
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Undo2 size={40} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuracion de Bloqueo</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Limites de Tiempo:</Text>

        <View style={styles.pickerContainer}>
          <View style={styles.pickerBackground}>
            <View style={styles.selectionBar} />
            <View style={styles.pickerWrapper}>
              <PickerColumn options={hourOptions} selectedValue={hours} onSelect={setHours} />
              <Text style={styles.separator}>:</Text>
              <PickerColumn options={minuteOptions} selectedValue={minutes} onSelect={setMinutes} />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={32} color="#000" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Rooms')}>
          <Users size={32} color="#000" />
          <Text style={styles.navText}>Salas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <User size={32} color="#000" />
          <Text style={styles.navText}>Cuenta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: '#A0A0A0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#D9D9D9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 15,
  },
  backButton: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 2,
    borderWidth: 2,
    borderColor: '#000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
  },
  pickerContainer: {
    width: width * 0.7,
    height: 400,
    marginBottom: 50,
  },
  pickerBackground: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: 60,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  selectionBar: {
    position: 'absolute',
    top: '50%',
    marginTop: -30,
    width: '100%',
    height: 60,
    backgroundColor: '#6699CC',
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
    backgroundColor: '#6699CC',
    width: width * 0.6,
    paddingVertical: 15,
    borderRadius: 40,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
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
