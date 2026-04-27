import React from 'react';
import { Animated, FlatList, Modal, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';

type CompletedModalProps = {
  visible: boolean;
  completedTodos: Todo[];
  onClose: () => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

export default function CompletedModal({ visible, completedTodos, onClose, onToggle, onDelete, onEdit }: CompletedModalProps) {
  const translateX = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only trigger on right swipe (going back/left)
        return gestureState.dx > 20 && Math.abs(gestureState.dy) < 50;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow positive values (swiping right to go back)
        if (gestureState.dx > 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 100) {
          // Swipe far enough - close the modal
          Animated.timing(translateX, {
            toValue: 400,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            translateX.setValue(0);
          });
        } else {
          // Snap back
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[styles.container, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.header}>
          {/* Left spacer mirrors the close icon width to keep title centered */}
          <View style={styles.spacer} />

          <Text style={styles.headerTitle}>Completed</Text>

          <Pressable
            style={({ pressed }) => [styles.doneButton, pressed && { opacity: 0.8 }]}
            onPress={onClose}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>

        <FlatList
          data={completedTodos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TodoItem
              item={item}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              isCompleted={true}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No completed tasks yet</Text>
          }
        />
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,   // 20
    paddingTop: 75,
    paddingBottom: Spacing.xl,       // 20
    backgroundColor: Colors.background,
  },
  spacer: {
    width: 72,                       // mirrors doneButton width
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.size.display,               // 34
    fontWeight: Typography.weight.heavy,             // '800'
    fontFamily: Typography.fontFamily,
    letterSpacing: Typography.letterSpacing.display, // -0.5
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  doneButton: {
    width: 72,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 999,
    paddingVertical: Spacing.sm,     // 8
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  doneButtonText: {
    fontSize: Typography.size.body,           // 15
    fontWeight: Typography.weight.semibold,   // '600'
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,   // 20
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textTertiary,
    fontSize: Typography.size.body,  // 15
    marginTop: 50,
  },
});
