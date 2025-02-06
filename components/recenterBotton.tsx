import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type RecenterButtonProps = {
  mapRef: React.MutableRefObject<any>;
  location: { latitude: number; longitude: number } | null;
  setRegion: (region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }) => void;
};

const RecenterButton: React.FC<RecenterButtonProps> = ({ mapRef, location, setRegion }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (isFollowing && location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      const interval = setInterval(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }, 500);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isFollowing, location, mapRef, setRegion]);

  const flyToLocation = () => {
    if (!location || !mapRef.current) return;

    const currentRegion = mapRef.current.__lastRegion || {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };

    const targetRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.004,
      longitudeDelta: 0.004,
    };

    // Esegui animazione solo se la posizione attuale è diversa da quella target
    const distanceLat = Math.abs(targetRegion.latitude - currentRegion.latitude);
    const distanceLon = Math.abs(targetRegion.longitude - currentRegion.longitude);

    if (distanceLat > 0.0005 || distanceLon > 0.0005) {
      mapRef.current.animateToRegion(targetRegion, 2000);
      setRegion(targetRegion);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.recenterButton, isFollowing && styles.activeButton]}
      onPress={() => {
        setIsFollowing((prev) => !prev);
        if (!isFollowing) {
          flyToLocation();
        }
      }}
    >
      <MaterialIcons name={isFollowing ? "gps-fixed" : "gps-not-fixed"} size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  recenterButton: {
    position: 'absolute',
    bottom: 180,
    backgroundColor: '#86af49',
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
  activeButton: {
    backgroundColor: '#32421b',
  },
});

export default RecenterButton;
