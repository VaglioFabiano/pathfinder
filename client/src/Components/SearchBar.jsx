import React, { useState, useEffect, useRef } from 'react';
import '../style/search.css';
import { FaSearchLocation } from "react-icons/fa";
import { GiPositionMarker } from "react-icons/gi";

function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchBarRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  // Save recent searches to localStorage
  const updateRecentSearches = (newSearch) => {
    const updatedSearches = [newSearch, ...recentSearches.filter(item => item !== newSearch)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Get the user's current location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentLocation({ latitude, longitude });
          setQuery('Current Location');
          setShowDropdown(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get current location.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Handle input changes with debouncing for API calls
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(true);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (value.length > 0) {
        fetch(`https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1&limit=5&countrycodes=it`)
          .then(response => response.json())
          .then(data => {
            setSuggestions(data.map(item => item.display_name));
          })
          .catch(error => {
            console.error('Autocomplete error:', error);
            setSuggestions([]);
          });
      } else {
        setSuggestions([]);
      }
    }, 300); // Debounce delay of 300ms
  };

  // Handle selecting a suggestion or performing a search
  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    setSuggestions([]);
    updateRecentSearches(searchTerm);
    setShowDropdown(false);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-bar-container" ref={searchBarRef}>
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
        />
        <button className="search-button" onClick={() => handleSearch(query)}>
          <FaSearchLocation />
        </button>
      </div>

      {showDropdown && (
        <div className="suggestions-container">
          {query.length === 0 && (
            <>
              <div className="suggestion" onClick={handleCurrentLocation}>
                <GiPositionMarker /> Usa la mia posizione attuale
              </div>
              {recentSearches.length > 0 && (
                <div className="recent-searches">
                  <h4>Ricerche Recenti:</h4>
                  {recentSearches.map((item, index) => (
                    <div
                      key={index}
                      className="suggestion"
                      onClick={() => handleSearch(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {query.length > 0 && suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion"
              onClick={() => handleSearch(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
