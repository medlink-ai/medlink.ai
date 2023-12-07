import { decodeResult, ReturnType } from "@chainlink/functions-toolkit";
import { Contract } from "ethers";
import { signer } from '@/utils/connection';
import { abi } from '@/utils/contracts/abi/FunctionsConsumer.json';

const readResponse = async (consumerAddress: string): Promise<string> => {
    const functionsConsumer = new Contract(consumerAddress, abi, signer);

    const responseBytes = await functionsConsumer.s_lastResponse();
    console.log("Response Bytes : ", responseBytes);

    const decodedResponse = decodeResult(responseBytes, ReturnType.string);

    return `${decodedResponse}`;
}

export default readResponse;