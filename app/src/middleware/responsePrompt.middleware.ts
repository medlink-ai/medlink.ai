import { decodeResult, ReturnType } from "@chainlink/functions-toolkit";
import { Contract } from "ethers";
import { signer } from '@/utils/connection';
import { abi } from '@/utils/contracts/abi/FunctionsConsumerAI.json';

const readResponsePrompt = async (consumerAddress: string): Promise<string> => {
    try {
        const functionsConsumer = new Contract(consumerAddress, abi, signer);

        const responseBytes = await functionsConsumer.s_lastResponse();

        const decodedResponse = decodeResult(responseBytes, ReturnType.string)

        return `${decodedResponse}`;
    } catch (error) {
        console.error('Error in readResponse:', error);
        throw error; 
    }
};

export default readResponsePrompt;
