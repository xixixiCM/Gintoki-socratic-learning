import { app } from './app';
import { env } from './config/env';

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend is running at http://localhost:${env.port}${env.apiPrefix}`);
});
