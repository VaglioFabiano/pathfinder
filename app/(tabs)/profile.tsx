import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Sezione header con avatar e testo */}
      <View style={styles.header}>
        <Icon name="person-circle-outline" size={80} color="white" />
        <Text style={styles.greeting}>Fabiano{"\n"}Vaglio</Text>
      </View>
      {/* Sezione contenuti */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONTENUTI</Text>
        <TouchableOpacity style={styles.listItem}>
          <Icon name="trail-sign-outline" size={24} color="white" />
          <Text style={styles.listItemText}>Percorsi</Text>
          <Icon name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Icon name="briefcase-outline" size={24} color="white" />
          <Text style={styles.listItemText}>Progetti</Text>
          <Icon name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Icon name="radio-button-on-outline" size={24} color="white" />
          <Text style={styles.listItemText}>Tracce</Text>
          <Icon name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Icon name="chatbox-outline" size={24} color="white" />
          <Text style={styles.listItemText}>Punti di interesse</Text>
          <Icon name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <Icon name="download-outline" size={24} color="white" />
          <Text style={styles.listItemText}>Download</Text>
          <Icon name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 70,
    backgroundColor: '#1c1c1e', // Colore scuro per l'header
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
