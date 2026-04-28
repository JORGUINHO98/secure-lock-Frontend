import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Undo2, Menu } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme/colors';

const Header = ({ 
  title, 
  showBack = false, 
  onBack, 
  showMenu = false, 
  onMenu,
  rightElement,
  isDark = false
}) => {
  const themeColors = isDark ? COLORS.dark : COLORS.light;
  const textColor = isDark ? '#FFFFFF' : themeColors.text;

  return (
    <View style={[
      styles.header, 
      { 
        backgroundColor: isDark ? COLORS.secondary : themeColors.background,
        borderBottomColor: isDark ? 'transparent' : themeColors.border,
        borderBottomWidth: isDark ? 0 : 1
      }
    ]}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <Undo2 size={32} color={textColor} />
          </TouchableOpacity>
        )}
        {showMenu && (
          <TouchableOpacity onPress={onMenu} style={styles.iconButton}>
            <Menu size={32} color={textColor} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightContainer}>
        {rightElement}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    height: Platform.OS === 'ios' ? 70 : 80,
    paddingTop: Platform.OS === 'android' ? 10 : 10,
    paddingBottom: 10,
  },
  leftContainer: {
    width: 50,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 50,
    alignItems: 'flex-end',
  },
  title: {
    ...TYPOGRAPHY.h2,
    textAlign: 'center',
  },
  iconButton: {
    padding: SPACING.xs,
  },
});

export default Header;
