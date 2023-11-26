export interface Network {
  gasPrice: number | undefined;
  nonce: number | undefined;
  accounts: string[];
  verifyApiKey: string;
  chainId: number;
  confirmations: number;
  nativeCurrencySymbol: string;
  linkToken: string;
  linkPriceFeed: string;
  functionsRouter: string;
  donId: string;
  gatewayUrls: string[];
}

export interface Networks {
  ethereumSepolia: Network;
  polygonMumbai: Network;
}