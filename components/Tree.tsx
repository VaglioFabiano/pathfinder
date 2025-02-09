import React, { useRef, useEffect, useState } from 'react';
import { View, Animated, StyleSheet, TouchableOpacity, Text } from 'react-native';
import LottieView from 'lottie-react-native';

interface TreeProps {
  setRegion: (region: any) => void;
  location: any;
  trail: any[];
  setRecomanded: (trail: any) => void;
}

const Tree: React.FC<TreeProps> = ({ setRegion, location, trail, setRecomanded }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showBubble, setShowBubble] = useState(true);
  const [isFirstAnimationCompleted, setIsFirstAnimationCompleted] = useState(false);
  const [isSecondAnimationPlaying, setIsSecondAnimationPlaying] = useState(false);
  const [recommendedTrail, setRecommendedTrail] = useState<any | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const bubbleFadeAnim = useRef(new Animated.Value(1)).current;

  const resetTree = () => {
    setIsVisible(true);
    setShowBubble(true);
    setRecommendedTrail(null);
    setIsFirstAnimationCompleted(false);
    setIsSecondAnimationPlaying(false);
    setRecomanded([]);
    setRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  };

  const hideTree = () => {
    if (isSecondAnimationPlaying) {
      resetTree();
      return;
    }

    // Calcola i 3 trail più vicini solo al clic sulla prima animazione
    if (trail.length > 0 && location) {
      const closestTrails = getClosestTrails(location, trail);
      console.log('Closest trails after click:', closestTrails);
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

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));

    setIsSecondAnimationPlaying(true);
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
              ? "I recommend these trails. Click here to return to the initial situation!"
              : "Hello! Click on me to find a \ntrail for you!"}
          </Text>
        </Animated.View>
      )}

      {/* First Animation (Tree) */}
      {isVisible && !isSecondAnimationPlaying && (
        <TouchableOpacity onPress={hideTree}>
          <Animated.View style={[styles.treeContainer, { opacity: fadeAnim }]}>
            <LottieView
              source={require('./animazioni/Animation - 1738939847982.json')}
              autoPlay
              loop={false}
              style={styles.animation}
              onAnimationFinish={() => setIsFirstAnimationCompleted(true)}
            />
          </Animated.View>
        </TouchableOpacity>
      )}

      {/* Second Animation */}
      {isSecondAnimationPlaying && (
        <TouchableOpacity onPress={hideTree}>
          <LottieView
            source={require('./animazioni/Animation - 1738939888724.json')}
            loop={true}
            style={styles.animation}
          />
        </TouchableOpacity>
      )}
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
    left: -20,
    bottom: 45,
  },
  animation: {
    width: 200,
    height: 200,
  },
  bubble: {
    position: 'absolute',
    bottom: 200,
    left: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Tree;
