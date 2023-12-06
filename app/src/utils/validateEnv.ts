import { cleanEnv, str } from "envalid";

function configEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ["development", "production"],
        }),
        PORT: str(),
        RPC_URL: str(),
        PRIVATE_KEY: str(),
        FRONTEND_URL: str(),
        HOSTED_SERVER_URL: str(),
        VERIFIER_DID: str(),
    });
}

export default configEnv;
