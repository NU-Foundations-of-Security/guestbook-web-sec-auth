export const jwt = require('jsonwebtoken');
export const TOP_SECRET_SIGNING_SECRET = '5bfexdswh9i1vwqildm9'

export const generateJWT = (user, duration) => {
    const token = jwt.sign({
        userId: user.username,
    }, TOP_SECRET_SIGNING_SECRET, {
        expiresIn: duration
    });
    return token;
}

export const verifyJWT = (token) => {
    try {
        const tokenPayload = jwt.verify(token, TOP_SECRET_SIGNING_SECRET);
        console.log(tokenPayload)
        return tokenPayload.userId;
    } catch (error) {
        console.log(error);
        return null;
    }
}