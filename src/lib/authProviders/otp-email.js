const postmark = require("postmark");
const otpGenerator = require('otp-generator')

const storeOTP = (db, token, userId) => {
    return new Promise((resolve, reject) => {
        const query = "REPLACE INTO otp (user_id, otp) values(?, ?)";
        db.execute(query,
            [userId, token],
            (err, rows, fields) => {
                return resolve(true);
            });
    });
}

const correctToken = (db, token) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM otp WHERE otp = ?";
        db.execute(query,
            [token],
            (err, rows, fields) => {
                if (!err && rows.length > 0) {
                    return resolve(rows[0]);
                } else {
                    return resolve(null);
                }
            });
    });
};

const removeToken = (db, token) => {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM otp WHERE otp = ?";
        db.execute(query,
            [token],
            (err, rows, fields) => {
                return resolve(true);
            });
    });
};

export const getUserFromEmail = (db, email) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE email = ?`;
        db.execute(query,
            [email],
            (err, rows, fields) => {
                if (rows.length > 0) 
                    return resolve(rows[0].user_id); 
                else
                    return reject(`${email} is not registered.`);
            });
    });
};

const sendEmail = (destination, subject, htmlBody) => {
    const client = new postmark.ServerClient("5410bdd9-96ff-4049-baea-0f2be31eec40");
    client.sendEmail({
        "From": "srutib@u.northwestern.edu",
        "To": destination,
        "Subject": subject,
        "HTMLBody": htmlBody
    });
};

export const sendOTP = async (db, email) => {
    // Check if phone number matches a user in the DB, extract out username
    const userId = await getUserFromEmail(db, email);

    // Generate an OTP with 6 random numbers
    const OTP = otpGenerator.generate(8, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: true, specialChars: true });
    await storeOTP(db, OTP, userId, 5);

    // Send it to the user's phone with twilio API
    sendEmail(email,
        "Your guestbook login details",
        `Here is your One-Time Password: <b>${OTP}</b>.`);
};

export const verifyOTP = async (db, enteredCode) => {
    const user = await correctToken(db, enteredCode);
    await removeToken(db, enteredCode);

    if (user === null) throw new Error("Unsuccessful login with One-Time Password");
    return user;
};