// Entrypoint serverless da Vercel: exporta o app Express como handler de
// requisição. O vercel.json redireciona todas as rotas para esta função.
import { app } from '../src/app';

export default app;
