import { Request, Response, NextFunction , Router } from 'express';
import { validationMiddleware } from "./../middlewares/validation.middleware";
import PostNotFoundException from '../exceptions/PostNotFoundException';
import postModel from './post.model';
import Post from './post.interface';
import Controller from 'interfaces/controller.interface';
import PostDTO from './post.dto';
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
            .post(validationMiddleware(PostDTO),this.createPost);
        

        this.router.route(`${this.path}/:id`)
            .get(this.getPostById) //get by ID
            .patch(validationMiddleware(PostDTO, true),this.modifyPost)
            .delete(this.removePost);
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

    getPostById = (req : Request, res : Response, next: NextFunction) => {
        const id = req.params.id;
        postModel.findById(id)
        .then((post) => {
          if (post) {
            res.send(post);
          } else {
            next(new PostNotFoundException(id));
          }
        });
    }

    modifyPost = (req : Request, res : Response, next : NextFunction) : void => {
        const id = req.params.id;
        let postData : Post = req.body;
        postModel.findByIdAndUpdate(id, postData, {new : true})
            .then(post=>{
                if(post) {
                    res.send(post);
                }else {
                    next(new PostNotFoundException(id));
                }
            });
    }
    removePost = (req : Request, res : Response, next : NextFunction) : void => {
        const id = req.params.id;
        postModel.findByIdAndDelete(id)
        .then(post=>{
            if(post) {
                res.send(200);
            }else {
                next(new PostNotFoundException(id));
            }
        });
    }
    public getRouter() : Router {
        return this.router;
    }
}
export default PostController;
