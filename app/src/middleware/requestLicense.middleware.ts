import { Contract } from 'ethers';
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";
import { signer } from '@/utils/connection';
import { abi } from '@/utils/contracts/abi/FunctionsConsumer.json';

const requestLicense = async (consumerAddress: string, subscriptionId: string, walletAddress: string): Promise<string> => {
    if (!consumerAddress || !subscriptionId) {
        throw new Error("Missing required environment variables");
    }

    const functionsConsumer = new Contract(consumerAddress, abi, signer);

    const source = fs.readFileSync(path.resolve(__dirname, "../../../source3.js")).toString();

    const args = [walletAddress];
    const callbackGasLimit = 300_000;

    console.log("Sending the request...");

    const requestTx = await functionsConsumer.sendRequest(
        source,
        args,
        [],
        subscriptionId,
        callbackGasLimit,
    )

    const txReceipt = await requestTx.wait(1);
    const requestId = txReceipt.events[2].args.id;
    console.log(`Request made. Request id is ${requestId}. TxHash is ${requestTx.hash}`);
    return `Request made. Request id is ${requestId}. TxHash is ${requestTx.hash}`;
}

export default requestLicense;