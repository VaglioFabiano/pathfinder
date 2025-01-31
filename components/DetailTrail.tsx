import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Pressable } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface PopupProps {
  selectedTrail: {
    name: string;
    downhill: number;
    difficulty: string;
    length: number;
    duration: number;
    elevation : number;
    
    startpoint: [number, number];
    trail: [[number, number]];
    endpoint: [number, number];
  
    description: string;
    image: string;
  
    city: string;
    region: string;
    state: string;
    province: string;
  
    activity: string;
  };
  startTrail: () => void;
  closeModal: (flag:boolean) => void;
  isVisible: boolean;
}

const TrailInfoModal: React.FC<PopupProps> = ({ selectedTrail, startTrail, closeModal, isVisible }) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => closeModal(true)}
    >
        
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.trailName}>{selectedTrail?.name}</Text>

            {/* Informazioni principali */}
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
              <View style={styles.difficultyContainer}>
                <Text style={styles.difficultyLabel}>{selectedTrail?.difficulty}</Text>
              </View>
            </View>

            {/* Descrizione del trail */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Descrizione</Text>
              <Text style={styles.descriptionText}>
                {selectedTrail.description}
              </Text>
            </View>
          </ScrollView>

          {/* Pulsanti */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.startButton} onPress={startTrail}>
              <Text style={styles.buttonText}>Inizia</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => closeModal(true)}>
              <Text style={styles.buttonText}>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 10,
    padding: 20,
    maxHeight: '90%',
  },
  scrollView: {
    paddingBottom: 20,
  },
  trailName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginRight: 10,
    marginBottom: 5,
  },
  difficultyContainer: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  difficultyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'justify',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TrailInfoModal;
