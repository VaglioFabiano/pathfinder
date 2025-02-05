import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

interface StartTrailButtonProps {
  startTrail: (position: any, activity: string) => void;
  currentPosition: any;
}

const activityIcons: { [key: string]: string } = {
  Walk: 'walk',
  Hiking: 'hiking',
  Bike: 'bike',
};

const StartTrailButton = ({ startTrail, currentPosition }: StartTrailButtonProps) => {
  const [selectedActivity, setSelectedActivity] = useState('Walk');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const activities = ['Walk', 'Hiking', 'Bike'];

  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Row with Icon, Activity Button, and Start */}
      <View style={styles.row}>
        {/* Start Trail Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => startTrail(currentPosition, selectedActivity)}
        >
          <Text style={styles.buttonText}>Start Trail</Text>
        </TouchableOpacity>
        {/* Activity Button */}
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

        
      </View>

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
                    size={18}
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
    width: '40%',
    justifyContent: 'center',
  },
  activityIcon: {
    marginRight: 5,
  },
  dropdownIcon: {
    marginLeft: 5,
  },
  startButton: {
    backgroundColor: '#86af49',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '60%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    bottom: 100,
    width: '50%',
    backgroundColor: '#979797',
    borderRadius: 8,
    right: 10,
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
