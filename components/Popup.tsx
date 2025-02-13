import { AntDesign } from '@expo/vector-icons';
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
        <AntDesign name="infocirlceo" size={16} color="white" style={styles.iconStyle} />
        <Text style={styles.trailName}>{selectedTrail?.name}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            <MaterialIcons name="timeline" size={16} color="#fff" /> {selectedTrail?.length} km
          </Text>
          <Text style={styles.infoText}>
            <MaterialIcons name="schedule" size={16} color="#fff" /> {selectedTrail?.duration} h
          </Text>
          <Text style={styles.infoText}>
            <MaterialIcons name="landscape" size={16} color="#fff" /> {selectedTrail?.elevation} m
          </Text>
          <View style={[styles.difficultyContainer, 
            { backgroundColor: selectedTrail?.difficulty === 'Beginner' ? '#4986af' :
             selectedTrail?.difficulty === 'Intermediate' ? '#af8649' : '#af4953' }]} >
            <Text style={[styles.difficultyLabel, {color: "#fff"}]}>{selectedTrail?.difficulty}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        {/* Pulsanti posizionati sotto */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.startButton} onPress={startTrail}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButtonContainer} onPress={() => closeModal(true)}>
            <Text style={[styles.buttonText]}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  separator: { height: 1, backgroundColor: 'black', marginVertical: 5, opacity: 0.2, alignItems: 'center', justifyContent: 'center' },
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
    backgroundColor: '#979797',
    padding: 20,
    borderRadius: 12,
    width: 400,
  },
  trailName: {
    color: '#ffffff',
    fontSize: 21,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  infoText: {
    color: '#fff',
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
    marginTop: 5,
  },
  startButton: {
    backgroundColor: '#86af49',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra
  },
  closeButtonContainer: {
    backgroundColor: 'rgb(141, 141, 141)',  // Un grigio scuro
    padding: 10,
    borderRadius: 5,
    // Ombra
    shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra

    elevation: 5,  // Per dispositivi Android, per l'ombra
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginVertical: 5,
    fontSize: 16,
  },
  iconStyle: {
    alignSelf:"flex-end",  // Center the icon horizontally
     marginBottom: 5,
     shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra
  },
});

export default Popup;
