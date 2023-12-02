import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import ChainlinkFunctionsController from '@/resources/chainlink_functions/cf.controller';
import App from './app';

validateEnv();
const port = Number(process.env.PORT || 8080);
const appInstance = new App([new ChainlinkFunctionsController()], port);
appInstance.listen();
