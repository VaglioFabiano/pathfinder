import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';

interface StartTrailButtonProps {
  startTrail: (position: any, activity: string) => void;
  currentPosition: any;
}

const StartTrailButton = ({ startTrail, currentPosition }: StartTrailButtonProps) => {
  const [selectedActivity, setSelectedActivity] = useState('Escursione');
  const [modalVisible, setModalVisible] = useState(false);

  const activities = ['Escursione', 'Corsa', 'Ciclismo', 'Camminata'];

  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
    setModalVisible(false); // Chiudi il modal dopo la selezione
  };

  return (
    <View style={styles.container}>
      {/* Pulsante per aprire il menu a tendina */}
      <TouchableOpacity
        style={styles.activityButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>{selectedActivity}</Text>
      </TouchableOpacity>

      {/* Bottone Start */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => startTrail(currentPosition, selectedActivity)}
      >
        <Text style={styles.buttonText}>Inizia Percorso</Text>
      </TouchableOpacity>

      {/* Modal per il menu a tendina */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <FlatList
              data={activities}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleActivitySelect(item)}>
                  <Text style={styles.modalItem}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'gray',
    padding: 10,
    elevation: 5,
  },
  activityButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

export default StartTrailButton;
