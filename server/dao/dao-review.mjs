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

    this.getReviewsByTrail = (trail_id) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM Review WHERE trail_id = ?',
                [trail_id],
                (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(rows);
                }
            );
        });
    };

    this.getReviewsByUser = (user_id) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM Review WHERE user_id = ?',
                [user_id],
                (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(rows);
                }
            );
        });
    };

    this.deleteReview = (id) => {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM Review WHERE id = ?',
                [id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(null);
                }
            );
        });
    };

}