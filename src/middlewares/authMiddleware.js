import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/constants.js';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies['auth'];

    if (!token) {
        return next();
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET)

        console.log(decodedToken);

        // TODO: Add user data to request

        return next();
    } catch (err) {
        //TODO: Invalid token
    }
};
