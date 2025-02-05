import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, FlatList, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons';

const SearchBar = ({ mapRef }: { mapRef: React.RefObject<any> }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; coords: { latitude: number; longitude: number } }[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const storedSearches = await AsyncStorage.getItem('recentSearches');
        if (storedSearches) {
          setRecentSearches(JSON.parse(storedSearches));
        }
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    };
    loadRecentSearches();
  }, []);

  const updateRecentSearches = async (newSearch: string) => {
    const updatedSearches = [newSearch, ...recentSearches.filter((item) => item !== newSearch)].slice(0, 5);
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowDropdown(true);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      if (value.trim().length > 0) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&limit=5&countrycodes=it`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const formattedData = data.map((item) => ({
              name: item.display_name || 'Unknown location',
              coords: {
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
              },
            }));
            setSuggestions(formattedData);
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleSearch = async (searchTerm: string) => {
    if (!mapRef?.current) {
      Alert.alert('Map not ready', 'The map is not ready yet. Please try again.');
      return;
    }

    setShowDropdown(false);
    const selectedSuggestion = suggestions.find((s) => s.name === searchTerm);

    if (selectedSuggestion) {
      mapRef.current.animateToRegion(
        {
          ...selectedSuggestion.coords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
      updateRecentSearches(searchTerm);
    } else {
      Alert.alert('Location not found', 'Please refine your search.');
    }

    setQuery(searchTerm);
    setSuggestions([]);
  };

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setShowDropdown(false); setSuggestions([]); }} accessible={false}>
      <View style={styles.container}>
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.input}
              placeholder="Search..."
              placeholderTextColor="#95a5a6"
              value={query}
              onChangeText={handleInputChange}
              onFocus={() => setShowDropdown(true)}
              onSubmitEditing={() => handleSearch(query)}
              blurOnSubmit={true}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => { setQuery(''); setShowDropdown(false); setSuggestions([]); Keyboard.dismiss(); }} style={styles.clearButton}>
                <Entypo name="cross" size={20} color="#7f8c8d" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {showDropdown && suggestions.length > 0 && (
          <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setShowDropdown(false); setSuggestions([]); }}>
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions || []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSearch(item.name)}>
                    <Text style={styles.suggestion}>{item?.name ?? 'No name available'}</Text>
                  </TouchableOpacity>
                )}
                keyboardShouldPersistTaps="always"
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    position: 'absolute',
    top: '4%',
    left: '3%',
    right: '3%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 50,
    width: '100%',
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    paddingRight: 25,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: '3%',
    right: '3%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 5,
    zIndex: 1000,
  },
  suggestion: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    color: '#34495e',
  },
});

export default SearchBar;
