import { abi, bytecode } from "@/utils/contracts/abi/FunctionsConsumer.json";
import { wallet, signer } from "@/utils/connection";
import { Networks } from "@/utils/interfaces/networks.interface";
import { networks } from "@/utils/networks";
import { ContractFactory, utils } from "ethers";
import HttpException from "@/utils/exceptions/http.exception";

const deployFunctionsConsumerContract = async (NETWORK: keyof Networks ): Promise<string | Error> => {
  try {
    const routerAddress = networks[NETWORK].functionsRouter;
    const donIdBytes32: string = utils.formatBytes32String(networks[NETWORK].donId);
    const contractFactory: ContractFactory = new ContractFactory(abi, bytecode, wallet);

    console.log(
      `Deploying FunctionsConsumer contract on network ${NETWORK}...`
    );
    const functionsConsumerContract = await contractFactory
      .connect(signer)
      .deploy(routerAddress, donIdBytes32);

    await functionsConsumerContract.deployed();
    console.log(`FunctionsConsumer deployed at address ${functionsConsumerContract.address}`);

    return functionsConsumerContract.address;
  } catch (error: any) {
    console.log('Canno deploy Functions Consumer contract');
    throw new HttpException(400, error);
  }
};

export default deployFunctionsConsumerContract;
