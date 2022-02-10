const jwt = require('jsonwebtoken');
import { config } from 'dotenv';
import { unAuthorized } from '../liberaries/handlers/ResponseHandler';
import { Request, Response, NextFunction } from 'express';

config();

const createJWT = (payload: any) => {
    const secret = process.env.SECRETE_KEY;

    const expTime = Math.floor(Date.now() / 1000) + 55 * 55 * 10 * 4; // 1 year
    const token = jwt.sign(
        {
            exp: expTime,
            data: payload,
        },
        secret
    );
    return { token: token, exp: expTime };
};

const decodeJWT = (token: any) => {
    const secret = process.env.SECRET_KEY;
    console.log(`secret key === ${secret}`)
    console.log(`public key === ${token}`)
    return jwt.verify(token, secret);
};
const decodeJWTMiddleWare = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.headers.authorization) {
           // console.log('there are token headers');
            const token = req.headers.authorization;
            let tokenArray = token.split(" ");
            const user = decodeJWT(tokenArray[1]);
            if (!user) {
                return unAuthorized('session is expired', [], res)
            } else {
                req.body.userData = user;
                next();
            }
        } else
            return unAuthorized('session value not found', [], res)
    } catch (err) {

        return unAuthorized('session is expired', [], res)

    }
};

module.exports = {
    createJWT,
    decodeJWT,
    decodeJWTMiddleWare,
};
