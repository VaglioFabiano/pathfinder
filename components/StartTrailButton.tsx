import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

interface StartTrailButtonProps {
  startTrail: (position: any, activity: string) => void;
  currentPosition: any;
}

const activityIcons: { [key: string]: string } = {
  Walk: 'walk',
  Hike: 'hiking',
  Bike: 'bike',
};

const StartTrailButton = ({ startTrail, currentPosition }: StartTrailButtonProps) => {
  const [selectedActivity, setSelectedActivity] = useState('Walk');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const activities = ['Walk', 'Hike', 'Bike'];

  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
   
        <TouchableOpacity
          style={styles.activityRow}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <MaterialCommunityIcons
            name={activityIcons[selectedActivity] || 'walk'}
            size={20}
            color="white"
            style={styles.activityIcon}
          />
          <Text style={styles.buttonText}>
            {selectedActivity}
          </Text>
          {/* Dropdown Icon */}
          <MaterialIcons
            name={dropdownVisible ? 'arrow-drop-up' : 'arrow-drop-down'}
            size={24}
            color="white"
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.startButton}
          onPress={() => startTrail(currentPosition, selectedActivity)}
        >
          <Text style={styles.buttonText}>Start Trail</Text>
        </TouchableOpacity>
       
        

      {/* Dropdown List */}
      {dropdownVisible && (
        
        <View style={styles.dropdown}>
          <FlatList
            data={activities}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleActivitySelect(item)}
                style={styles.itemContainer}
              >
                <View style={styles.activityRow}>
                  <MaterialCommunityIcons
                    name={activityIcons[item] || 'walk'}
                    size={25}
                    color="white"
                    style={styles.activityIcon}
                  />
                  <Text style={styles.modalItem}>{item}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.toLowerCase()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#979797',
    padding: 10,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra
  },
  activityIcon: {
    marginRight: 10,
  },

  startButton: {
    backgroundColor: '#86af49',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',  // Colore dell'ombra (nero)
    shadowOffset: { width: 0, height: 2 },  // Offset dell'ombra
    shadowOpacity: 0.2,  // Opacità dell'ombra
    shadowRadius: 4,  // Raggio dell'ombra
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    bottom: 130,
    width: '100%',
    backgroundColor: '#979797',
    borderRadius: 8,
    zIndex: 5,
  },
  itemContainer: {
    paddingVertical: 2,
  },
  modalItem: {
    fontSize: 16,
    color: 'white',
  },
  
});

export default StartTrailButton;
