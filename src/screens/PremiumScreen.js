import React, { useState } from 'react';
import {
  Platform, View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Alert, ActivityIndicator,
  Dimensions, ScrollView, Modal, TextInput, KeyboardAvoidingView,
} from 'react-native';
import { X, Check, Home, Users, User, Star, CreditCard, ShieldCheck, Zap, Lock } from 'lucide-react-native';
import { COLORS, SPACING } from '../theme/colors';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';

// ─── CardField fuera del componente para evitar remount al tipear ───
const CardField = ({ label, value, onChangeText, placeholder, keyboardType = 'default', maxLength, isDark }) => (
  <View style={styles.fieldWrapper}>
    <Text style={[styles.fieldLabel, { color: isDark ? '#CCC' : '#555' }]}>{label}</Text>
    <TextInput
      style={[
        styles.cardInput,
        {
          backgroundColor: isDark ? '#2A2A3D' : '#F4F6FF',
          color: isDark ? '#FFF' : '#1A1A1A',
          borderColor: isDark ? '#4A4A6A' : COLORS.border,
        },
      ]}
      placeholder={placeholder}
      placeholderTextColor={isDark ? '#666' : '#AAA'}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={maxLength}
      autoCapitalize="none"
    />
  </View>
);

const { width } = Dimensions.get('window');

