import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getUser } from '@/dao/userDAO'; // Assicurati che il percorso sia corretto

export default function ProfileScreen() {
  /*const [user, setUser] = useState<{ name: string; surname: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser(1); // Simula il recupero utente dal DB con ID 1
      if (userData) {
        setUser(userData);
      }
    };

    fetchUser();
  }, []);*/

  return (
    <ScrollView style={styles.container}>
      {/* Sezione header con avatar e testo */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={80} color="white" />
        <Text style={styles.greeting}>
          {/*user ? `${user.name}\n${user.surname}` : "Caricamento..."*/}
        </Text>
      </View>

      {/* Sezione contenuti */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONTENUTI</Text>

        {/** Lista delle sezioni */}
        <TouchableOpacity style={styles.listItem}>
          <Ionicons name="trail-sign-outline" size={24} color="white" />
          <Text style={styles.listItemText}>Percorsi</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Ionicons name="briefcase-outline" size={24} color="white" />
          <Text style={styles.listItemText}>Progetti</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Ionicons name="radio-button-on-outline" size={24} color="white" />
          <Text style={styles.listItemText}>Tracce</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Ionicons name="chatbox-outline" size={24} color="white" />
          <Text style={styles.listItemText}>Punti di interesse</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Ionicons name="download-outline" size={24} color="white" />
          <Text style={styles.listItemText}>Download</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 70,
    backgroundColor: '#1c1c1e',
  },
  greeting: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#bbb',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  listItemText: {
    color: 'white',
    fontSize: 18,
    flex: 1,
    marginLeft: 15,
  },
});
