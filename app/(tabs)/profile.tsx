import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Modal, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as UserDAO from '@/dao/userDAO';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isTrailExpandedTD, setIsTrailExpandedTD] = useState(false);
  const [isTrailExpandedS, setIsTrailExpandedS] = useState(false);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [users, setUsers] = useState<string[]>([]);

  const rotateAnimationTD = useState(new Animated.Value(0))[0]; 
  const rotateAnimationS = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchUser = async () => {
      const user = await UserDAO.getUser();
      setUserName(user);
    };

    fetchUser();
  }, []);

  const toggleTrailSectionTD = () => {
    const newState = !isTrailExpandedTD;
    setIsTrailExpandedTD(newState);

    Animated.timing(rotateAnimationTD, {
      toValue: newState ? 90 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const toggleTrailSectionS = () => {
    const newState = !isTrailExpandedS;
    setIsTrailExpandedS(newState);

    Animated.timing(rotateAnimationS, {
      toValue: newState ? 90 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Funzione per aprire il popup e recuperare gli utenti
  const openUserSelection = async () => {
    const fetchedUsers = await UserDAO.getUsers();
    if (fetchedUsers) {
      setUsers(fetchedUsers);
      setIsUserModalVisible(true);
    }
  };

  // Funzione per selezionare un utente e aggiornare il nome
  const handleUserSelect = (user: string) => {
    setUserName(user);
    setIsUserModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={80} color="white" />
        <Text style={styles.greeting}>
          {userName ? userName : "Caricamento..."}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONTENTS</Text>

        <TouchableOpacity style={styles.listItem} onPress={toggleTrailSectionTD}>
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

        <TouchableOpacity style={styles.listItem}>
          <MaterialCommunityIcons name="map-marker-plus" size={24} color="white" />
          <Text style={styles.listItemText}>Trails Created</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem} onPress={toggleTrailSectionS}>
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

      {/* Popup per selezionare l'utente */}
      <Modal visible={isUserModalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Select a User</Text>

            <FlatList
              data={users}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelect(item)}>
                  <Text style={styles.userText}>{item}</Text>
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
});