const PremiumScreen = ({ navigation }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Estados del Modal de Pago Simulado ---
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const { isPremium, checkPremiumStatus, theme } = useAppContext();
  const isDark = theme === 'dark';

  const handleClose = () => {
    if (showPayment) {
      setShowPayment(false);
    } else {
      navigation.goBack();
    }
  };

  // Formatea el número de tarjeta con espacios cada 4 dígitos
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  // Formatea la fecha MM/AA
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const handlePayPress = async () => {
    // Validación básica de campos
    if (!cardName.trim() || !cardNumber.trim() || !expiryDate.trim() || !cvv.trim()) {
      Alert.alert('⚠️ Campos incompletos', 'Por favor completa todos los datos de tu tarjeta.');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('⚠️ Número inválido', 'El número de tarjeta debe tener 16 dígitos.');
      return;
    }
    if (cvv.length < 3) {
      Alert.alert('⚠️ CVV inválido', 'El CVV debe tener al menos 3 dígitos.');
      return;
    }

    setIsProcessingPayment(true);

    // Simulación de 2 segundos (pasarela bancaria)
    setTimeout(async () => {
      try {
        await api.post('/suscripciones/upgrade/');
        await checkPremiumStatus();
        setIsProcessingPayment(false);
        setIsPaymentModalVisible(false);
        // Limpiar formulario
        setCardNumber(''); setExpiryDate(''); setCvv(''); setCardName('');
        Alert.alert(
          '✅ Pago exitoso',
          '¡Bienvenido a Premium! Tu cuenta ha sido actualizada.',
          [{ text: 'Continuar', onPress: () => navigation.goBack() }]
        );
      } catch (error) {
        setIsProcessingPayment(false);
        setIsPaymentModalVisible(false);
        const statusCode = error.response?.status;
        const errorData = error.response?.data;
        const message =
          errorData?.detail || errorData?.error || errorData?.message ||
          'Hubo un problema al procesar tu suscripción.';
        console.log('Error suscripción:', statusCode, JSON.stringify(errorData));
        Alert.alert('❌ Error', `[${statusCode}] ${message}`);
      }
    }, 2000);
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
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
        <Text style={[styles.headerTitle, { color: COLORS.text.white }]}>Plan Premium</Text>
        <TouchableOpacity onPress={handleClose} style={[styles.closeButton, { backgroundColor: isDark ? '#2A2F45' : 'rgba(255,255,255,0.2)' }]}>
          <X size={24} color={COLORS.text.white} />
        </TouchableOpacity>
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A2E' : COLORS.background.main }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {isPremium ? (
            <View style={styles.premiumSuccess}>
              <View style={styles.starContainer}>
                <Star size={80} color="#FFD700" fill="#FFD700" />
              </View>
              <Text style={[styles.mainTitle, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>¡Ya eres Premium!</Text>
              <Text style={[styles.subTitle, { color: COLORS.text.secondary }]}>
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

              <Text style={[styles.mainTitle, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>
                Desbloquea todo el potencial de Secure Lock
              </Text>

              <Text style={[styles.subTitle, { color: COLORS.text.secondary }]}>
                Control total de tus dispositivos sin anuncios y sin límites.
              </Text>

              <View style={[styles.card, { backgroundColor: isDark ? '#2A2F45' : COLORS.background.surface }]}>
                <FeatureItem text="Salas ilimitadas" />
                <FeatureItem text="Dispositivos ilimitados por sala" />
                <FeatureItem text="Sin anuncios molestos" />
                <FeatureItem text="Soporte prioritario 24/7" />
                <FeatureItem text="Copias de seguridad en la nube" />
              </View>

              <View style={styles.priceSection}>
                <Text style={[styles.priceTag, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>$ 13.99</Text>
                <Text style={[styles.priceInfo, { color: COLORS.text.secondary }]}>Un solo pago para siempre</Text>
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={() => setShowPayment(true)}>
                <Text style={styles.buttonText}>Obtener Premium Ahora</Text>
              </TouchableOpacity>

              <Text style={styles.cancelNotice}>Cancela en cualquier momento</Text>
            </View>
          ) : (
            <View style={styles.paymentContainer}>
              <View style={[styles.googlePlayCard, { backgroundColor: isDark ? '#2A2F45' : COLORS.background.surface }]}>
                <View style={styles.gpHeader}>
                  <Text style={[styles.gpTitle, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Google Play</Text>
                </View>

                <View style={styles.appRow}>
                  <View style={styles.appIcon}>
                    <ShieldCheck size={30} color="#FFF" />
                  </View>
                  <View>
                    <Text style={[styles.appName, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>SECURE LOCK Premium</Text>
                    <Text style={styles.appSub}>Versión Completa</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.paymentRow}>
                  <Text style={[styles.paymentLabel, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Precio total</Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.paymentValue, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>$ 13.99</Text>
                    <Text style={styles.taxLabel}>+ impuestos aplicables</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.methodRow, { backgroundColor: isDark ? '#3D3D3D' : '#F5F5F5' }]}
                  onPress={() => setIsPaymentModalVisible(true)}
                >
                  <CreditCard size={20} color={COLORS.primary} />
                  <Text style={[styles.methodText, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Agregar tarjeta de crédito</Text>
                  <Text style={styles.arrow}>{'>'}</Text>
                </TouchableOpacity>

                <Text style={styles.legalSmall}>
                  Al tocar "Suscribirse", aceptas nuestras Condiciones del servicio. La suscripción se renovará automáticamente a menos que la canceles.
                </Text>

                <TouchableOpacity
                  style={[styles.subscribeButton, isLoading && { opacity: 0.7 }]}
                  onPress={() => setIsPaymentModalVisible(true)}
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

      {/* Bottom Nav */}
      {!showPayment && (
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
      )}

      {/* ===================== MODAL DE PAGO SIMULADO ===================== */}
      <Modal
        visible={isPaymentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => !isProcessingPayment && setIsPaymentModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.modalContainer, { backgroundColor: isDark ? '#1E1E2E' : '#FFF' }]}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Lock size={18} color={COLORS.primary} />
                <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#1A1A1A' }]}>
                  Pago Seguro
                </Text>
              </View>

            </View>

            {/* Resumen del cobro */}
            <View style={[styles.amountRow, { backgroundColor: isDark ? '#2A2A3D' : '#F0EDFF' }]}>
              <Text style={[styles.amountLabel, { color: isDark ? '#CCC' : '#555' }]}>Total a cobrar</Text>
              <Text style={[styles.amountValue, { color: COLORS.primary }]}>$13.99 USD</Text>
            </View>

            {/* Separador */}
            <View style={[styles.modalDivider, { backgroundColor: isDark ? '#333' : '#EEE' }]} />

            {/* Campos de tarjeta */}
            <CardField
              label="Nombre en la tarjeta"
              value={cardName}
              onChangeText={setCardName}
              placeholder="JUAN PÉREZ"
              isDark={isDark}
            />
            <CardField
              label="Número de tarjeta"
              value={cardNumber}
              onChangeText={(v) => setCardNumber(formatCardNumber(v))}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              maxLength={19}
              isDark={isDark}
            />
            <View style={styles.rowFields}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <CardField
                  label="Vencimiento"
                  value={expiryDate}
                  onChangeText={(v) => setExpiryDate(formatExpiry(v))}
                  placeholder="MM/AA"
                  keyboardType="numeric"
                  maxLength={5}
                  isDark={isDark}
                />
              </View>
              <View style={{ flex: 1 }}>
                <CardField
                  label="CVV"
                  value={cvv}
                  onChangeText={(v) => setCvv(v.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={4}
                  isDark={isDark}
                />
              </View>
            </View>

            {/* Indicador de procesamiento */}
            {isProcessingPayment && (
              <View style={styles.processingRow}>
                <ActivityIndicator color={COLORS.primary} size="small" />
                <Text style={[styles.processingText, { color: isDark ? '#CCC' : '#555' }]}>
                  Procesando pago...
                </Text>
              </View>
            )}

            {/* Botones de acción */}
            <TouchableOpacity
              style={[styles.payButton, isProcessingPayment && { opacity: 0.6 }]}
              onPress={handlePayPress}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <CreditCard size={18} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.payButtonText}>Pagar $13.99</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: isDark ? '#555' : COLORS.border }]}
              onPress={() => setIsPaymentModalVisible(false)}
              disabled={isProcessingPayment}
            >
              <Text style={[styles.cancelButtonText, { color: isDark ? '#AAA' : '#666' }]}>Cancelar</Text>
            </TouchableOpacity>

            <Text style={styles.secureNote}>🔒 Tus datos están cifrados y son seguros</Text>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
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
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  premiumSuccess: { alignItems: 'center', marginTop: 50 },
  starContainer: {
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 30,
  },
  offerContainer: { alignItems: 'center', marginTop: 20 },
  badge: {
    flexDirection: 'row', backgroundColor: COLORS.primary,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, alignItems: 'center', marginBottom: 20,
  },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginLeft: 5 },
  mainTitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, lineHeight: 34 },
  subTitle: { fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 22, paddingHorizontal: 10 },
  card: {
    width: '100%', borderRadius: 20, padding: 20, marginBottom: 30,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkIcon: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#00B894', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  featureText: { fontSize: 15, fontWeight: '500' },
  priceSection: { alignItems: 'center', marginBottom: 30 },
  priceTag: { fontSize: 42, fontWeight: 'bold' },
  priceInfo: { fontSize: 14, marginTop: 5 },
  primaryButton: {
    backgroundColor: COLORS.primary, width: '100%', height: 60,
    borderRadius: 16, justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  cancelNotice: { fontSize: 12, color: '#888', marginTop: 15 },
  paymentContainer: { marginTop: 20 },
  googlePlayCard: {
    borderRadius: 25, padding: 25,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 10,
  },
  gpHeader: { marginBottom: 20 },
  gpTitle: { fontSize: 20, fontWeight: 'bold' },
  appRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  appIcon: {
    width: 60, height: 60, backgroundColor: COLORS.primary,
    borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  appName: { fontSize: 18, fontWeight: 'bold' },
  appSub: { fontSize: 14, color: '#888' },
  divider: { height: 1, backgroundColor: '#EEE', marginBottom: 25 },
  paymentRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 25,
  },
  paymentLabel: { fontSize: 16, fontWeight: '600' },
  paymentValue: { fontSize: 18, fontWeight: 'bold' },
  taxLabel: { fontSize: 12, color: '#888' },
  methodRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 15, borderRadius: 12, marginBottom: 25,
  },
  methodText: { flex: 1, marginLeft: 15, fontSize: 15, fontWeight: '500' },
  arrow: { fontSize: 18, color: '#AAA' },
  legalSmall: {
    fontSize: 11, color: '#AAA', textAlign: 'center',
    lineHeight: 16, marginBottom: 25,
  },
  subscribeButton: {
    backgroundColor: '#00B894', height: 55,
    borderRadius: 15, justifyContent: 'center', alignItems: 'center',
  },
  subscribeText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  bottomNav: {
    flexDirection: 'row', height: 90, justifyContent: 'space-around',
    alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)', paddingBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 3,
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, fontWeight: '600', marginTop: 4 },

  // --- Modal styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  testBadge: {
    backgroundColor: '#FF7675',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  testBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  amountLabel: { fontSize: 14, fontWeight: '500' },
  amountValue: { fontSize: 20, fontWeight: 'bold' },
  modalDivider: { height: 1, marginBottom: 16 },
  fieldWrapper: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: '600', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardInput: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '500',
  },
  rowFields: { flexDirection: 'row' },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 8,
  },
  processingText: { fontSize: 14, fontWeight: '500', marginLeft: 8 },
  payButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  payButtonText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  cancelButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: { fontSize: 15, fontWeight: '600' },
  secureNote: {
    textAlign: 'center',
    fontSize: 11,
    color: '#AAA',
    marginTop: 14,
  },
});

export default PremiumScreen;
