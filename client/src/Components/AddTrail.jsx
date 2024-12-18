import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import TrailForm from "./TrailForm";
import { CiGps } from "react-icons/ci";
import { MapContainer as LeafletMap, TileLayer, Marker, Polyline, Popup, useMap,useMapEvents } from 'react-leaflet';

// Component: RecenterButton
const RecenterButton = ({ position, mod }) => {
  const [isClicked, setIsClicked] = useState(false);

  // Usa useMapEvents per gestire gli eventi della mappa
  const map = useMapEvents({
    locationfound(e) {
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const recenterMap = () => {
    if (position) {
      map.flyTo(position, 17); // Usa flyTo per un'animazione fluida
    }
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: mod === "add" ? "600px" : "250px", // Cambia posizione dinamicamente
        right: "20px",
        zIndex: 1000,
      }}
    >
      <button
        className={`recenter-button ${isClicked ? "clicked" : ""}`}
        onClick={recenterMap}
      >
        <CiGps className="nav-icon" />
      </button>
    </div>
  );
};

// Component: CurrentPositionMarker
const CurrentPositionMarker = ({ position }) => {


const customMarkerIcon = new L.DivIcon({
  className: 'custom-marker-icon',
  html: `
    <div style="
      width: 20px; 
      height: 20px; 
      border-radius: 50%; 
      background-color: #3498db; 
      position: relative;">
      <div style="
        width: 8px; 
        height: 8px; 
        border-radius: 50%; 
        background-color: white; 
        position: absolute; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%);">
      </div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

if (!position) return null;

return <Marker position={position} icon={customMarkerIcon} />;
};

const AddTrail = ({ mod }) => {
  const [isActive, setIsActive] = useState(false);
  const [isRecap, setIsRecap] = useState(false);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [downhill, setDownhill] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [positions, setPositions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState([0, 0]);
  const [animatedPosition, setAnimatedPosition] = useState(null);
  const mapRef = useRef(null); // Aggiunto riferimento alla mappa

  // Funzione per ottenere la posizione iniziale
  const getPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentPosition([latitude, longitude]);
          setPositions([[latitude, longitude]]); // Inizializza con la posizione attuale
        },
        (error) => {
          console.error("Errore nella geolocalizzazione:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      );
    } else {
      console.error("Geolocalizzazione non supportata dal browser.");
    }
  };

  useEffect(() => {
    getPosition();
  }, []);

  const speedInKmPerSecond = 4 / 3600; // Velocità di 4 km/h in km/s
  const intervalDuration = 30; // Intervallo di 30 secondi

  useEffect(() => {
    let generalInterval = null;
    let positionInterval = null;

    if (isActive) {
      // Reimposta la vista della mappa sulla posizione corrente
      if (mapRef.current) {
        mapRef.current.setView(currentPosition, 20); // Centra la mappa sul cursore
      }

      // Aggiorna tempo e distanza ogni secondo
      generalInterval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        setDistance((prevDistance) => prevDistance + speedInKmPerSecond);

        // Simula dislivello e discesa
        setElevation((prevElevation) => prevElevation + Math.random() * 0.005);
        setDownhill((prevDownhill) => prevDownhill + Math.random() * 0.01);
      }, 1000);

      // Aggiorna la posizione ogni 30 secondi
      positionInterval = setInterval(() => {
        setPositions((prevPositions) => {
          const lastPosition = prevPositions[prevPositions.length - 1] || currentPosition;
          const newPosition = [
            lastPosition[0] + Math.random() * 0.0003, // Piccolo spostamento in latitudine
            lastPosition[1] + Math.random() * 0.0003, // Piccolo spostamento in longitudine
          ];
          setCurrentPosition(newPosition);
          return [...prevPositions, newPosition];
        });
      }, intervalDuration * 1000);
    }

    return () => {
      clearInterval(generalInterval);
      clearInterval(positionInterval);
    };
  }, [isActive, currentPosition]);

  useEffect(() => {
    if (isActive && positions.length > 1) {
      moveCursor();
    }
  }, [isActive, positions]);

  // Funzione per animare il cursore tra le posizioni
  const moveCursor = () => {
    let startTimestamp = null;
    let currentIndex = 0;

    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsedTime = timestamp - startTimestamp;
      const travelTime = 1000;

      if (elapsedTime > travelTime) {
        startTimestamp = timestamp;
        currentIndex++;
      }

      if (currentIndex < positions.length - 1) {
        const start = positions[currentIndex];
        const end = positions[currentIndex + 1];
        const fraction = Math.min((elapsedTime % travelTime) / travelTime, 1);
        const interpolatedPosition = [
          start[0] + (end[0] - start[0]) * fraction,
          start[1] + (end[1] - start[1]) * fraction,
        ];

        setAnimatedPosition(interpolatedPosition);
      }

      if (currentIndex < positions.length - 1) {
        requestAnimationFrame(animate);
      }
    };
    if (positions.length > 1) {
      requestAnimationFrame(animate);
    }
  };

  const endTrail = () => {
    setIsActive(false);
    setIsRecap(true);
  };

  const resetTrail = () => {
    setTime(0);
    setDistance(0);
    setDownhill(0);
    setElevation(0);
    setPositions([]);
    getPosition();
    setIsRecap(false);
  };

  const startTrail = (position) => {
    setIsActive(true);
    const map = useMapEvents({
      locationfound(e) {
        map.flyTo(e.latlng, map.getZoom());
      },
    });
  
    const recenterMap = () => {
      if (position) {
        map.flyTo(position, 20); // Usa flyTo per un'animazione fluida
      }
    };

    recenterMap();

  };

  const calculateAverageSpeed = () => (distance / (time / 3600)).toFixed(2);

  return (
    <>
      {currentPosition.length > 0 && currentPosition[0] !== 0 && currentPosition[1] !== 0 ? (
        <LeafletMap center={currentPosition} zoom={17} style={{ height: '100vh', width: '100%' }} zoomControl={false} ref={mapRef} >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <CurrentPositionMarker position={currentPosition || animatedPosition} />
          <RecenterButton position={currentPosition} mod={mod} />
        </LeafletMap>
      ) : (
        <div>Loading map...</div>
      )}
      <div className="trail-component">
        {!isActive && !isRecap && ( <button className="start-button" onClick={() => startTrail(currentPosition)}> Inizia Percorso</button> )}

        {isActive && (
          <div className="active-container">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h2>{Math.floor(time / 60)}m {time % 60}s</h2>
                <p>Tempo</p>
              </div>
              <div>
                <h2>{distance.toFixed(2)} km</h2>
                <p>Distanza</p>
              </div>
            </div>
            <div>
              <p>Discesa: {downhill.toFixed(2)} m</p>
              <p>Elevazione: {elevation.toFixed(2)} m</p>
              <p>Velocità: {calculateAverageSpeed()} km/h</p>
            </div>
            <button className="end-button" onClick={endTrail}> Termina </button>
          </div>
        )}

        {isRecap && (
          <div className="recap-container">
            <h2>Recap Percorso</h2>
            <p>Tempo: {Math.floor(time / 60)}m {time % 60}s</p>
            <p>Distanza: {distance.toFixed(2)} km</p>
            <p>Velocità Media: {calculateAverageSpeed()} km/h</p>
            <p>Elevazione Totale: {elevation.toFixed(2)} m</p>
            <p>Discesa Totale: {downhill.toFixed(2)} m</p>
            <TrailForm distance={distance} duration={time} elevation={elevation} downhill={downhill} positions={positions} onSave={() => {resetTrail();}}/>
          </div>
        )}
      </div>
    </>
  );
};


export default AddTrail;
