import React from 'react';
import { Platform, View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Switch } from 'react-native';
import { Undo2, Moon, BookOpen, Settings, Calendar, Home, Users, User } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';

const LockConfigScreen = ({ route, navigation }) => {
  const { roomId, deviceId } = route.params;
  const { setDeviceSchedule } = useAppContext();

  const schedules = [
    { id: '1', title: 'Hora de dormir', time: '20h-7h', icon: <Moon size={32} color="#000" /> },
    { id: '2', title: 'Estudio', time: '8h-12h', icon: <BookOpen size={32} color="#000" /> },
    { id: '3', title: 'Tiempo particular', time: '20h-21h', icon: <Settings size={32} color="#000" /> },
    { id: '4', title: 'Todos los Dias', time: 'Lu,Ma,Mi,Ju,Vi,Sa,Do', icon: <Calendar size={32} color="#000" /> },
  ];

  const handleSelectSchedule = (scheduleTitle) => {
    setDeviceSchedule(roomId, deviceId, scheduleTitle);
    navigation.goBack();
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

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Horarios:</Text>

        {schedules.map((item) => (
          <View key={item.id} style={styles.scheduleCard}>
            <View style={styles.iconBox}>
              {item.icon}
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleTitle}>{item.title}</Text>
              <Text style={styles.scheduleTime}>{item.time}</Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch 
                value={false} 
                onValueChange={() => handleSelectSchedule(item.title)}
                trackColor={{ false: "#767577", true: "#000" }}
                thumbColor={"#f4f3f4"}
              />
              <Text style={styles.onText}>ON</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity 
          style={styles.manualButton} 
          onPress={() => navigation.navigate('ManualTime', { roomId, deviceId })}
        >
          <Text style={styles.manualButtonText}>Estimar Tiempo Manualmente</Text>
        </TouchableOpacity>
      </ScrollView>

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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    padding: 15,
    marginBottom: 15,
    borderRadius: 0,
  },
  iconBox: {
    width: 60,
    height: 60,
    backgroundColor: '#4E5A8E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  scheduleInfo: {
    flex: 1,
    marginLeft: 15,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scheduleTime: {
    fontSize: 18,
    color: '#000',
    marginTop: 4,
  },
  switchContainer: {
    alignItems: 'center',
  },
  onText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
  },
  manualButton: {
    backgroundColor: '#4FB3C3',
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  manualButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
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

export default LockConfigScreen;
