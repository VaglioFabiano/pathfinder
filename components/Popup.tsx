import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Assicurati di importare MaterialIcons

interface PopupProps {
  selectedTrail: {
    id: number;
    name: string;
    startpoint: { latitude: number; longitude: number };
    endpoint: { latitude: number; longitude: number };
    trail: [[number, number]];
    length: number; // Assicurati che la lunghezza, durata e difficoltà siano passati nel selectedTrail
    duration: number;
    elevation: number;
    difficulty: string;
  } | null;
  startTrail: () => void;
  closeModal: (flag: boolean) => void;
  setIsModalDetailVisible: (value: boolean) => void;
}

const Popup: React.FC<PopupProps> = ({ selectedTrail, startTrail, closeModal, setIsModalDetailVisible }) => {
  return (
    <View style={styles.popupContainer}>
      <TouchableOpacity style={styles.popup} onPress={() => { closeModal(false); setIsModalDetailVisible(true); }}>
        <Text style={styles.trailName}>{selectedTrail?.name}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            <MaterialIcons name="timeline" size={16} color="#666" /> {selectedTrail?.length} km
          </Text>
          <Text style={styles.infoText}>
            <MaterialIcons name="schedule" size={16} color="#666" /> {selectedTrail?.duration} ore
          </Text>
          <Text style={styles.infoText}>
            <MaterialIcons name="landscape" size={16} color="#666" /> {selectedTrail?.elevation} m
          </Text>
          <View style={[styles.difficultyContainer, { backgroundColor: selectedTrail?.difficulty === 'Beginner' ? '#28a745' : selectedTrail?.difficulty === 'Intermediate' ? '#ffc107' : '#dc3545' }]}>
            <Text style={styles.difficultyLabel}>{selectedTrail?.difficulty}</Text>
          </View>
        </View>

        {/* Pulsanti posizionati sotto */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.startButton} onPress={startTrail}>
            <Text style={styles.buttonText}>Inizia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => closeModal(true)}>
            <Text style={styles.buttonText}>Chiudi</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
  },
  popup: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    width: 400,
  },
  trailName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  infoText: {
    color: '#bbb',
    fontSize: 14,
  },
  difficultyContainer: {
    padding: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  difficultyLabel: {
    color: '#fff',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  startButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Popup;
