import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Polyline, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CiGps } from "react-icons/ci";
import API from '../API.mjs';
import { IoStop } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


import '../style/base.css';
import '../style/button.css';
import '../style/layout.css';
import '../style/map.css';
import '../style/modal.css';
import '../style/navigation.css';
import { use } from 'react';

const TrailPopup = ({ trailsAtStartpoint, onClose, onStartTrail, onReadMore, userPosition, setTrailActive }) => {
  const [isNearStartpoint, setIsNearStartpoint] = useState(false);
  const distanceThreshold = 1000; // Soglia di distanza in metri (ad esempio 100 metri)
  const navigate = useNavigate();

  // Funzione per calcolare la distanza tra la posizione dell'utente e il startpoint
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Raggio della Terra in metri
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distanza in metri
    return distance;
  };

  // Effetto per verificare la distanza dall'utente al startpoint
  useEffect(() => {
    if (userPosition) {
      trailsAtStartpoint.forEach((trail) => {

        const distance = calculateDistance(
          userPosition[0],
          userPosition[1],
          trail.startpoint[0],
          trail.startpoint[1]
        );
        console.log("Distanza:", distance);
        setIsNearStartpoint(distance <= distanceThreshold);

      });
    }
  }, [userPosition, trailsAtStartpoint]);

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
  
    return `${hours}h:${minutes}m:${seconds}s`;
  };

  return (
    <div>
      <div>
        <strong>Seleziona un Trail:</strong>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {trailsAtStartpoint.map((trail) => (
            <li key={trail.id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{trail.name}</strong>
                  <br />
                  Lunghezza: {trail.length.toFixed(2)} km
                  <br />
                  Durata: {formatDuration(trail.duration)}<br />
                </div>
                <div>
                  <button
                    onClick={() => {
                      onStartTrail(trail.id);
                      onClose()
                      setTrailActive(true);
                    }}
                    disabled={!isNearStartpoint} // Disabilita il tasto "Start" se non siamo vicini al punto di partenza
                  >
                    Start
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
      <button
          onClick={() =>{
            navigate(`/trails/${trailsAtStartpoint[0]?.startpoint.join(",")}`);
          }}
        >
          Read More
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

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
const CurrentPositionMarker = ({ position, setCoords, setMapLink }) => {
  useEffect(() => {
    if (position) {
      const [latitude, longitude] = position;
      setCoords({ lat: `${latitude}°`, long: `${longitude}°` });
      setMapLink(`https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`);
    }
  }, [position, setCoords, setMapLink]);

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

const TrailPath = ({ trail }) => {
  if (!trail || !trail.startpoint || !trail.endpoint) return null;
  trail.trails ? trail.trails : trail.trails = [trail.startpoint, trail.endpoint];
  return (
    <React.Fragment key={trail.id}>
      {/* Linea tratteggiata per il percorso */}
      <Polyline
        positions={trail.trails}
        color="black"
        weight={4}
        opacity={0.7}
        dashArray="5, 5" // Impostiamo la linea tratteggiata
      />
      
      {/* Marker per l'endpoint del trail */}
      <Marker
        position={trail.endpoint}
        icon={new L.DivIcon({
          className: 'custom-marker-icon',
          html: `
            <div style="
              width: 20px; 
              height: 20px; 
              border-radius: 50%; 
              background-color: #2ecc71; /* Verde */
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
        })}
      />
    </React.Fragment>
  );
};

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};


// Main Component: MapContainer
const MapContainer = ({mod, user}) => {
  const [position, setPosition] = useState(null);
  const [mapLink, setMapLink] = useState('');
  const [coords, setCoords] = useState({ lat: '', long: '' });
  const [sensorError, setSensorError] = useState(null);
  const [trails, setTrails] = useState([]); // Stato per i trail di base
  const [selectedStartpoint, setSelectedStartpoint] = useState(null); // Stato per il punto di partenza selezionato
  const [detailedTrail, setDetailedTrail] = useState(null); // Stato per il trail dettagliato
  const [trailsAtStartpoint, setTrailsAtStartpoint] = useState([]); // Stato per i trail al punto di partenza
  const [trailActive, setTrailActive] = useState(false); // Stato per il trail attivo
  const [simulatedPosition, setSimulatedPosition] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false); // Nuovo stato per il popup della recensione
  const [review, setReview] = useState({ rating: 0, comment: '' }); // Stato per il contenuto della recensione

  // Funzione per ottenere i trail di base
  useEffect(() => {
    const fetchBasicTrails = async () => {
      try {
        const basicTrails = await API.getTrails();
        setTrails(basicTrails);
      } catch (error) {
        console.error("Errore nel recupero dei trail di base:", error);
      }
    };

    fetchBasicTrails();
  }, [position]);

  useEffect(() => {
    let animationFrameId = null;
    if (trailActive && detailedTrail) {
      const path = detailedTrail.trails; // Array di punti del percorso
      let index = 0; // Inizia dal primo punto
      let startTime = null;

      const speedMetersPerSecond = 4 * 1000 / 3600; // 4 km/h in metri al secondo

      const moveToNextPoint = (timestamp) => {
        if (!startTime) startTime = timestamp;
      
        const currentPosition = path[index];
        const nextPosition = path[index + 1];
      
        if (index < path.length - 1) {
          const distance = calculateDistance(currentPosition, nextPosition); // Calcola la distanza tra i punti
          const travelTime = (distance / speedMetersPerSecond) * 1000; // Tempo necessario in millisecondi
      
          const elapsed = timestamp - startTime; // Tempo trascorso dall'inizio dell'interpolazione
          const fraction = Math.min(elapsed / travelTime, 1); // Percentuale del percorso completata
      
          // Interpola tra i due punti
          const interpolatedPosition = interpolatePosition(
            currentPosition,
            nextPosition,
            fraction
          );
          setSimulatedPosition(interpolatedPosition);
      
          if (fraction === 1) {
            // Passa al prossimo segmento
            startTime = null;
            index++;
          }
      
          // Controlla se il puntatore ha raggiunto l'endpoint
          const endpoint = path[path.length - 1];
          const distanceToEndpoint = calculateDistance(interpolatedPosition, endpoint);
      
          if (distanceToEndpoint < 5) { // Distanza in metri per considerare l'arrivo
            console.log("Raggiunto l'endpoint!");
            endTrail(); // Chiama la funzione endTrail
            return; // Interrompe l'animazione
          }
      
          // Richiede il prossimo frame
          animationFrameId = requestAnimationFrame(moveToNextPoint);
        }
      };
      // Avvia l'animazione
      animationFrameId = requestAnimationFrame(moveToNextPoint);

      // Pulizia
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [trailActive, detailedTrail]);

  const calculateDistance = (pointA, pointB) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371e3; // Raggio della Terra in metri
    const lat1 = toRadians(pointA[0]);
    const lon1 = toRadians(pointA[1]);
    const lat2 = toRadians(pointB[0]);
    const lon2 = toRadians(pointB[1]);
    const deltaLat = lat2 - lat1;
    const deltaLon = lon2 - lon1;
  
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distanza in metri
  };
  
  const interpolatePosition = (pointA, pointB, fraction) => {
    const lat = pointA[0] + (pointB[0] - pointA[0]) * fraction;
    const lon = pointA[1] + (pointB[1] - pointA[1]) * fraction;
    return [lat, lon];
  };
  
  // Funzione per ottenere i dettagli aggiuntivi del trail selezionato
  const fetchTrailDetails = async (trailStartpoint) => {
    try {
      const trailDetails = await API.getTrailsMoreInfo(trailStartpoint);
      setSelectedStartpoint(trailStartpoint);
      setTrailsAtStartpoint(trailDetails);
    } catch (error) {
      console.error("Errore nel recupero dei dettagli del trail:", error);
      setSelectedStartpoint(null);
    }
  };

  // Funzione per inviare la recensione
  const submitReview = async () => {
    try {
      // Simula una chiamata API per salvare la recensione
      const response = await API.submitReview({
        trailId: detailedTrail.id,
        userId: user.id,
        rating: review.rating,
        comment: review.comment,
      });
      console.log('Recensione inviata:', response);
    } catch (error) {
      console.error('Errore nell\'invio della recensione:', error);
    } finally {
      setShowReviewForm(false); // Chiudi il popup
      setReview({ rating: 0, comment: '' }); // Resetta il form
    }
  };
  

  // Funzione per caricare e visualizzare un trail completo
  const startTrail = async (trailId) => {
    try {
      const trailData = await API.getTrail(trailId);
      setDetailedTrail(trailData);
    } catch (error) {
      console.error("Errore nel caricamento del trail:", error);
    }
  };

  // Funzione per ottenere la posizione
  const getPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          setSensorError("Errore nella geolocalizzazione.");
        },
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: 10000,
        }
      );
    } else {
      setSensorError("Geolocalizzazione non supportata da questo browser.");
    }
  };

  useEffect(() => {
    getPosition();
  }, []);

  if (!position) return <div>Caricamento posizione...</div>;
 
  const handlePopupClose = () => {
    setSelectedStartpoint(null);
    setTrailsAtStartpoint([]);
  };

  const endTrail = () => {
    setTrailActive(false);
    setDetailedTrail(null);
    setShowReviewForm(true); // Mostra il popup
  };

  return (
    <div style={{ position: "relative" }}>
      <LeafletMap center={position} zoom={17} style={{ height: '100vh', width: '100%' }} zoomControl={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Posizione attuale */}
        <CurrentPositionMarker position={simulatedPosition || position} setCoords={setCoords} setMapLink={setMapLink} />

        {/* Marker per il punto di partenza */}
        {trails.map((trail) => ( <Marker key={trail.id} position={trail.startpoint} eventHandlers={{ click: () => fetchTrailDetails(trail.startpoint),}}/>))}

        {/* Popup per il punto di partenza selezionato */}
        {selectedStartpoint && (
            <Popup position={selectedStartpoint} onClose={handlePopupClose}>
              <TrailPopup
                trailsAtStartpoint={trailsAtStartpoint}
                onClose={handlePopupClose}  // Tasto Close nel Popup
                onStartTrail={startTrail}
                userPosition={position}
                setTrailActive={setTrailActive}
              />
            </Popup>
          )}

          {/* Aggiungi Polyline per ogni trail e endpoint */}
          {trailsAtStartpoint.map((trail) => (<TrailPath key={trail.id} trail={trail} />))}

          {/* Trail dettagliato */}
          {detailedTrail && <TrailPath key={detailedTrail.id} trail={detailedTrail} />}
          <div>
            {/* Bottone per recentrare */}
                     
            <RecenterButton position={position} mod = {mod} />

            
            {/*trailActive && (
            <button className="end-trail-button" onClick={endTrail} aria-label="End Trail">
              <IoStop className='nav-icon' />
            </button>
          )*/}
          
          {user && showReviewForm && (
            <Modal onClose={() => setShowReviewForm(false)}>
              <h2>Lascia una recensione</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitReview();
                }}
              >
                <div className="form-group">
                  <label>Valutazione:</label>
                  <select
                    value={review.rating}
                    onChange={(e) => setReview({ ...review, rating: e.target.value })}
                    required
                  >
                    <option value={0} disabled>Seleziona</option>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <option key={star} value={star}>
                        {`${star} Stelle`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Commento:</label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                    placeholder="Scrivi il tuo commento qui..."
                    required
                  />
                </div>
                <button type="submit">Invia Recensione</button>
              </form>
            </Modal>
          )}
          {!user && showReviewForm && (
            <Modal onClose={() => setShowReviewForm(false)}>
              <h2>Devi essere loggato per lasciare una recensione</h2>
            </Modal>
          )}
        </div>
      </LeafletMap>
    </div>
  );
};


export default MapContainer;
