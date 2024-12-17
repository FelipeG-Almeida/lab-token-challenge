import { User, userDB } from '../models/user';
import { DBManager } from './DBManager';

export class UserDatabase extends DBManager {
    public static TABLE_USERS = 'users';

    public async findUserById(id: string): Promise<userDB> {
        const [user]: userDB[] = await DBManager.connection(
            UserDatabase.TABLE_USERS
        ).where({ id });

        return user;
    }

    public async findUserByEmail(email: string): Promise<userDB | undefined> {
        const [user]: userDB[] = await DBManager.connection(
            UserDatabase.TABLE_USERS
        ).where({ email });
        return user;
    }

    public async insertUser(newUserDB: User): Promise<void> {
        await DBManager.connection(UserDatabase.TABLE_USERS).insert(newUserDB);
    }

    public async updateUser(id: string, userData: User): Promise<void> {
        await DBManager.connection(UserDatabase.TABLE_USERS)
            .update(userData)
            .where({ id });
    }
}
