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
    const iconColor = COLORS.primary;
    
    // Simple logic for dynamic icons based on name
    const name = room.name.toLowerCase();
    if (name.includes('sala') || name.includes('living')) return <Layout size={iconSize} color={iconColor} />;
    if (name.includes('cuarto') || name.includes('habitación') || name.includes('bedroom')) return <Home size={iconSize} color={iconColor} />;
    if (name.includes('oficina') || name.includes('office')) return <Smartphone size={iconSize} color={iconColor} />;
    
    return <Shield size={iconSize} color={iconColor} />;
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
        },
        SHADOWS.small
      ]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: COLORS.primaryLight }]}>
        {getIcon()}
      </View>
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: themeColors.text }]} numberOfLines={1}>
            {room.name}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
              <Pencil size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
              <Trash2 size={18} color={COLORS.status.locked} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={[styles.deviceCount, { color: themeColors.textSecondary }]}>
            {room.deviceCount || 0} dispositivos
          </Text>
          <View style={styles.viewMore}>
            <Text style={styles.viewMoreText}>Ver detalles</Text>
            <ChevronRight size={16} color={COLORS.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: 20,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
    height: 64,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...TYPOGRAPHY.h3,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
    backgroundColor: 'rgba(150, 150, 150, 0.15)',
    borderRadius: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceCount: {
    ...TYPOGRAPHY.caption,
  },
  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewMoreText: {
    ...TYPOGRAPHY.small,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 2,
  },
});

export default RoomCard;
