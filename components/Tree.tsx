import React, { useRef, useEffect, useState } from 'react';
import { View, Animated, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

const Tree = () => {
  const [isVisible, setIsVisible] = useState(true); // Stato per visibilità
  const [showBubble, setShowBubble] = useState(true); // Stato per il fumetto
  const animation = useRef(new Animated.Value(0)).current; // Valore animato
  const fadeAnim = useRef(new Animated.Value(1)).current; // Animazione di opacità
  const bubbleFadeAnim = useRef(new Animated.Value(1)).current; // Animazione di opacità per il fumetto

  // Effetto per far muovere sempre l'albero a destra/sinistra e ruotarlo
  useEffect(() => {
    
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: -1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start();
    
  }, []);

  // Funzione per far scomparire l'albero con una dissolvenza
  const hideTree = () => {
    Animated.timing(fadeAnim, {
      toValue: 0, // L'opacità diventa 0
      duration: 500, // Velocità della dissolvenza
      useNativeDriver: true,
    }).start(() => setIsVisible(false)); // Dopo l'animazione, nasconde il componente
  };

  // Effetto per mostrare e nascondere il fumetto ogni 15 secondi
  useEffect(() => {
    const showAndHideBubble = () => {
      setShowBubble(true);
      Animated.timing(bubbleFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      setTimeout(() => {
        Animated.timing(bubbleFadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setShowBubble(false));
      }, 5000);
    };

    showAndHideBubble();
    const interval = setInterval(showAndHideBubble, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {showBubble && (
        <Animated.View style={[styles.bubble, { opacity: bubbleFadeAnim }]}> 
          <Text style={styles.bubbleText}>{"Ciao, se hai bisogno\n di me cliccami"}</Text>
        </Animated.View>
      )}
      {isVisible && (
        <TouchableOpacity onPress={hideTree}>
          <Animated.View
            style={[
              styles.treeContainer,
              {
                opacity: fadeAnim, // Gestisce la dissolvenza
                transform: [
                  {
                    rotate: animation.interpolate({
                      inputRange: [-1, 0, 1], 
                      outputRange: ['-5deg', '-5deg', '5deg'], // Rotazione oscillante
                    }),
                  },
                  { translateY: -120 }, // Sposta più in alto
                ],
              },
            ]}
          >
            <Image source={require('../images/tree.png')} style={styles.image} />
          </Animated.View>
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
  },
  treeContainer: {
    alignItems: 'center',
    position: 'absolute',
    left: -10, // Posizionamento base (puoi regolarlo)
    top: -120, // Sposta più in alto
  },
  image: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  bubble: {
    position: 'absolute',
    top: -300, // Posiziona il fumetto sopra l'albero
    left: -10, // Posizionamento base (puoi regolarlo)
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
