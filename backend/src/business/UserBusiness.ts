import { UserDatabase } from '../database/UserDatabase';
import { LoginInputDTO } from '../dto/users/login.dto';
import { SignupInputDTO } from '../dto/users/signup.dto';
import { UpdateUserDTO } from '../dto/users/update.dto';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { TokenPayload, User } from '../models/user';
import { HashManager } from '../services/HashManager';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';

export class UserBusiness {
    constructor(
        private hashManager: HashManager,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private userDatabase: UserDatabase
    ) {}

    public signup = async (input: SignupInputDTO): Promise<string> => {
        const { name, email, password } = input;
        const hash = await this.hashManager.hash(password);
        const id: string = this.idGenerator.generate();

        const userIdExists = await this.userDatabase.findUserById(id);
        const userEmailExists = await this.userDatabase.findUserByEmail(email);

        if (userIdExists) {
            throw new BadRequestError('O id já existe no banco');
        }
        if (userEmailExists) {
            throw new BadRequestError('O email informado já foi cadastrado');
        }

        const newUser = new User(id, name, email, hash);
        await this.userDatabase.insertUser(newUser);

        const tokenPayload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
        };
        const token = this.tokenManager.createToken(tokenPayload);

        return token;
    };

    public login = async (input: LoginInputDTO): Promise<string> => {
        const { email, password } = input;

        const user = await this.userDatabase.findUserByEmail(email);
        if (!user) {
            throw new NotFoundError(
                `Usuário com email ${email} não encontrado`
            );
        }

        const isPasswordCorrect = await this.hashManager.compare(
            password,
            user.getPassword()
        );
        if (!isPasswordCorrect) {
            throw new BadRequestError('Email ou senha incorretos');
        }

        const tokenPayload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
        };
        const token = this.tokenManager.createToken(tokenPayload);

        return token;
    };

    public editUser = async (input: UpdateUserDTO): Promise<void> => {
        const { name, email, newEmail } = input;

        const user = await this.userDatabase.findUserByEmail(email);
        if (!user) {
            throw new NotFoundError(
                `Usuário com email ${email} não encontrado`
            );
        }

        user.setEmail(newEmail);
        user.setName(name);
        await this.userDatabase.updateUser(user.getId(), user);
    };
}
