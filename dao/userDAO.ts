import getDatabase from '@/hooks/database';

interface User {
    name: string;
    surname: string;
}

const getUser = async (id: number): Promise<string | null> => {
    try {
        const db = await getDatabase();
        const sql = "SELECT name, surname FROM User WHERE id = ?";
        const result = await db.getAsync(sql, [id]);

        console.log("Risultato da DB:", result);

        if (result) {
            return `${result.name} ${result.surname}`; // Ritorna solo il nome e cognome come stringa
        } else {
            return null; // Se l'utente non esiste, ritorna null
        }
    } 
    catch (error) { 
        console.log("Errore in getUser:", error);
        return null;
    }
};


getUser(3);
export {getUser};