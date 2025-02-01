import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type RecenterButtonProps = {
  mapRef: React.MutableRefObject<any>;
  location: { latitude: number; longitude: number } | null;
  setRegion: (region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }) => void;
};

const RecenterButton: React.FC<RecenterButtonProps> = ({ mapRef, location, setRegion }) => {
  const [isClicked, setIsClicked] = useState(false);

  const recenterMap = () => {
    if (location) {
      mapRef.current.animateToRegion(
            {
               latitude: location.latitude,
                longitude: location.longitude, 
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }, 1000);
  
        
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <TouchableOpacity
      style={[styles.recenterButton, isClicked && styles.clicked]}
      onPress={recenterMap}
    >
      <MaterialIcons name="gps-fixed" size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  recenterButton: {
    position: 'absolute',
    bottom: 180,
    backgroundColor: '#34495e',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  clicked: {
    backgroundColor: '#00bcd4',
  },
});

export default RecenterButton;
