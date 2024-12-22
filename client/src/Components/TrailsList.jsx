import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../API.mjs";
import { useState } from "react";

const TrailsList = () => {
  const { startpoint } = useParams();
    const [trailsAtStartpoint, setTrailsAtStartpoint] = useState([]);
    
  // Filtra i trail relativi allo startpoint specifico
  useEffect(() => {
    const fetchTrailDetails = async () => {
        try {
            const trailDetails = await API.getTrailsMoreInfo(startpoint);
            console.log("Dettagli del trail:", trailDetails);
            setTrailsAtStartpoint(trailDetails);
        } catch (error) {
          console.error("Errore nel recupero dei dettagli del trail:", error);
          setSelectedStartpoint(null);
        }
      };
    
    fetchTrailDetails();
  }, [startpoint]);
  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
  
    return `${hours}h:${minutes}m:${seconds}s`;
  };
  
  return (
    <div>
      <h1>Trail per Startpoint: {startpoint}</h1>
      <ul>
        {trailsAtStartpoint.map((trail) => (
          <li key={trail.id}>
            <h3>{trail.name}</h3>
            <p>
              Lunghezza: {trail.length.toFixed(2)} km<br />
              Durata: {formatDuration(trail.duration)}<br />
              Difficoltà: {trail.difficulty}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrailsList;
