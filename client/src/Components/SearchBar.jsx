import React, { useState, useEffect, useRef } from 'react';
import '../style/search.css';
import { FaSearchLocation } from 'react-icons/fa';

function SearchBar({ map }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchBarRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Carica le ricerche recenti da localStorage
  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  // Salva le ricerche recenti in localStorage
  const updateRecentSearches = (newSearch) => {
    const updatedSearches = [newSearch, ...recentSearches.filter((item) => item !== newSearch)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Gestisci le modifiche all'input con debounce per ridurre le richieste API
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(true);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (value.length > 0) {
        fetch(`https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1&limit=5&countrycodes=it`)
          .then((response) => response.json())
          .then((data) => {
            setSuggestions(
              data.map((item) => ({
                name: item.display_name,
                coords: [parseFloat(item.lat), parseFloat(item.lon)],
              }))
            );
          })
          .catch((error) => {
            console.error('Autocomplete error:', error);
            setSuggestions([]);
          });
      } else {
        setSuggestions([]);
      }
    }, 300); // Debounce delay di 300ms
  };

  // Gestisce la ricerca e centra la mappa
  const handleSearch = (searchTerm) => {
    if (!map) {
      console.error('Map instance is not available.');
      alert('The map is not ready yet. Please try again.');
      return;
    }

    setShowDropdown(false);
    const selectedSuggestion = suggestions.find((s) => s.name === searchTerm);

    if (selectedSuggestion) {
      map.flyTo(selectedSuggestion.coords, 17); // Centra la mappa
      updateRecentSearches(searchTerm);
    } else {
      // Cerca direttamente tramite Nominatim
      fetch(`https://nominatim.openstreetmap.org/search?q=${searchTerm}&format=json&addressdetails=1&limit=1`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            map.flyTo(coords, 17); // Centra la mappa
            updateRecentSearches(searchTerm);
          } else {
            alert('Location not found. Please refine your search.');
          }
        })
        .catch((error) => {
          console.error('Error during search:', error);
          alert('An error occurred while searching for the location.');
        });
    }

    setQuery(searchTerm);
    setSuggestions([]);
  };

  // Chiudi il dropdown quando si clicca all'esterno
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
          placeholder="Search for a location..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)} // Cerca con Invio
        />
        <button className="search-button" onClick={() => handleSearch(query)}>
          <FaSearchLocation />
        </button>
      </div>

      {showDropdown && (
        <div className="suggestions-container">
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="recent-searches">
              <h4>Recent Searches:</h4>
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
          {query.length > 0 &&
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion"
                onClick={() => handleSearch(suggestion.name)}
              >
                {suggestion.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
