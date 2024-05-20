import { User } from 'src/app/auth/models/user.model';

export interface Chat {
    id?: number;
    users?: User[];
    lastUpdated?: Date;
}
