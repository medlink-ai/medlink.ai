import { SecretsManager } from "@chainlink/functions-toolkit";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";
import { signer } from "@/utils/connection";
import HttpException from '@/utils/exceptions/http.exception';
import { Networks } from "@/utils/interfaces/networks.interface";
import { networks } from "@/utils/networks";

const encryptedSecretsRef = async (NETWORK: keyof Networks): Promise<string> => {
    try {
        const functionsRouterAddress = networks[NETWORK].functionsRouter;
        const donId = networks[NETWORK].donId;

        const secretsManager = new SecretsManager({
            signer,
            functionsRouterAddress,
            donId
        })

        await secretsManager.initialize();

        const secrets = {
            apiKey: process.env.GPT_API_KEY as string,
        }

        const encryptedSecretObj = await secretsManager.encryptSecrets(secrets);

        const gatewayUrls = networks[NETWORK].gatewayUrls;

        const slotId = 0;

        const minutesUntilExpiration = 75;

        const { version, success } = await secretsManager.uploadEncryptedSecretsToDON({
            encryptedSecretsHexstring: encryptedSecretObj.encryptedSecrets,
            gatewayUrls,
            slotId,
            minutesUntilExpiration
        });

        if (success) {
            console.log("Uploaded secrets to DON...")
            const encryptedSecretsReference = secretsManager.buildDONHostedEncryptedSecretsReference({
                slotId,
                version
            })

            console.log(`make a noted of the encryptedSecretsReference: ${encryptedSecretsReference}`);
            
            return encryptedSecretsReference;
        }

        return 'Error on encryption';
    } catch (error: any) {
        console.error("Cannot create encryted secret reference");
                throw new HttpException(400, error);
    }
}

export default encryptedSecretsRef;