import getDatabase from '@/hooks/database';

interface Review {  
    id: number;
    trail_id: number;
    user_id: number;
    rating: number;
    comment: string;
}
const getReviews = async (id:number) => {
    try {
        const db = await getDatabase();
        const sql = "SELECT * FROM Review WHERE trail_id = ?";
        const res = await db.getAllAsync(sql,[id]);
        const result = res.map((review: Review) => ({
            id: review.id,
            trail_id: review.trail_id,
            user_id: review.user_id,
            rating: review.rating,
            comment: review.comment
        }));
        return result;
    } 
    catch (error) { console.log(error); }
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