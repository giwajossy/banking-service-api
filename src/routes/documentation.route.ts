import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express';

const router = express.Router()

const swaggerJsDocs = swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Banking Service API - Lendsqr 💰  ',
            version: '1.0.0',
            description: 'A system where user can create an account, fund their wallet, transfer funds to another user\'s account, withdraw funds, and see transaction history. [Click to see live preview](https://lendsqr-service-api.herokuapp.com/)',
            contact: {
                name: 'API Support',
                email: 'giwajossy@gmail.com',
                url: 'https://github.com/giwajossy'
            },
            license: {
                name: 'Apache 2.0',
                url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
            }
        }
    },
    servers: [
        {
            url: 'https://lendsqr-service-api.herokuapp.com/',
            description: 'Developmenent server'
        },
        {
            url: 'https://lendsqr-service-api.herokuapp.com/',
            description: 'Production server'
        }
    ],
    apis: ['./src/spec/*.yml', './src/spec/components/*.yml']
});


router.use('/', swaggerUI.serve)
router.get('/', swaggerUI.setup(swaggerJsDocs));

export default router;
