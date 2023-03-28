import React from 'react';
import { mainnet, arbitrum, goerli, sepolia, optimism } from "wagmi/chains";
import {configureChains, createClient, WagmiConfig} from "wagmi";
import { LedgerConnector } from "wagmi/connectors/ledger";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal} from "@web3modal/react";
import PROJECT_ID, { getJsonRpcProviders } from "./web3/GetWeb3";

import Home from "./pages/Home";
import "./css/bootstrap-5.2.3-dist/css/bootstrap.min.css";

const CHAINS = [mainnet, goerli, sepolia];
const { provider, webSocketProvider, chains } = configureChains(
    CHAINS,
    [
        // WalletConnect 자체 provider 는 아직 웹소켓과 세폴리아를 지원하지 않는 것 같다.
        //w3mProvider({ projectId: PROJECT_ID }),
        jsonRpcProvider(
            {
                rpc: (chain) => getJsonRpcProviders(chain.id)
            }
        )
    ]
);

/*
const standalone = new WalletConnectConnector(
    {
        chains: CHAINS,
        options: {
            projectId: PROJECT_ID,
            showQrModal: false,
            rpcMap: {
                1: "https://eth-mainnet.g.alchemy.com/v2/",
                5: "https://eth-goerli.g.alchemy.com/v2/",
                11155111: "https://eth-sepolia.g.alchemy.com/v2/"
            }
        },
    }
);
*/


const ledgerConnector = new LedgerConnector({
    chains,
})

const coinbaseConnector = new CoinbaseWalletConnector({
    chains
})

const wagmiClient = createClient({
    autoConnect: true,
    connectors: [
        ...w3mConnectors(
            {
                projectId: PROJECT_ID,
                version: 2, // WalletConnect V2
                chains
            }
        ),
        coinbaseConnector,
        ledgerConnector
    ],
    provider,
    webSocketProvider
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

function App() {

    return (
        <>
            {/* WagmiConfig 하위에 컴포넌트들을 배치한다. */}
            <WagmiConfig client={wagmiClient}>
                <Home/>
            </WagmiConfig>
            <Web3Modal
                projectId={PROJECT_ID}
                ethereumClient={ethereumClient}
                enableNetworkView={true}
                enableAccountView={false}
                enableExplorer={false}
                // themeVariables={{
                //     "--w3m-background-color": "#FF0000"
                // }}
            />
        </>
    );
}

export default App;