import { User } from 'src/app/auth/models/user.model';
import { Chat } from './Chat';

export interface Message {
    id?: number;
    message?: string;
    user?: User;
    chat?: Chat;
    createdAt?: Date;
}
