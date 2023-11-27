import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import ChainlinkFunctionsService from '@/resources/chainlink_functions/cf.service';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/chainlink_functions/cf.validation';
import * as fs from 'fs';
import { promisify } from 'util';

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
            validationMiddleware(validate.deployConsumerContract),
            this.deployConsumer
        )

        this.router.post(
            `${this.path}/create-fund-subscription`,
            validationMiddleware(validate.createAndFundSub),
            this.createAndFundSub
        )

        this.router.post(
            `${this.path}/request`,
            validationMiddleware(validate.request),
            this.request
        )

        this.router.post(
            `${this.path}/read-response`,
            validationMiddleware(validate.response),
            this.readResponse
        )

        this.router.post(
            `${this.path}/functions-consumer-subscription`,
            validationMiddleware(validate.functionsConsumer),
            this.functionsConsumer
        )

        this.router.post(
            `${this.path}/functions-request-response`,
            this.functionsRequest
        )
    }

    private deployConsumer = async (req: Request, res: Response, next: NextFunction): Promise<string | void> => {
        try {
            const { NETWORK } = req.body;
            const deployedConsumerAddress = await this.ChainlinkFunctionsService.deployConsumerContract(NETWORK);
            
            res.status(200).json({ deployedConsumerAddress });

            return deployedConsumerAddress.toString();
        } catch (error: any) {
            next(new HttpException(400, error));
        }
    }

    private createAndFundSub = async (req: Request, res: Response, next: NextFunction): Promise<string | void> => {
        try {
            const { NETWORK, consumerAddress, linkAmount  } = req.body;
            const subscriptionId = await this.ChainlinkFunctionsService.createAndFundSub(NETWORK, consumerAddress, linkAmount);
            res.status(200).json(subscriptionId);

            return subscriptionId.toString();
        } catch (error: any) {
            next(new HttpException(400, error));
        }
    }

    private request = async (req: Request, res: Response, next: NextFunction): Promise<string | void> => {
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

    private readResponse = async (req: Request, res: Response, next: NextFunction): Promise<string | void> => {
        try {
            const { consumerAddress } = req.body;
            const response = await this.ChainlinkFunctionsService.readResponse(consumerAddress);
            res.status(200).json(response);

            return response.toString();
        } catch (error: any) {
            console.log('Read response failed.');
            next(new HttpException(400, error));
        }
    }

    private functionsConsumer = async (req: Request, res: Response, next: NextFunction): Promise<string | void> => {
        try {
            const { NETWORK } = req.body;
            const linkAmount = "5";
            const deployedConsumerAddress = (await this.ChainlinkFunctionsService.deployConsumerContract(NETWORK)).toString();
            const subscriptionId = await this.ChainlinkFunctionsService.createAndFundSub(NETWORK, deployedConsumerAddress, linkAmount);

            // Store data in localStorage
            const data = {
                consumerAddress: deployedConsumerAddress,
                subscriptionId: subscriptionId,
            };

            fs.writeFile('config.json', JSON.stringify(data, null, 2), 'utf-8', (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                } else {
                    console.log('Data has been stored locally')
                }
            })

            res.status(200).json({ consumerAddress: deployedConsumerAddress, subscriptionId: subscriptionId });

            return subscriptionId.toString();
        } catch (error: any) {
            next(new HttpException(400, error));
        }
    };

    private functionsRequest = async (req: Request, res: Response, next: NextFunction): Promise<string | void> => {
        try {
            const { drug_details } = req.body;

            try {
                // Use promisified fs.readFile
                const fileContent = await readFileAsync('config.json', 'utf-8');
                const parsedData = JSON.parse(fileContent);
                console.log('Read data from file:', parsedData);

                const consumerAddress = parsedData.consumerAddress;
                const subscriptionId = parsedData.subscriptionId;

                await this.ChainlinkFunctionsService.request(consumerAddress, subscriptionId, drug_details);
                const response = await this.ChainlinkFunctionsService.readResponse(consumerAddress);

                if (response) {
                    res.status(200).json(response.toString());
                    return response.toString();
                } else {
                    res.status(404).json({ error: 'No response available' });
                    return 'No response available';
                }
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                throw new HttpException(500, 'Error parsing JSON');
            }
        } catch (error: any) {
            next(new HttpException(400, error));
        }
    };

}

export default ChainlinkFunctionsController;
