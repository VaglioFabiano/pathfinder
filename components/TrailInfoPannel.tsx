import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TrailInfoPanelProps {
  isPaused: boolean;
  time: number;
  distance: number;
  downhill: number;
  elevation: number;
  calculateAverageSpeed: () => number;
  endTrail: () => void;
  pauseTrail: () => void;
  resumeTrail: () => void;
}

const TrailInfoPanel: React.FC<TrailInfoPanelProps> = ({ isPaused, pauseTrail, resumeTrail, time, distance, downhill, elevation, calculateAverageSpeed, endTrail }) => {
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
            <Text style={styles.infoLabel} >Downhill: {downhill.toFixed(2)} m</Text>
        </View>

        <View style={styles.elevationContainer}>
            <Text style={styles.infoLabel} >Elevation: {elevation.toFixed(2)} m</Text>
        </View>
        <View style={styles.averageSpeedContainer}>
            <Text style={styles.infoLabel} >Avg Speed: {calculateAverageSpeed()} km/h</Text>
        </View>
        </View>
           
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

          {/* Bottone di fine */}
          <TouchableOpacity
            style={[styles.endButton, { backgroundColor: '#dc3545', width: '40%' }]}
            onPress={endTrail}
          >
            <Text style={styles.buttonText}>End</Text>
          </TouchableOpacity>
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
  buttonContainer: {
    width: '100%',
    flexDirection: 'row', // Disposizione orizzontale dei bottoni
    justifyContent: 'space-between', // Distribuisce i bottoni in modo uniforme
    alignItems: 'center',
    marginTop: 10,
  },
timeDistanceContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
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
    alignItems: "baseline",
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
    alignItems: "flex-end",
  },
  downhillContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  averageSpeedContainer :{
    marginTop: 10,
    alignItems: "flex-start",
  },
  endButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TrailInfoPanel;
