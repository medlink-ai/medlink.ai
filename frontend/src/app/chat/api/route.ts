import { cat } from "@xenova/transformers";
import axios from "axios";
import { isUndefined } from "lodash";

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        console.log(prompt);

        const functionRequest = await axios.post(
            `${process.env.NEXT_PUBLIC_VERIFICATION_SERVER_LOCAL_HOST_URL}/api/chainlink-functions/function-request-openai-prompt`,
            {
                prompt: prompt,
            }
        );
        const data = await functionRequest.data;

        console.log("Function Request Done", data);

        let functionResponse: string | undefined;

        while (isUndefined(functionResponse)) {
            console.log("Waiting for function response", functionResponse);
            await new Promise((resolve) => setTimeout(resolve, 5000));
            await axios
                .post<string>(`${process.env.NEXT_PUBLIC_VERIFICATION_SERVER_LOCAL_HOST_URL}/api/chainlink-functions/function-response-openai-prompt`)
                .then((res) => (functionResponse = res.data));
        }

        return Response.json(functionResponse);
    } catch (error) {
        return Response.json({ status: 500, message: "Internal Server Error", data: error });
    }
}
