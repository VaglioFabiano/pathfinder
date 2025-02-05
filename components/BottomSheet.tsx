import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Tree from './Tree'; // Importa il componente Tree
import RecenterButton from './recenterBotton'; // Importa il componente RecenterButton
import Tutorial from './Tutorial'; // Importa il componente Tutorial
import { Ionicons } from '@expo/vector-icons';

interface BottomSheetProps {
  trailActive: boolean;
  mapRef: React.MutableRefObject<any>;
  location: { latitude: number; longitude: number } | null;
  setRegion: React.Dispatch<React.SetStateAction<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null>>;
  endTrail: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({trailActive, mapRef, location, setRegion, endTrail }) => {
  return (
    <View style={styles.buttonGroup}>
      {/* Tree a sinistra */}
      <View style={styles.leftButtonContainer}>
        {trailActive ? (
        <TouchableOpacity style={styles.endTrailButton} onPress={endTrail}>
          <Ionicons name="stop" size={24} color="white" />
        </TouchableOpacity>)
      :<Tree />}
      </View>

      {/* RecenterButton e Tutorial a destra */}
      <View style={styles.rightButtonContainer}>
      
        <RecenterButton mapRef={mapRef} location={location} setRegion={setRegion} />
        <Tutorial />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    position: 'absolute',
    bottom: 20,
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
  },
});

export default BottomSheet;
