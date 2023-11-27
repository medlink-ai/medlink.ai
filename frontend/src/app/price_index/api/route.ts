import axios from "axios";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get("input");

    const res = await axios.get(`https://choh8fjgci.execute-api.ap-southeast-1.amazonaws.com/dev/v1/ph/medlist/?input=${input}`);
    const product = await res.data;

    return Response.json({ product });
}
