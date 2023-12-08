import { DrugDetails } from "@/constants/types";
import axios, { AxiosError } from "axios";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get("input");

    const res = await axios.get(`https://choh8fjgci.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/medlist/?input=${input}`);
    const product = await res.data;

    return Response.json({ product });
}

export async function POST(request: Request) {
    try {
        const { product } = await request.json();

        const functionRequest = await axios.post(`${process.env.API_BASE_URL}/api/chainlink-functions/functions-request-response`, {
            drug_details: product,
        });

        await functionRequest.data;

        const timeout = Date.now() + 60000;

        while (Date.now() < timeout) {
            try {
                await new Promise((resolve) => setTimeout(resolve, 5000));

                const functionResponse = await axios.post<DrugDetails>(`${process.env.API_BASE_URL}/api/chainlink-functions/post-functions-response`);
                const { product_name } = functionResponse.data;

                if (product_name === product) {
                    return Response.json(functionResponse.data);
                }
            } catch (loopError) {
                return Response.json({ status: loopError, message: "Internal Server Error", data: loopError });
            }
        }

        console.log("Timeout");
        return Response.json({ status: 500, message: "Timeout" });
    } catch (error) {
        return Response.json({ status: 500, message: "Internal Server Error", data: error });
    }
}
