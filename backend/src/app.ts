import cors from 'cors';
import express from 'express';

import { env } from './config/env';
import { graphRouter } from './routes/graph.routes';
import { healthRouter } from './routes/health.routes';
import { textbookRouter } from './routes/textbook.routes';
import { learningRouter } from './routes/learning.routes';
import { lessonRouter } from './routes/lesson.routes';
import { preparationRouter } from './routes/preparation.routes';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_request, response) => {
  response.json({
    code: 200,
    message: 'ok',
    data: {
      service: 'ai-socratic-learning-backend',
      apiPrefix: env.apiPrefix
    }
  });
});

app.use(env.apiPrefix, healthRouter);
app.use(env.apiPrefix, graphRouter);
app.use(env.apiPrefix, textbookRouter);
app.use(env.apiPrefix, learningRouter);
app.use(env.apiPrefix, lessonRouter);
app.use(env.apiPrefix, preparationRouter);

app.use((_request, response) => {
  response.status(404).json({
    code: 404,
    message: 'Not Found',
    data: null
  });
});
