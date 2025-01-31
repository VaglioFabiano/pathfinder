import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TrailInfoPanelProps {
  time: number;
  distance: number;
  downhill: number;
  elevation: number;
  calculateAverageSpeed: () => number;
  endTrail: () => void;
}

const TrailInfoPanel: React.FC<TrailInfoPanelProps> = ({ time, distance, downhill, elevation, calculateAverageSpeed, endTrail }) => {
  return (
    <View style={styles.container}>
      <View style={styles.timeDistanceContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            {Math.floor(time / 60)}m {time % 60}s
          </Text>
          <Text style={styles.infoLabel}>Tempo</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>{distance.toFixed(2)} km</Text>
          <Text style={styles.infoLabel}>Distanza</Text>
        </View>
      </View>


      <View style={styles.secondRow}>
        <View style={styles.downhillContainer}>
            <Text style={styles.infoLabel} >Discesa: {downhill.toFixed(2)} m</Text>
        </View>

        <View style={styles.elevationContainer}>
            <Text style={styles.infoLabel} >Elevazione: {elevation.toFixed(2)} m</Text>
        </View>
        <View style={styles.averageSpeedContainer}>
            <Text style={styles.infoLabel} >Velocità: {calculateAverageSpeed()} km/h</Text>
        </View>
        </View>
        <TouchableOpacity style={styles.endButton} onPress={endTrail}>
            <Text style={styles.buttonText}>Termina</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80, // Posiziona il pannello in basso
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
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
  },
  infoLabel: {
    fontSize: 14,
    color: 'gray',
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
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TrailInfoPanel;
