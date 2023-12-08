import { Consumer } from "@/constants/types";
import axios from "axios";

export async function POST(request: Request) {
    const res = await axios.post<Consumer>(`${process.env.API_BASE_URL}/api/chainlink-functions/functions-consumer-subscription`);
    const data = res.data;

    return Response.json(data);
}
