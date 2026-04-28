import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/colors';
import { useAppContext } from '../context/AppContext';

const CustomInput = ({ 
  label, 
  icon: Icon, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  error,
  keyboardType = 'default',
  containerStyle
}) => {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const [focusAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [themeColors.border, COLORS.primary]
  });

  const borderWidth = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2]
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: isDark ? COLORS.text.white : themeColors.textSecondary }]}>
          {label}
        </Text>
      )}
      <Animated.View style={[
        styles.inputContainer,
        { 
          backgroundColor: themeColors.surface,
          borderColor: error ? COLORS.status.locked : borderColor,
          borderWidth: borderWidth
        },
        (isFocused && !error) ? SHADOWS.glow : {}
      ]}>
        {Icon && (
          <Icon 
            size={20} 
            color={isFocused ? COLORS.primary : themeColors.textSecondary} 
            style={styles.icon} 
          />
        )}
        <TextInput
          style={[styles.input, { color: themeColors.text }]}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            {isPasswordVisible ? (
              <EyeOff size={20} color={themeColors.textSecondary} />
            ) : (
              <Eye size={20} color={themeColors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.xs,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    height: 58,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: SPACING.xs,
  },
  errorText: {
    color: COLORS.status.locked,
    fontSize: 12,
    fontWeight: '500',
    marginTop: SPACING.xs,
    marginLeft: 4,
  },
});

export default CustomInput;
