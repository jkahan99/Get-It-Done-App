import { Inter_700Bold } from '@expo-google-fonts/inter';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Raleway_700Bold } from '@expo-google-fonts/raleway';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AddTodoModal from '../components/AddTodoModal';
import CompletedModal from '../components/CompletedModal';
import EditTodoModal from '../components/EditTodoModal';
import { Todo } from '../types/Todo';
import { generateWittyNotification } from '../utils/aiNotifications';
import { cancelNotification, requestNotificationPermissions, scheduleNotification } from '../utils/notifications';
export default function TodoList() {

//make an array of ToDo items
const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Poppins_700Bold,
    Raleway_700Bold,
    Montserrat_700Bold,
  });
const [todos, setTodos] = useState<Todo[]>([]);
const [modalVisible, setModalVisible] = useState(false);  // Add this
const [todoText, setTodoText] = useState('');  
const [showCompleted, setShowCompleted] = useState(false);
const [editingId, setEditingId] = useState<number | null>(null);  // ADD THIS
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
  const message1h = baseMessage;                     // 1 hour: urgency
  const message23h = baseMessage;                            // 23 hours: original  
  const message1w = `Final reminder: ${baseMessage} `;     // 1 week: guilt trip

  // Schedule 3 notifications with different messages
  const notificationId1h = await scheduleNotification(newTodo.id, message1h, 2);
  const notificationId23h = await scheduleNotification(newTodo.id, message23h, 82800);
  const notificationId1w = await scheduleNotification(newTodo.id, message1w, 604800);
 
  // Update the todo with notification ID
  setTodos(prevTodos => prevTodos.map(todo => 
    todo.id === newTodo.id 
      ? {...todo, notificationIds: [notificationId1h, notificationId23h, notificationId1w]} 
      : todo
  ));
}

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
          return {...todo, completed: true};
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
        return {...todo, completed: false};
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
      return {...todo, title: newTitle};
    }
    return todo;
  }));
};

