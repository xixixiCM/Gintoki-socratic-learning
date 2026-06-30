import { Router } from 'express';

import { getDefaultTextbook } from '../controllers/textbook.controller';

export const textbookRouter = Router();

textbookRouter.get('/textbooks/default', getDefaultTextbook);
