import { Router } from 'express';

import { prepareDefaultTextbook } from '../controllers/preparation.controller';

export const preparationRouter = Router();

preparationRouter.post('/preparation/default-textbook', prepareDefaultTextbook);
