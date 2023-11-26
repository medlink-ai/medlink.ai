import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
validateEnv();
const app = new App([], Number(process.env.PORT))
app.listen();