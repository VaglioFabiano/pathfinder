import React, { useState } from "react";
import API from "../API"; // Assicurati di importare le funzioni API corrette
import backImage from '../assets/back.png'; // Importa l'immagine


const LoginForm = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(credentials);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

const RegisterForm = ({ onRegister }) => {
    const [newUser, setNewUser] = useState({ email: "", password: "", name: "", surname: "" });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onRegister(newUser);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Cognome"
          value={newUser.surname}
          onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
        <button type="submit">Register</button>
      </form>
    );
};

const AuthModal = ({ onLoginSuccess, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true); // Alterna tra Login e Registrazione
  const [message, setMessage] = useState("");

  const handleLogin = async (credentials) => {
    try {
      const user = await API.login(credentials);
      setMessage({ msg: `Benvenuto, ${user.username}!`, type: "success" });
      onLoginSuccess(user);
    } catch (err) {
      setMessage({ msg: "Errore durante il login. Verifica le credenziali.", type: "danger" });
    }
  };

  const handleRegister = async (newUser) => {
    try {
      const user = await API.register(newUser);
      setMessage({ msg: `Registrazione completata! Benvenuto, ${user.username}!`, type: "success" });
      onLoginSuccess(user);
    } catch (err) {
      setMessage({ msg: "Errore durante la registrazione. Riprova.", type: "danger" });
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === "auth-modal") {
      onClose(); // Chiude la modal se clicchi fuori
    }
  };

  return (
    <div className="auth-modal" onClick={handleOutsideClick}>
      <div className="auth-modal-content">
        {/* Bottone Indietro */}
        <img
          src={backImage}
          alt="Indietro"
          className="back-image"
          onClick={onClose}
        />

  
        {/* Messaggi */}
        {message && <div className={`alert ${message.type}`}>{message.msg}</div>}
  
        {/* Contenuto della Modal */}
        {isLoginMode ? (
          <>
            <h2>Login</h2>
            <LoginForm onLogin={handleLogin} />
            <p>
              Non hai ancora un account?{" "}
              <button onClick={() => setIsLoginMode(false)}>Registrati</button>
            </p>
          </>
        ) : (
          <>
            <h2>Registrati</h2>
            <RegisterForm onRegister={handleRegister} />
            <p>
              Hai già un account?{" "}
              <button onClick={() => setIsLoginMode(true)}>Accedi</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
  
};


export default AuthModal;
