import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

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
          console.log('%c API Response:', 'color: cyan; font-weight: bold;', data);
  
          if (Array.isArray(data) && data.length > 0) {
            const formattedData = data.map((item) => ({
              name: item.display_name || 'Unknown location',
              coords: {
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
              },
            }));
  
            console.log('%c Processed Suggestions:', 'color: green; font-weight: bold;', formattedData);
            setSuggestions(formattedData);
          } else {
            console.warn('%c No results found.', 'color: orange; font-weight: bold;');
            setSuggestions([]);
          }
        } catch (error) {
          console.error('%c Error fetching suggestions:', 'color: red; font-weight: bold;', error);
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
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${searchTerm}&format=json&addressdetails=1&limit=1`
        );
        const data = await response.json();
        if (data.length > 0) {
          const coords = {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          };
          mapRef.current.animateToRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 1000);
          updateRecentSearches(searchTerm);
        } else {
          Alert.alert('Location not found', 'Please refine your search.');
        }
      } catch (error) {
        console.error('Error during search:', error);
        Alert.alert('Error', 'An error occurred while searching for the location.');
      }
    }

    setQuery(searchTerm);
    setSuggestions([]);
  };

  return (
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
          />
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch(query)}>
          <FontAwesome name="search" size={20} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      {showDropdown && suggestions.length > 0 && (
      <View style={styles.suggestionsContainer}>
        <FlatList
          data={suggestions || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSearch(item.name)}>
              <Text style={styles.suggestion}>
                {item?.name ?? 'No name available'}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={{ padding: 10, textAlign: 'center', color: '#aaa' }}>
              No suggestions found
            </Text>
          )}
        />
      </View>
)}




    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    position: 'absolute',
    top: '3.5%',
    left: '10%',
    right: '10%',
    alignItems: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  searchButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 12,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  dropdown: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  suggestion: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    color: '#34495e',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60, 
    left: 0,
    right: 0,
    backgroundColor: 'white', 
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, 
    zIndex: 1000, 
  },  
});

export default SearchBar;
