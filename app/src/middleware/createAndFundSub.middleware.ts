import { SubscriptionManager } from "@chainlink/functions-toolkit";
import { utils } from "ethers";
import { signer } from "@/utils/connection";
import { networks } from "@/utils/networks";
import HttpException from "@/utils/exceptions/http.exception";

const NETWORK = "polygonMumbai";

const functionsRouterAddress = networks[NETWORK].functionsRouter;
const linkTokenAddress = networks[NETWORK].linkToken;
const consumerAddress = "0x4d93a395cba2CAf125f7C33080281E7b972F32b6";
const LINK_AMOUNT = "5";

const createAndFundSub = async (): Promise<void> => {
    try {
        const subscriptionManager = new SubscriptionManager({
            signer,
            linkTokenAddress,
            functionsRouterAddress
        })

        await subscriptionManager.initialize();

        // Create Subscription
        const subscriptionId = await subscriptionManager.createSubscription();
        console.log(`Subscription ${subscriptionId} created.`)

        // Add consumer to subscription
        await subscriptionManager.addConsumer({
            subscriptionId,
            consumerAddress,
        })

        console.log(`Subscription ${subscriptionId} now has ${consumerAddress} as a consumer`);

        const juelsAmount = utils.parseUnits(LINK_AMOUNT, 18).toString();
        subscriptionManager.fundSubscription({
            subscriptionId,
            juelsAmount
        })

        console.log(`Subscription ${subscriptionId} funded with ${LINK_AMOUNT} LINK`);
    } catch (error: any) {
        console.log('Create and fund subscription failed.');
        throw new HttpException(400, error);
    }
}

export default createAndFundSub;
