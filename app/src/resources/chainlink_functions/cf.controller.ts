import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import ChainlinkFunctionsService from '@/resources/chainlink_functions/cf.service';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/chainlink_functions/cf.validation';
import * as fs from 'fs';
import { promisify } from 'util';
import { getResponsePriceIndex, getResponseProvider} from '@/middleware/getResponse.middleware';

const readFileAsync = promisify(fs.readFile);

class ChainlinkFunctionsController implements Controller {
    public path = '/chainlink-functions';
    public router = Router();
    private ChainlinkFunctionsService = new ChainlinkFunctionsService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/consumer-contract`,
            this.deployConsumer
        )

        this.router.post(
            `${this.path}/create-fund-subscription`,
            validationMiddleware(validate.createAndFundSub),
            this.createAndFundSub
        )

        this.router.post(
            `${this.path}/post-functions-request`,
            validationMiddleware(validate.postFunctionsRequest),
            this.postFunctionsRequest
        )

        this.router.post(
            `${this.path}/post-functions-response`,
            this.postFunctionsResponse
        )

        this.router.post(
            `${this.path}/functions-consumer-subscription`,
            this.functionsConsumer
        )

        this.router.post(
            `${this.path}/functions-request-response`,
            this.functionsRequest
        )

        this.router.post(
            `${this.path}/function-request-provider`,
            validationMiddleware(validate.functionRequestProvider),
            this.functionRequestProvider
        )

        this.router.post(
            `${this.path}/function-response-provider`,
            this.functionsResponseProvider
        )
    }

    private deployConsumer = async (req: Request, res: Response, next: NextFunction): Promise<string | void> => {
        try {
            const deployedConsumerAddress = await this.ChainlinkFunctionsService.deployConsumerContract("polygonMumbai");
            
            res.status(200).json({ deployedConsumerAddress });

            return deployedConsumerAddress.toString();
        } catch (error: any) {
            next(new HttpException(400, error));
        }
    }

    private createAndFundSub = async (req: Request, res: Response, next: NextFunction): Promise<string | void> => {
        try {
            const { consumerAddress, linkAmount  } = req.body;
            const subscriptionId = await this.ChainlinkFunctionsService.createAndFundSub("polygonMumbai", consumerAddress, linkAmount);
            res.status(200).json(subscriptionId);

            return subscriptionId.toString();
        } catch (error: any) {
            next(new HttpException(400, error));
        }
    }

    private postFunctionsRequest = async (req: Request, res: Response, next: NextFunction): Promise<string | void> => {
        try {
            const { consumerAddress, subscriptionId, drug_details } = req.body;
            const response = await this.ChainlinkFunctionsService.request(consumerAddress, subscriptionId, drug_details);

            res.status(200).json(response);

            return response.toString();
        } catch (error: any) {
            console.log('Functions consumer request failed.');
            next(new HttpException(400, error));
        }
    }

    private postFunctionsResponse = async (req: Request, res: Response, next: NextFunction): Promise<string | void> => {
        try {
            await new Promise(resolve => setTimeout(resolve, 5000));

            const { consumerAddress } = req.body;

            // const fileContent = await readFileAsync('config.json', 'utf-8');
            // const parsedData = JSON.parse(fileContent);
            // console.log('Read data from file:', parsedData);

            // const consumerAddress = parsedData.consumerAddress;

            const response = await this.ChainlinkFunctionsService.readResponse(consumerAddress);
            const result = await getResponsePriceIndex(response);

            if (result) {
                res.status(200).json(result);
                return result;
            } else {
                res.status(404).json({ error: 'No response available' });
                return 'No response available';
            }
        } catch (error: any) {
            console.log('Read response failed.');
            next(new HttpException(400, error));
        }
    }

    private functionsConsumer = async (req: Request, res: Response, next: NextFunction): Promise<string | void> => {
        try {
            const linkAmount = "5";
            const deployedConsumerAddress = (await this.ChainlinkFunctionsService.deployConsumerContract("polygonMumbai")).toString();
            const subscriptionId = await this.ChainlinkFunctionsService.createAndFundSub("polygonMumbai", deployedConsumerAddress, linkAmount);

            // // Store data in localStorage
            // const data = {
            //     consumerAddress: deployedConsumerAddress,
            //     subscriptionId: subscriptionId,
            // };

            // fs.writeFile('config.json', JSON.stringify(data, null, 2), 'utf-8', (err) => {
            //     if (err) {
            //         console.error('Error writing to file:', err);
            //     } else {
            //         console.log('Data has been stored locally')
            //     }
            // })

            res.status(200).json({ consumerAddress: deployedConsumerAddress, subscriptionId: subscriptionId });

            return subscriptionId.toString();
        } catch (error: any) {
            next(new HttpException(400, error));
        }
    };

    private functionsRequest = async (req: Request, res: Response, next: NextFunction): Promise<string | void> => {
        try {
            const { consumerAddress, subscriptionId, drug_details } = req.body;

            // const fileContent = await readFileAsync('config.json', 'utf-8');
            // const parsedData = JSON.parse(fileContent);
            // console.log('Read data from file:', parsedData);

            // const consumerAddress = parsedData.consumerAddress;
            // const subscriptionId = parsedData.subscriptionId;

            const result = await this.ChainlinkFunctionsService.request(consumerAddress, subscriptionId, drug_details);

            res.status(200).json(result.toString());
        } catch (error: any) {
            next(new HttpException(400, error));
        }
    };

    private functionRequestProvider = async (req: Request, res: Response, next: NextFunction): Promise<string | void> => {
        try {
            const { consumerAddress, subscriptionId, drug, amount } = req.body;

            // const fileContent = await readFileAsync('config.json', 'utf-8');
            // const parsedData = JSON.parse(fileContent);
            // console.log('Read data from file:', parsedData);

            // const consumerAddress = parsedData.consumerAddress;
            // const subscriptionId = parsedData.subscriptionId;

            const result = await this.ChainlinkFunctionsService.requestProvider(consumerAddress, subscriptionId, drug, amount);

            res.status(200).json(result.toString());

        } catch (error: any) {
            console.log('Functions consumer for provider request failed.');
            next(new HttpException(400, error));
        }
    }

    private functionsResponseProvider = async (req: Request, res: Response, next: NextFunction): Promise<any[] | string | void> => {
        try {
            await new Promise(resolve => setTimeout(resolve, 5000));

            const { consumerAddress } = req.body;

            // const fileContent = await readFileAsync('config.json', 'utf-8');
            // const parsedData = JSON.parse(fileContent);
            // console.log('Read data from file:', parsedData);

            // const consumerAddress = parsedData.consumerAddress;

            const response = await this.ChainlinkFunctionsService.readResponse(consumerAddress);
            const result = await getResponseProvider(response);

        if (result) {
            res.status(200).json(result);
            return result;
        } else {
            res.status(404).json({ error: 'No response available' });
            return 'No response available';
        }
        } catch (error: any) {
        console.log('Read response failed.');
        next(new HttpException(400, error));
        }
    };

}

export default ChainlinkFunctionsController;
