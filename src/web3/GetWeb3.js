// WalletConnect cloud
const PROJECT_ID = "";

// Alchemy
const API_KEY_ALCHEMY = "";
const API_KEY_ALCHEMY_ARBITRUM = "";
const API_KEY_ALCHEMY_OPTIMISM = "";
const API_KEY_ALCHEMY_GOERLI = "";
const API_KEY_ALCHEMY_SEPOLIA = "";

const getJsonRpcProviders = (chainId) => {

        let endpoint = {};
        switch (chainId) {
            case 1:
                endpoint = {
                    http: `https://eth-mainnet.g.alchemy.com/v2/${API_KEY_ALCHEMY}`,
                    webSocket: `wss://eth-mainnet.g.alchemy.com/v2/${API_KEY_ALCHEMY}`
                }
                break;
            case 42161:
                endpoint = {
                    http: `https://arb-mainnet.g.alchemy.com/v2/${API_KEY_ALCHEMY_ARBITRUM}`,
                    webSocket: `wss://arb-mainnet.g.alchemy.com/v2/${API_KEY_ALCHEMY_ARBITRUM}`
                }
                break;
            case 10:
                endpoint = {
                    http: `https://opt-mainnet.g.alchemy.com/v2/${API_KEY_ALCHEMY_OPTIMISM}`,
                    webSocket: `wss://opt-mainnet.g.alchemy.com/v2/${API_KEY_ALCHEMY_OPTIMISM}`
                }
                break;
            case 280:
                endpoint = {
                    http: "https://testnet.era.zksync.dev/",
                    webSocket: "wss://testnet.era.zksync.dev/ws"
                }
                break;
            case 5:
                endpoint = {
                    http: `https://eth-goerli.g.alchemy.com/v2/${API_KEY_ALCHEMY_GOERLI}`,
                    webSocket: `wss://eth-goerli.g.alchemy.com/v2/${API_KEY_ALCHEMY_GOERLI}`
                }
                break;
            case 11155111:
                endpoint = {
                    http: `https://eth-sepolia.g.alchemy.com/v2/${API_KEY_ALCHEMY_SEPOLIA}`,
                    webSocket: `wss://eth-sepolia.g.alchemy.com/v2/${API_KEY_ALCHEMY_SEPOLIA}`
                }
                break;
            default:

        }
        return endpoint;
}

export default PROJECT_ID;

export {
    getJsonRpcProviders,
}