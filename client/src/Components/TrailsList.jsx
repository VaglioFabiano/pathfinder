import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../API.mjs";
const SERVER_URL = 'http://localhost:3001';

const TrailDetails = () => {
  const { id } = useParams();
  const [trail, setTrail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });

  useEffect(() => {
    const fetchTrailData = async () => {
      try {
        const trailDetails = await API.getTrail(id);
        setTrail(trailDetails); // Prendiamo il primo (unico) trail
        console.log("TrailDetails:", trailDetails);
        const trailReviews = await API.getReviewsByTrail(trailDetails.id);
        setReviews(trailReviews);
      } catch (error) {
        console.error("Errore durante il recupero del trail o delle recensioni:", error);
      }
    };

    fetchTrailData();
  }, []);

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    return `${hours}h:${minutes}m:${seconds}s`;
  };

  const handleReviewChange = (field, value) => {
    setNewReview((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitReview = async () => {
    const { comment, rating } = newReview;
    if (!comment || !rating) {
      alert("Inserisci un commento e una valutazione.");
      return;
    }

    const review = {
      trail_id: trail.id,
      user_id: 1, // Da sostituire con l'ID utente reale
      rating,
      comment,
    };

    try {
      await API.submitReview(review);
      setReviews((prev) => [...prev, review]);
      setNewReview({ comment: "", rating: 0 });
    } catch (error) {
      console.error("Errore nell'invio della recensione:", error);
      alert("Errore nell'invio della recensione.");
    }
  };

  if (!trail) {
    return <p>Caricamento delle informazioni del trail...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{trail.name}</h2>
      <p>
        <strong>Descrizione:</strong> {trail.description}<br />
        <strong>Lunghezza:</strong> {trail.length.toFixed(2)} km<br />
        <strong>Durata:</strong> {formatDuration(trail.duration)}<br />
        <strong>Difficoltà:</strong> {trail.difficulty}<br />
        <strong>Dislivello:</strong> {trail.downhill.toFixed(2)} m<br />
      </p>

      {trail.images && (
        <div style={{ marginBottom: "20px" }}>
          <h4>Immagini del Trail:</h4>
         
            <img
              src={`http://localhost:3001/${trail.images}`}
              alt={`Immagine del trail ${trail.name}`}
              style={{ width: "100%", maxWidth: "500px", margin: "10px 0" }}
            />
          
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <h3>Aggiungi una recensione</h3>
        <textarea
          value={newReview.comment}
          onChange={(e) => handleReviewChange("comment", e.target.value)}
          placeholder="Scrivi il tuo commento..."
          rows="4"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <div style={{ marginBottom: "10px" }}>
          <label>
            Valutazione:{" "}
            <input
              type="number"
              value={newReview.rating}
              onChange={(e) => handleReviewChange("rating", Number(e.target.value))}
              min="1"
              max="5"
              style={{ width: "50px" }}
            />
            /5
          </label>
        </div>
        <button onClick={handleSubmitReview}>Invia Recensione</button>
      </div>

      <h3>Recensioni</h3>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <strong>Utente:</strong> {review.user_id}<br />
              <strong>Voto:</strong> {review.rating}/5<br />
              <strong>Commento:</strong> {review.comment}
            </li>
          ))}
        </ul>
      ) : (
        <p>Non ci sono recensioni per questo trail.</p>
      )}
    </div>
  );
};

export default TrailDetails;
