import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View, Dimensions } from 'react-native';



const Tutorial = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  const steps = [
    'Welcome to Add Trail the Pathfinder map! \n From here you can orient yourself and record a new activity',
    'Tap this button to start recording a new activity',
    'This button indicates which activity you are recording',
    'This is the button to recenter the map on your position',
    'End of tutorial! You are now ready to go.',
  ];

  const openTutorial = () => {
    setIsClicked(true);
    setCurrentStep(0);
    setTimeout(() => setIsClicked(false), 500);
  };

  const handleNextStep = async () => {
    if (currentStep !== null && currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
    } else {
      
      setCurrentStep(null); // Chiude il modal
    }
  };

  const handlePreviousStep = () => {
    if (currentStep !== null && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      {/* Pulsante di avvio */}
      <TouchableOpacity
        style={[styles.button, isClicked && styles.clicked]}
        onPress={openTutorial}
      >
        <Text style={styles.text}>?</Text>
      </TouchableOpacity>

      {/* Modal per il tutorial */}
      {currentStep !== null && (
        <Modal transparent animationType="fade" visible={true}>
          <View style={styles.modalContainer}>
            {/* Tocca a sinistra per tornare indietro */}
            <TouchableOpacity
              style={[styles.halfScreen, styles.leftHalf]}
              onPress={handlePreviousStep}
            />
            {/* Contenuto del tutorial */}
            <View
              style={[
                styles.modalContent,
                styles[`step${currentStep}`] || styles.defaultStepStyle,
              ]}
            >
              <Text style={styles.modalText}>{steps[currentStep]}</Text>
            </View>
            {/* Tocca a destra per andare avanti */}
            <TouchableOpacity
              style={[styles.halfScreen, styles.rightHalf]}
              onPress={handleNextStep}
            />
          </View>
        </Modal>
      )}
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles: { [key: string]: any } = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: '#979797',
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
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  modalContent: {
    position: 'absolute',
    backgroundColor: '#FFF',
    width: 300,
    padding: 20,
    borderRadius: 10,
  },

  modalText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
  },
  halfScreen: {
    flex: 1,
  },
  leftHalf: {
    backgroundColor: 'transparent',
  },
  rightHalf: {
    backgroundColor: 'transparent',
  },
  step0: {
    top: height / 2 - 100,
    left: width / 2 - 150,
  },
  step1: {
    bottom: 170,
    left: 50,
  },
  step2: {
    bottom: 230,
    left: 50,
  },
 
  step3: {
    bottom: 290,
    left: 10,
  },
 
  step4: {
    top: height / 2 - 100,
    left: width / 2 - 150,
  },
});

export default Tutorial;
