import { PORT } from "./config";

export const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Brainly API',
            version: '1.0.0',
            description: 'API documentation for Brainly content management platform',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        username: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        bio: { type: 'string' },
                    },
                },
                Content: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        userId: { type: 'string' },
                        title: { type: 'string' },
                        link: { type: 'string' },
                        type: { 
                            type: 'string',
                            enum: ['youtube', 'twitter', 'document']
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                ShareLink: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        userId: { type: 'string' },
                        hash: { type: 'string' },
                    },
                },
            },
        },
        security: [{
            bearerAuth: [],
        }],
    },
    apis: ['./src/*.ts'],
};

export const swaggerDocs = {
    /**
     * @swagger
     * tags:
     *   - name: Auth
     *     description: Authentication endpoints
     *   - name: Content
     *     description: Content management endpoints
     *   - name: Share
     *     description: Content sharing endpoints
     */

    /**
     * @swagger
     * /api/v1/signup:
     *   post:
     *     summary: Register a new user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - password
     *               - email
     *             properties:
     *               username:
     *                 type: string
     *                 minLength: 3
     *               password:
     *                 type: string
     *                 minLength: 6
     *               email:
     *                 type: string
     *                 format: email
     *     responses:
     *       201:
     *         description: User registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 token:
     *                   type: string
     *       400:
     *         description: Invalid input
     *       409:
     *         description: Username or email already exists
     */

    /**
     * @swagger
     * /api/v1/signin:
     *   post:
     *     summary: Sign in a user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - password
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Sign in successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *       403:
     *         description: Incorrect credentials
     */

    /**
     * @swagger
     * /api/v1/content:
     *   get:
     *     summary: Get all content for the authenticated user
     *     tags: [Content]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of user's content
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 content:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Content'
     *   post:
     *     summary: Create new content
     *     tags: [Content]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *               - type
     *             properties:
     *               title:
     *                 type: string
     *               type:
     *                 type: string
     *                 enum: [youtube, twitter, document]
     *               link:
     *                 type: string
     *               file:
     *                 type: string
     *                 format: binary
     *     responses:
     *       201:
     *         description: Content created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 content:
     *                   $ref: '#/components/schemas/Content'
     *   delete:
     *     summary: Delete content
     *     tags: [Content]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - contentId
     *             properties:
     *               contentId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Content deleted successfully
     *       404:
     *         description: Content not found or not authorized
     */

    /**
     * @swagger
     * /api/v1/content/search:
     *   get:
     *     summary: Search for content by title or type
     *     tags: [Content]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: q
     *         schema:
     *           type: string
     *         required: true
     *         description: Search term
     *     responses:
     *       200:
     *         description: List of content matching the search term
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 results:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Content'
     *       400:
     *         description: Search term is required
     *       403:
     *         description: Not authenticated
     */

    /**
     * @swagger
     * /api/v1/brain/share:
     *   get:
     *     summary: Get user's share status
     *     tags: [Share]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Share status
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 hash:
     *                   type: string
     *                   nullable: true
     *   post:
     *     summary: Toggle sharing status
     *     tags: [Share]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - share
     *             properties:
     *               share:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Share status updated
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 hash:
     *                   type: string
     *                 message:
     *                   type: string
     */

    /**
     * @swagger
     * /api/v1/brain/{shareLink}:
     *   get:
     *     summary: Get shared content
     *     tags: [Share]
     *     parameters:
     *       - in: path
     *         name: shareLink
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Shared content
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 username:
     *                   type: string
     *                 content:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Content'
     *       411:
     *         description: Invalid share link or user not found
     */
}; 