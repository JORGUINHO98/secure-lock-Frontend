import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  Dimensions,
  Image
} from 'react-native';
import { ShieldCheck, Lock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const TargetLockScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        {/* Shield with Lock Icon */}
        <View style={styles.shieldContainer}>
          <View style={styles.shieldBackground}>
            <ShieldCheck size={220} color="#4FB3C3" strokeWidth={1} />
            <View style={styles.lockOverlay}>
              <Lock size={60} color="#4FB3C3" />
            </View>
          </View>
        </View>

        {/* Branding */}
        <Text style={styles.brandTitle}>Secure Lock</Text>
        <Text style={styles.brandSubtitle}>INSTANT MOBILE PROTECTION</Text>

        {/* Remote Control Indicator */}
        <View style={styles.remoteIndicator}>
          <Text style={styles.remoteText}>Control de dispositivo remoto</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark background as per image
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  shieldContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldBackground: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    top: '40%',
  },
  brandTitle: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#4FB3C3', // Cyan/Blue color from image
    textAlign: 'center',
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 16,
    color: '#D9D9D9',
    textAlign: 'center',
    marginTop: 5,
    letterSpacing: 1,
    fontWeight: '600',
  },
  remoteIndicator: {
    marginTop: 60,
    backgroundColor: '#D9D9D9',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 0,
  },
  remoteText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  }
});

export default TargetLockScreen;
