const fs = require("fs");
const path = require("path");
const { SubscriptionManager, simulateScript, ResponseListener, ReturnType, decodeResult, FulfillmentCode } = require("@chainlink/functions-toolkit");
const { abi } = require('./contracts/abi/FunctionsConsumer.json');
const ethers = require("ethers");
require("dotenv").config();

const consumerAddress = "0x2a1c9224e4ebd41d9d33cc9203afbd6a2b664bd7";
const subscriptionId = 1030;

const makeRequestMumbai = async () => {
  // Initialize functions settings
  const source = fs
    .readFileSync(path.resolve(__dirname, "source.js"))
    .toString();

  const args = ["Losartan 50mg Film-Coated Tablet", "10.0"];

  // Initialize ethers signer and provider to interact with the contracts onchain
  const privateKey = process.env.PRIVATE_KEY; // fetch PRIVATE_KEY
  if (!privateKey)
    throw new Error(
      "private key not provided - check your environment variables"
  );

  const rpcUrl = process.env.POLYGON_MUMBAI_RPC_URL; // fetch sepolia RPC URL

  if (!rpcUrl)
    throw new Error(`rpcUrl not provided  - check your environment variables`);

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider); // create ethers signer for signing transactions

  const functionsConsumer = new ethers.Contract(consumerAddress, abi, signer);

  const callbackGasLimit = 300_000;

  console.log("Sending the request...");

  const requestTx = await functionsConsumer.sendRequest(
      source,
      args,
      [],
      subscriptionId,
      callbackGasLimit,
  )

  const txReceipt = await requestTx.wait(1);
  const requestId = txReceipt.events[2].args.id;
  console.log(`Request made. Request id is ${requestId}. TxHash is ${requestTx.hash}`);
  return `Request made. Request id is ${requestId}. TxHash is ${requestTx.hash}`;
}

makeRequestMumbai().catch((e) => {
    console.error(e);
    process.exit(1);
})