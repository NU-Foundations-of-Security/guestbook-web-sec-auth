import { getDatabase, closeDBInstance } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

const filter = async (db, queryParams, userId) => {
    const nameQuery = queryParams.name;
    if (nameQuery == '') { // No name provided
        return [];
    }

    return new Promise((resolve, reject) => {
        const query = "SELECT message FROM messages WHERE name = ? AND user_id = ?";
        console.log(query);
        db.execute(query, 
        [`${nameQuery}`, userId],
        (err, rows, fields) => {
            if (fields && fields[0].constructor == Array) {
                let new_rows = [];
                for (let i = 0; i < fields.length; i++) {
                    if (fields[i] != undefined && rows[i][0] != undefined) {
                        for (let j = 0; j < rows[i].length; j++) {
                            new_rows.push(rows[i][j]);
                        }
                    }
                }
                rows = new_rows;
            }
            return resolve(rows.map(r => r.message));
        });
    });
};

export default async function handler(req, res) {
    const db = getDatabase();

    const userId = verifyJWT(req.headers["authorization"])
    if (userId === null) {
        res.status(401).json("Login token expired.");
        return;
    }

    try {
        const messages = await filter(db, req.query, userId);
        closeDBInstance(db);
        res.status(200).json(messages);
    } catch (e) {
        console.error(e);
        closeDBInstance(db);
        res.status(400).json(e.message);
    }
};