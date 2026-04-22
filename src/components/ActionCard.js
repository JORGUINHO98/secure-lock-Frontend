import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, SPACING } from '../theme/colors';

const ActionCard = ({ title, subtitle, icon: Icon, backgroundColor, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {Icon && <Icon size={48} color={COLORS.text.primary} strokeWidth={1.5} />}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: 8, // Rectangular but slightly rounded as in the image
    marginBottom: SPACING.md,
    width: '100%',
    minHeight: 100,
  },
  iconContainer: {
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.text.primary,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default ActionCard;
