import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pencil, Trash2, ChevronRight, Home, Layout, Shield, Smartphone } from 'lucide-react-native';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../theme/colors';
import { useAppContext } from '../context/AppContext';

const RoomCard = ({ room, onEdit, onDelete, onPress }) => {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const getIcon = () => {
    const iconSize = 32;
    return <Shield size={iconSize} color="#FFFFFF" />;
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={onPress}
      style={[
        styles.container, 
        { 
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
        }
      ]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: COLORS.primary }]}>
        {getIcon()}
      </View>
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: themeColors.text }]} numberOfLines={1}>
            {room.name}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
              <Pencil size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
              <Trash2 size={20} color={COLORS.status.locked} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View />
          <TouchableOpacity onPress={onPress} style={styles.viewMore}>
            <Text style={styles.viewMoreText}>Ver Más</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: 16,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
    height: 80,
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    ...TYPOGRAPHY.h3,
    fontSize: 20,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    padding: 4,
    marginLeft: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  viewMore: {
    paddingVertical: 4,
  },
  viewMoreText: {
    fontSize: 16,
    color: COLORS.primary,
  },
});

export default RoomCard;
