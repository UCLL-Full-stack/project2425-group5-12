import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { taskRouter } from './controller/task.routes';
import { userRouter } from './controller/user.routes';
import { tagRouter } from './controller/tag.routes';
import { projectRouter } from './controller/project.routes';
import taskService from './service/task.service';
import { set } from 'date-fns';
import projectService from './service/project.service';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/tasks', taskRouter);
app.use('/users', userRouter);
app.use('/tags', tagRouter);
app.use('/projects', projectRouter);

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({ status: 'application error', message: error.message });
});

/* const createSampleTaskAndProject = () => {
        taskService.createTask({
            title: 'Finish lab2',
            description: 'nodejs and express assignment',
            deadline: set(new Date(), { year: 2025, month: 10, date: 28, hours: 15 }),
            owner: {
                id: 1,
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                role: 'user',
            },
            tags: [
                {
                    id: 1,
                    title: '',
                },
            ],
        });
        projectService.createProject({
            title: 'Full-Stack',
            description: 'Full-Stack Course',
            owner: {
                id: 1,
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                role: 'user',
            },
        });
        projectService.addTaskByIdByProjectId({ projectId: 1, taskId: 1 });
        projectService.addMemberByIdByProjectId({ projectId: 1, memberId: 2 });
    };
    createSampleTaskAndProject();*/

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Courses API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
});
