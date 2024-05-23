export const userExists = async (db, bodyParams) => {
    return new Promise((resolve, reject) => {
        const username = bodyParams.username;
        const password = bodyParams.password;

        const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
        db.execute(query,
            [username, password],
            (err, rows, fields) => {
                if (err)
                    console.error(err);
                if (rows.length == 0) {
                    return reject("User or password does not exist");
                } else {
                    return resolve(rows[0]);
                }
            });
    });
}