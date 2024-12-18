import db from '../db.mjs';
import crypto from 'crypto';

export default function UserDAO () {
    this.getUsers = (email, password) =>{
        //password test
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM User WHERE email = ? ';
            db.get(query, [email], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                else if (row === undefined) {
                    resolve(false);
                    return;
                }
                else {
                    const user ={ id: row.id, username: row.email , name: row.name, surname: row.surname};
                    crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
                        if(err) 
                            reject(err);
                        if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
                            resolve(false);
                        else
                            resolve(user);
                    });
                }
            });
        });
    }

    this.createUser = (email, password, salt, name, surname) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO User (name, surname, email, password, salt) VALUES (?, ?, ?, ?, ?)';
            db.run(query, [name, surname,email, password, salt], function (err) {
                if (err) {
                    reject(err); // Potrebbe essere una violazione di vincolo (email unica)
                } else {
                    resolve(this.lastID); // ID dell'utente creato
                }
            });
        });
    };
    
}
