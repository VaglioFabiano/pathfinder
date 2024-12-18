import db from "../db.mjs";

export default function ReviewDAO() {
    this.submitReview = (review) => {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO Review (user_id, trail_id,  rating, comment) VALUES (?, ?, ?, ?)', 
                [review.user_id, review.trail_id, review.rating, review.comment], 
                function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ id: this.lastID });
            });
        });
    };
}