import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type AddTodoModalProps = {
  visible: boolean;
  todoText: string;
  onChangeText: (text: string) => void;
  onAdd: () => void;
  onCancel: () => void;
};

export default function AddTodoModal({ visible, todoText, onChangeText, onAdd, onCancel }: AddTodoModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>New Task</Text>

          
          
          <TextInput
            style={styles.modalInput}
            placeholder="What do you want to do?"
            value={todoText}
            onChangeText={onChangeText}
            autoFocus={true}
            onSubmitEditing={onAdd}
            returnKeyType="done"

          />
          
          <View style={styles.modalButtons}>
  <TouchableOpacity 
    style={[styles.modalButton, styles.cancelButton]}
    onPress={onCancel}
  >
    <Text style={styles.modalButtonText}>Cancel</Text>
  </TouchableOpacity>
  
  <TouchableOpacity
    style={[styles.modalButton, !todoText.trim() && styles.disabledButton]}
    onPress={onAdd}
    disabled={!todoText.trim()}
  >
    <Text style={styles.modalButtonText}>Add</Text>
  </TouchableOpacity>
</View>
        </View>
      </View>
    </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
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
  disabledButton: {
    backgroundColor: '#c7c7cc',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});