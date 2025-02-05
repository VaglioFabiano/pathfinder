import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import TrailForm from '@/components/TrailForm'; // Assumendo che TrailForm sia stato convertito in una versione compatibile con React Native
import StartTrailButton from '@/components/StartTrailButton';
import TrailInfoPanel from './TrailInfoPannel';
interface TrailComponentProps {
  startTrail: (position: { latitude: number; longitude: number }, selectedActivity: any) => Promise<void>;
  endTrail: () => void;
  currentPosition: any;
  isRecap: boolean;
  trailData: any;
  calculateAverageSpeed: () => number;
  resetTrail: () => void;
 
}

const TrailComponent: React.FC<TrailComponentProps> = ({
  startTrail,
  endTrail,
  currentPosition,
  trailData,
  isRecap,
  calculateAverageSpeed,
  resetTrail,
 
}) => {
  return (
    <>
      {/* Bottone "Inizia Percorso" */}
      {!trailData.isActive && !isRecap && ( <StartTrailButton startTrail={startTrail} currentPosition={currentPosition} /> )}

      {/* Contenitore attivo del percorso */}
      {trailData.isActive && (
        <TrailInfoPanel time={trailData.time} distance={trailData.distance} downhill={trailData.downhill} elevation={trailData.elevation} calculateAverageSpeed={calculateAverageSpeed} endTrail={endTrail} />
      )}

      {/* Recap del percorso */}
      {isRecap && ( <TrailForm trailData = {trailData} resetTrail={resetTrail}/> )}
      </>
  );
};


export default TrailComponent;
