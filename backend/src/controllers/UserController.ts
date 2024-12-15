import { Request, Response } from 'express';
import { UserBusiness } from '../business/UserBusiness';
import { signupSchema } from '../dto/users/signup.dto';
import { ZodError } from 'zod';
import { BaseError } from '../errors/BaseError';
import { loginSchema } from '../dto/users/login.dto';
import { updateUserSchema } from '../dto/users/update.dto';

export class UserController {
    constructor(private userBusiness: UserBusiness) {}

    public signup = async (req: Request, res: Response) => {
        try {
            const input = signupSchema.parse({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });
            const output = await this.userBusiness.signup(input);

            res.status(201).send(output);
        } catch (error) {
            console.log(error);

            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    public login = async (req: Request, res: Response) => {
        try {
            const input = loginSchema.parse({
                email: req.body.email,
                password: req.body.password,
            });
            const output = await this.userBusiness.login(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);

            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    public updateUser = async (req: Request, res: Response) => {
        try {
            const input = updateUserSchema.parse({
                name: req.body.name,
                email: req.body.email,
                newEmail: req.body.newEmail,
            });
            await this.userBusiness.editUser(input);

            res.status(200).send(true);
        } catch (error) {
            console.log(error);

            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };
}
