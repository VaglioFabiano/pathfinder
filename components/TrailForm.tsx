import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface TrailFormProps {
    time: number;
    distance: number;
    downhill: number;
    elevation: number;
    activityType: string;
    calculateAverageSpeed: () => number;
    resetTrail: () => void;
}

const TrailForm: React.FC<TrailFormProps> = ({time, distance, downhill, elevation, activityType, calculateAverageSpeed, resetTrail }) => {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Errore', 'Il nome del Trail è obbligatorio.');
      return;
    }
    // Puoi aggiungere qui la logica per salvare il trail
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
              {/* Campo Nome del Trail */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Trail Name:</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Insert Trail Name..."
                  placeholderTextColor="#888"  
                />
              </View>

              {/* Campo Difficoltà */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Difficulty:</Text>
                <View style={styles.difficultyContainer}>
                  <TouchableOpacity
                    style={[styles.difficultyButton, difficulty === 'Beginner' && styles.selectedButton]}
                    onPress={() => setDifficulty('Beginner')}
                  >
                    <Text style={styles.buttonText}>Beginner</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.difficultyButton, difficulty === 'Intermediate' && styles.selectedButton]}
                    onPress={() => setDifficulty('Intermediate')}
                  >
                    <Text style={styles.buttonText}>Intermediate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.difficultyButton, difficulty === 'Advanced' && styles.selectedButton]}
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
                  placeholderTextColor="#888"  
                />
              </View>

              {/* Visualizzazione dei dati del trail */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Activity: {activityType} </Text>
                <Text style={styles.label}>Tempo: {formatTime(time)} </Text>
                <Text style={styles.label}>Distanza: {distance.toFixed(2)} km</Text>
                <Text style={styles.label}>Discesa: {downhill.toFixed(2)} m</Text>
                <Text style={styles.label}>Elevazione: {elevation.toFixed(2)} m</Text>
              </View>

              {/* Caricamento delle foto */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Foto:</Text>
                <TouchableOpacity onPress={handleFileInputClick} style={styles.uploadButton}>
                  <Text style={styles.uploadButtonText}>Inserisci Foto</Text>
                </TouchableOpacity>
                <ScrollView horizontal style={styles.imagePreviewContainer}>
                  {images.map((image, index) => (
                    <Image key={index} source={{ uri: image }} style={styles.imagePreview} />
                  ))}
                </ScrollView>
              </View>

              {/* Bottone Salva */}
              <Button title="Salva Trail" onPress={handleSubmit} color="#3498db" />
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
    backgroundColor: 'white',
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
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  difficultyContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  difficultyButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: 'white',
  },
  uploadButton: {
    backgroundColor: '#3498db',
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
