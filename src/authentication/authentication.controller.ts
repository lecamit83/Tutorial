import * as bcrypt from 'bcrypt';
import Controller from '../interfaces/controller.interface';
import { validationMiddleware } from "./../middlewares/validation.middleware";
import { Router, NextFunction, Request, Response } from 'express';
import UserDTO from '../users/user.dto';
import LoginDTO from './loginDTO';
import userModel from '../users/user.model';
import UserExistException from '../exceptions/UserExistException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';

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
        this.router.route(`${this.path}/register`)
            .post(validationMiddleware(UserDTO), this.registration);

        this.router.route(`${this.path}/login`)
            .post(validationMiddleware(LoginDTO), this.loggedIn);
    }

    private registration = async (req : Request, res : Response , next : NextFunction) => {
        const userData : UserDTO = req.body;
        
        if(await userModel.findOne({email : userData.email})) {
            next(new UserExistException(userData.email));
        } else {
            userData.password = await bcrypt.hash(userData.password, 10);
            const newUser = new userModel(userData);
            await newUser.save();
            res.send(newUser);
        }
    }

    private loggedIn = async (req : Request, res : Response, next : NextFunction) => {
        const loggedInData : UserDTO = req.body;
        const user = await userModel.findOne({ email: loggedInData.email });
        if(user) {
            const isPasswordMatching = await bcrypt.compare(loggedInData.password, user.password);
            if (isPasswordMatching) {
                res.send(user);
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    }
}
export default AuthenticationController;