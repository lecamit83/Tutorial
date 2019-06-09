import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import  PostController  from "./posts/post.controller";
import { MongoError } from 'mongodb';


class App {
    private app : express.Application;
    constructor() {
        this.app = express();

        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeControllers();
    }

    public getInstance() : express.Application {
        return this.app;
    }

    private initializeMiddlewares() : void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended : true}));
    }
    
    private initializeControllers() : void {
        this.app.use('/api', new PostController().getRouter());
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
}
export default App;