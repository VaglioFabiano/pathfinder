import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface WarningModalProps {
  warningModalVisible: boolean;
  warningText: string;
  setWarningText: (text: string) => void;
  submitWarning: (flag: boolean) => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ warningModalVisible, warningText, setWarningText, submitWarning }) => {

  return (
    <Modal visible={warningModalVisible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Warning Description</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter your warning description..."
            value={warningText}
            placeholderTextColor={'white'}  
            onChangeText={setWarningText}
            multiline={true}
          />

          <View style={styles.separator} />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#86af49' }]}
              onPress={() => submitWarning(true)}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => submitWarning(false)}
            >
              <Text style={[styles.buttonText, { textDecorationLine: 'underline' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  separator: { height: 1, backgroundColor: 'black', marginVertical: 5, opacity: 0.2, alignItems: 'center', justifyContent: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: {
    backgroundColor: 'rgb(141, 141, 141)',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#a0a0a0', // Colore simile al background del ReviewModal
    color: 'white',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default WarningModal;
