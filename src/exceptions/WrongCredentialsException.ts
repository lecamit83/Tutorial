import HttpException from "./HttpException";

class WrongCredentialsException extends HttpException {
    constructor(){
        super(404, `User not available`);
    }
}

export default WrongCredentialsException;