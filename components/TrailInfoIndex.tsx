import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Aggiungiamo l'icona di pericolo
import WarningModal from './WarningModal';

interface TrailInfoPanelProps {
  currentPos: { latitude: number; longitude: number };
  isPaused: boolean;
  time: number;
  distance: number;
  downhill: number;
  elevation: number;
  calculateAverageSpeed: () => number;
  endTrail: () => void;
  pauseTrail: () => void;
  resumeTrail: () => void;
  submitWarning: (warningText: string, position: { latitude: number; longitude: number }) => void;
}

const TrailInfoIndex: React.FC<TrailInfoPanelProps> = ({submitWarning, currentPos, isPaused, time, distance, downhill, elevation, calculateAverageSpeed, endTrail, pauseTrail, resumeTrail,}) => {

    // Nell'app principale o componente dove viene utilizzato
    const [warningModalVisible, setWarningModalVisible] = useState(false);
    const [warningText, setWarningText] = useState('');

    const handleWarning = () => {
        setWarningModalVisible(true);
        pauseTrail();
    };

    const handleWarningSubmit = (confirmed: boolean) => {
        if (confirmed) {
          if (warningText.trim() === '') {
            alert('Inserisci un commento e seleziona una valutazione.');
            return;
          }
          console.log("cuttentPos", currentPos);
          submitWarning(warningText, currentPos);
        }
        resumeTrail();
        setWarningModalVisible(false); 
    };

    

  return (
    <View style={styles.container}>
      <View style={styles.timeDistanceContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            {Math.floor(time / 60)}m {time % 60}s
          </Text>
          <Text style={styles.infoLabel}>Time</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>{distance.toFixed(2)} km</Text>
          <Text style={styles.infoLabel}>Distance</Text>
        </View>
      </View>

      <View style={styles.secondRow}>
        <View style={styles.downhillContainer}>
          <Text style={styles.infoLabel}>Downhill: {downhill.toFixed(2)} m</Text>
        </View>

        <View style={styles.elevationContainer}>
          <Text style={styles.infoLabel}>Elevation: {elevation.toFixed(2)} m</Text>
        </View>
        <View style={styles.averageSpeedContainer}>
          <Text style={styles.infoLabel}>Avg Speed: {calculateAverageSpeed()} km/h</Text>
        </View>
      </View>

      {/* Bottoni in una sola riga */}
      <View style={styles.buttonContainer}>
        {/* Bottone Pausa/Resume */}
        {!isPaused ? (
          <TouchableOpacity
            style={[styles.endButton, { backgroundColor: '#86af49', width: '40%' }]}
            onPress={pauseTrail}
          >
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.endButton, { backgroundColor: '#32421b', width: '40%' }]}
            onPress={resumeTrail}
          >
            <Text style={styles.buttonText}>Resume</Text>
          </TouchableOpacity>
        )}

        {/* Bottone di pericolo giallo */}
        <TouchableOpacity
          style={[styles.warningButton, { width: '15%' }]}
          onPress={() => {
            handleWarning();
          }}
        >
          <Icon name="exclamation-triangle" size={16} color="white" />
        </TouchableOpacity>

        {/* Bottone di fine */}
        <TouchableOpacity
          style={[styles.endButton, { backgroundColor: '#dc3545', width: '40%' }]}
          onPress={endTrail}
        >
          <Text style={styles.buttonText}>End</Text>
        </TouchableOpacity>
        <WarningModal warningModalVisible={warningModalVisible} warningText={warningText} setWarningText={setWarningText} submitWarning={handleWarningSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70, // Posiziona il pannello in basso
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#979797',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  timeDistanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  secondRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  infoBox: {
    alignItems: 'baseline',
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 26,
    color: 'white',
  },
  infoLabel: {
    fontSize: 14,
    color: 'white',
  },
  elevationContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  downhillContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  averageSpeedContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  endButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  warningButton: {
    backgroundColor: '#f4c542', // Giallo
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row', // Disposizione orizzontale dei bottoni
    justifyContent: 'space-between', // Distribuisce i bottoni in modo uniforme
    alignItems: 'center',
    marginTop: 10,
  },
});

export default TrailInfoIndex;
