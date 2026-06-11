import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

type Option = { label: string; seconds: number | null; icon: string };

const OPTIONS: Option[] = [
  { label: 'None', seconds: null, icon: 'notifications-off-outline' },
  { label: '1 hr', seconds: 3600, icon: 'time-outline' },
  { label: '3 hrs', seconds: 10800, icon: 'time-outline' },
  { label: 'Tomorrow', seconds: 86400, icon: 'sunny-outline' },
  { label: '1 week', seconds: 604800, icon: 'calendar-outline' },
];

type NotificationPickerProps = {
  selected: number | null;
  onSelect: (seconds: number | null) => void;
};

export default function NotificationPicker({ selected, onSelect }: NotificationPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Remind me</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.seconds;
          return (
            <TouchableOpacity
              key={opt.label}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(opt.seconds)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={opt.icon as any}
                size={13}
                color={isSelected ? Colors.surface : Colors.textSecondary}
              />
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.size.caption,
    fontWeight: Typography.weight.semibold,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.surface,
  },
});