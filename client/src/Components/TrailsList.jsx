import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../API.mjs";
import { useState } from "react";

const TrailsList = () => {
  const { startpoint } = useParams();
 const [trails, setTrails] = useState([]);
  const [reviewsByTrail, setReviewsByTrail] = useState({});
  const [newReviews, setNewReviews] = useState({});
  const [selectedTrail, setSelectedTrail] = useState(null);

    
  // Filtra i trail relativi allo startpoint specifico
  
  useEffect(() => {
    const fetchTrailsData = async () => {
      try {
        const trailDetails = await API.getTrailsMoreInfo(startpoint);
        setTrails(trailDetails);

        // Pre-carica le recensioni per ogni trail
        const reviewsPromises = trailDetails.map((trail) =>
          API.getReviewsByTrail(trail.id).then((reviews) => ({
            trailId: trail.id,
            reviews,
          }))
        );

        const reviewsData = await Promise.all(reviewsPromises);
        const reviewsMap = reviewsData.reduce((acc, { trailId, reviews }) => {
          acc[trailId] = reviews;
          return acc;
        }, {});

        setReviewsByTrail(reviewsMap);
      } catch (error) {
        console.error("Errore durante il recupero dei trail o delle recensioni:", error);
      }
    };

    fetchTrailsData();
  }, [startpoint]);

  const handleReviewChange = (trailId, field, value) => {
    setNewReviews((prev) => ({
      ...prev,
      [trailId]: {
        ...prev[trailId],
        [field]: value,
      },
    }));
  }; 

  const handleSubmitReview = async (trailId) => {
    const { comment, rating } = newReviews[trailId] || {};
    if (!comment || !rating) {
      alert("Inserisci un commento e una valutazione.");
      return;
    }

    const review = {
      trail_id: trailId,
      user_id: 1, // Da sostituire con l'ID utente reale
      rating,
      comment,
    };

    try {
      await API.submitReview(review);

      setReviewsByTrail((prev) => ({
        ...prev,
        [trailId]: [...(prev[trailId] || []), review],
      }));

      setNewReviews((prev) => ({
        ...prev,
        [trailId]: { comment: "", rating: 0 },
      }));
    } catch (error) {
      console.error("Errore nell'invio della recensione:", error);
      alert("Errore nell'invio della recensione.");
    }
  };
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>Trails per Startpoint: {startpoint}</h1>
      {trails.map((trail) => (
        <div key={trail.id} style={{ marginBottom: "40px" }}>
          {/* Dettagli del Trail */}
          <h2>{trail.name}</h2>
          <p>
            <strong>Descrizione:</strong> {trail.description}<br />
            <strong>Lunghezza:</strong> {trail.length} km<br />
            <strong>Durata:</strong> {trail.duration} ore<br />
            <strong>Difficoltà:</strong> {trail.difficulty}<br />
            <strong>Dislivello:</strong> {trail.downhill} m<br />
          </p>

          {/* Immagini */}
          {trail.images && trail.images.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h4>Immagini del Trail:</h4>
              {trail.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Immagine del trail ${trail.name}`}
                  style={{ width: "100%", maxWidth: "500px", margin: "10px 0" }}
                />
              ))}
            </div>
          )}

          {/* Aggiungi Recensione */}
          <div style={{ marginBottom: "20px" }}>
            <h3>Aggiungi una recensione</h3>
            <textarea
              value={newReviews[trail.id]?.comment || ""}
              onChange={(e) =>
                handleReviewChange(trail.id, "comment", e.target.value)
              }
              placeholder="Scrivi il tuo commento..."
              rows="4"
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <div style={{ marginBottom: "10px" }}>
              <label>
                Valutazione:{" "}
                <input
                  type="number"
                  value={newReviews[trail.id]?.rating || 0}
                  onChange={(e) =>
                    handleReviewChange(trail.id, "rating", Number(e.target.value))
                  }
                  min="1"
                  max="5"
                  style={{ width: "50px" }}
                />
                /5
              </label>
            </div>
            <button onClick={() => handleSubmitReview(trail.id)}>
              Invia Recensione
            </button>
          </div>

          {/* Lista delle Recensioni */}
          <h3>Recensioni</h3>
          {reviewsByTrail[trail.id]?.length > 0 ? (
            <ul>
              {reviewsByTrail[trail.id].map((review, index) => (
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
      ))}
    </div>
  );
};

export default TrailsList;
