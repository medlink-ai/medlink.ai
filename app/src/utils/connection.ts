import "dotenv/config";
import { providers, Wallet } from "ethers";

const { RPC_URL, PRIVATE_KEY } = process.env;

const provider = new providers.JsonRpcProvider(RPC_URL as string);
const wallet = new Wallet(PRIVATE_KEY as string);
const signer = wallet.connect(provider);

export { provider, wallet, signer };