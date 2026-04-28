import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../theme/colors';
import { ChevronRight } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';

const ActionCard = ({ title, subtitle, icon: Icon, variant = 'default', onPress, accentColor }) => {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;
  
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getCardBackground = () => {
    if (accentColor) return accentColor;
    switch (variant) {
      case 'primary': return COLORS.primary;
      case 'secondary': return COLORS.secondary;
      case 'accent': return themeColors.accent || COLORS.accent;
      default: return themeColors.surface;
    }
  };

  const isColored = variant !== 'default' || accentColor;
  const iconColor = isColored ? '#FFFFFF' : COLORS.primary;
  const titleColor = isColored ? '#FFFFFF' : themeColors.text;
  const subtitleColor = isColored ? 'rgba(255,255,255,0.8)' : themeColors.textSecondary;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={[
          styles.container, 
          { 
            backgroundColor: getCardBackground(),
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            borderWidth: isDark ? 1 : 0
          },
          !isColored && SHADOWS.medium,
          isColored && styles.coloredContainer,
        ]} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={[
          styles.iconContainer,
          { backgroundColor: isColored ? 'rgba(255,255,255,0.2)' : COLORS.primaryLight }
        ]}>
          {Icon && <Icon size={24} color={iconColor} strokeWidth={2.5} />}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1} adjustsFontSizeToFit>{title}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: subtitleColor }]} numberOfLines={2}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={[
          styles.chevronContainer,
          { backgroundColor: isColored ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.03)' }
        ]}>
          <ChevronRight size={18} color={titleColor} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 24,
    marginBottom: SPACING.md,
    width: '100%',
    minHeight: 90,
  },
  coloredContainer: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h3,
    fontSize: 18,
    marginBottom: 2,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    lineHeight: 18,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ActionCard;
