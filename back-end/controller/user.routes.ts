/**
 * @swagger
 *   components:
 *    schemas:
 *      Role:
 *          type: string
 *          enum: [ADMIN, USER]
 *          description: User role.
 *
 *      User:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            firstName:
 *              type: string
 *              description: Firstname of the user.
 *            lastName:
 *              type: string
 *              description: Lastname of the user.
 *            email:
 *              type: string
 *              description: Email of the user.
 *            password:
 *              type: string
 *              description: Password of the user.
 *            role:
 *              $ref: '#/components/schemas/Role'
 *              description: Role of the user.
 *
 *      UserInput:
 *          type: object
 *          properties:
 *            firstName:
 *              type: string
 *              description: Firstname of the user.
 *            lastName:
 *              type: string
 *              description: Lastname of the user.
 *            email:
 *              type: string
 *              description: Email of the user.
 *            password:
 *              type: string
 *              description: Password of the user.
 *      UserLogin:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *              description: Email of the user.
 *            password:
 *              type: string
 *              description: Password of the user.
 */
import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *       summary: Get a list of all users.
 *       responses:
 *            200:
 *                description: An array of users.
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: "#/components/schemas/User"
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user.
 *     requestBody:
 *       description: A userInput object.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Logged in user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = <UserInput>req.body;
        const response = await userService.authenticate({
            email: user.email,
            password: user.password,
        });
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

export { userRouter };
