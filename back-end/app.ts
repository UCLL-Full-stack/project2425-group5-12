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
import { expressjwt } from 'express-jwt';

const app = express();

dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
    }).unless({
        path: ['/api-docs', /^\/api-docs\/.*/, '/login', '/signup', '/status'],
    })
);

app.use(cors());
app.use(bodyParser.json());

app.use('/tasks', taskRouter);
app.use('/users', userRouter);
app.use('/', userRouter);
app.use('/tags', tagRouter);
app.use('/projects', projectRouter);

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error.name === 'UnauthorizedError') {
        return res.status(401).json({ status: 'domain error', message: error.message });
    } else if (error.name === 'DomainError') {
        res.status(400).json({ status: 'domain error', message: error.message });
    } else {
        res.status(401).json({ status: 'application error', message: error.message });
    }
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PlanIT API',
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
