import { decodeResult, ReturnType } from "@chainlink/functions-toolkit";
import { Contract } from "ethers";
import { signer } from '@/utils/connection';
import { abi } from '@/utils/contracts/abi/FunctionsConsumer.json';

const MAX_ATTEMPTS = 3;

const readResponse = async (consumerAddress: string): Promise<string> => {
    const functionsConsumer = new Contract(consumerAddress, abi, signer);
    let attempts = 0;
    let responseBytes;

    do {
        responseBytes = await functionsConsumer.s_lastResponse();
        attempts++;
    } while ((responseBytes === 0 || responseBytes === undefined || responseBytes === null) && attempts < MAX_ATTEMPTS);

    if (responseBytes === 0 || responseBytes === undefined || responseBytes === null) {
        throw new Error('Invalid response received after maximum attempts');
    }

    console.log("Response Bytes : ", responseBytes);
    const decodedResponse = decodeResult(responseBytes, ReturnType.string);

    return `${decodedResponse}`;
}

export default readResponse;