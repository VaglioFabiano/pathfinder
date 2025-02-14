import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Modal, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as UserDAO from '@/dao/userDAO';
import * as TrailDAO from '@/dao/trailDAO';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform,Image } from 'react-native';
import TrailInfoModal from '@/components/DetailTrail';

import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
 // Stato
const [userName, setUserName] = useState<string | null>(null);
const [userImage, setUserImage] = useState<any>(null); // Ora accetta direttamente il valore dell'immagine
const [profileSource, setProfileSource] = useState<any>(null);
const [userId, setUserId] = useState<number | null>(null);
const [trailsCreated, setTrailsCreated] = useState<any[]>([]);
const [trailsDone, setTrailsDone] = useState<any[]>([]);
const [users, setUsers] = useState<{ id: number; name: string; surname: string }[]>([]);
const [isTrailExpandedTD, setIsTrailExpandedTD] = useState(false);
const [isTrailExpandedTC, setIsTrailExpandedTC] = useState(false);
const [isTrailExpandedS, setIsTrailExpandedS] = useState(false);
const [isUserModalVisible, setIsUserModalVisible] = useState(false);
const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
const [selectedTrail, setSelectedTrail] = useState(null);

const rotateAnimationTD = useState(new Animated.Value(0))[0];
const rotateAnimationTC = useState(new Animated.Value(0))[0];
const rotateAnimationS = useState(new Animated.Value(0))[0];
const [loadingImages, setLoadingImages] = useState<boolean>(true);

const images = Array.isArray(selectedTrail?.image)
        ? selectedTrail.image
        : typeof selectedTrail?.image === "string"
        ? JSON.parse(selectedTrail.image) // Se è una stringa JSON, convertila in array
        : [];
// Mappa immagini basata su ID utente
const userImages: { [key: number]: any } = {
    2: require("../../assets/images/MarcoSporty.png"),
    3: require("../../assets/images/FabiVaglio.png"),
};

// Apri modale dettagli trail
const openModal = (trail) => {
    setSelectedTrail(trail);
    setIsModalDetailVisible(true);
};

// Chiudi modale
const closeModal = () => {
    setIsModalDetailVisible(false);
    setSelectedTrail(null);
};

// Effetto per aggiornare l'immagine del profilo quando cambia userId
useEffect(() => {
    if (userId && userImages[userId]) {
        console.log("✅ Assegnata immagine per ID:", userId);
        setProfileSource(userImages[userId]);
    } else {
        console.log("⚠️ Nessuna immagine trovata per ID:", userId);
        setProfileSource(null);
    }
}, [userId]);

// Caricamento iniziale utente e trail
useEffect(() => {
    const fetchUserAndTrails = async () => {
        const userData = await UserDAO.getUser();

        if (userData && userData.fullName) {
            setUserName(userData.fullName);

            const fetchedUsers = await UserDAO.getUsers();
            const userFound = fetchedUsers?.find((u) => `${u.name} ${u.surname}` === userData.fullName);

            if (userFound) {
                setUserId(userFound.id);
                fetchTrails(userFound.id);
            }
        }
    };

    fetchUserAndTrails();
}, []);

// Carica i trail creati e completati da un utente
const fetchTrails = async (id: number) => {
    const createdTrails = await TrailDAO.getTrailsCreatedByUsers(id);
    setTrailsCreated(createdTrails);

    const doneTrails = await TrailDAO.getTrailsDoneByUsers(id);
    setTrailsDone(doneTrails);
};

