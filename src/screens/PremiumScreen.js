import React, { useState } from 'react';
import {
  Platform, View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView
} from 'react-native';
import { X, Check, Home, Users, User, Star, CreditCard, ShieldCheck, Zap } from 'lucide-react-native';
import { COLORS, SPACING } from '../theme/colors';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';

const { width, height } = Dimensions.get('window');

const PremiumScreen = ({ navigation }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isPremium, checkPremiumStatus, theme } = useAppContext();
  const isDark = theme === 'dark';

  const handleClose = () => {
    if (showPayment) {
      setShowPayment(false);
    } else {
      navigation.goBack();
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // Simulando llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      // await api.post('/suscripciones/', {});
      await checkPremiumStatus();
      Alert.alert('💳 ¡Éxito!', 'Tu suscripción Premium se ha activado correctamente.');
      setShowPayment(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error en suscripción:', error);
      Alert.alert('❌ Error', 'Hubo un problema al procesar tu suscripción.');
    } finally {
      setIsLoading(false);
    }
  };

  const FeatureItem = ({ text }) => (
    <View style={styles.featureItem}>
      <View style={styles.checkIcon}>
        <Check size={18} color="#FFF" />
      </View>
      <Text style={[styles.featureText, { color: isDark ? '#FFF' : '#333' }]}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1A1A1A' : '#A8C3C0' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.header, { backgroundColor: isDark ? '#2D2D2D' : '#A8C3C0' }]}>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#1E234C' }]}>Plan Premium</Text>
        <TouchableOpacity onPress={handleClose} style={[styles.closeButton, { backgroundColor: isDark ? '#333' : 'rgba(255,255,255,0.3)' }]}>
          <X size={24} color={isDark ? '#FFF' : '#1E234C'} />
        </TouchableOpacity>
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isPremium ? (
          <View style={styles.premiumSuccess}>
            <View style={styles.starContainer}>
               <Star size={80} color="#FFD700" fill="#FFD700" />
            </View>
            <Text style={[styles.mainTitle, { color: isDark ? '#FFF' : '#000' }]}>¡Ya eres Premium!</Text>
            <Text style={[styles.subTitle, { color: isDark ? '#AAA' : '#666' }]}>
              Gracias por tu apoyo. Disfruta de acceso ilimitado a todas las funciones.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={handleClose}>
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        ) : !showPayment ? (
          <View style={styles.offerContainer}>
            <View style={styles.badge}>
              <Zap size={16} color="#FFF" fill="#FFF" />
              <Text style={styles.badgeText}>OFERTA LIMITADA</Text>
            </View>
            
            <Text style={[styles.mainTitle, { color: isDark ? '#FFF' : '#000' }]}>
              Desbloquea todo el potencial de Secure Lock
            </Text>
            
            <Text style={[styles.subTitle, { color: isDark ? '#AAA' : '#666' }]}>
              Control total de tus dispositivos sin anuncios y sin límites.
            </Text>

            <View style={[styles.card, { backgroundColor: isDark ? '#2D2D2D' : '#FFF' }]}>
              <FeatureItem text="Salas ilimitadas" />
              <FeatureItem text="Dispositivos ilimitados por sala" />
              <FeatureItem text="Sin anuncios molestos" />
              <FeatureItem text="Soporte prioritario 24/7" />
              <FeatureItem text="Copias de seguridad en la nube" />
            </View>

            <View style={styles.priceSection}>
              <Text style={[styles.priceTag, { color: isDark ? '#FFF' : '#000' }]}>$ 13.99</Text>
              <Text style={[styles.priceInfo, { color: isDark ? '#AAA' : '#666' }]}>Un solo pago para siempre</Text>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={() => setShowPayment(true)}>
              <Text style={styles.buttonText}>Obtener Premium Ahora</Text>
            </TouchableOpacity>
            
            <Text style={styles.cancelNotice}>Cancela en cualquier momento</Text>
          </View>
        ) : (
          <View style={styles.paymentContainer}>
             <View style={[styles.googlePlayCard, { backgroundColor: isDark ? '#2D2D2D' : '#FFF' }]}>
                <View style={styles.gpHeader}>
                  <Text style={[styles.gpTitle, { color: isDark ? '#FFF' : '#000' }]}>Google Play</Text>
                </View>

                <View style={styles.appRow}>
                  <View style={styles.appIcon}>
                    <ShieldCheck size={30} color="#FFF" />
                  </View>
                  <View>
                    <Text style={[styles.appName, { color: isDark ? '#FFF' : '#000' }]}>SECURE LOCK Premium</Text>
                    <Text style={styles.appSub}>Versión Completa</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.paymentRow}>
                  <Text style={[styles.paymentLabel, { color: isDark ? '#FFF' : '#000' }]}>Precio total</Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.paymentValue, { color: isDark ? '#FFF' : '#000' }]}>$ 13.99</Text>
                    <Text style={styles.taxLabel}>+ impuestos aplicables</Text>
                  </View>
                </View>

                <View style={[styles.methodRow, { backgroundColor: isDark ? '#3D3D3D' : '#F5F5F5' }]}>
                  <CreditCard size={20} color="#6C5CE7" />
                  <Text style={[styles.methodText, { color: isDark ? '#FFF' : '#000' }]}>Visa •••• 2485</Text>
                  <Text style={styles.arrow}>{'>'}</Text>
                </View>

                <Text style={styles.legalSmall}>
                  Al tocar "Suscribirse", aceptas nuestras Condiciones del servicio. La suscripción se renovará automáticamente a menos que la canceles.
                </Text>

                <TouchableOpacity 
                  style={[styles.subscribeButton, isLoading && { opacity: 0.7 }]} 
                  onPress={handleSubscribe}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.subscribeText}>Suscribirse</Text>
                  )}
                </TouchableOpacity>
             </View>
          </View>
        )}
      </ScrollView>
      </View>

      {/* Bottom Nav Simulation */}
      {!showPayment && (
        <View style={[styles.bottomNav, { backgroundColor: isDark ? '#2D2D2D' : '#FFF' }]}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Home size={24} color={isDark ? '#AAA' : '#666'} />
            <Text style={[styles.navText, { color: isDark ? '#AAA' : '#666' }]}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Rooms')}>
            <Users size={24} color={isDark ? '#AAA' : '#666'} />
            <Text style={[styles.navText, { color: isDark ? '#AAA' : '#666' }]}>Salas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
            <User size={24} color={isDark ? '#AAA' : '#666'} />
            <Text style={[styles.navText, { color: isDark ? '#AAA' : '#666' }]}>Cuenta</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    position: 'relative',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 55,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  premiumSuccess: {
    alignItems: 'center',
    marginTop: 50,
  },
  starContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  offerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  badge: {
    flexDirection: 'row',
    backgroundColor: '#6C5CE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 34,
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#00B894',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  priceTag: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  priceInfo: {
    fontSize: 14,
    marginTop: 5,
  },
  primaryButton: {
    backgroundColor: '#6C5CE7',
    width: '100%',
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelNotice: {
    fontSize: 12,
    color: '#888',
    marginTop: 15,
  },
  paymentContainer: {
    marginTop: 20,
  },
  googlePlayCard: {
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  gpHeader: {
    marginBottom: 20,
  },
  gpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  appIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#6C5CE7',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  appSub: {
    fontSize: 14,
    color: '#888',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginBottom: 25,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  paymentValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taxLabel: {
    fontSize: 12,
    color: '#888',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
  },
  methodText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 15,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: '#AAA',
  },
  legalSmall: {
    fontSize: 11,
    color: '#AAA',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 25,
  },
  subscribeButton: {
    backgroundColor: '#00B894',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingBottom: 15,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default PremiumScreen;
