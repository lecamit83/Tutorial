import {IsString, IsEmail} from 'class-validator'
class UserDTO {
    @IsString()
    public name : string;

    @IsEmail()
    public email : string;

    @IsString()
    public password : string;
}
export default UserDTO;