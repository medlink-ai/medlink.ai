import { ProviderDetail } from "@/constants/types";
import axios from "axios";

export async function POST(request: Request) {
    try {
        const { product, budget, consumerAddress, subscriptionId } = await request.json();

        const functionRequest = await axios.post(`${process.env.API_BASE_URL}/api/chainlink-functions/function-request-provider`, {
            drug: product,
            amount: budget,
            consumerAddress,
            subscriptionId,
        });

        await functionRequest.data;

        await new Promise((resolve) => setTimeout(resolve, 8000));

        const functionResponse = await axios.post<ProviderDetail[]>(
            `${process.env.API_BASE_URL}/api/chainlink-functions/function-response-provider`,
            {
                consumerAddress,
            }
        );

        return Response.json(functionResponse.data);
    } catch (error) {
        return Response.json({ status: 500, message: "Internal Server Error", data: error });
    }
}
