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


export default TrailComponent;
