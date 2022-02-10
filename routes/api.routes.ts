import { Router } from 'express';
const { decodeJWTMiddleWare } = require('../middleware/AuthJWT');


const router = Router();

//"=========================  Import Controllers ====================================="

import { UserController } from '../controllers/User.controller';



//#region "========================= Controller Objects ====================================="

const userController = new UserController();


//#region "========================= Utility Routes ====================================="

router.post(
    '/register',

    userController.registerUser
);

router.post(
    '/login',

    userController.loginUser
);

router.get(
    '/user',
    decodeJWTMiddleWare,
    userController.getUser
);

router.get(
    '/list-tasks',
    decodeJWTMiddleWare,
    userController.taskList
);

router.post(
    '/create-task',
    decodeJWTMiddleWare,
    userController.addTask
);


export default router;