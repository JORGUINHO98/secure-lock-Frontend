import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
  Dimensions
} from 'react-native';
import { X, Check, Home, Users, User } from 'lucide-react-native';
import { COLORS, SPACING } from '../theme/colors';
import { useAppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');

const PremiumScreen = ({ visible, onClose }) => {
  const [showPayment, setShowPayment] = useState(false);
  const { setIsPremium } = useAppContext();

  const handleSubscribe = () => {
    setIsPremium(true);
    setShowPayment(false);
    onClose();
    alert('¡Suscripción exitosa!');
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        {!showPayment ? (
          <>
            {/* Plan Premium View (Image 2) */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Plan Premium</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={32} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={styles.mainTitle}>Obten la aplicasion Premiun sin anuncios</Text>
              <Text style={styles.subTitle}>Controla mas a atu propia manera</Text>

              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>$ 13.00/Un solo pago_ Cancelacion en cualquier momento</Text>
              </View>

              <TouchableOpacity
                style={styles.premiumButton}
                onPress={() => setShowPayment(true)}
              >
                <Text style={styles.premiumButtonText}>Obten la app Premium</Text>
              </TouchableOpacity>
            </View>

            {/* Dummy Bottom Nav to match screenshot */}
            <View style={styles.bottomNav}>
              <TouchableOpacity style={styles.navItem}>
                <Home size={28} color="#000" />
                <Text style={styles.navText}>Inicio</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Users size={28} color="#000" />
                <Text style={styles.navText}>Salas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <User size={28} color="#000" />
                <Text style={styles.navText}>Cuenta</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Payment Modal View (Image 3) */}
            <View style={styles.paymentContainer}>
              <View style={styles.paymentHeader}>
                <Text style={styles.headerTitle}>Plan Premium</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={32} color="#000" />
                </TouchableOpacity>
              </View>

              <View style={styles.paymentModalOverlay}>
                <View style={styles.googlePlayModal}>
                  <View style={styles.gpHeader}>
                    <Text style={styles.gpTitle}>Google Play</Text>
                    <TouchableOpacity onPress={() => setShowPayment(false)}>
                      <X size={24} color="#000" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.appInfo}>
                    <View style={styles.appIconPlaceholder}>
                      <Users size={40} color="#FFF" />
                    </View>
                    <Text style={styles.appName}>SECURE LOCK Premium</Text>
                  </View>

                  <View style={styles.paymentDetails}>
                    <View>
                      <Text style={styles.detailLabel}>Comienza: hoy</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.priceValue}>$ 13.99</Text>
                      <Text style={styles.taxLabel}>mas impuestos</Text>
                    </View>
                  </View>

                  <Text style={styles.cancelInfo}>
                    Cancela el registro cunado quieras en la seccion de suscripciones de Google Play
                  </Text>

                  <TouchableOpacity style={styles.visaRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.visaText}>VISA</Text>
                      <Text style={styles.cardInfo}>Visa-2485</Text>
                    </View>
                    <Text style={styles.arrow}>{'>'}</Text>
                  </TouchableOpacity>

                  <Text style={styles.legalText}>
                    Al precionar "suscribirse", obtienes toda la app completa sin restricciones y anuncios.{"\n"}
                    Condiciones del servicio de Google Play. Obtén más información sobre como cancelar la suscripción.
                  </Text>

                  <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
                    <Text style={styles.subscribeButtonText}>Suscribirse</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#959C88', // Greyish green header background in screenshot
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#959C88',
    position: 'relative'
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'serif', // Trying to match the stylized font
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#FFF',
    padding: 2,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    backgroundColor: '#A09E9E', // Grey background from image
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 10,
    color: '#000',
  },
  subTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 100,
  },
  priceContainer: {
    marginBottom: 40,
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  premiumButton: {
    backgroundColor: '#6699CC',
    width: '100%',
    paddingVertical: 20,
    borderRadius: 0,
    alignItems: 'center',
  },
  premiumButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#C5C5C5',
    borderTopWidth: 1,
    borderTopColor: '#AAA',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  // Payment View Styles
  paymentContainer: {
    flex: 1,
    backgroundColor: '#959C88',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#959C88',
  },
  paymentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  googlePlayModal: {
    backgroundColor: '#B5AEAE', // Pinkish grey from image
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 40,
  },
  gpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  gpTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  appIconPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  taxLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelInfo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  visaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    padding: 15,
    marginBottom: 20,
  },
  visaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#01579B',
    marginRight: 20,
  },
  cardInfo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  legalText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 18,
  },
  subscribeButton: {
    backgroundColor: '#4FB3C3',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  subscribeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  }
});

export default PremiumScreen;
