import { Resend } from 'resend';
const otpGenerator = require('otp-generator')

const storeOTP = (db, token, userId) => {
    return new Promise((resolve, reject) => {
        const query = "REPLACE INTO otp (user_id, otp) values(?, ?)";
        db.execute(query,
            [userId, `${token}`],
            (err, rows, fields) => {
                if (err) console.log(err);
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
                if (err) console.error(err);
                if (rows.length > 0) 
                    return resolve(rows[0].username); 
                else
                    return reject(`${email} is not registered.`);
            });
    });
};

const sendEmail = (destination, subject, htmlBody) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    resend.emails.send({
        from: "onboarding@resend.dev",
        to: destination,
        subject: subject,
        html: htmlBody
});
};

export const sendOTP = async (db, email) => {
    // Check if phone number matches a user in the DB, extract out username
    const userId = await getUserFromEmail(db, email);

    // Generate an OTP with 6 random numbers
    const OTP = otpGenerator.generate(8, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: true, specialChars: true });
    await storeOTP(db, OTP, userId);

    // Send it to the user's phone with twilio API
    sendEmail(email,
        "Your guestbook login details",
        `Here is your One-Time Password: <b>${OTP}</b>`);
};

export const verifyOTP = async (db, enteredCode) => {
    const user = await correctToken(db, enteredCode);
    await removeToken(db, enteredCode);

    if (user === null) throw new Error("Unsuccessful login with One-Time Password");
    return user;
};