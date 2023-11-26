import { decodeResult, ReturnType } from "@chainlink/functions-toolkit";
import { Contract } from "ethers";
import { signer } from '@/utils/connection';
import { abi } from '@/utils/contracts/abi/FunctionsConsumer.json';

const consumerAddress = "0x969FA82452E57A1cdDB709278efA0f6d826fE672";

const readResponse = async (): Promise<void> => {
    const functionsConsumer = new Contract(consumerAddress, abi, signer);

    const responseBytes = await functionsConsumer.s_lastResponse();
    console.log("Response Bytes : ", responseBytes);

    const decodedResponse = decodeResult(responseBytes, ReturnType.string);

    console.log("Price Index : ", decodedResponse);
}

export default readResponse;