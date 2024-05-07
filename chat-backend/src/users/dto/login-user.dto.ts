import { IsNotEmpty } from "class-validator";

//check if userName and password is not empty && others fields checkers
export class LoginUserDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;
}
