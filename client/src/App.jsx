import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import './App.css';
import Home from './Components/Home';
import BottomNavigation from './Components/BottomNavigation';
import TrailsList from './Components/TrailsList';
import AddTrail from './Components/AddTrail';
import Tutorial from './Components/Tutorial';
import Profile from './Components/Profile';
import AuthModal from './Components/AuthModal';
import TreeAssistant from './Components/TreeAssistant';
import SearchBar from './Components/SearchBar';
import { CiGps } from "react-icons/ci";

const App = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [mod, setMod] = useState("map");
  const [user, setUser] = useState(null);
  const [isVisibleTree, setIsVisibleTree] = useState(false);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setMod("map");
    console.log("Utente loggato:", loggedInUser);
  };

  return (
    <div className={isMobile ? 'mobileContainer' : 'container'}>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              mod={mod}
              setMod={setMod}
              user={user}
              onLoginSuccess={handleLoginSuccess}
              isVisibleTree={isVisibleTree}
              setIsVisibleTree={setIsVisibleTree}
            />
          }
        >
          <Route index element={<Home mod={mod} user={user} />} />
          <Route path="/trails/:id" element={<TrailsList />} />
          <Route
            path="/profile"
            element={<Profile user={user} setUser={setUser} setMod={setMod} />}
          />
          <Route path="*" element={<NOT_FOUND isMobile={isMobile} />} />
        </Route>
      </Routes>
    </div>
  );
};

const NOT_FOUND = ({ isMobile }) => (
  <div className={isMobile ? 'mobile-not-found' : 'not-found'}>
    <h1>404 - Pagina non trovata</h1>
  </div>
);

const Layout = ({ mod, setMod, user, onLoginSuccess, isVisibleTree, setIsVisibleTree }) => {
  return (
    <div className="layout">
      <div className="content">
        {mod === "add" ? <AddTrail mod={mod} /> : <MapWithSearch />}
      </div>
      {mod === "profile" && !user && (
        <AuthModal onLoginSuccess={onLoginSuccess} onClose={() => setMod("map")} />
      )}
      <div className="bottom-container">
        {mod !== "profile" && <Tutorial mod={mod} />}
        {isVisibleTree && <TreeAssistant isVisibleTree={isVisibleTree} />}
        <div className="bottom-nav">
          <BottomNavigation
            mod={mod}
            setMod={setMod}
            user={user}
            setIsVisibleTree={setIsVisibleTree}
          />
        </div>
      </div>
    </div>
  );
};

function MapWithSearch() {
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]); // Imposta la posizione dell'utente
          setIsLocationLoaded(true); // Segna che la posizione è stata caricata
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location.");
          setIsLocationLoaded(true); // Anche in caso di errore, permette di mostrare la mappa con un centro predefinito
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocationLoaded(true); // In caso di mancato supporto, mostra la mappa con un centro predefinito
    }
  }, []);

  // Mostra un messaggio di caricamento fino a quando la posizione non è stata caricata
  if (!isLocationLoaded) {
    return <div style={{ textAlign: "center", marginTop: "20px" }}>Loading map...</div>;
  }

  return (
    <MapContainer
      center={userLocation || [41.9028, 12.4964]} // Usa la posizione dell'utente o Roma come fallback
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
      zoomControl={false} // Disabilita il controllo dello zoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {userLocation && <CurrentPositionMarker position={userLocation} />}
      <SearchBarWrapper />
      <RecenterButton userLocation={userLocation} />
    </MapContainer>

  );
}


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

// Wrapper per la barra di ricerca
function SearchBarWrapper() {
  const map = useMap();
  return <SearchBar map={map} />;
}

// Pulsante per recentrare la mappa
function RecenterButton({ userLocation }) {
  const map = useMap();

  const handleRecenter = () => {
    if (userLocation) {
      map.flyTo(userLocation, 17); // Recentra la mappa
    } else {
      alert("Your location is not available.");
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "150px", // Altezza verticale
        right: "10px",   // Distanza dal lato destro
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleRecenter}
        style={{
          width: "60px",
          height: "60px",
          backgroundColor: "#1E2A39",
          border: "none",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          cursor: "pointer",
        }}
      >
        <CiGps style={{ color: "#FFFFFF", fontSize: "28px" }} />
      </button>
    </div>
  );
}

export default App;
