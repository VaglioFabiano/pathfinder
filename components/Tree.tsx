import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const Tree = () => {
  const [isClicked, setIsClicked] = useState(false);

  const tree = () => {
    setIsClicked((prev) => !prev);
  };

  return (
    <View >
      <TouchableOpacity
        style={[styles.button, isClicked && styles.clicked]}
        onPress={tree}
      >
        <Text style={styles.text}>🌳</Text>
      </TouchableOpacity>

      {/* Posiziona l'animazione al bordo del pulsante */}
      {isClicked && <TalkingCharacter />}
    </View>
  );
};

const TalkingCharacter = () => {
  return (
    <LottieView
      source={require('./animazioni/Animation - 1738269635940.json')} 
      autoPlay
      loop
      style={styles.animationContainer}
    />
  );
};


const styles = StyleSheet.create({

  animationContainer: {
    bottom: 500, // Distanza dal fondo
    backgroundColor: "transparent", 
    width: 250, 
    height: 250,
    elevation: 5,
    zIndex: 10,
  },
  button: {
    position: 'absolute',
    bottom: 100, // Posiziona il pulsante in basso
    backgroundColor: '#4caf50', // Colore del pulsante
    borderRadius: 50, // Forma arrotondata
    width: 60, // Larghezza del pulsante
    height: 60, // Altezza del pulsante
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  clicked: {
    backgroundColor: '#348637', // Colore quando il pulsante viene cliccato
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24, // Testo più grande
  },
});

export default Tree;
