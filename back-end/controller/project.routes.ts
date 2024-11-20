/**
 * @swagger
 *   components:
 *    schemas:
 *      Project:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            title:
 *              type: string
 *              description: Project name.
 *            description:
 *              type: string
 *              description: Project description.
 *            done:
 *              type: string
 *              format: boolean
 *              description: Project status.
 *            tasks:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/Task'
 *              description: Tasks of project.
 *            members:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/User'
 *              description: Members of project.
 *            owner:
 *              $ref: '#/components/schemas/User'
 *              description: Project owner.
 *      ProjectInput:
 *          type: object
 *          properties:
 *            title:
 *              type: string
 *              description: Project name.
 *            description:
 *              type: string
 *              description: Project description.
 *            owner:
 *              type: object
 *              properties:
 *                  id:
 *                      type: number
 *                      format: int64
 */
import express, { Response, Request, NextFunction } from 'express';
import projectService from '../service/project.service';
import { ProjectInput } from '../types';

const projectRouter = express.Router();

/**
 * @swagger
 * /projects:
 *   get:
 *       summary: Get a list of all projects.
 *       responses:
 *            200:
 *                description: An array of projects.
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: "#/components/schemas/Project"
 */
projectRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await projectService.getAllProjects();
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *       summary: Get a project by id.
 *       parameters:
 *           - in: path
 *             name: id
 *             schema:
 *               type: integer
 *               required: true
 *               description: The project id.
 *       responses:
 *            200:
 *                description: A project object.
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: "#/components/schemas/Project"
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
 *     requestBody:
 *       description: A projectInput object.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: Created Project.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
projectRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = <ProjectInput>req.body;
        await projectService.createProject(project);
        res.status(201).json({ message: 'Project succesfully created!' });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /projects/{id}/toggle:
 *   put:
 *       summary: Change status of project.
 *       parameters:
 *           - in: path
 *             name: id
 *             schema:
 *               type: integer
 *               required: true
 *               description: The project id.
 *       responses:
 *            200:
 *                description: A changed project object.
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: "#/components/schemas/Project"
 */
projectRouter.put('/:id/toggle', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectService.toggleProjectDoneById({ id: Number(req.params.id) });
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /projects/{projectId}/tasks/{taskId}:
 *   put:
 *       summary: Adds task to project.
 *       parameters:
 *           - in: path
 *             name: projectId
 *             schema:
 *               type: integer
 *               required: true
 *               description: The projects id.
 *           - in: path
 *             name: taskId
 *             schema:
 *               type: integer
 *               required: true
 *               description: The tasks id.
 *       responses:
 *            200:
 *                description: A changed project object.
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: "#/components/schemas/Project"
 */
/*projectRouter.put(
    '/:projectId/tasks/:taskId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const project = await projectService.addTaskByIdByProjectId({
                projectId: Number(req.params.projectId),
                taskId: Number(req.params.taskId),
            });
            res.status(200).json(project);
        } catch (error) {
            next(error);
        }
    }
);*/

/**
 * @swagger
 * /projects/{projectId}/members/{memberId}:
 *   put:
 *       summary: Adds member to project.
 *       parameters:
 *           - in: path
 *             name: projectId
 *             schema:
 *               type: integer
 *               required: true
 *               description: The projects id.
 *           - in: path
 *             name: memberId
 *             schema:
 *               type: integer
 *               required: true
 *               description: The members id.
 *       responses:
 *            200:
 *                description: A changed project object.
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: "#/components/schemas/Project"
 */
projectRouter.put(
    '/:projectId/members/:memberId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const project = await projectService.addMemberByIdByProjectId({
                projectId: Number(req.params.projectId),
                memberId: Number(req.params.memberId),
            });
            res.status(200).json(project);
        } catch (error) {
            next(error);
        }
    }
);

export { projectRouter };
