import { User } from "@/lib/authEntities/user";
import { getDatabase } from "@/lib/db";

const doesUserExist = async (db, username) => {
    console.log(username);
    return new Promise((resolve, reject) => {
        const query = `SELECT * from users WHERE username = ?`;
        db.execute(query,
        [username],
        (err, rows, fields) => {
            console.log(rows);
            if (err) {
                console.log(err);
            }
            console.log(rows.length);
            if (rows.length > 0) {
                return resolve(true);
            } else {
                return resolve(false);
            }
        });
    });
}

const createAccount = async (db, bodyParams) => {
    return new Promise(async (resolve, reject) => {
        const username = bodyParams.username;
        const password = bodyParams.password;
        const email = bodyParams.email;

        // Input validation before account creation
        let user;
        try {
            user = new User(username, password);
        } catch (error) {
            return reject(error.message);
        }

        // First check that user does not exist
        const userExists = await doesUserExist(db, username);
        if (userExists) return reject("Username exists");

        const query = `INSERT INTO users (username, password, email) VALUES(?, ?, ?)`;
        db.execute(query,
            [user.getUsername(), user.getPassword(), email],
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    return reject("Error creating account");
                } else {
                    return resolve("User created successfully");
                }
            });
    });
}

export default async function handler(req, res) {
    const db = getDatabase();
    try {
        console.log(req.body);
        const message = await createAccount(db, req.body);
        res.status(200).json(message);
    } catch (error) {
        res.status(409).json(error);
    }
}