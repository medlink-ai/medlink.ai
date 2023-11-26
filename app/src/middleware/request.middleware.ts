import { Contract } from 'ethers';
import * as fs from "fs";
import * as path from "path";
import { Location } from '@chainlink/functions-toolkit';
import "dotenv/config";
import { signer } from '@/utils/connection';
import { abi } from '@/utils/contracts/abi/FunctionsConsumer.json';

const consumerAddress = "0x969FA82452E57A1cdDB709278efA0f6d826fE672";
const subscriptionId = "939";

const sendRequest = async (): Promise<void> => {
    if (!consumerAddress || !subscriptionId) {
        throw new Error("Missing required environment variables");
    }

    const functionsConsumer = new Contract(consumerAddress, abi, signer);

    const source = fs.readFileSync(path.resolve(__dirname, "../../../source.js")).toString();

    const args = ["Losartan 50mg Film-Coated Tablet"];
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
}

export default sendRequest;