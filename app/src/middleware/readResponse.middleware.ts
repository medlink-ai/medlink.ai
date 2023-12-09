import { decodeResult, ReturnType } from "@chainlink/functions-toolkit";
import { Contract } from "ethers";
import { signer } from '@/utils/connection';
import { abi } from '@/utils/contracts/abi/FunctionsConsumer.json';

const readResponse = async (consumerAddress: string): Promise<string> => {
    try {
        const functionsConsumer = new Contract(consumerAddress, abi, signer);

        const responseBytes = await functionsConsumer.s_lastResponse();

        if (!isInvalidResponse(responseBytes)) {
            const decodedResponse = decodeResult(responseBytes, ReturnType.string);
            console.log(decodedResponse);
            return `${decodedResponse}`;
        }

        throw new Error('Invalid response received after maximum attempts');
    } catch (error) {
        console.error('Error in readResponse:', error);
        throw error; // Re-throw the error to propagate it to the calling code
    }
};

const isInvalidResponse = (responseBytes: any): boolean => {
    return responseBytes === 0 || responseBytes === undefined || responseBytes === null;
};

export default readResponse;
