import { IsString } from "class-validator";

export class User {
  id?: number;
  userName?: string;
  @IsString()
  password?: string;
  imagePath?: string;
}