// Anima l'espansione delle sezioni
const toggleSection = (setter: React.Dispatch<React.SetStateAction<boolean>>, animation: Animated.Value) => {
    setter((prev) => {
        const newState = !prev;
        Animated.timing(animation, {
            toValue: newState ? 90 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
        return newState;
    });
};

// Apri il selettore utenti
const openUserSelection = async () => {
    const fetchedUsers = await UserDAO.getUsers();
    if (fetchedUsers) {
        setUsers(fetchedUsers);
        setIsUserModalVisible(true);
    }
};

// Selezione di un nuovo utente
const handleUserSelect = (user: { id: number; name: string; surname: string }) => {
    setUserName(`${user.name} ${user.surname}`);
    setUserId(user.id);
    fetchTrails(user.id);

    setIsUserModalVisible(false);
};

 

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          {profileSource ? (
            <Image 
              key={profileSource} 
              source={profileSource} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={styles.profileImageContainer}>
              <Ionicons name="person-circle-outline" size={150} color="white" />
            </View>
          )}
          <Text style={styles.greeting}>{userName ? userName : "Caricamento..."}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTENTS</Text>
  
          <TouchableOpacity style={styles.listItem} onPress={() => toggleSection(setIsTrailExpandedTD, rotateAnimationTD)}>
                <Ionicons name="trail-sign-outline" size={24} color="white" />
                <Text style={styles.listItemText}>Trails Done</Text>
                <Animated.View style={{ transform: [{ rotate: rotateAnimationTD.interpolate({ inputRange: [0, 90], outputRange: ['0deg', '90deg'] }) }] }}>
                    <Ionicons name="chevron-forward" size={20} color="#979797" />
                </Animated.View>
            </TouchableOpacity>

            {isTrailExpandedTD && (
                <View style={styles.dropdown}>
                    {trailsDone.length > 0 ? (
                        trailsDone.map((trail) => (
                            <TouchableOpacity key={trail.id} style={styles.trailCard} onPress={() => openModal(trail)}>
                              
                        
                                <Text style={styles.trailName}>{trail.name}</Text>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoText}>
                                        <MaterialIcons name="timeline" size={16} color="#fff" /> {trail.length} km
                                    </Text>
                                    <Text style={styles.infoText}>
                                        <MaterialIcons name="schedule" size={16} color="#fff" /> {trail.duration} h
                                    </Text>
                                    <Text style={styles.infoText}>
                                        <MaterialIcons name="landscape" size={16} color="#fff" /> {trail.elevation ? `${trail.elevation} m` : "N/A"}
                                    </Text>
                                    <View style={[
                                        styles.difficultyContainer,
                                        { backgroundColor: trail.difficulty === 'Beginner' ? '#4986af' : 
                                                        trail.difficulty === 'Intermediate' ? '#af8649' : 
                                                        '#af4953' }
                                    ]}>
                                        <Text style={[
                                            styles.difficultyLabel, 
                                            { color: '#fff' }
                                        ]}>
                                            {trail.difficulty}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.dropdownText}>Nessun trail completato</Text>
                    )}
                </View>
            )}
  
          <TouchableOpacity style={styles.listItem} onPress={() => toggleSection(setIsTrailExpandedTC, rotateAnimationTC)}>
            <MaterialCommunityIcons name="map-marker-plus" size={24} color="white" />
            <Text style={styles.listItemText}>Trails Created</Text>
            <Animated.View style={{ transform: [{ rotate: rotateAnimationTC.interpolate({ inputRange: [0, 90], outputRange: ['0deg', '90deg'] }) }] }}>
              <Ionicons name="chevron-forward" size={20} color="#979797" />
            </Animated.View>
          </TouchableOpacity>
  
          {isTrailExpandedTC && (
            <View style={styles.dropdown}>
              {trailsCreated.length > 0 ? (
                trailsCreated.map((trail) => (
                  <TouchableOpacity 
                    key={trail.id} 
                    style={styles.trailCard} 
                    onPress={() => openModal(trail)}
                  >
                    
                    <Text style={styles.trailName}>{trail.name}</Text>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoText}>
                        <MaterialIcons name="timeline" size={16} color="#fff" /> {trail.length} km
                      </Text>
                      <Text style={styles.infoText}>
                        <MaterialIcons name="schedule" size={16} color="#fff" /> {trail.duration} h
                      </Text>
                      <Text style={styles.infoText}>
                        <MaterialIcons name="landscape" size={16} color="#fff" /> {trail.elevation ? `${trail.elevation} m` : "N/A"}
                      </Text>

                      <View style={[
                        styles.difficultyContainer,
                        { backgroundColor: trail.difficulty === 'Beginner' ? '#4986af' : 
                                        trail.difficulty === 'Intermediate' ? '#af8649' : 
                                        '#af4953' }
                      ]}>
                        <Text style={[
                          styles.difficultyLabel, 
                          { color:  '#fff' }
                        ]}>
                          {trail.difficulty}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.dropdownText}>Nessun trail creato</Text>
              )}
            </View>
          )}

  
          <TouchableOpacity style={styles.listItem} onPress={() => toggleSection(setIsTrailExpandedS, rotateAnimationS)}>
                <Ionicons name="settings-outline" size={24} color="white" />
                <Text style={styles.listItemText}>Settings</Text>
                <Animated.View style={{ transform: [{ rotate: rotateAnimationS.interpolate({ inputRange: [0, 90], outputRange: ['0deg', '90deg'] }) }] }}>
                  <Ionicons name="chevron-forward" size={20} color="#979797" />
                </Animated.View>
              </TouchableOpacity>

              {isTrailExpandedS && (
                  <TouchableOpacity style={styles.changeUserButton} onPress={openUserSelection}>
                    <Text style={styles.changeUserText}>Change User</Text>
                  </TouchableOpacity>
                
              )}
        </View>
  
        <Modal visible={isUserModalVisible} animationType="slide" transparent>
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Select a User</Text>
  
              <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()} // Usa l'ID come chiave
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelect(item)}>
                    <Text style={styles.userText}>{item.name} {item.surname}</Text>
                  </TouchableOpacity>
                )}
              />
  
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsUserModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {isModalDetailVisible && (
        <TrailInfoModal 
          isVisible={isModalDetailVisible} 
          closeModal={closeModal} 
          selectedTrail={selectedTrail} 
          startTrail={() => console.log("Inizia il trail", selectedTrail)}
        />
      )}

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  imageScrollView: {
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginRight: 10,
  },
  loader: {
    position: 'absolute',
  },
  noImagesText: {
    color: 'white',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  
  container: { 
    flex: 1, 
    backgroundColor: '#000' },
    header: { 
      alignItems: 'center', 
      justifyContent: 'center', 
      paddingVertical: 40, 
      backgroundColor: '#1c1c1e' },
  greeting: { 
    color: 'white', 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 50 },
  section: { 
    marginTop: 20, 
    paddingHorizontal: 20 },
  sectionTitle: { 
    color: '#bbb', 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginBottom: 10 },
  listItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#444' },
  listItemText: { 
    color: 'white', 
    fontSize: 18, 
    flex: 1, 
    marginLeft: 15 },
  dropdown: { 
    backgroundColor: '#222', 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 10 },
  dropdownText: { 
    color: 'white', 
    fontSize: 16, 
    paddingVertical: 5 },
  changeUserButton: { 
    backgroundColor: '#86af49', 
    paddingVertical: 10, 
    borderRadius: 5, 
    marginTop: 10, 
    alignItems: 'center' },
  changeUserText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center' },
  modalContainer: { 
    width: '80%', 
    backgroundColor: 
    '#1c1c1e', 
    padding: 20, 
    borderRadius: 10 },
  title: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    textAlign: 'center' },
  userItem: { 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#444' },
  userText: { 
    color: 'white', 
    fontSize: 18, 
    textAlign: 'center' },
  closeButton: { 
    marginTop: 20, 
    paddingVertical: 10, 
    backgroundColor: '#86af49', 
    borderRadius: 5, 
    alignItems: 'center' },
  closeButtonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' },
    trailItem: { 
      marginTop: 5, 
      padding: 8, 
      borderBottomWidth: 1, 
      borderBottomColor: '#444' },
    trailText: { 
      color: 'white', 
      fontSize: 16, 
      fontWeight: 'bold' },
    trailDetails: { 
      color: '#bbb', 
      fontSize: 14 },
    trailCard: { 
      backgroundColor: '#979797', 
      padding: 20, 
      borderRadius: 10, 
      marginBottom: 10 },
    trailName: { 
      fontSize: 20, 
      fontWeight: 'bold', 
      color: 'white', 
      marginBottom: 10 },
    infoRow: { 
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      justifyContent: 'space-between', 
      marginTop: 5, 
      marginBottom: 10 },
    infoText: { 
      fontSize: 16, 
      color: 'white', 
      marginRight: 10 },
    difficultyContainer: { 
      paddingVertical: 3, 
      paddingHorizontal: 8, 
      borderRadius: 5 },
    difficultyLabel: { 
      fontSize: 14, 
      fontWeight: 'bold' },
    separator: { 
      height: 1, 
      backgroundColor: 'black', 
      opacity: 0.2, 
      marginVertical: 10 },
    buttonRow: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginTop: 10 },
    startButton: { 
      backgroundColor: '#86af49', 
      paddingVertical: 10, 
      paddingHorizontal: 20, 
      borderRadius: 5 },
    buttonText: { 
      color: 'white', 
      fontSize: 16, 
      fontWeight: 'bold' },
    profileImage: {
      top: 30,
      width: 150,
      height: 150,
      borderRadius: 80, // Per renderla circolare
    },
    profileImageContainer: {
      width: 150,
      height: 150,
      borderRadius: 80, // Assicura che sia simile all'immagine
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden', // Evita problemi di ridimensionamento
      backgroundColor: 'transparent', // Mantiene lo sfondo trasparente
      top: 30,},
   
});


