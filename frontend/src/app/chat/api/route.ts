import axios from "axios";
import { isUndefined } from "lodash";

export async function POST(request: Request) {
    let previousResponse = "";

    try {
        const { prompt } = await request.json();

        const functionRequest = await axios.post(
            `${process.env.NEXT_PUBLIC_VERIFICATION_SERVER_LOCAL_HOST_URL}/api/chainlink-functions/function-request-openai-prompt`,
            {
                prompt: prompt,
            }
        );
        await functionRequest.data;

        let functionResponse: string | undefined;

        while (isUndefined(functionResponse) || previousResponse === functionResponse) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            await axios
                .post<string>(`${process.env.NEXT_PUBLIC_VERIFICATION_SERVER_LOCAL_HOST_URL}/api/chainlink-functions/function-response-openai-prompt`)
                .then((res) => {
                    functionResponse = res.data;
                });
        }

        previousResponse = functionResponse;
        return Response.json(functionResponse);
    } catch (error) {
        return Response.json({ status: 500, message: "Internal Server Error", data: error });
    }
}
