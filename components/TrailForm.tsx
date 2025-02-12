import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as TrailDAO from '@/dao/trailDAO';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
interface TrailFormProps {
  trailData: any;
  resetTrail: () => void;
}

const TrailForm: React.FC<TrailFormProps> = ({ trailData, resetTrail }) => {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [step, setStep] = useState(1); // Gestione dello step corrente
  
  const handleCancellation = () => {  
    Alert.alert('Are you sure?', 'Do you want to cancel the trail?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: resetTrail },
    ]);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Trail name is require.');
      return;
    }

    const trail = {
      name,
      downhill: trailData.downhill,
      difficulty,
      length: trailData.distance.toFixed(2),
      duration: trailData.time,
      elevation: trailData.elevation.toFixed(2),
      startpoint: [trailData.positions[0].latitude, trailData.positions[0].longitude],
      trail: trailData.positions.map((position: any) => [position.latitude, position.longitude]),
      endpoint: [trailData.positions[trailData.positions.length - 1].latitude, trailData.positions[trailData.positions.length - 1].longitude],
      description,
      image: null,
      city: trailData.city,
      region: trailData.region,
      state: trailData.state,
      province: trailData.province,
      activity: trailData.activityType.toLowerCase(),
    };

    await TrailDAO.createTrail(trail);
    Alert.alert('Success', `Trail "${name}" saved successfully! \n (Image will be uploaded soon...)`);
    resetTrail();
  };

  const handleFileInputClick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission denied', 'You need permission to access photos.');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImages((prevImages) => [...prevImages, pickerResult.assets[0].uri]);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
      return (
        <View>
          {/* Nome Trail */}
          <View style={styles.inputContainer}>
          
            <View style={[{ flexDirection: 'row' }]}>
              <Icon name="map-outline" size={20} color="white" />
              <Text style={styles.label}>Trail Name:</Text>
            </View>
            <TextInput
              style={[styles.input, { width: '100%'}]}
              value={name}
              onChangeText={setName}
              placeholder="Insert Trail Name..."
              placeholderTextColor="rgba(255, 255, 255,0.5)"
            />
          </View>

          {/* Difficoltà */}
          <View style={[{ flexDirection: 'row' }]}>

          <Icon name="speedometer" size={20} color="white" />

          <Text style={styles.label}>Difficulty:</Text>
          </View>
          <View style={styles.difficultyContainer}>
            <TouchableOpacity
              style={[styles.difficultyButton, difficulty === 'Beginner' && { backgroundColor: '#4986af' }]}
              onPress={() => setDifficulty('Beginner')}
            >
              <Text style={styles.buttonText}>Beginner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.difficultyButton, difficulty === 'Intermediate' && { backgroundColor: '#af8649' }]}
              onPress={() => setDifficulty('Intermediate')}
            >
              <Text style={styles.buttonText}>Intermediate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.difficultyButton, difficulty === 'Advanced' && { backgroundColor: '#af4953' }]}
              onPress={() => setDifficulty('Advanced')}
            >
              <Text style={styles.buttonText}>Advanced</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
      case 2:
        return (
          <View>
            {/* Descrizione */}
            <View style={styles.inputContainer}>
            <View style={[{ flexDirection: 'row' }]}>
              <Icon name="text-box-outline" size={20} color="white" />
              <Text style={styles.label}>Description:</Text>
              </View>
            </View>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top'}]}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Insert a description..."
              placeholderTextColor="rgba(255, 255, 255,0.5)"
            />
          </View>
        );
      case 3:
        return (
          <View>   
            <View style={[ { flexDirection: 'row' , justifyContent: 'space-between', alignItems: 'center' }]}>
                   
            <View style={[styles.inputContainer, { flexDirection: 'row', marginTop: 10  }]}>
              <Icon name="camera-outline" size={20} color="white" />
              <Text style={styles.label}>Photo:</Text>
              
            </View>
            <TouchableOpacity onPress={handleFileInputClick} style={[styles.uploadButton, { backgroundColor: '#86af49' , width: '60%', justifyContent: 'center', alignItems: 'center',marginTop: 10 }]}>
                <Icon name="plus-circle-outline" size={18} color="white" />
                <Text style={[styles.uploadButtonText]}>Insert Photo</Text>
              </TouchableOpacity>
              </View> 
            <ScrollView horizontal style={styles.imagePreviewContainer}>
              {images.map((image: string, index: number) => (
                <Image key={index} source={{ uri: image }} style={styles.imagePreview} />
              ))}
            </ScrollView>
          </View>
        );
      case 4:
        return (
          <View style={styles.recapContainer}> 
            {/* Nome del trail */}
            <View style={styles.recapSection}>
              <Icon name="map-outline" size={20} color="white" />
              <Text style={styles.recapLabel}>Trail Name:</Text>
              <Text style={styles.recapValue}>{name || "N/A"}</Text>
            </View>
            {/* Difficoltà */}
            <View style={styles.recapSection}>
              <Icon name="speedometer" size={20} color="white" />
              <Text style={styles.recapLabel}>Difficulty:</Text>
              <View style={[styles.difficultyButton, { backgroundColor: difficulty === 'Beginner' ? '#4986af' : difficulty === 'Intermediate' ? '#af8649' : '#af4953' }]}>
                <Text style={styles.recapValue}>{difficulty}</Text>
              </View>
            </View>
            {/* Posizione */}
            <View style={styles.recapSection}>
              <Icon name="map-marker-outline" size={20} color="white" />
              <Text style={styles.recapLabel}>Location:</Text>
              <Text style={styles.recapValue}>
                {`${trailData.city}, ${trailData.state}, ${trailData.region}`}
              </Text>
            </View>
            {/* Attività */}
            <View style={styles.recapSection}>
              <Icon name={trailData.activityType.toLowerCase()} size={20} color="white" />
              <Text style={styles.recapLabel}>Activity:</Text>
              <Text style={styles.recapValue}>{trailData.activityType}</Text>
            </View>
            {/* Tempo e Distanza */}
            <View style={styles.recapStatsRow}>
              <View style={styles.recapStatBox}>
                <Icon name="timer-outline" size={20} color="white" />
                <Text style={styles.statLabel}>Time</Text>
                <Text style={styles.statValue}>{formatTime(trailData.time)} h</Text>
              </View>
              <View style={styles.recapStatBox}>
                <Icon name="map-marker-distance" size={20} color="white" />
                <Text style={styles.statLabel}>Distance</Text>
                <Text style={styles.statValue}>{trailData.distance.toFixed(2)} km</Text>
              </View>
            </View>
            {/* Dislivello */}
            <View style={styles.recapStatsRow}>
              <View style={styles.recapStatBox}>
                <Icon name="arrow-down-bold-outline" size={20} color="white" />
                <Text style={styles.statLabel}>Downhill</Text>
                <Text style={styles.statValue}>{trailData.downhill.toFixed(2)} m</Text>
              </View>
              <View style={styles.recapStatBox}>
                <Icon name="arrow-up-bold-outline" size={20} color="white" />
                <Text style={styles.statLabel}>Elevation</Text>
                <Text style={styles.statValue}>{trailData.elevation.toFixed(2)} m</Text>
              </View>
            </View>
            {/* Foto */}
            {images.length > 0 && (
              <View style={styles.recapImages}>
                <Icon name="camera-outline" size={20} color="white" />
                <Text style={styles.recapLabel}>Photos:</Text>
                <ScrollView horizontal>
                  {images.map((image: string, index: number) => (
                    <Image key={index} source={{ uri: image }} style={styles.imagePreview} />
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Step 1: Basic Info";
      case 2:
        return "Step 2: Trail Details";
      case 3:
        return "Step 3: Photos";
      case 4:
        return "Step 4: Recap";
      default:
        return "Step";
    }
  };

  
  return (
    <Modal animationType="fade" transparent={true} onRequestClose={resetTrail}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.headerContainer}>
              <Text style={[styles.label, { color: 'white',fontSize: 28 }]}>{getStepTitle(step)}</Text>
              <TouchableOpacity onPress={handleCancellation} style={styles.closeButton}>
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            <ScrollView style={{ width: '100%' }}>
              {renderStepContent()}
            </ScrollView>
            <View style={styles.separator} />
            <View style={styles.navigationButtonsContainer}>
              {step > 1 && (
                <TouchableOpacity onPress={() => setStep(step - 1)} style={[styles.arrowButton, { justifyContent: "flex-start", left: 10 }]}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              )}
              {step <= 1 && (
                <View style={[styles.arrowButton, {shadowColor: '#000',  // Colore dell'ombra (nero)
                  shadowOffset: { width: 0, height: 0 },  // Offset dell'ombra
                  shadowOpacity: 0,  // Opacità dell'ombra
                  shadowRadius: 0,  // Raggio dell'ombra
                   backgroundColor: "#979797" }]} />
              )}
              {step < 4 ? (
                <TouchableOpacity onPress={() => setStep(step + 1)} style={[styles.arrowButton, { justifyContent: "flex-end", right: 10 }]}>
                  <Ionicons name="arrow-forward" size={24} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleSubmit} style={[styles.uploadButton, { right: 10, width: '30%' }]}>
                  <Text style={styles.uploadButtonText}>Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
  
};

const styles = StyleSheet.create({
  // Containers and Layouts
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#979797',
    borderRadius: 30,
    padding: 20,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 5,
    opacity: 0.2,
  },
  recapContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  recapStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  recapStatBox: {
    backgroundColor: 'rgb(141, 141, 141)',
    borderRadius: 8,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  recapSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recapImages: {
    marginTop: 10,
    flexDirection: 'row',
  },
  inputContainer: {
    marginBottom: 10,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra
  },
  imagePreviewContainer: {
    marginTop: 10,
  },

  // Buttons
  arrowButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#86af49',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra
  },
  closeButton: {
    backgroundColor:"#dc3545" ,
    padding: 5,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra
  },
  difficultyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    width: '30%',
    justifyContent: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#86af49',
    shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra
  },

  // Labels and Text
  label: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    
  },
  label2: {
    fontWeight: 'normal',
    marginBottom: 5,
    color: 'white',
  },
  recapTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  recapLabel: {
    fontWeight: 'bold',
    color: 'white',
    width: 120,
    marginLeft: 5,
  },
  recapValue: {
    color: 'white',
  },
  statLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  statValue: {
    color: 'white',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recapText: {
    color: 'white',
    fontSize: 16,
    marginVertical: 5,
  },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    padding: 10,
    color: 'white',
    marginTop: 5,
  },

  // Colors for Difficulty Levels
  beginner: { color: '#4986af' },
  intermediate: { color: '#af8649' },
  advanced: { color: '#af4953' },

  // Image Styles
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default TrailForm;
