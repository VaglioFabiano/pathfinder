import React, { useState, useEffect, useRef } from 'react';
import '../style/search.css';
import { FaSearchLocation } from "react-icons/fa";
import { GiPositionMarker } from "react-icons/gi";


function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false); // Per controllare la visibilità della tendina
  const searchBarRef = useRef(null);

  // Carica le ricerche recenti dal localStorage
  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  // Aggiorna le ricerche recenti nel localStorage
  const updateRecentSearches = (newSearch) => {
    const updatedSearches = [newSearch, ...recentSearches.filter(item => item !== newSearch)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Ottieni la posizione attuale dell'utente
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentLocation({ latitude, longitude });
          setQuery('Current Location');
          setShowDropdown(false); // Chiude la tendina
        },
        (error) => {
          console.error('Errore nella geolocalizzazione:', error);
          alert('Impossibile ottenere la posizione attuale.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('La geolocalizzazione non è supportata dal browser.');
    }
  };

  // Gestisce il cambiamento del campo di input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  
    if (value.length > 0) {
      fetch(`https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1&limit=5`)
        .then(response => response.json())
        .then(data => {
          setSuggestions(data.map(item => item.display_name));
        })
        .catch(error => {
          console.error("Errore durante il completamento automatico:", error);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
    setShowDropdown(true);
  };
  
  // Gestisce il click sui suggerimenti o la ricerca
  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    setSuggestions([]);
    updateRecentSearches(searchTerm);
    setShowDropdown(false); // Chiude la tendina dopo una selezione
  };

  // Chiude i suggerimenti quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowDropdown(false); // Nasconde la tendina
        setSuggestions([]); // Svuota i suggerimenti
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
          onFocus={() => setShowDropdown(true)} // Mostra la tendina quando l'input è focalizzato
        />
        <button className="search-button" onClick={() => handleSearch(query)}>
          <FaSearchLocation />
        </button>
      </div>

      {/* Suggerimenti e Ricerche Recenti */}
      {showDropdown && (
        <div className="suggestions-container">
          {query.length === 0 && (
            <>
              <div className="suggestion" onClick={handleCurrentLocation}>
              <GiPositionMarker />
              Usa la mia posizione attuale
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
