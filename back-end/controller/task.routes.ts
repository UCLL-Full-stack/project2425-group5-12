/**
 * @swagger
 *   components:
 *    schemas:
 *      Task:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            title:
 *              type: string
 *              description: Task name.
 *            description:
 *              type: string
 *              description: Task description.
 *            done:
 *              type: string
 *              format: boolean
 *              description: Task status.
 *            deadline:
 *              type: string
 *              format: date-time
 *              description: Task deadline.
 *            owner:
 *              $ref: '#/components/schemas/User'
 *              description: Task assignee.
 *            tags:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/Tag'
 *              description: Tags of task.
 *      TaskInput:
 *          type: object
 *          properties:
 *            title:
 *              type: string
 *              description: Task name.
 *            description:
 *              type: string
 *              description: Task description.
 *            deadline:
 *              type: string
 *              format: date-time
 *              description: Task deadline.
 *            owner:
 *              type: object
 *              properties:
 *                  id:
 *                      type: number
 *                      format: int64
 *            tags:
 *              type: array
 *              items:
 *                properties:
 *                    id:
 *                        type: number
 *                        format: int64

 */
import express, { NextFunction, Request, Response } from 'express';
import taskService from '../service/task.service';
import { TaskInput } from '../types';

const taskRouter = express.Router();

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Post a new task.
 *     requestBody:
 *       description: A taskInput object.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200:
 *         description: Created task.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
taskRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = <TaskInput>req.body;
        const result = await taskService.createTask(task);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /tasks:
 *   put:
 *     summary: Change an existing task.
 *     requestBody:
 *       description: A taskInput object.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200:
 *         description: changed task.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
taskRouter.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = <TaskInput>req.body;
        const result = await taskService.updateTask(task);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /tasks:
 *   get:
 *       summary: Get a list of all tasks.
 *       responses:
 *            200:
 *                description: An array of tasks.
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: "#/components/schemas/Task"
 */
taskRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *       summary: Get a task by id.
 *       parameters:
 *           - in: path
 *             name: id
 *             schema:
 *               type: integer
 *               required: true
 *               description: The tasks id.
 *       responses:
 *            200:
 *                description: A task object.
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: "#/components/schemas/Task"
 */
taskRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.getTaskById({ id: Number(req.params.id) });
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /tasks/{id}/toggle:
 *   put:
 *       summary: Change status of task.
 *       parameters:
 *           - in: path
 *             name: id
 *             schema:
 *               type: integer
 *               required: true
 *               description: The tasks id.
 *       responses:
 *            200:
 *                description: A changed task object.
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: "#/components/schemas/Task"
 */
taskRouter.put('/:id/toggle', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.toggleTaskDoneById({ id: Number(req.params.id) });
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /tasks/{taskId}/tags/{tagId}:
 *   put:
 *       summary: Adds tag to task.
 *       parameters:
 *           - in: path
 *             name: taskId
 *             schema:
 *               type: integer
 *               required: true
 *               description: The tasks id.
 *           - in: path
 *             name: tagId
 *             schema:
 *               type: integer
 *               required: true
 *               description: The tag id.
 *       responses:
 *            200:
 *                description: A changed task object.
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: "#/components/schemas/Task"
 */
taskRouter.put('/:taskId/tags/:tagId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.addTagByIdByTaskId({
            taskId: Number(req.params.taskId),
            tagId: Number(req.params.tagId),
        });
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
});

export { taskRouter };
