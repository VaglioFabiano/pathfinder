import getDatabase from '@/hooks/database';

interface Coordinate {
    lat: number;
    lng: number;
}

interface Trail {
    id: number;
    name: string;
    downhill: number;
    difficulty: string;
    length: number;
    duration: number;
    elevation: number;

    // Geographical points for the trail
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
        const sql = "INSERT INTO Trail (name, downhill, difficulty, length, duration, elevation, startpoint, trail, endpoint, description, image, city, region, state, province, activity) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        const [result] = await db.runAsync(sql, [trail.name, trail.downhill, trail.difficulty, trail.length, trail.duration, trail.elevation, trail.startpoint, trail.trail, trail.endpoint, trail.description, trail.image, trail.city, trail.region, trail.state, trail.province, trail.activity]);
    } catch (error) {
        console.log(error);
    }
}

export {getTrails, getTrail, createTrail};



