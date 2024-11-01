/**
 * @swagger
 *   components:
 *    schemas:
 *      User:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            firstName:
 *              type: string
 *              description: Firstname user.
 *            lastName:
 *              type: string
 *              description: Lastname user.
 *            email:
 *              type: string
 *              description: Email user.
 *            password:
 *              type: string
 *              description: Password user.
 *      UserInput:
 *          type: object
 *          properties:
 *            firstName:
 *              type: string
 *              description: Firstname user.
 *            lastName:
 *              type: string
 *              description: Lastname user.
 *            email:
 *              type: string
 *              description: Email user.
 *            password:
 *              type: string
 *              description: Password user.
 */
import express, { Request, Response } from 'express';
import userService from '../service/user.service';

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
userRouter.get('/', (req: Request, res: Response) => {
    const users = userService.getAllUsers();
    res.status(200).json(users);
});

export { userRouter };
