import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';

import userModel from '../users/user.model';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';

export async function authMiddleware(request:RequestWithUser , response : Response, next : NextFunction ) {
    const cookies = request.cookies;
    if(cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET;
        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
            const id = verificationResponse._id;
            const user = await userModel.findById(id);
            if (user) {
                request.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }
        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    }
}