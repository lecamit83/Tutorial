import { Request, Response, NextFunction , Router } from 'express';
import postModel from './post.model';
import Post from './post.interface';
import Controller from 'interfaces/controller.interface';
class PostController implements Controller {
    public path : string = '/post';
    public router : Router;
    constructor(){
        this.router = Router();
        this.intializeRoutes();
    }
    private intializeRoutes() : void {
        this.router.route(this.path)
            .get(this.getPosts)
            .post(this.createPost);
    }
    getPosts = (request: Request, response: Response) => {
        postModel.find()
            .then(posts => {
            response.send(posts);
            })
    }
    createPost = (request : Request, response : Response) => {
        const postData : Post = request.body;
        const createdPost = new postModel(postData);
        createdPost.save()
            .then(savedPost => {
                response.send(savedPost);
            })
    }
    public getRouter() : Router {
        return this.router;
    }
}
export default PostController;
