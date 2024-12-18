import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";
import { GiTrail, GiDekuTree } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import API from "../API.mjs";
import AuthModal from "./AuthModal"; // Importa il componente AuthModal


import '../style/base.css';
import '../style/button.css';
import '../style/layout.css';
import '../style/map.css';
import '../style/modal.css';
import '../style/navigation.css';


function BottomNavigation(props) {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false); // Stato per il popup

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const u = await API.getUserInfo();
        setUser(u);
      } catch (err) {
        console.log("Utente non autenticato", err);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser); // Salva i dettagli dell'utente loggato
    setShowAuthModal(false); // Chiudi il popup dopo il login
  };

  const handleProfileClick = () => {
    if (user) {
      // Utente loggato: vai alla pagina del profilo
      props.setMod("profile");
      navigate(`/profile`);
    } else {
      // Utente non loggato: mostra il popup di autenticazione
      setShowAuthModal(true);
    }
  };

  return (
    <div className="bottom-navigation">
      <button className="nav-button">
        <FaMapMarkedAlt
          className="nav-icon"
          onClick={() => {
            props.setMod("map");
            navigate(`/`);
          }}
        />
      </button>
      <button className="nav-button">
        <GiTrail
          className="nav-icon"
          onClick={() => {
            props.setMod("add");
          }}
        />
      </button>
      <button className="nav-button">
        <GiDekuTree className="nav-icon" />
      </button>
      <button className="nav-button">
        <FaUser className="nav-icon" onClick={handleProfileClick} />
      </button>

      {showAuthModal && (
        <AuthModal
          onLoginSuccess={handleLoginSuccess} // Gestisce il successo del login
          onClose={() => setShowAuthModal(false)} // Chiude il popup
        />
      )}
    </div>
  );
}

export default BottomNavigation;
