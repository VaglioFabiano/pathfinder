import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import TrailForm from '@/components/TrailForm'; // Assumendo che TrailForm sia stato convertito in una versione compatibile con React Native
import StartTrailButton from '@/components/StartTrailButton';
import TrailInfoPanel from './TrailInfoPannel';

interface TrailComponentProps {
  isActive: boolean;
  isRecap: boolean;
  startTrail: (position: any) => void;
  endTrail: () => void;
  currentPosition: any;
  time: number;
  distance: number;
  downhill: number;
  elevation: number;
  calculateAverageSpeed: () => number;
  resetTrail: () => void;
  positions: any[];
  activityType: string;
}

const TrailComponent: React.FC<TrailComponentProps> = ({
  isActive,
  isRecap,
  startTrail,
  endTrail,
  currentPosition,
  time,
  distance,
  downhill,
  elevation,
  calculateAverageSpeed,
  resetTrail,
  positions,
  activityType,
}) => {
  return (
    <>
      {/* Bottone "Inizia Percorso" */}
      {!isActive && !isRecap && ( <StartTrailButton startTrail={startTrail} currentPosition={currentPosition} /> )}

      {/* Contenitore attivo del percorso */}
      {isActive && (
        <TrailInfoPanel time={time} distance={distance} downhill={downhill} elevation={elevation} calculateAverageSpeed={calculateAverageSpeed} endTrail={endTrail} />
      )}

      {/* Recap del percorso */}
      {isRecap && ( <TrailForm time={time} distance={distance} downhill={downhill} elevation={elevation} calculateAverageSpeed={calculateAverageSpeed} activityType={activityType} resetTrail={resetTrail}/> )}
      </>
  );
};

const styles = StyleSheet.create({
  trailComponent: {
    padding: 20,
  },
  startButton: {
    backgroundColor: '#007BFF',
    bottom: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeContainer: {
    backgroundColor: '#f1f1f1',
    padding: 20,
    borderRadius: 10,
  },
  timeDistanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoBox: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  elevationContainer: {
    marginBottom: 20,
  },
  endButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  recapContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  recapTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default TrailComponent;
