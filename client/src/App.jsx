import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa'; // Importa l'icona
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
import API from './API.mjs'; // Importa l'API per i trail

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
              setUser={setUser}
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

const Layout = ({ mod, setMod, user, onLoginSuccess, isVisibleTree, setIsVisibleTree,setUser }) => {
  return (
    <div className="layout">
      <div className="content">
        {mod === "add" ? <AddTrail mod={mod} /> : <Outlet />}
      </div>
      {mod === "profile" && !user && (<AuthModal onLoginSuccess={onLoginSuccess} setUser={setUser} onClose={() => setMod("map")} />)}
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
export default App;
