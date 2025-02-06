import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Tree from './Tree'; // Importa il componente Tree
import RecenterButton from './recenterBotton'; // Importa il componente RecenterButton
import Tutorial from './Tutorial'; // Importa il componente Tutorial
import { Ionicons } from '@expo/vector-icons';
import TrailInfoIndex from './TrailInfoIndex';

interface BottomSheetProps {
  isPaused: boolean;
  trailData: any;
  trailActive: boolean;
  mapRef: React.MutableRefObject<any>;
  location: { latitude: number; longitude: number } | null;
  setRegion: React.Dispatch<React.SetStateAction<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null>>;
  endTrail: () => void;
  calculateAverageSpeed: () => number;
  pauseTrail: () => void;
  resumeTrail: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({isPaused, trailData , trailActive, mapRef, location, setRegion, endTrail, calculateAverageSpeed, pauseTrail, resumeTrail }) => {
  return (
  <>
    { trailActive && ( <TrailInfoIndex isPaused={isPaused} time={trailData.time} distance={trailData.distance} downhill={trailData.downhill} elevation={trailData.elevation} calculateAverageSpeed={calculateAverageSpeed} endTrail={endTrail} pauseTrail={pauseTrail} resumeTrail={resumeTrail} /> )}
    <View style={[styles.buttonGroup, { bottom: trailActive ? 170 : 20 }]}>
      {/* Tree a sinistra */}
      <View style={styles.leftButtonContainer}>
        {!trailActive &&  <Tree />}
      </View>
      
      {/* RecenterButton e Tutorial a destra */}
      <View style={styles.rightButtonContainer}>
        <RecenterButton mapRef={mapRef} location={location} setRegion={setRegion} />
        <Tutorial />
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  leftButtonContainer: {
    alignItems: 'flex-start',
  },
  rightButtonContainer: {
    alignItems: 'flex-end',
  },
   endTrailButton: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: 'red',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
});

export default BottomSheet;
