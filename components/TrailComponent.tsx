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
  setTrailData: (trail: any) => void;
  city: string;
  region: string;
  state: string;
  province: string;
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
  setTrailData,
  city,
  region,
  state,
  province,
  calculateAverageSpeed,
  resetTrail,
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
      {isRecap && ( <TrailForm  time={time} distance={distance} downhill={downhill} elevation={elevation} setTrailData={setTrailData} activityType={activityType} city={city} region ={region} state={state} province={province} resetTrail={resetTrail}/> )}
      </>
  );
};


export default TrailComponent;
