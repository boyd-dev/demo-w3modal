import React, {useEffect, useState} from 'react';
import {Alert, Button, ButtonGroup, ButtonToolbar, Card, Col, Container, Row} from "react-bootstrap";
import _ from "lodash";
import { mainnet, arbitrum, goerli, sepolia, optimism } from "wagmi/chains";
import {configureChains, createClient, useAccount, useNetwork, WagmiConfig} from "wagmi";
import { LedgerConnector } from "wagmi/connectors/ledger";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { useWeb3Modal, Web3Modal} from "@web3modal/react";
import PROJECT_ID, { getJsonRpcProviders } from "./web3/GetWeb3";
import Main from "./pages/Main";

import "./css/bootstrap-5.2.3-dist/css/bootstrap.min.css";

const { provider, webSocketProvider, chains } = configureChains(
    [ mainnet, goerli, sepolia ],
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

    const [alert, setAlert] = useState("");
    const [address, setAddress] = useState("");

    const { open } = useWeb3Modal();
    const { chain } = useNetwork();

    useAccount({
        onConnect({ address }) {
            setAddress(address);
            console.log(`WalletConnect version=${ethereumClient.walletConnectVersion}`);
        },
        onDisconnect() {
            setAddress("");
            setAlert("Disconnected");
        }
    });

    useEffect(()=>{
        if (chain !== undefined && !_.isEmpty(address)) {

            setAlert(`${chain.name} :: ${address}`);

            // 메타마스크 계정 변경 accountChanged
            // 애플리케이션에 연결이 되어 있는 경우에만 발생
            ethereumClient.watchAccount((account)=>{
                setAddress(account.address);
            })

            // 메타마스크 네트워크 변경 chainChanged
            ethereumClient.watchNetwork((network)=>{
                console.log(network);
            })
        }
    }, [address, chain]);

    const handleOpen = async () => {
        if (_.isEmpty(address)) {
            await open();
        }
    }

    const handleDisconnect = async () => {
        await ethereumClient.disconnect();
        setAddress("");
    }

    return (
        <Container fluid className="mt-3 col-md-6">
            <Row>
                <Col>
                    <Card>
                        <Card.Header>Web3Modal V2</Card.Header>
                        <Card.Body>
                            <ButtonToolbar>
                                <ButtonGroup>
                                    <Button variant="outline-primary" onClick={handleOpen}>Connect</Button>
                                    <Button variant="outline-primary" onClick={handleDisconnect}>Disconnect</Button>
                                </ButtonGroup>
                            </ButtonToolbar>
                            {/* WagmiConfig 하위에 컴포넌트들을 배치한다. */}
                            <WagmiConfig client={wagmiClient}>
                                <Main setAlert={setAlert}/>
                            </WagmiConfig>
                            <Web3Modal
                                projectId={PROJECT_ID}
                                ethereumClient={ethereumClient}
                                enableNetworkView={true}
                                enableAccountView={false}
                                enableExplorer={false}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    {alert?
                        <Alert variant="success" className="text-break">{alert}</Alert>
                        :null
                    }
                </Col>
            </Row>
        </Container>
    );
}

export default App;