import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as TrailDAO from '@/dao/trailDAO';


interface TrailFormProps {
    trailData: any;
    resetTrail: () => void;
}
interface Trail {
  name: string;
  downhill: number;
  difficulty: string;
  length: number;
  duration: number;
  elevation : number;
  
  startpoint: [number, number];
  trail: [[number, number]];
  endpoint: [number, number];

  description: string;
  image: string;

  city: string;
  region: string;
  state: string;
  province: string;

  activity: string;

}
const TrailForm: React.FC<TrailFormProps> = ({trailData, resetTrail }) => {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  
  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Errore', 'Il nome del Trail è obbligatorio.');
      return;
    }
    // Puoi aggiungere qui la logica per salvare il trail
    
    const trail: Trail = {
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
      image: images[0] || '',
      city: trailData.city,
      region: trailData.region,
      state: trailData.state,
      province: trailData.province,
      activity: trailData.activityType,
    };

    await TrailDAO.createTrail(trail);

    Alert.alert('Successo', `Trail "${name}" salvato con successo!`);
    resetTrail();
  };

  const handleFileInputClick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permesso negato', 'È necessario il permesso per accedere alle foto.');
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
    const hours = Math.floor(timeInSeconds / 3600); // Ottieni le ore
    const minutes = Math.floor((timeInSeconds % 3600) / 60); // Ottieni i minuti rimanenti
    const seconds = timeInSeconds % 60; // Ottieni i secondi rimanenti
  
    // Restituisce la stringa formattata come "hh:mm:ss"
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal animationType="fade" transparent={true} onRequestClose={resetTrail} >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.formContainer}>
            <Text style={[styles.label, {fontSize:28}]}>Activity:<Text style={styles.label2}> {trailData.activityType} </Text></Text>

              {/* Campo Nome del Trail */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Trail Name:</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Insert Trail Name..."
                  placeholderTextColor="#fff"  
                  
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Difficulty:</Text>
                <View style={styles.difficultyContainer}>
                  <TouchableOpacity
                    style={[styles.difficultyButton, difficulty === 'Beginner' && { backgroundColor: '#28a745' }]}
                    onPress={() => setDifficulty('Beginner')}
                  >
                    <Text style={styles.buttonText}>Beginner</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.difficultyButton, difficulty === 'Intermediate' && { backgroundColor: '#ffc107' }]}
                    onPress={() => setDifficulty('Intermediate')}
                  >
                    <Text style={styles.buttonText}>Intermediate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.difficultyButton, difficulty === 'Advanced' && { backgroundColor: '#dc3545' }]}
                    onPress={() => setDifficulty('Advanced')}
                  >
                    <Text style={styles.buttonText}>Advanced</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Campo Descrizione */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description:</Text>
                <TextInput
                  style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  placeholder="Insert a description..."
                  placeholderTextColor="#fff"  
                />
              </View>
              {/* Visualizzazione della posizione del trail */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Location:</Text>
                <Text style={styles.label2}>{trailData.city}, {trailData.province}, {trailData.state}, {trailData.region}</Text>
              </View>
              {/* Visualizzazione dei dati del trail */}
              <View style={styles.inputContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.label}>Time: 
                  <Text style={styles.label2}> {formatTime(trailData.time)} h</Text>
                   </Text>
                  <Text style={styles.label}>Distance:<Text style={styles.label2}> {trailData.distance.toFixed(2)} km</Text></Text>
                </View> 
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.label}>Discesa:
                    <Text style={styles.label2}> {trailData.downhill.toFixed(2)} m</Text> 
                    </Text>
                  <Text style={styles.label}>Elevazione: <Text style={styles.label2}>{trailData.elevation.toFixed(2)} m</Text></Text>
                </View>
              </View>

              {/* Caricamento delle foto */}
              <View style={styles.inputContainer}>
                 <View style={{ flexDirection: 'row'}}>
                 <Text style={styles.label}>Photo:</Text>
                <TouchableOpacity onPress={handleFileInputClick} style={[styles.uploadButton, {backgroundColor: 'gray', marginLeft: 10, padding:3, justifyContent:"center"}]} >
                  <Text style={[styles.uploadButtonText,{textDecorationLine:"underline"}]}>Insert Photo</Text>
                </TouchableOpacity>
                </View>
                <ScrollView horizontal style={styles.imagePreviewContainer}>
                  {images.map((image, index) => (
                    <Image key={index} source={{ uri: image }} style={styles.imagePreview} />
                  ))}
                </ScrollView>
              </View>

              {/* Bottone Salva */}
              <TouchableOpacity onPress={handleSubmit} style={styles.uploadButton}>
                  <Text style={styles.uploadButtonText}>Salva Trail</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Sfondo semi-trasparente per l'effetto overlay
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  formContainer: {
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    color: 'white',
  },
  label2: {
    fontWeight: "normal",
    marginBottom: 5,
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    color: 'white',
    padding: 10,
    borderRadius: 5,
  },
  difficultyContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  difficultyButton: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
 
  buttonText: {
    color: 'white',
  },
  uploadButton: {
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    marginTop: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default TrailForm;
