import HttpException from "./HttpException";

class UserExistException extends HttpException {
    constructor(email : string){
        super(404, `${email} was exist`);
    }
}

export default UserExistException;