import getDatabase from '@/hooks/database';


const getUser = async (id: number = 3): Promise<string | null> => {
    try {
        const db = await getDatabase();
        console.log("Database Object:", db); // Debug per verificare cosa viene restituito

        const sql = "SELECT name, surname FROM User WHERE id = ?";
        // Prova a usare lo stesso metodo che funziona in getTrail
        const res = await db.getAllAsync(sql, [id]);
        
        // Prendi il primo risultato (che dovrebbe essere uno solo)
        const result = res[0]; 

        console.log("Risultato da DB:", result);

        if (result && result.name && result.surname) { 
            return `${result.name} ${result.surname}`;
        } else {
            return null;
        }
    } 
    catch (error) { 
        console.error("Errore in getUser:", error);
        return null;
    }
};

const getUsers = async (): Promise<string[] | null> => {
    try {
        const db = await getDatabase();
        console.log("Database Object:", db); // Debug per verificare cosa viene restituito

        const sql = "SELECT name, surname FROM User";

        // Usa getAllAsync per ottenere tutti gli utenti
        const results = await db.getAllAsync(sql);

        console.log("Risultati da DB:", results);

        if (results && results.length > 0) {
            // Mappa i risultati in un array di stringhe "Nome Cognome"
            return results.map((user: { name: string; surname: string }) => 
                `${user.name} ${user.surname}`
            );
        } else {
            console.warn("Nessun utente trovato nel database.");
            return null;
        }
    } 
    catch (error) { 
        console.error("Errore in getUsers:", error);
        return null;
    }
};



export { getUser, getUsers };
