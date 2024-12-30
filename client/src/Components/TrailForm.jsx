import React, { useState, useEffect } from "react";
import API from "../API.mjs";


const TrailForm = ({ distance, duration, elevation, downhill, positions, onSave }) => {
    const [name, setName] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
  
    const handleImageCapture = (e) => {
      const files = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...files]);
    };
    const handleFileInputClick = () => {
      document.getElementById("file-input").click();
    };
    const getLocationDetails = async (latitude, longitude) => {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        const state = data.address.country;
        const region = data.address.state;
        const province = data.address.county;
        const city = data.address.city || data.address.town || data.address.village;
    
        return { state, region, province, city };
      } catch (error) {
        console.error("Errore durante il reverse geocoding:", error);
        return null;
      }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
    
        const {state, region,province, city} = await getLocationDetails(positions[0][0], positions[0][1]);

        console.log(state, region, province, city);

        formData.append("trail", JSON.stringify({
          name,
          difficulty,
          description,
          length: distance.toFixed(2),
          duration,
          elevation,
          downhill,
          startpoint: positions[0],
          endpoint: positions[positions.length - 1],
          trails: positions,
          state: state,
          region: region,
          province: province,
          city: city
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