import { Response, Request, NextFunction } from 'express';
import { UserManager } from '../liberaries/managerLayer/UserManager';
import { successResponse, insufficientParameters, dbError, internalServerError, emailAlreadyExist } from '../liberaries/handlers/ResponseHandler';
const jwt = require("../middleware/AuthJWT");
import * as EmailValidator from 'email-validator';
const userManager = UserManager.getInstance();


export class UserController {

    registerUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const email = request.body.email;
            const password = request.body.password;


            if (
                email === '' ||
                !email ||
                email === undefined ||
                password === '' ||
                !password ||
                password === undefined
            ) {
                return insufficientParameters('Params are not correct', response);
            }

            let emailValidate = EmailValidator.validate(email);

            if(!emailValidate){
                return insufficientParameters('Email Should be in format', response);
            }

            await userManager.register(String(email), String(password))
                .then((data: any) => {
                    if (data.res) {
                        return successResponse('', data.result, response);
                    } else {
                        return emailAlreadyExist('Email already exist', data, response);
                    }

                }).catch((error) => {
                    return dbError(error, response);
                });

        } catch (error) {
            console.error('Error Fetching Stickers', error);
            return internalServerError(
                'Error Fetching Stickers',
                error,
                response
            );
        }
    }

    loginUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const email = request.body.email;
            const password = request.body.password;


            if (
                email === '' ||
                !email ||
                email === undefined ||
                password === '' ||
                !password ||
                password === undefined
            ) {
                return insufficientParameters('Params are not correct', response);
            }

            let emailValidate = EmailValidator.validate(email);

            if(!emailValidate){
                return insufficientParameters('Email Should be in format', response);
            }

            await userManager.login(String(email), String(password))
                .then((data: any) => {
                    if (data.res) {

                        return successResponse('', { jwt: data.result }, response);
                    } else {
                        return emailAlreadyExist('Incorrect email and password', data, response);
                    }

                }).catch((error) => {
                    return dbError(error, response);
                });

        } catch (error) {
            console.error('Error Fetching Stickers', error);
            return internalServerError(
                'Error Fetching Stickers',
                error,
                response
            );
        }
    }

    addTask = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const name = request.body.name;

            if (
                name === '' ||
                !name ||
                name === undefined
            ) {
                return insufficientParameters('Params are not correct', response);
            }

            await userManager.taskCreate(String(name))
                .then((data: any) => {
                    if (data.res) {
                        return successResponse('', { task: data.result }, response);
                    } else {
                        return emailAlreadyExist('Email already exist', data, response);
                    }

                }).catch((error) => {
                    return dbError(error, response);
                });

        } catch (error) {
            console.error('Error Fetching Stickers', error);
            return internalServerError(
                'Error Fetching Stickers',
                error,
                response
            );
        }
    }

    getUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const token: any = request.headers.authorization;
            let tokenArray = token.split(" ");

            const user = await jwt.decodeJWT(tokenArray[1]);

            await userManager.getUser(String(user.email))
                .then((data) => {
                    return successResponse('', { user: data }, response);
                }).catch((error) => {
                    return dbError(error, response);
                });

        } catch (error) {
            console.error('Error Fetching Stickers', error);
            return internalServerError(
                'Error Fetching Stickers',
                error,
                response
            );
        }
    }

    taskList = async (request: Request, response: Response, next: NextFunction) => {
        try {

            await userManager.tasks()
                .then((data) => {
                    return successResponse('', data, response);
                }).catch((error) => {
                    return dbError(error, response);
                });

        } catch (error) {
            console.error('Error Fetching Stickers', error);
            return internalServerError(
                'Error Fetching Stickers',
                error,
                response
            );
        }
    }

}