import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddTodoModal from '../components/AddTodoModal';
import CompletedModal from '../components/CompletedModal';
import EditTodoModal from '../components/EditTodoModal';
import TodoItem from '../components/TodoItem';
import { Colors, Shadows, Spacing, Typography } from '../constants/theme';
import { Todo } from '../types/Todo';
import { generateWittyNotification } from '../utils/aiNotifications';
import { cancelNotification, requestNotificationPermissions, scheduleNotification } from '../utils/notifications';

export default function TodoList() {

const insets = useSafeAreaInsets();
const [todos, setTodos] = useState<Todo[]>([]);
const [modalVisible, setModalVisible] = useState(false);
const [todoText, setTodoText] = useState('');
const [showCompleted, setShowCompleted] = useState(false);
const [editingId, setEditingId] = useState<number | null>(null);
const [editText, setEditText] = useState('');
const [justCompleted, setJustCompleted] = useState<number | null>(null);

useEffect(() => {
  loadTodos();
}, []);

useEffect(() => {
  saveTodos();
}, [todos]);

useEffect(() => {
  requestNotificationPermissions();
}, []);

const addTodo = async (title: string) => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  const newTodo: Todo = {
    id: Date.now(),
    title,
    completed: false,
  };

  // Add to state IMMEDIATELY (user sees it right away)
  setTodos([...todos, newTodo]);

  // THEN do the slow AI stuff in background
  const baseMessage = await generateWittyNotification(title);
  console.log('AI message for "' + title + '":', baseMessage);

  // Create variations programmatically (no extra cost!)
  const message1h = baseMessage;
  const message23h = baseMessage;
  const message1w = `Final reminder: ${baseMessage} `;

  // Schedule 3 notifications with different messages
  const notificationId1h = await scheduleNotification(newTodo.id, message1h, 2);
  const notificationId23h = await scheduleNotification(newTodo.id, message23h, 82800);
  const notificationId1w = await scheduleNotification(newTodo.id, message1w, 604800);

  // Update the todo with notification IDs
  setTodos(prevTodos => prevTodos.map(todo =>
    todo.id === newTodo.id
      ? { ...todo, notificationIds: [notificationId1h, notificationId23h, notificationId1w] }
      : todo
  ));
};

const toggleComplete = (id: number) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  const todo = todos.find(t => t.id === id);
  if (todo && !todo.completed) {
    setJustCompleted(id);

    if (todo.notificationIds) {
      todo.notificationIds.forEach(id => cancelNotification(id));
      console.log('All 3 notifications cancelled!');
    }
    setTimeout(() => {
      setTodos(todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: true };
        }
        return todo;
      }));

      // Clear justCompleted so it disappears from active list
      setTimeout(() => {
        setJustCompleted(null);
      }, 700);

    }, 100);
  } else {
    setJustCompleted(null);
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: false };
      }
      return todo;
    }));
  }
};

const deleteTodo = (id: number) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  const todo = todos.find(t => t.id === id);
  if (todo?.notificationIds) {
    todo.notificationIds.forEach(id => cancelNotification(id));
    console.log('All 3 notifications cancelled!');
  }
  setTodos(todos.filter(todo => todo.id !== id));
};

const editTodo = (id: number, newTitle: string) => {
  setTodos(todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, title: newTitle };
    }
    return todo;
  }));
};

const openEditModal = (id: number) => {
  const todoToEdit = todos.find(todo => todo.id === id);
  if (todoToEdit) {
    setEditText(todoToEdit.title);
    setEditingId(id);
    setShowCompleted(false);
  }
};

const saveTodos = async () => {
  try {
    await AsyncStorage.setItem('todos', JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos:', error);
  }
};

const loadTodos = async () => {
  try {
    const savedTodos = await AsyncStorage.getItem('todos');
    if (savedTodos !== null) {
      setTodos(JSON.parse(savedTodos));
    }
  } catch (error) {
    console.error('Failed to load todos:', error);
  }
};

const activeTodos = todos.filter(todo => !todo.completed || todo.id === justCompleted);
const completedTodos = todos.filter(todo => todo.completed);


return (
  <View style={styles.outer}>
    <View style={styles.container}>

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top - 12 }]}>
        <Text style={styles.headerTitle}>Get It Done</Text>
      </View>

      {/* TODO LIST */}
      <FlatList
        data={activeTodos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onToggle={toggleComplete}
            onDelete={deleteTodo}
            onEdit={openEditModal}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle-outline" size={64} color={Colors.border} />
            <View style={{ height: 16 }} />
            <Text style={styles.emptyTitle}>All clear ✨</Text>
            <View style={{ height: 8 }} />
            <Text style={styles.emptySubtitle}>Add your first task to get started</Text>
          </View>
        }
      />

      {/* COMPLETED BUTTON */}
      <Pressable
        style={({ pressed }) => [styles.completedButton, pressed && { opacity: 0.8 }]}
        onPress={() => setShowCompleted(!showCompleted)}
      >
        <Ionicons name="checkmark-done" size={20} color={Colors.primary} />
        <Text style={styles.completedButtonText}>{completedTodos.length} Done</Text>
      </Pressable>

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { backgroundColor: Colors.primaryPressed }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color={Colors.surface} />
      </Pressable>

    </View>

    {/* MODALS */}
    <AddTodoModal
      visible={modalVisible}
      todoText={todoText}
      onChangeText={setTodoText}
      onAdd={() => {
        if (todoText.trim() !== '') {
          addTodo(todoText);
          setModalVisible(false);
          setTodoText('');
        }
      }}
      onCancel={() => { setModalVisible(false); setTodoText(''); }}
    />

    <CompletedModal
      visible={showCompleted}
      completedTodos={completedTodos}
      onClose={() => setShowCompleted(false)}
      onToggle={toggleComplete}
      onDelete={deleteTodo}
      onEdit={openEditModal}
    />

    <EditTodoModal
      visible={editingId !== null}
      editText={editText}
      onChangeText={setEditText}
      onSave={() => {
        if (editText.trim() !== '' && editingId !== null) {
          editTodo(editingId, editText);
          setEditingId(null);
          setEditText('');
        }
      }}
      onCancel={() => {
        setEditingId(null);
        setEditText('');
      }}
    />
  </View>
);

}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,                   // 20
    paddingBottom: Spacing.lg,                       // 16
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.size.display,               // 34
    fontWeight: Typography.weight.heavy,             // '800'
    fontFamily: Typography.fontFamily,
    letterSpacing: Typography.letterSpacing.display, // -0.5
    color: Colors.textPrimary,
  },

  listContent: {
    paddingHorizontal: Spacing.xl,                   // 20
    paddingBottom: 120,                              // clear the FABs
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: Typography.size.title,                 // 22
    fontWeight: Typography.weight.bold,              // '700'
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: Typography.size.body,                  // 15
    fontWeight: Typography.weight.regular,           // '400'
    fontFamily: Typography.fontFamily,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  completedButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,                                 // 4
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 999,
    height: 52,
    paddingHorizontal: Spacing['2xl'],               // 24
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  completedButtonText: {
    fontSize: Typography.size.body,                  // 15
    fontWeight: Typography.weight.semibold,          // '600'
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
});
