import { Consumer } from "@/constants/types";
import axios from "axios";

export async function POST(request: Request) {
    const res = await axios.post<Consumer>(
        `${process.env.NEXT_PUBLIC_VERIFICATION_SERVER_LOCAL_HOST_URL}/api/chainlink-functions/functions-consumer-subscription`
    );
    const data = res.data;

    return Response.json(data);
}
