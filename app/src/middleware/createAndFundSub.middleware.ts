import { SubscriptionManager } from "@chainlink/functions-toolkit";
import { utils } from "ethers";
import { signer } from "@/utils/connection";
import { networks } from "@/utils/networks";
import HttpException from "@/utils/exceptions/http.exception";
import { Networks } from "@/utils/interfaces/networks.interface";


const createAndFundSub = async (NETWORK: keyof Networks, consumerAddress: string, LINK_AMOUNT: string): Promise<string> => {
    try {
        const functionsRouterAddress = networks[NETWORK].functionsRouter;
        const linkTokenAddress = networks[NETWORK].linkToken;
        
        const subscriptionManager = new SubscriptionManager({
            signer,
            linkTokenAddress,
            functionsRouterAddress
        })

        console.log(`Subscrition manager starting to initialize...`)

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

        return subscriptionId.toString();
    } catch (error: any) {
        console.log('Create and fund subscription failed.');
        throw new HttpException(400, error);
    }
}

export default createAndFundSub;
