import { sendOTP, verifyOTP } from "@/lib/authProviders/otp-email";
import { userExists } from "@/lib/authProviders/passwords";
import { closeDBInstance, getDatabase } from "@/lib/db";
import { generateJWT } from "@/lib/jwt";

export default async function handler(req, res) {
    const db = getDatabase();
    const authType = req.body.method;
    let user;

    try {
        if (authType == "userpass")
            user = await userExists(db, req.body);
        else if (authType == "OTP") {
            if (req.body.email) {
                await sendOTP(db, req.body.email);
            }
            else if (req.body.enteredCode) {
                user = await verifyOTP(db, req.body.enteredCode);
            }   
        }

        const jwt = generateJWT(user, '10d');

        closeDBInstance(db);
        res.status(200).json(jwt);
    } catch (error) {
        closeDBInstance(db);
        res.status(401).json(error.message);
    }
}