import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import TrailForm from '@/components/TrailForm'; // Assumendo che TrailForm sia stato convertito in una versione compatibile con React Native
import StartTrailButton from '@/components/StartTrailButton';
import TrailInfoPanel from './TrailInfoPannel';
interface TrailComponentProps {
  isPaused: boolean;
  startTrail: (position: { latitude: number; longitude: number }, selectedActivity: any) => Promise<void>;
  endTrail: () => void;
  currentPosition: any;
  isRecap: boolean;
  trailData: any;
  calculateAverageSpeed: () => number;
  resetTrail: () => void;
  pauseTrail: () => void;
  resumeTrail: () => void;
 
}

const TrailComponent: React.FC<TrailComponentProps> = ({isPaused, pauseTrail, resumeTrail, startTrail, endTrail, currentPosition, trailData, isRecap, calculateAverageSpeed, resetTrail,}) => {
  return (
    <>
      {!trailData.isActive && !isRecap && ( <StartTrailButton startTrail={startTrail} currentPosition={currentPosition} /> )}

      {trailData.isActive && (
        <TrailInfoPanel isPaused={isPaused} pauseTrail={pauseTrail} resumeTrail={resumeTrail} time={trailData.time} distance={trailData.distance} downhill={trailData.downhill} elevation={trailData.elevation} calculateAverageSpeed={calculateAverageSpeed} endTrail={endTrail} />
      )}

      {isRecap && ( <TrailForm trailData = {trailData} resetTrail={resetTrail}/> )}
      </>
  );
};


export default TrailComponent;
