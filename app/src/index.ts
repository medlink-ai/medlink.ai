import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import ChainlinkFunctionsController from './resources/chainlink_functions/cf.controller';
validateEnv();
const app = new App([new ChainlinkFunctionsController()], Number(process.env.PORT))
app.listen();