import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import Controller from '../interfaces/controller.interface';
import { validationMiddleware } from "./../middlewares/validation.middleware";
import { Router, NextFunction, Request, Response } from 'express';
import UserDTO from '../users/user.dto';
import LoginDTO from './loginDTO';
import userModel from '../users/user.model';
import UserExistException from '../exceptions/UserExistException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import User from '../users/user.interface';
import TokenData from '../interfaces/tokenData.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import { authMiddleware } from '../middlewares/auth.middleware';

class AuthenticationController implements Controller {
    public path : string = '/auth';
    public router : Router ;
    constructor(){
        this.router = Router();
        this.intializeRoutes();
    }

    /**
     * getRouter
  : Route    */
    public getRouter() : Router {
        return this.router;
    }

    private intializeRoutes() : void {
        this.router.post(`${this.path}/register`, authMiddleware ,validationMiddleware(UserDTO), this.registration);

        this.router.post(`${this.path}/login`, authMiddleware, validationMiddleware(LoginDTO), this.loggedIn);
    }

    private registration = async (req : Request, res : Response , next : NextFunction) => {
        const userData : UserDTO = req.body;
        
        if(await userModel.findOne({email : userData.email})) {
            next(new UserExistException(userData.email));
        } else {
            userData.password = await bcrypt.hash(userData.password, 10);
            const newUser = new userModel(userData);
            await newUser.save();

            const tokenData = this.createToken(newUser);
            res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
            res.send(newUser);
        }
    }

    private loggedIn = async (req : Request, res : Response, next : NextFunction) => {
        const loggedInData : UserDTO = req.body;
        const user = await userModel.findOne({ email: loggedInData.email });
        if(user) {
            const isPasswordMatching = await bcrypt.compare(loggedInData.password, user.password);
            if (isPasswordMatching) {

                const tokenData = this.createToken(user);
                res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
                res.send(user);
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    }
    private createToken(user: User): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
    private createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }
}
export default AuthenticationController;