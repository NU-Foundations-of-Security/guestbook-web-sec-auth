import { getDatabase, closeDBInstance } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

const getAllMessages = async (db, userId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT name, address, message FROM messages WHERE display = 1 AND user_id = ?;';
        console.log(query);
        db.execute(query, 
            [userId],
            (err, rows, fields) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            return resolve(rows);
        });
    });
}

export default async function handler(req, res) {
    const db = getDatabase();

    const userId = verifyJWT(req.headers["authorization"]);
    if (userId === null) {
        res.status(401).json("Login token expired.");
        return;
    }

    try {
        const messages = await getAllMessages(db, userId);
        closeDBInstance(db);
        res.status(200).json(messages);
    } catch (e) {
        console.error(e);
        closeDBInstance(db);
        res.status(400).json(e.message);
    }
}