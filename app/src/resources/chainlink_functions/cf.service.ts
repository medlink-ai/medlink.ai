import HttpException from "@/utils/exceptions/http.exception";
import deployFunctionsConsumerContract from "@/middleware/deployConsumer.middleware";
import createFundSub from "@/middleware/createAndFundSub.middleware";
import request from '@/middleware/request.middleware';
import requestProvider from '@/middleware/requestProvider.middleware';
import readResponse from "@/middleware/readResponse.middleware";
import { Networks } from "@/utils/interfaces/networks.interface";
import { wallet } from "@/utils/connection";
import sendRequestProvider from "@/middleware/requestLicense.middleware";

class ChainlinkFunctionsService {
    public async deployConsumerContract(NETWORK: keyof Networks): Promise<string | Error> {
        try {
            const deployedConsumerAddress = await deployFunctionsConsumerContract(NETWORK);
            return deployedConsumerAddress;
        } catch (error: any) {
            console.log('Cannot deploy Functions Consumer contract');
            throw new HttpException(400, error.message);
        }
    }

    public async createAndFundSub(NETWORK: keyof Networks, consumerAddress: string, linkAmount: string): Promise<string | Error> {
        try {
            const subscriptionId = await createFundSub(NETWORK, consumerAddress, linkAmount);
            return subscriptionId;
        } catch (error: any) {
            console.log('Cannot create and fund subscription.');
            throw new HttpException(400, error.message);
        }
    }

    public async request(consumerAddress: string, subscriptionId: string, drug_details: string): Promise<string | Error> {
        try {
            const response = await request(consumerAddress, subscriptionId, drug_details);
            return response;
        } catch (error: any) {
            console.log('Cannot request for price index.');
            throw new HttpException(400, error.message);
        }
    }

    public async requestProvider(consumerAddress: string, subscriptionId: string, drug_details: string, amount: string): Promise<string | Error> {
        try {
            const response = await requestProvider(consumerAddress, subscriptionId, drug_details, amount);
            return response;
        } catch (error: any) {
            console.log('Cannot request for price index.');
            throw new HttpException(400, error.message);
        }
    }

    public async readResponse(walletAddress: string): Promise<string | Error> {
        try {
            const response = await readResponse(walletAddress);
            return response;
        } catch (error: any) {
            console.log(`Cannot license number from: ${walletAddress}`);
            throw new HttpException(400, error.message);
        }
    }

    public async requestLicense(consumerAddress: string, subscriptionId: string, walletAddress: string): Promise<string | Error> {
        try {
            const response = await sendRequestProvider(consumerAddress, subscriptionId, walletAddress);
            return response;
        } catch (error: any) {
            console.log('Cannot request for price index.');
            throw new HttpException(400, error.message);
        }
    }

    public async readLicense(walletAddress: string): Promise<string | Error> {
        try {
            const response = await readResponse(walletAddress);
            return response;
        } catch (error: any) {
            console.log(`Cannot license number from: ${walletAddress}`);
            throw new HttpException(400, error.message);
        }
    }
}

export default ChainlinkFunctionsService;