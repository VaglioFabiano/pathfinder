import getDatabase from '@/hooks/database';
import * as WarningTrail from '@/dao/warningDAO';

interface Coordinate {
    latitude: number;
    longitude: number;
}
interface Warning {  
    trail_id: number;
    position: [number, number];
    description: string;
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
    //warning: Warning;
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
        
        //const warnings = await WarningTrail.getWarning(id);
        
        /*const warning = warnings.map((warning: Warning) => ({
            trail_id: warning.trail_id,
            position: {
                latitude: warning.position[0],
                longitude: warning.position[1]
            },
            description: warning.description
        }));*/

        const result = res[0];
        
        //result.warning = warning;

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

import * as FileSystem from 'expo-file-system';

const saveImagePermanently = async (imageUri: string): Promise<string> => {
    try {
        const fileName = imageUri.split('/').pop(); // Estrai il nome del file
        const newPath = `${FileSystem.documentDirectory}${fileName}`; // Percorso permanente

        await FileSystem.moveAsync({
            from: imageUri,
            to: newPath,
        });

        return newPath; // Restituisce il nuovo percorso dell'immagine
    } catch (error) {
        console.error("Errore nel salvataggio dell'immagine:", error);
        return imageUri; // Se fallisce, usa il percorso originale
    }
};

const createTrail = async (trail: Trail) => {
    try {
        const db = await getDatabase();

        // Salva l'immagine in una posizione permanente
        const newImagePath = await saveImagePermanently(trail.image);

        console.log("Nuovo percorso dell'immagine:", newImagePath);

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
            newImagePath ? newImagePath : null, // Salva solo il path
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
};

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
        image: trail.image

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
            image: trail.image
        }));
        
    } catch (error) {
        console.error("Errore in getTrailsDoneByUsers:", error);
        return [];
    }
};

  
  

export {getTrails, getTrail, createTrail, getTrailsCreatedByUsers, getTrailsDoneByUsers};



