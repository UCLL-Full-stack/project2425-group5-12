/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         title:
 *           type: string
 *           description: Project name.
 *         description:
 *           type: string
 *           description: Project description.
 *         done:
 *           type: string
 *           format: boolean
 *           description: Project status.
 *         tasks:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Task'
 *           description: Tasks of project.
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           description: Members of project.
 *         owner:
 *           $ref: '#/components/schemas/User'
 *           description: Project owner.
 *     ProjectInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Project name.
 *         description:
 *           type: string
 *           description: Project description.
 *         owner:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               format: int64
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message field.
 */
import express, { Response, Request, NextFunction } from 'express';
import projectService from '../service/project.service';
import { ProjectInput } from '../types';

const projectRouter = express.Router();

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get a list of all projects.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Project"
 */
projectRouter.get('/', async (req: Request & { auth?: any }, res: Response, next: NextFunction) => {
    try {
        const { userRole, userEmail } = req.auth;
        const projects = await projectService.getAllProjects({ userRole, userEmail });
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get a project by id.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The project id.
 *     responses:
 *       200:
 *         description: A project object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Project"
 */
projectRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectService.getProjectById({ id: Number(req.params.id) });
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Post a new project.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: A projectInput object.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: Project response message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
projectRouter.post(
    '/',
    async (req: Request & { auth?: any }, res: Response, next: NextFunction) => {
        try {
            const { userRole } = req.auth;
            const project = <ProjectInput>req.body;
            await projectService.createProject(project, userRole);
            res.status(201).json({ message: 'Project successfully created.' });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /projects/{id}/toggle:
 *   put:
 *     summary: Change status of project.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The project id.
 *     responses:
 *       200:
 *         description: A changed project response message.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/MessageResponse"
 */
projectRouter.put('/:id/toggle', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await projectService.toggleProjectDoneById({ id: Number(req.params.id) });
        res.status(200).json({ message: 'Project status toggled succesfully.' });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /projects/{projectId}/members/{memberId}:
 *   put:
 *     summary: Add member to project.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The project's id.
 *       - in: path
 *         name: memberId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The member's id.
 *     responses:
 *       200:
 *         description: The changed project response message.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/MessageResponse"
 */
projectRouter.put(
    '/:projectId/members/:memberId',
    async (req: Request & { auth?: any }, res: Response, next: NextFunction) => {
        try {
            const { userRole, userEmail } = req.auth;
            await projectService.addMemberByIdByProjectId({
                projectId: Number(req.params.projectId),
                memberId: Number(req.params.memberId),
                userEmail,
                userRole,
            });
            res.status(200).json({ message: 'User added succesfully.' });
        } catch (error) {
            next(error);
        }
    }
);

export { projectRouter };
