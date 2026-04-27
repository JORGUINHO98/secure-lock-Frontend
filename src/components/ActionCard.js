import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, SPACING } from '../theme/colors';
import { ChevronRight } from 'lucide-react-native';

const ActionCard = ({ title, subtitle, icon: Icon, variant = 'default', onPress }) => {
  // Determine styles based on variant
  const isColored = variant === 'primary' || variant === 'secondary';
  
  const getCardBackground = () => {
    switch (variant) {
      case 'primary':
        return COLORS.primary;
      case 'secondary':
        return COLORS.secondary;
      default:
        return COLORS.background.surface;
    }
  };

  const iconColor = isColored ? 'rgba(255,255,255,0.9)' : COLORS.primary;
  const titleColor = isColored ? '#FFFFFF' : COLORS.text.main;
  const subtitleColor = isColored ? 'rgba(255,255,255,0.75)' : COLORS.text.secondary;
  const chevronColor = isColored ? 'rgba(255,255,255,0.5)' : COLORS.text.secondary;

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: getCardBackground() },
        isColored && styles.coloredContainer,
      ]} 
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[
        styles.iconContainer,
        { backgroundColor: isColored ? 'rgba(255,255,255,0.15)' : 'rgba(0, 106, 255, 0.08)' }
      ]}>
        {Icon && <Icon size={28} color={iconColor} strokeWidth={2} />}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>}
      </View>
      <ChevronRight size={22} color={chevronColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: 20,
    marginBottom: SPACING.md,
    width: '100%',
    minHeight: 88,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  coloredContainer: {
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default ActionCard;
