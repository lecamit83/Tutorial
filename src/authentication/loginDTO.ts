import { IsString, IsEmail } from 'class-validator';

class LogInDTO {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export default LogInDTO;