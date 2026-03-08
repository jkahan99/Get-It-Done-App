import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type EditTodoModalProps = {
  visible: boolean;
  editText: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export default function EditTodoModal({ visible, editText, onChangeText, onSave, onCancel }: EditTodoModalProps) {
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
          <Text style={styles.modalTitle}>Edit Task</Text>
          
          <TextInput
            style={styles.modalInput}
            placeholder="Task name"
            value={editText}
            onChangeText={onChangeText}
            autoFocus={true}  
            onSubmitEditing={onSave}  
            returnKeyType="done"
          />
          
          <View style={styles.modalButtons}>
  <TouchableOpacity 
    style={[styles.modalButton, styles.cancelButton]}
    onPress={onCancel}
  >
    <Text style={styles.modalButtonText}>Cancel</Text>
  </TouchableOpacity>
  
  <TouchableOpacity style={styles.modalButton} onPress={onSave}>
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
  modalButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});