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

  const getCurrentRegion = () => {
    return mapRef.current?.__lastRegion || {
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  };

  const flyToLocation = () => {
    if (!location || !mapRef.current) return;

    const startRegion = getCurrentRegion();
    const endRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.005, // Zoom più vicino
      longitudeDelta: 0.005,
    };

    animateFlyTo(startRegion, endRegion, 2000);
  };

  const animateFlyTo = (startRegion: any, endRegion: any, duration: number) => {
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing per un movimento più naturale
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const interpolatedRegion = {
        latitude: startRegion.latitude + (endRegion.latitude - startRegion.latitude) * easeOutExpo,
        longitude: startRegion.longitude + (endRegion.longitude - startRegion.longitude) * easeOutExpo,
        latitudeDelta: startRegion.latitudeDelta + (endRegion.latitudeDelta - startRegion.latitudeDelta) * easeOutExpo,
        longitudeDelta: startRegion.longitudeDelta + (endRegion.longitudeDelta - startRegion.longitudeDelta) * easeOutExpo,
      };

      mapRef.current.animateToRegion(interpolatedRegion, 16);
      setRegion(interpolatedRegion);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <TouchableOpacity
      style={[styles.recenterButton, isClicked && styles.clicked]}
      onPress={() => {
        setIsClicked(true);
        flyToLocation();
        setTimeout(() => setIsClicked(false), 300);
      }}
    >
      <MaterialIcons name="gps-fixed" size={24} color="white" />
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
  clicked: {
    backgroundColor: '#00bcd4',
  },
});

export default RecenterButton;