const openEditModal = (id: number) => {
  const todoToEdit = todos.find(todo => todo.id === id);
  if (todoToEdit) {
    setEditText(todoToEdit.title);
    setEditingId(id);
    setShowCompleted(false);  // Closes completed modal

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
// Animated circle component
// Animated circle component with green flash
// Animated circle component with animated checkmark
const AnimatedTodoCircle = ({ item, onToggle }: { item: Todo; onToggle: () => void }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const checkScale = React.useRef(new Animated.Value(0)).current;
  const checkOpacity = React.useRef(new Animated.Value(0)).current;

  // Animate checkmark in when item becomes completed
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

  const handlePress = () => {
    // Bounce the whole circle
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onToggle();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.6}>
        <View style={item.completed ? styles.circleCompleted : styles.circle}>
          {item.completed && (
            <Animated.Text 
              style={[
                styles.checkmark,
                { 
                  transform: [{ scale: checkScale }],
                  opacity: checkOpacity 
                }
              ]}
            >
              ✓
            </Animated.Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
return (
  <View style={{ flex: 1, backgroundColor: '#FAF8F5' }}>
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Get It Done</Text>
      </View>

      {/* TODO LIST */}
      <FlatList
        data={activeTodos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoRow}>
            <AnimatedTodoCircle item={item} onToggle={() => toggleComplete(item.id)} />
            
            <TouchableOpacity 
              style={styles.todoContent}
              onPress={() => openEditModal(item.id)}
            >
              <Text style={styles.todoTitle}>
                {item.title}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteButton}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔥</Text>
            <Text style={styles.emptyTitle}>All clear!</Text>
            <Text style={styles.emptyText}>Tap + and get it done!</Text>
          </View>
        }
      />

      {/* COMPLETED BUTTON */}
      <TouchableOpacity 
        style={styles.completedButton}
        onPress={() => setShowCompleted(!showCompleted)}
      >
        <Text style={styles.completedButtonText}>
          ✓ {completedTodos.length}
        </Text>
      </TouchableOpacity>

      {/* NEW BUTTON */}
      <TouchableOpacity 
        style={styles.newButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.newButtonText}>+</Text>
      </TouchableOpacity>
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
      onCancel={() => setModalVisible(false)}
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
  container: {
    flex: 1,
  backgroundColor: '#FAF8F5',

  },
  text: {  // Add this
    color: 'blue',
    fontSize: 40,  // This is how you change text size
  },
 header: {
  alignItems: 'center',  // Center everything
  paddingHorizontal: 20,
  paddingTop: 30,
  paddingBottom: 20,
  backgroundColor: '#FAF8F5',
},
circle: {
  width: 24,
  height: 24,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: '#c7c7cc',
  marginRight: 12,
  justifyContent: 'center',
  alignItems: 'center',
},
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
todoRow: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FAF8F5',  // Change from 'white' to match background
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: '#e5e5ea',
  justifyContent: 'space-between',  // Add this
},
emptyState: {
  alignItems: 'center',
  marginTop: 100,
},
emptyIcon: {
  fontSize: 48,
  marginBottom: 16,
},
emptyTitle: {
  fontSize: 24,
  fontWeight: '600',
  color: '#000',
  marginBottom: 8,
},
// Keep your existing emptyText but update it:
emptyText: {
  textAlign: 'center',
  color: '#8e8e93',
  fontSize: 17,
},
todoContent: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},
deleteButton: {
  fontSize: 20,
  marginLeft: 10,
},
safeArea: {
  flex: 1,
  backgroundColor: '#FAF8F5',  // Extends cream to edges
},
modalContent: {
  backgroundColor: 'white',
  borderRadius: 12,
  padding: 20,
  width: '80%',
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 15,
  textAlign: 'center',
},
modalInput: {
  borderWidth: 1,
  borderColor: '#e5e5ea',
  borderRadius: 8,
  padding: 12,
  fontSize: 17,
  marginBottom: 20,
},
modalButtons: {
  flexDirection: 'row',
  gap: 10,
},
modalButton: {
  flex: 1,
  backgroundColor: '#007AFF',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
},
cancelButton: {
  backgroundColor: '#8e8e93',
},
modalButtonText: {
  color: 'white',
  fontSize: 17,
  fontWeight: '600',
},
todoTitle: {
  fontSize: 17,
  color: '#000',
},
newButton: {
  position: 'absolute',
  bottom: 30,
  right: 30,
  backgroundColor: '#007AFF',
   width: 70,           // Match completed button
  height: 70,          // Match completed button
  borderRadius: 35, 
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 8,  // For Android
},
newButtonText: {
  fontSize: 38,
  color: 'white',
  fontWeight: '300',  // Thin plus sign
  lineHeight: 38
},
completedButton: {
  position: 'absolute',
  bottom: 30,
  left: 30,
  backgroundColor: '#34C759',
  width: 70,
  height: 70,
  borderRadius: 35,
  justifyContent: 'center',
  alignItems: 'center',
   shadowColor: '#000',  // Add shadow
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 8,
},
completedButtonText: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
},
outerContainer: {
  flex: 1,
  backgroundColor: '#FAF8F5',  // This fills EVERYTHING
},
  headerTitle: {
  fontSize: 44,
  fontFamily: 'Raleway_700Bold',  // Use the custom font
  letterSpacing: -1,  // Tighter spacing (more modern)
  textAlign: 'center',
},
  circleCompleted: {
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: '#34C759',
  borderColor: '#34C759',
  borderWidth: 2,
  marginRight: 12,
  justifyContent: 'center',
  alignItems: 'center',
},
checkmark: {
  color: 'white',
  fontSize: 14,
  fontWeight: 'bold',
},
todoTitleCompleted: {
  fontSize: 17,
  color: '#8e8e93',
  textDecorationLine: 'line-through',
},
});
