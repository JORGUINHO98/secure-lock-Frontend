import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS, SPACING } from '../theme/colors';

const ActionCard = ({ title, subtitle, icon: Icon, backgroundColor, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: COLORS.background.surface }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {Icon && <Icon size={48} color={COLORS.primary} strokeWidth={1.5} />}
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
    borderRadius: 16,
    marginBottom: SPACING.md,
    width: '100%',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
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
    color: COLORS.text.main,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default ActionCard;
