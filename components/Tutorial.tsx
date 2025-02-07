import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View, Dimensions } from 'react-native';

import * as TrailDAO from '@/dao/trailDAO'; 


interface TutorialProps {
  findNearestTrail: (position:{latitude: number; longitude: number}) => any;
  location: { latitude: number; longitude: number } | null;
  setRegion: (region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }) => void;
  setSelectedTrail: (trail: any) => void;
}

const Tutorial: React.FC<TutorialProps> = ({ setSelectedTrail, findNearestTrail, location, setRegion }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  const steps = [
    'Welcome to the Pathfinder map! \n From here you can orient yourself and start a new activity',
    'Tap this button to start a new activity',
    'This line indicates the path of the trail you are following',
    'Using this button you can return to the map of Pathfinder',
    'Using this button you can add a new trail to the map',
    'Here will be all your pernonal information',
    'This is the button to recenter the map on your position',
    'This is Treely! He will help you to find the best trail for you',
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
      const nearesttrail = findNearestTrail(location);
      const trail = await TrailDAO.getTrail(nearesttrail.id);

      if (nextStep === 1) {
        // Step 2: Chiama la funzione per trovare il trail più vicino
        console.log(nearesttrail);
        setRegion({
          latitude: nearesttrail.startpoint.latitude,
          longitude: nearesttrail.startpoint.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
      else if (nextStep === 2) {
        // Step 3: Chiama la funzione per selezionare il trail
        setSelectedTrail(trail);
      }
      else if (nextStep === 3){
        setSelectedTrail(null);
        setRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
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
    top: 300,
    left: 50,
  },
  step2: {
    bottom: 100,
    right: 20,
  },
  step3: {
    bottom: 100,
    left: 10,
  },
  step4: {
    bottom: 100,
    left: width / 2 - 150,
  },
  step5: {
    bottom: 100,
    right: 10,
  },
  step6: {
    bottom: 190,
    left: 10,
  },
  step7: {
    bottom: 190,
    right: 10,
  },
  step8: {
    top: height / 2 - 100,
    left: width / 2 - 150,
  },
});

export default Tutorial;
