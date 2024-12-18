import React, { useState } from 'react';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Home from './Components/Home';
import BottomNavigation from './Components/BottomNavigation';
import './App.css';
import TrailsList from './Components/TrailsList';
import AddTrail from './Components/AddTrail';
import Tutorial from './Components/Tutorial';
import Profile from './Components/Profile';
import AuthModal from './Components/AuthModal'; // Componente per autenticazione

const App = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [mod, setMod] = useState("map");
  const [user, setUser] = useState(null); // Stato utente loggato

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser); // Salva l'utente loggato
    setMod("map"); // Torna alla mappa
  };

  return (
    <div className={isMobile ? 'mobileContainer' : 'container'}>
      <Routes>
        <Route path="/" element={<Layout mod={mod} setMod={setMod} user={user} onLoginSuccess={handleLoginSuccess} />}>
          <Route index element={<Home mod={mod} user={user} />} />
          <Route path="/trails/:startpoint" element={<TrailsList />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} setMod={setMod} />} />
          <Route path="*" element={<NOT_FOUND isMobile={isMobile} />} />
        </Route>
      </Routes>
    </div>
  );
};

const NOT_FOUND = (props) => (
  <div className={props.isMobile ? 'mobile-not-found' : 'not-found'}>
    <h1>404 - Pagina non trovata</h1>
  </div>
);

const Layout = ({ mod, setMod, user, onLoginSuccess }) => {
  return (
    <div className="layout">
      <div className="content">
        
        {mod === "add" ? (
            <AddTrail mod={mod} />
        ): <Outlet />}
      </div>

      {/* Modale Auth per login/register */}
      {mod === "profile" && !user && (
        <AuthModal onLoginSuccess={onLoginSuccess} onClose={() => setMod("map")} />
      )}

      <div className="bottom-container">
        {mod !== "profile" && <Tutorial mod={mod} />}
        <div className="bottom-nav">
          <BottomNavigation mod={mod} setMod={setMod} user={user} />
        </div>
      </div>
    </div>
  );
};

export default App;
