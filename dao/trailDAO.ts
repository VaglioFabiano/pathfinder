import getDatabase from '@/hooks/database';

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface Trail {
    name: string;
    downhill: number;
    difficulty: string;
    length: number;
    duration: number;
    elevation: number;

    startpoint: Coordinate;
    trail: Coordinate[];
    endpoint: Coordinate;

    description: string;
    image: string;

    city: string;
    region: string;
    state: string;
    province: string;

    activity: string;
}
  

const getTrails = async () => {
   try {
    const db = await getDatabase();
    const sql = "SELECT id, name, length, duration, startpoint, difficulty, activity FROM Trail";
    const result = await db.getAllAsync(sql,[]);

    const returnResult = result.map((trail: any) => ({
        id: trail.id,
        name: trail.name,
        length: trail.length,
        duration: trail.duration,
        startpoint: JSON.parse(trail.startpoint), 
        difficulty: trail.difficulty,
        activity: trail.activity,
      }));

      returnResult.forEach((trail: any) => {
        trail.startpoint = {
          latitude: trail.startpoint[0],
          longitude: trail.startpoint[1]
        };
      });
      
    return returnResult;

    } 
    catch (error) { console.log(error); }
};

const getTrail = async (id: number) => {
    try {
        const db = await getDatabase();
        const sql = "SELECT * FROM Trail WHERE id = ?";
        const res = await db.getAllAsync(sql, [id]);
        
        const result = res[0];
        

        result.startpoint = JSON.parse(result.startpoint);
        result.trails = JSON.parse(result.trails);
        result.endpoint = JSON.parse(result.endpoint);
        

        result.startpoint = {
            latitude: result.startpoint[0],
            longitude: result.startpoint[1]
        };
        result.trail = result.trails.map((point: any) => ({
            latitude: point[0],
            longitude: point[1]
        }));
        result.endpoint = {
            latitude: result.endpoint[0],
            longitude: result.endpoint[1]
        };
        return result;
    } catch (error) {
        console.log(error);
    }
}

const createTrail = async (trail: Trail) => {
    try {
        const db = await getDatabase();


        const sql = `INSERT INTO Trail 
        (name, downhill, difficulty, length, duration, elevation, startpoint, trails, endpoint, description, image, city, region, state, province, activity, id_user) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        
        
        await db.runAsync(sql, [
          trail.name,
          trail.downhill,
          trail.difficulty,
          trail.length,
          trail.duration,
          trail.elevation,
          JSON.stringify(trail.startpoint),
          JSON.stringify(trail.trail),  
          JSON.stringify(trail.endpoint),
          trail.description,
          trail.image,
          trail.city,
          trail.region,
          trail.state,
          trail.province,
          trail.activity,
          1
        ]);
    } catch (error) {
        console.log(error);
    }
}

const getTrailsCreatedByUsers = async (id_user: number): Promise<Trail[]> => {
    try {
      const db = await getDatabase();
      const sql = "SELECT * FROM Trail WHERE id_user = ?";
      const res = await db.getAllAsync(sql, [id_user]);
  
      if (!res || res.length === 0) {
        console.warn("Nessun trail trovato per l'utente:", id_user);
        return [];
      }
  
      return res.map((trail: any) => ({
        id: trail.id,
        name: trail.name,
        length: trail.length,
        duration: trail.duration,
        description: trail.description,
        elevation: trail.elevation,
        difficulty: trail.difficulty,
        activity: trail.activity,
      }));
    } catch (error) {
      console.error("Errore in getTrailsUsers:", error);
      return [];
    }
}

const getTrailsDoneByUsers = async (id_user: number): Promise<Trail[]> => {
    try {
        const db = await getDatabase();
        const sql = "SELECT id_trail FROM TrailDone WHERE id_user = ?";
        const res = await db.getAllAsync(sql, [id_user]);

        if (!res || res.length === 0) {
            console.warn("Nessun trail trovato per l'utente:", id_user);
            return [];
        }

        const trailIds = res.map((row: any) => row.id_trail);
        
        if (trailIds.length === 0) return [];

        const sql2 = `SELECT * FROM Trail WHERE id IN (${trailIds.map(() => '?').join(', ')})`;
        const trails = await db.getAllAsync(sql2, trailIds);

        return trails.map((trail: any) => ({
            id: trail.id,
            name: trail.name,
            length: trail.length,
            duration: trail.duration,
            description: trail.description,
            elevation: trail.elevation,
            difficulty: trail.difficulty,
            activity: trail.activity,
        }));
        
    } catch (error) {
        console.error("Errore in getTrailsDoneByUsers:", error);
        return [];
    }
};

  
  

export {getTrails, getTrail, createTrail, getTrailsCreatedByUsers, getTrailsDoneByUsers};



