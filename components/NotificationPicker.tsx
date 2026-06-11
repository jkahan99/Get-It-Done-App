import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

type ChipId = '1hr' | '1day' | 'other';

type NotificationPickerProps = {
  selected: Date | null;
  onSelect: (date: Date | null) => void;
};

const CHIPS: { id: ChipId; label: string; icon: string }[] = [
  { id: '1hr', label: '1 hr', icon: 'time-outline' },
  { id: '1day', label: '1 day', icon: 'sunny-outline' },
  { id: 'other', label: 'Other', icon: 'calendar-outline' },
];

const TOLERANCE_MS = 5 * 60 * 1000; // 5-minute window to match a preset chip

function getActiveChip(date: Date | null): ChipId | null {
  if (!date) return null;
  const ms = date.getTime() - Date.now();
  if (Math.abs(ms - 3_600_000) < TOLERANCE_MS) return '1hr';
  if (Math.abs(ms - 86_400_000) < TOLERANCE_MS) return '1day';
  return 'other';
}

export default function NotificationPicker({ selected, onSelect }: NotificationPickerProps) {
  const activeChip = getActiveChip(selected);

  const handleChipPress = (id: ChipId) => {
    if (activeChip === id) {
      onSelect(null);
      return;
    }
    if (id === '1hr') {
      onSelect(new Date(Date.now() + 3_600_000));
    } else if (id === '1day') {
      onSelect(new Date(Date.now() + 86_400_000));
    } else {
      onSelect(new Date(Date.now() + 2 * 3_600_000));
    }
  };

  const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (date) onSelect(date);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Remind me</Text>
      <View style={styles.row}>
        {CHIPS.map(({ id, label, icon }) => {
          const isSelected = activeChip === id;
          return (
            <TouchableOpacity
              key={id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => handleChipPress(id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={icon as any}
                size={13}
                color={isSelected ? Colors.surface : Colors.textSecondary}
              />
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {activeChip === 'other' && selected && (
        <View style={styles.datePickerRow}>
          <DateTimePicker
            value={selected}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        </View>
      )}
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
  datePickerRow: {
    marginTop: Spacing.sm,
    alignItems: 'flex-start',
  },
});
