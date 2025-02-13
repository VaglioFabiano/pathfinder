import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View, Dimensions } from 'react-native';

import * as TrailDAO from '@/dao/trailDAO'; 
import { Entypo } from '@expo/vector-icons';


interface TutorialProps {
  findNearestTrail: (position:{latitude: number; longitude: number}) => any;
  location: { latitude: number; longitude: number } | null;
  setRegion: (region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }) => void;
  region: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
  setSelectedTrail: (trail: any) => void;
}

const Tutorial: React.FC<TutorialProps> = ({ setSelectedTrail, findNearestTrail, location,region, setRegion }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [arrowPosition, setArrowPosition] = useState<{ top: number; left: number } | null>(null);

  const steps = [
    '🌍 Welcome to the Pathfinder map! \n Here, you can explore trails, find your way, and start a new adventure.',
    '▶️ Tap this button to start a new activity. From here, you can begin a hike and track your journey.',
    '📍 This line represents the trail path you are following. It will guide you from start to finish!',
    '🗺️ Use this button to return to the Pathfinder map. If you ever get lost in the menus, you can always come back here.',
    '➕ With this button, you can add a new trail to the map. Share your favorite routes with everyone!',
    '👤 Here, you’ll find all your personal information: activities, progress, and preferences all in one place.',
    '🎯 This is the button to recenter the map on your location. Tap it once to lock onto your position and follow your movements. Tap it again to unlock and move freely around the map.',
    '🌳 This is Treely! Your friendly guide who will help you find the best trail for you!',
    '🎉 End of the tutorial! You are now ready to explore the trails with Pathfinder!',
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
      setArrowPosition(null);

      if (nextStep === 1) {
        // Step 2: Chiama la funzione per trovare il trail più vicino
        if (nearesttrail.startpoint) {
          setArrowPosition({
            top: height/2 - 50 , // Modifica in base alla posizione dello startpoint
            left:  width/2 - 25, // Modifica in base alla posizione dello startpoint
          });
        }
        setRegion({
          latitude: nearesttrail.startpoint.latitude,
          longitude: nearesttrail.startpoint.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
      else if (nextStep === 2) {
        // Step 3: Chiama la funzione per selezionare il trail
        setArrowPosition({
          top: height/2  , // Modifica in base alla posizione dello startpoint
          left:  width/2 - 25, // Modifica in base alla posizione dello startpoint
        });
        setSelectedTrail(trail);
      }
      else if (nextStep === 3){
        setSelectedTrail(null);
        setArrowPosition({
          top: height - 130 , // Modifica in base alla posizione dello startpoint
          left:  40, // Modifica in base alla posizione dello startpoint
        });
        setRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
      else if (nextStep === 4){
        setArrowPosition({
          top: height - 130 , // Modifica in base alla posizione dello startpoint
          left:  width/2 - 30, // Modifica in base alla posizione dello startpoint
        });
      }
      else if (nextStep === 5){
        setArrowPosition({
          top: height - 130 , // Modifica in base alla posizione dello startpoint
          left:  width - 95, // Modifica in base alla posizione dello startpoint
        });
      }

      else if (nextStep === 6){
        setArrowPosition({
          top: height - 290 , // Modifica in base alla posizione dello startpoint
          left:  width - 75, // Modifica in base alla posizione dello startpoint
        });
      }

      else if (nextStep === 7){
        setArrowPosition({
          top: height - 250 , // Modifica in base alla posizione dello startpoint
          left:  60, // Modifica in base alla posizione dello startpoint
        });
      }
      else if (nextStep === 8){
        setSelectedTrail(null);
        setArrowPosition(null);
        setRegion(region);
      }

    } else {
      
      setCurrentStep(null); // Chiude il modal
    }
  };

  const handlePreviousStep = async () => {
    if (currentStep !== null && currentStep < steps.length - 1) {
      const nextStep = currentStep - 1;
      setCurrentStep(nextStep);
      setArrowPosition(null);

      const nearesttrail = findNearestTrail(location);
      const trail = await TrailDAO.getTrail(nearesttrail.id);

      if (nextStep === 1) {
        // Step 2: Chiama la funzione per trovare il trail più vicino
        if (nearesttrail.startpoint) {
          setArrowPosition({
            top: height/2 - 50 , // Modifica in base alla posizione dello startpoint
            left:  width/2 - 25, // Modifica in base alla posizione dello startpoint
          });
        }
        setRegion({
          latitude: nearesttrail.startpoint.latitude,
          longitude: nearesttrail.startpoint.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
      else if (nextStep === 2) {
        // Step 3: Chiama la funzione per selezionare il trail
        setArrowPosition({
          top: height/2  , // Modifica in base alla posizione dello startpoint
          left:  width/2 - 25, // Modifica in base alla posizione dello startpoint
        });
        setSelectedTrail(trail);
      }
      else if (nextStep === 3){
        setSelectedTrail(null);
        setArrowPosition({
          top: height - 130 , // Modifica in base alla posizione dello startpoint
          left:  40, // Modifica in base alla posizione dello startpoint
        });
        setRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
      else if (nextStep === 4){
        setArrowPosition({
          top: height - 130 , // Modifica in base alla posizione dello startpoint
          left:  width/2 - 30, // Modifica in base alla posizione dello startpoint
        });
      }
      else if (nextStep === 5){
        setArrowPosition({
          top: height - 130 , // Modifica in base alla posizione dello startpoint
          left:  width - 95, // Modifica in base alla posizione dello startpoint
        });
      }

      else if (nextStep === 6){
        setArrowPosition({
          top: height - 290 , // Modifica in base alla posizione dello startpoint
          left:  width - 75, // Modifica in base alla posizione dello startpoint
        });
      }

      else if (nextStep === 7){
        setArrowPosition({
          top: height - 250 , // Modifica in base alla posizione dello startpoint
          left:  60, // Modifica in base alla posizione dello startpoint
        });
      }
      else if (nextStep === 8){
        setSelectedTrail(null);
        setArrowPosition(null);
        setRegion(region);
      }

    } else {
      
      setCurrentStep(null); // Chiude il modal
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
              {/* Contenitore per frecce e testo */}
              <View style={styles.tutorialRow}>
                {/* Freccia sinistra */}
                <TouchableOpacity onPress={handlePreviousStep} disabled={currentStep === 0}>
                  <View style={[styles.triangleLeft, currentStep === 0 && styles.disabledArrow]} />
                </TouchableOpacity>

                {/* Testo del tutorial */}
                <Text style={styles.modalText}>{steps[currentStep]}</Text>

                {/* Freccia destra */}
                <TouchableOpacity onPress={handleNextStep} disabled={currentStep === steps.length - 1}>
                  <View style={[styles.triangleRight, currentStep === steps.length - 1 && styles.disabledArrow]} />
                </TouchableOpacity>
              </View>
            </View>
            {arrowPosition && (
              <Entypo
                style={{
                  position: 'absolute',
                  top: arrowPosition.top,
                  left: arrowPosition.left,
                  color: 'white',
                  fontSize: 50,
                }}
                name='arrow-bold-down'
              />
            )}

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
    backgroundColor: '#979797',
    width: 320,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center', // Centra tutto
    justifyContent: 'center',
  },
  tutorialRow: {
    flexDirection: 'row', // Disposizione orizzontale
    alignItems: 'center', // Centra verticalmente
    justifyContent: 'space-between', // Spazio tra frecce e testo
  },
  modalText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    flex: 1, // Permette al testo di adattarsi dinamicamente
    marginHorizontal: 10, // Spazio tra testo e frecce
  },
  triangleLeft: {
    width: 0,
    height: 0,
    borderLeftWidth: 0,
    borderRightWidth: 15,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderStyle: 'solid',
    borderRightColor: '#86af49',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra
  },
  triangleRight: {
    width: 0,
    height: 0,
    borderRightWidth: 0,
    borderLeftWidth: 15,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderStyle: 'solid',
    borderLeftColor: '#86af49',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra
  },
  disabledArrow: {
    borderRightColor: '#979797',
    borderLeftColor: '#979797',
    shadowOpacity: 0,  // Opacità dell'ombra
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
    left: width / 2 - 160,
  },
  step1: {
    top: 270,
    left: 50,
  },
  step2: {
    top: 300,
    left: 50,
  },
  step3: {
    bottom: 140,
    left: 10,
  },
  step4: {
    bottom: 140,
    left: width / 2 - 150,
  },
  step5: {
    bottom: 140,
    right: 10,
  },
  step6: {
    bottom: 190,
    left: 10,
  },
  step7: {
    bottom: 300,
    right: 10,
  },
  step8: {
    top: height / 2 - 100,
    left: width / 2 - 160,
  },
});

export default Tutorial;
