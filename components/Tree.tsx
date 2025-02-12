import React, { useRef, useState } from 'react';
import { View, Animated, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';

interface TreeProps {
  setRegion: (region: any) => void;
  location: any;
  trail: any[];
  setRecomanded: (trail: any) => void;
}

const Tree: React.FC<TreeProps> = ({ setRegion, location, trail, setRecomanded }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showBubble, setShowBubble] = useState(true);
  const [isSecondAnimationPlaying, setIsSecondAnimationPlaying] = useState(false);
  const [recommendedTrail, setRecommendedTrail] = useState<any | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const bubbleFadeAnim = useRef(new Animated.Value(1)).current;

  const resetTree = () => {
    setIsVisible(true);
    setShowBubble(true);
    setRecommendedTrail(null);
    setIsSecondAnimationPlaying(false);
    setRecomanded([]);
   
  };

  const hideTree = () => {
    if (isSecondAnimationPlaying) {
      resetTree();
      return;
    }

    if (trail.length > 0 && location) {
      const closestTrails = getClosestTrails(location, trail);
      setRecommendedTrail(closestTrails);
      setRecomanded(closestTrails);

      if (closestTrails.length > 0) {
        const closestTrail = closestTrails[0];
        setRegion({
          latitude: closestTrail.startpoint.latitude,
          longitude: closestTrail.startpoint.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    }

    setIsSecondAnimationPlaying(true);
    if (recommendedTrail) {
      setTimeout(() => {
        setShowBubble(false);  // Hide bubble
        setIsSecondAnimationPlaying(false); // Stop second animation
        resetTree();
      }, 5000);
    }  

    
  };

  const getClosestTrails = (location: any, trails: any[]) => {
    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const distances = trails.map((trail) => ({
      trail,
      distance: haversineDistance(location.latitude, location.longitude, trail.startpoint.latitude, trail.startpoint.longitude),
    }));

    distances.sort((a, b) => a.distance - b.distance);
    return distances.slice(0, 3).map((item) => item.trail);
  };

  return (
    <View style={styles.container}>
      {showBubble && (
        <Animated.View style={[styles.bubble, { opacity: bubbleFadeAnim }]}>
          <Text style={styles.bubbleText}>
            {isSecondAnimationPlaying
              ? "I recommend these trails. \n Click on me to return back!"
              : "Hello! Click on me to find a \ntrail for you!"}
          </Text>
        </Animated.View>
      )}

      {/* Animation using GIF */}
      <TouchableOpacity onPress={hideTree}>
        <Animated.View style={[styles.treeContainer, { opacity: fadeAnim }]}>
          <Image
            source={require('./animazioni/giphy.gif')}
            style={styles.animation}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  treeContainer: {
    position: 'absolute',
    left: -10,
    bottom: 40,
    shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra
    
  },
  animation: {
    width: 170,
    height: 200,
    shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra
  },
  bubble: {
    position: 'absolute',
    bottom: 250,
    left: 0,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: 'bold',
    shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra
  },
});

export default Tree;
