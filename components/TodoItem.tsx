import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '../constants/theme';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoItemProps {
  item: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (id: number) => void;
  isCompleted?: boolean;
}

export default function TodoItem({ item, onToggle, onDelete, onEdit }: TodoItemProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const checkScale = React.useRef(new Animated.Value(item.completed ? 1 : 0)).current;
  const checkOpacity = React.useRef(new Animated.Value(item.completed ? 1 : 0)).current;

  // ── unchanged animation logic ──────────────────────────────────────────────
  React.useEffect(() => {
    if (item.completed) {
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      checkScale.setValue(0);
      checkOpacity.setValue(0);
    }
  }, [item.completed]);

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.15, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1,    duration: 100, useNativeDriver: true }),
    ]).start();
    onToggle(item.id);
  };
  // ── end unchanged logic ────────────────────────────────────────────────────

  return (
    <Pressable
      style={({ pressed }) => [
        styles.todoRow,
        item.completed && styles.todoRowCompleted,
        pressed && styles.todoRowPressed,
      ]}
      onPress={() => onEdit?.(item.id)}
    >
      {/* Checkbox */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable onPress={handleToggle} hitSlop={8}>
          <View style={[styles.circle, item.completed && styles.circleCompleted]}>
            {item.completed && (
              <Animated.Text
                style={[
                  styles.checkmark,
                  { transform: [{ scale: checkScale }], opacity: checkOpacity },
                ]}
              >
                ✓
              </Animated.Text>
            )}
          </View>
        </Pressable>
      </Animated.View>

      {/* Title */}
      <Text style={[styles.todoTitle, item.completed && styles.todoTitleCompleted]}>
        {item.title}
      </Text>

      {/* Delete */}
      <Pressable onPress={() => onDelete(item.id)} hitSlop={8}>
        <Ionicons name="trash-outline" size={22} color={Colors.textTertiary} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,        // 16
    paddingHorizontal: Spacing.xl,      // 20
    borderRadius: Radius.md,            // 14
    borderWidth: 1,
    borderColor: Colors.border,         // stone-200
    marginBottom: Spacing.sm,            // 8
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  todoRowCompleted: {
    borderColor: Colors.borderSubtle,   // stone-100 on 3 sides
    borderLeftWidth: 4,
    borderLeftColor: Colors.primarySoft, // emerald-100 accent bar
  },
  todoRowPressed: {
    backgroundColor: Colors.borderSubtle, // #F5F5F4
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors.textDisabled,   // stone-300
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,            // 16
  },
  circleCompleted: {
    backgroundColor: Colors.primary,    // emerald-500
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
  todoTitle: {
    flex: 1,
    fontSize: Typography.size.bodyLg,       // 17
    fontWeight: Typography.weight.semibold,  // '600'
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,              // stone-900
  },
  todoTitleCompleted: {
    color: Colors.textDisabled,             // stone-300
    textDecorationLine: 'line-through',
  },
});
