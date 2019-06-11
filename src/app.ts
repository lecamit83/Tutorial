import * as express from 'express';

import * as cookieParser from 'cookie-parser';  
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import  PostController  from "./posts/post.controller";
import AuthenticationController from './authentication/authentication.controller';
import { MongoError } from 'mongodb';

import { errorMiddleware } from "./middlewares/error.middleware";


class App {
    private app : express.Application;
    constructor() {
        this.app = express();

        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeControllers();
        this.initializeErrorHandling();
    }

    public getInstance() : express.Application {
        return this.app;
    }

    private initializeMiddlewares() : void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended : true}));
        this.app.use(cookieParser());
    }
    
    private initializeControllers() : void {
        this.app.use('/api', new PostController().getRouter());
        this.app.use('/api', new AuthenticationController().getRouter());
    }
    private connectToDatabase() {
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH,
        } = process.env;
        mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, {
            useCreateIndex : true,
            useNewUrlParser : true,
        },(err : MongoError) : void => {
            if(err) throw err;
            console.log(`Database is connected!`);
        });
    }

    private initializeErrorHandling() : void {
        this.app.use(errorMiddleware);
    }
}
export default App;