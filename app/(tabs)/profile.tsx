import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Modal, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as UserDAO from '@/dao/userDAO';
import * as TrailDAO from '@/dao/trailDAO';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform } from 'react-native';
import TrailInfoModal from '@/components/DetailTrail';

export default function ProfileScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [trailsCreated, setTrailsCreated] = useState<any[]>([]);
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

  const openModal = (trail) => {
    setSelectedTrail(trail);
    setIsModalDetailVisible(true);
  };

  const closeModal = () => {
    setIsModalDetailVisible(false);
    setSelectedTrail(null);
  };


  useEffect(() => {
    const fetchUserAndTrails = async () => {
      const user = await UserDAO.getUser();
      if (user) {
        setUserName(user);
        const fetchedUsers = await UserDAO.getUsers();
        const userFound = fetchedUsers?.find((u) => `${u.name} ${u.surname}` === user);
        if (userFound) {
          setUserId(userFound.id);
          fetchTrails(userFound.id);
        }
      }
    };
    fetchUserAndTrails();
  }, []);

  const fetchTrails = async (id: number) => {
    const trails = await TrailDAO.getTrailsCreatedByUsers(id);
    setTrailsCreated(trails);
  };

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

  const openUserSelection = async () => {
    const fetchedUsers = await UserDAO.getUsers();
    if (fetchedUsers) {
      setUsers(fetchedUsers);
      setIsUserModalVisible(true);
    }
  };

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
          <Ionicons name="person-circle-outline" size={80} color="white" />
          <Text style={styles.greeting}>{userName ? userName : "Caricamento..."}</Text>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTENTS</Text>
  
          <TouchableOpacity style={styles.listItem} onPress={() => toggleSection(setIsTrailExpandedTD, rotateAnimationTD)}>
            <Ionicons name="trail-sign-outline" size={24} color="white" />
            <Text style={styles.listItemText}>Trails Done</Text>
            <Animated.View style={{ transform: [{ rotate: rotateAnimationTD.interpolate({ inputRange: [0, 90], outputRange: ['0deg', '90deg'] }) }] }}>
              <Ionicons name="chevron-forward" size={20} color="gray" />
            </Animated.View>
          </TouchableOpacity>
  
          {isTrailExpandedTD && (
            <View style={styles.dropdown}>
              <Text style={styles.dropdownText}>- Trail 1 completato</Text>
              <Text style={styles.dropdownText}>- Trail 2 completato</Text>
              <Text style={styles.dropdownText}>- Trail 3 completato</Text>
            </View>
          )}
  
          <TouchableOpacity style={styles.listItem} onPress={() => toggleSection(setIsTrailExpandedTC, rotateAnimationTC)}>
            <MaterialCommunityIcons name="map-marker-plus" size={24} color="white" />
            <Text style={styles.listItemText}>Trails Created</Text>
            <Animated.View style={{ transform: [{ rotate: rotateAnimationTC.interpolate({ inputRange: [0, 90], outputRange: ['0deg', '90deg'] }) }] }}>
              <Ionicons name="chevron-forward" size={20} color="gray" />
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

                    {/* Informazioni principali */}
                    <View style={styles.infoRow}>
                      <Text style={styles.infoText}>
                        <MaterialCommunityIcons name="timeline" size={16} color="#fff" /> {trail.length} km
                      </Text>
                      <Text style={styles.infoText}>
                        <MaterialCommunityIcons name="clock-time-five-outline" size={16} color="#fff" /> {trail.duration} ore
                      </Text>
                      <Text style={styles.infoText}>
                        <MaterialCommunityIcons name="terrain" size={16} color="#fff" /> {trail.elevation ? `${trail.elevation} m` : "N/A"}
                      </Text>

                      {/* Difficoltà colorata */}
                      <View style={[
                        styles.difficultyContainer,
                        { backgroundColor: trail.difficulty === 'Beginner' ? '#4CAF50' : 
                                        trail.difficulty === 'Intermediate' ? '#FFD700' : 
                                        '#FF3B30' }
                      ]}>
                        <Text style={[
                          styles.difficultyLabel, 
                          { color: trail.difficulty === 'Intermediate' ? '#000' : '#fff' }
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
                  <Ionicons name="chevron-forward" size={20} color="gray" />
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
  container: { 
    flex: 1, 
    backgroundColor: '#000' },
  header: { 
    alignItems: 'center', 
    paddingVertical: 70, 
    backgroundColor: '#1c1c1e' },
  greeting: { 
    color: 'white', 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 10 },
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
    trailItem: { marginTop: 5, padding: 8, borderBottomWidth: 1, borderBottomColor: '#444' },
    trailText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    trailDetails: { color: '#bbb', fontSize: 14 },
    trailCard: { backgroundColor: 'gray', padding: 20, borderRadius: 10, marginBottom: 10 },
    trailName: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 10 },
    infoRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 5, marginBottom: 10 },
    infoText: { fontSize: 16, color: 'white', marginRight: 10 },
    difficultyContainer: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 5 },
    difficultyLabel: { fontSize: 14, fontWeight: 'bold' },
    separator: { height: 1, backgroundColor: 'black', opacity: 0.2, marginVertical: 10 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    startButton: { backgroundColor: '#34495e', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});


