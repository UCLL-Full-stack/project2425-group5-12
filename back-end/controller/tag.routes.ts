/**
 * @swagger
 *   components:
 *    schemas:
 *      Tag:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            title:
 *              type: string
 *              description: Tag name.
 *      TagInput:
 *          type: object
 *          properties:
 *            title:
 *              type: string
 *              description: Tag name.
 */
import express, { NextFunction, Request, Response } from 'express';
import tagService from '../service/tag.service';
import { TagInput } from '../types';
import { error } from 'console';

const tagRouter = express.Router();

/**
 * @swagger
 * /tags:
 *   get:
 *       summary: Get a list of all tags.
 *       responses:
 *            200:
 *                description: An array of tags.
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: array
 *                            items:
 *                                $ref: "#/components/schemas/Tag"
 */
tagRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tags = await tagService.getAllTags();
        res.status(200).json(tags);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Post a new tag.
 *     requestBody:
 *       description: A tagInput object.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagInput'
 *     responses:
 *       200:
 *         description: Created tag.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 */
tagRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tag = <TagInput>req.body;
        const result = await tagService.createTag(tag);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

export { tagRouter };
