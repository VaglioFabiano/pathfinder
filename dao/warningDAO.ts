import getDatabase from '@/hooks/database';

interface Warning {  
    trail_id: number;
    position: [number, number];
    description: string;
}
const getWarning = async (id:number) => {
    try {
        const db = await getDatabase();
        const sql = "SELECT * FROM Warning WHERE id_trail = ?";
        const res = await db.getAllAsync(sql,[id]);

        console.log(res);

        
        const result = res.map((warning:any) => ({
            trail_id: warning.trail_id,
            position: JSON.parse(warning.position),
            description: warning.description
        }));
        return result;
    } 
    catch (error) { console.log(error); }
};

const addWarning = async (warning:Warning) => {
    try {
        const db = await getDatabase();
        const sql = "INSERT INTO Warning (id_trail, position, description) VALUES (?,?,?)";
        await db.runAsync(sql,[warning.trail_id,JSON.stringify(warning.position), warning.description]);
    } 
    catch (error) { console.log(error); }
};

export  { getWarning, addWarning };