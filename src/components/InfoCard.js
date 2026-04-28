import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../theme/colors';
import { useAppContext } from '../context/AppContext';

const InfoCard = ({ icon: Icon, label, value, color = COLORS.primary }) => {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: themeColors.surface,
        borderColor: themeColors.border,
      },
      SHADOWS.small
    ]}>
      <View style={[styles.iconWrapper, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : `${color}15` }]}>
        {Icon && <Icon size={24} color={color} />}
      </View>
      <Text style={[styles.label, { color: themeColors.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: themeColors.text }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    padding: SPACING.md,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.small,
    fontWeight: '600',
    marginBottom: 2,
  },
  value: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default InfoCard;
