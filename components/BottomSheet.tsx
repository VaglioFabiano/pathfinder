import React from 'react';
import { View, StyleSheet } from 'react-native';
import Tree from './Tree'; // Importa il componente Tree
import RecenterButton from './recenterBotton'; // Importa il componente RecenterButton
import Tutorial from './Tutorial'; // Importa il componente Tutorial

interface BottomSheetProps {
  mapRef: React.MutableRefObject<any>;
  location: { latitude: number; longitude: number } | null;
  setRegion: React.Dispatch<React.SetStateAction<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null>>;
}

const BottomSheet: React.FC<BottomSheetProps> = ({mapRef, location, setRegion }) => {
  return (
    <View style={styles.buttonGroup}>
      {/* Tree a sinistra */}
      <View style={styles.leftButtonContainer}>
        <Tree />
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
});

export default BottomSheet;
