import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';
import { ConservationStatus, STATUS_CONFIG } from '../data/mockData';
import { Radius } from '../theme';

interface Props {
  status: ConservationStatus;
  small?: boolean;
}

export default function StatusBadge({ status, small = false }: Props) {
  const config = STATUS_CONFIG[status];
  const iconSize = small ? 10 : 12;
  const fontSize = small ? 10 : 11;
  const padding = small ? { paddingHorizontal: 6, paddingVertical: 2 } : { paddingHorizontal: 10, paddingVertical: 4 };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.color + '44' }, padding]}>
      <ShieldAlert size={iconSize} color={config.color} strokeWidth={2} />
      <Text style={[styles.label, { color: config.color, fontSize }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: { fontWeight: '600' },
});
