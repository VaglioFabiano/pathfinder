import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Tutorial = () => {
  const [isClicked, setIsClicked] = useState(false);
  const tutorial = () => {
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <TouchableOpacity style={[styles.button, isClicked && styles.clicked]} onPress={() => tutorial()}>
      <Text style={styles.text}>?</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: '#838990',
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
    backgroundColor: '#d2dae2',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});

export default Tutorial;