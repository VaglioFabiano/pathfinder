import db from '../db.mjs';


export default function TrailDAO() {
    this.getTrails = () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM Trail', (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const trails = rows.map((trail) => ({
                    id: trail.id,
                    name: trail.name,
                    length: trail.length,
                    duration: trail.duration,
                    startpoint: trail.startpoint ? JSON.parse(trail.startpoint) : null,
                }));
                resolve(trails);
            });
        });
    };

    this.getTrailsMoreInformation = (startpoint) => {
        return new Promise((resolve, reject) => {
            const s = startpoint.split(',');
            const sta = [ parseFloat(s[0]), parseFloat(s[1])];
            const start = JSON.stringify(sta);
            db.all('SELECT * FROM Trail WHERE startpoint = ?', [start], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const trails = rows.map((trail) => ({
                    id: trail.id,
                    name: trail.name,
                    downhill: trail.downhill,
                    difficulty: trail.difficulty,
                    length: trail.length,
                    duration: trail.duration,
                    elevation: trail.elevation,
                    startpoint: trail.startpoint ? JSON.parse(trail.startpoint) : null,
                    endpoint: trail.endpoint ? JSON.parse(trail.endpoint) : null, // Parse JSON
                    description: trail.description,
                    image: trail.image,
                }));
                resolve(trails);
            });
        });
    };

    this.getTrail = (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM Trail WHERE id = ?', [id], (err, trail) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (trail) {
                    resolve({
                        id: trail.id,
                        name: trail.name,
                        downhill: trail.downhill,
                        difficulty: trail.difficulty,
                        length: trail.length,
                        duration: trail.duration,
                        elevation: trail.elevation,
                        startpoint: trail.startpoint ? JSON.parse(trail.startpoint) : null,
                        trails: trail.trails ? JSON.parse(trail.trails) : null,
                        endpoint: trail.endpoint ? JSON.parse(trail.endpoint) : null, // Parse JSON
                        description: trail.description,
                        image: trail.image,
                    });
                } else {
                    resolve(null);
                }
            });
        });
    };

    this.createTrail = (trail) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO Trail (name, downhill, difficulty, length, duration, elevation, startpoint, trails, endpoint, description, image)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(
                query,
                [
                    trail.name,
                    trail.downhill,
                    trail.difficulty,
                    trail.length,
                    trail.duration,
                    trail.elevation,
                    trail.startpoint ? JSON.stringify(trail.startpoint) : null,
                    trail.trails ? JSON.stringify(trail.trails) : null,
                    trail.endpoint ? JSON.stringify(trail.endpoint) : null, // Stringify JSON
                    trail.description,
                    trail.image,
                ],
                function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.lastID);
                }
            );
        });
    };
}
