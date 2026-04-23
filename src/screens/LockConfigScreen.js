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
import { COLORS } from '../theme/colors';

const LockConfigScreen = ({ route, navigation }) => {
  const { roomId, deviceId } = route.params;
  const { setDeviceSchedule, theme } = useAppContext();
  const isDark = theme === 'dark';

  const schedules = [
    { id: '1', title: 'Hora de dormir', time: '20h-7h', icon: <Moon size={32} color="#FFF" /> },
    { id: '2', title: 'Estudio', time: '8h-12h', icon: <BookOpen size={32} color="#FFF" /> },
    { id: '3', title: 'Tiempo particular', time: '20h-21h', icon: <Settings size={32} color="#FFF" /> },
    { id: '4', title: 'Todos los Dias', time: 'Lu,Ma,Mi,Ju,Vi,Sa,Do', icon: <Calendar size={32} color="#FFF" /> },
  ];

  const handleSelectSchedule = (scheduleTitle) => {
    setDeviceSchedule(roomId, deviceId, scheduleTitle);
    navigation.goBack();
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
      <ScrollView style={styles.content}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#1E234C' }]}>Horarios:</Text>

        {schedules.map((item) => (
          <View key={item.id} style={[styles.scheduleCard, { backgroundColor: isDark ? '#333' : '#FFF' }]}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#4FB3C3' : '#6C5CE7' }]}>
              {item.icon}
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={[styles.scheduleTitle, { color: isDark ? '#FFF' : '#000' }]}>{item.title}</Text>
              <Text style={[styles.scheduleTime, { color: isDark ? '#AAA' : '#666' }]}>{item.time}</Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch 
                value={false} 
                onValueChange={() => handleSelectSchedule(item.title)}
                trackColor={{ false: "#767577", true: "#6C5CE7" }}
                thumbColor={"#f4f3f4"}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity 
          style={[styles.manualButton, { backgroundColor: isDark ? '#4FB3C3' : '#6C5CE7' }]} 
          onPress={() => navigation.navigate('ManualTime', { roomId, deviceId })}
        >
          <Text style={styles.manualButtonText}>Estimar Tiempo Manualmente</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  iconBox: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  scheduleInfo: {
    flex: 1,
    marginLeft: 15,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scheduleTime: {
    fontSize: 14,
    marginTop: 4,
  },
  switchContainer: {
    alignItems: 'center',
  },
  manualButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
    borderRadius: 15,
  },
  manualButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
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
