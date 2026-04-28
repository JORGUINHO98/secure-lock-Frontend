import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../theme/colors';
import { useAppContext } from '../context/AppContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CustomModal = ({ 
  visible, 
  onClose, 
  title, 
  children, 
  primaryAction, 
  primaryLabel,
  secondaryAction,
  secondaryLabel,
  isLoading = false
}) => {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.dismissArea} 
          activeOpacity={1} 
          onPress={onClose} 
        />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={[
            styles.content, 
            { backgroundColor: themeColors.surface }
          ]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={24} color={themeColors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.body}>
              {children}
            </View>

            <View style={styles.footer}>
              {secondaryLabel && (
                <TouchableOpacity 
                  style={[styles.button, styles.secondaryButton, { borderColor: themeColors.border }]} 
                  onPress={secondaryAction || onClose}
                >
                  <Text style={[styles.buttonText, { color: themeColors.textSecondary }]}>
                    {secondaryLabel}
                  </Text>
                </TouchableOpacity>
              )}
              {primaryLabel && (
                <TouchableOpacity 
                  style={[styles.button, styles.primaryButton]} 
                  onPress={primaryAction}
                  disabled={isLoading}
                >
                  <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                    {isLoading ? '...' : primaryLabel}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.lg,
    maxHeight: SCREEN_HEIGHT * 0.8,
    ...SHADOWS.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  closeBtn: {
    padding: SPACING.xs,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
  },
  body: {
    marginBottom: SPACING.xl,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
  },
});

export default CustomModal;
