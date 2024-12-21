import React, { useState, useEffect } from "react";
import API from "../API.mjs";


const TrailForm = ({ distance, duration, elevation, downhill, positions, onSave }) => {
    const [name, setName] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
  
    //funzione per gestire immagini scelte dalla galleria o scattate con la fotocamera
    const handleImageCapture = (e) => {
      const files = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...files]);
    };
  
    const handleFileInputClick = () => {
      document.getElementById("file-input").click();
    };
  
    const handleSubmit = async () => {
      const formData = new FormData();

      formData.append("trail", JSON.stringify({
        name,
        difficulty,
        description,
        length: distance,
        duration,
        elevation,
        downhill,
        startpoint: positions[0],
        endpoint: positions[positions.length - 1],
        trails: positions,
      }));

      images.forEach((image) => {
        formData.append("image", image);
      });
      
      await API.saveTrail(formData);
      onSave();
  };
  
    return (
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div>
        <button type="submit">Salva Trail</button>

          <label>Nome del Trail:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Difficoltà:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Easy">Facile</option>
            <option value="Intermediate">Intermedio</option>
            <option value="Hard">Difficile</option>
          </select>
        </div>
        <div>
          <label>Descrizione:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
        <label>Foto:</label>
          <button
            type="button"
            onClick={handleFileInputClick}
            style={{
              backgroundColor: "#3498db",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              margin: "10px 0",
            }}
          >
            Inserisci Foto
          </button>
          {/* Input nascosto */}
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageCapture}
            style={{ display: "none" }}
            multiple
          />
        </div>
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Trail Img ${index}`}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />
          ))}
        </div>
      </form>
    );
  };
  export default TrailForm