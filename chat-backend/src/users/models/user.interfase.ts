export interface User {
  id?: number;
  userName?: string;
  displayName?: string;
  avatarURL?: string;
  password?: string;
  role?: UserRole;
}
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}
