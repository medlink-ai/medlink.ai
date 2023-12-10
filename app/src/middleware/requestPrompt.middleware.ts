import { Contract } from 'ethers';
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";
import { signer } from '@/utils/connection';
import { abi } from '@/utils/contracts/abi/FunctionsConsumerAI.json';
import { Location } from "@chainlink/functions-toolkit";
import HttpException from '@/utils/exceptions/http.exception';

const sendRequestPrompt = async (consumerAddress: string, subscriptionId: string, encryptedSecretsRef: string, prompt: string): Promise<string> => {
    try {
        if (!consumerAddress || !subscriptionId || !encryptedSecretsRef) {
            throw new Error("Missing required environment variables");
        }

        console.log('encr', encryptedSecretsRef)
        const functionsConsumer = new Contract(consumerAddress, abi, signer)

        const source = fs.readFileSync(path.resolve(__dirname, "../../../source4.js")).toString();

        const args = [`${prompt}. Provide reply in less than 10 words.`];
        const callbackGasLimit = 300000;

        console.log("Sending the request...");

        const requestTx = await functionsConsumer.sendRequest(
            source,
            Location.DONHosted,
            encryptedSecretsRef,
            args,
            [],
            subscriptionId,
            callbackGasLimit
        )

        const txReceipt = await requestTx.wait(1);
        const requestId = txReceipt.events[2].args.id;
        console.log(`Request made. Request id is ${requestId}. TxHash is ${requestTx.hash}`);
        return `Request made. Request id is ${requestId}. TxHash is ${requestTx.hash}`;
    } catch (error: any) {
        console.log(`Error making open AI functions request`, error)
        throw new HttpException(400, error);
    }
}

export default sendRequestPrompt;