import getDatabase from '@/hooks/database';

interface Review {  
    id: number;
    trail_id: number;
    user_id: number;
    rating: number;
    comment: string;
    username: string; // Opzionale, per la visualizzazione
}
const getReviews = async (trailId: number) => {
    try {
        const db = await getDatabase();
        
        // Controlla se il database è stato aperto correttamente
        if (!db) {
            console.error("Errore: Database non disponibile.");
            return [];
        }

        const sql = `
            SELECT r.id, r.trail_id, r.user_id, r.rating, r.comment, u.username 
            FROM Review r 
            INNER JOIN User u ON r.user_id = u.id 
            WHERE r.trail_id = ?`;

        const res = await db.getAllAsync(sql, [trailId]);

        // Se il risultato è vuoto, avvisa nei log
        if (!res || res.length === 0) {
            console.warn(`Nessuna review trovata per il trail con ID: ${trailId}`);
            return [];
        }

        // Mappiamo il risultato per restituire un array con i dati formattati
        return res.map((review: any) => ({
            id: review.id,
            trail_id: review.trail_id,
            user_id: review.user_id,
            username: review.username, // Nome utente incluso
            rating: review.rating,
            comment: review.comment
        }));

    } catch (error) { 
        console.error("Errore in getReviews:", error); 
        return []; // Ritorna un array vuoto per evitare crash
    }
};

const addReview = async (review:Review) => {
    try {
        const db = await getDatabase();
        const sql = "INSERT INTO Review (trail_id, user_id, rating, comment) VALUES (?,?,?,?)";
        await db.runAsync(sql,[review.trail_id, review.user_id, review.rating, review.comment]);
    } 
    catch (error) { console.log(error); }
};

export  { getReviews, addReview };