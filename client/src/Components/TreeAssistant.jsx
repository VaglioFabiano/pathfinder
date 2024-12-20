import React, { useState, useEffect } from "react";
import "../App.css"; // Stile e animazioni

const TreeAssistant = ({ isVisibleTree }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [lengthFilter, setLengthFilter] = useState(10);
  
  const trails = [
    { name: "Sentiero 1", difficulty: "Facile", length: 3 },
    { name: "Sentiero 2", difficulty: "Medio", length: 5 },
    { name: "Sentiero 3", difficulty: "Difficile", length: 10 },
    { name: "Sentiero 4", difficulty: "Facile", length: 2 },
    { name: "Sentiero 5", difficulty: "Medio", length: 4 },
    { name: "Sentiero 6", difficulty: "Difficile", length: 8 },
  ];

  // Genera suggerimenti iniziali
  useEffect(() => {
    generateSuggestions();
  }, [difficultyFilter, lengthFilter]);

  const generateSuggestions = () => {
    let filteredTrails = trails.filter((trail) => {
      const matchesDifficulty =
        difficultyFilter === "All" || trail.difficulty === difficultyFilter;
      const matchesLength = trail.length <= lengthFilter;
      return matchesDifficulty && matchesLength;
    });

    const randomSuggestions = filteredTrails
      .sort(() => 0.5 - Math.random()) // Mescola casualmente i percorsi
      .slice(0, 3); // Prendi i primi 3 percorsi

    setSuggestions(randomSuggestions);

    // Legge i suggerimenti a voce
    speakSuggestions(randomSuggestions);
  };

  const speakSuggestions = (suggestions) => {
    const synth = window.speechSynthesis;
    const message = `Ecco i percorsi consigliati: ${suggestions
      .map((trail) => `${trail.name}, difficoltà ${trail.difficulty}, lunghezza ${trail.length} chilometri`)
      .join(". ")}`;
    const utterance = new SpeechSynthesisUtterance(message);
    synth.speak(utterance);
  };

  return (
    <div className="tree-assistant-container">
      {isVisibleTree && (
        <div className="tree-assistant-popup">
          <div className="tree-assistant-content">
            <h2>Ciao, sono il tuo assistente Albero!</h2>
            <p>Filtra i percorsi in base alle tue preferenze:</p>
            
            {/* Filtri */}
            <div className="filters">
              <label>
                Difficoltà:
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option value="All">Tutte</option>
                  <option value="Facile">Facile</option>
                  <option value="Medio">Medio</option>
                  <option value="Difficile">Difficile</option>
                </select>
              </label>

              <label>
                Lunghezza massima (km):
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={lengthFilter}
                  onChange={(e) => setLengthFilter(e.target.value)}
                />
                {lengthFilter} km
              </label>
            </div>

            {/* Suggerimenti */}
            <p>Ecco alcuni percorsi che ti consiglio:</p>
            <ul>
              {suggestions.map((trail, index) => (
                <li key={index}>
                  <strong>{trail.name}</strong> - {trail.difficulty} - {trail.length} km
                </li>
              ))}
            </ul>

            <button className="generate-button" onClick={generateSuggestions}>
              Genera nuovi suggerimenti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeAssistant;
