import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API";

const Profile = ({ user, setUser, setMod }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.logout();
      setUser(null); // Resetta l'utente
      navigate("/");
      setMod("map"); // Torna alla mappa
    } catch (err) {
      console.log("Errore durante il logout", err);
    }
  };


  if (!user) {
    return null; // Mostra nulla se non loggato
  }

  return (
    <div className="profile-container">
      <div className="profile-details">
        <h2>Benvenuto, {user.username}!</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
