import { IsString } from 'class-validator';
 
class PostDTO {
  @IsString()
  public author: string;
 
  @IsString()
  public content: string;
 
  @IsString()
  public title: string;
}
 
export default PostDTO;