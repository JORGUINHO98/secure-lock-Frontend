import React from 'react';
import { Platform, View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  ScrollView,
  Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Undo2, Moon, BookOpen, Settings, Calendar, Home, Users, User } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../theme/colors';

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
      <ScrollView style={styles.content}>
        <Text style={[styles.sectionTitle, { color: isDark ? COLORS.text.white : COLORS.secondary }]}>Horarios:</Text>

        {schedules.map((item) => (
          <View key={item.id} style={[styles.scheduleCard, { backgroundColor: isDark ? '#2A2F45' : COLORS.background.surface }]}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? COLORS.accent : COLORS.primary }]}>
              {item.icon}
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={[styles.scheduleTitle, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>{item.title}</Text>
              <Text style={[styles.scheduleTime, { color: COLORS.text.secondary }]}>{item.time}</Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch 
                value={false} 
                onValueChange={() => handleSelectSchedule(item.title)}
                trackColor={{ false: "#767577", true: COLORS.primary }}
                thumbColor={"#f4f3f4"}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity 
          style={[styles.manualButton, { backgroundColor: isDark ? COLORS.accent : COLORS.primary }]} 
          onPress={() => navigation.navigate('ManualTime', { roomId, deviceId })}
        >
          <Text style={styles.manualButtonText}>Estimar Tiempo Manualmente</Text>
        </TouchableOpacity>
      </ScrollView>
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

export default LockConfigScreen;
