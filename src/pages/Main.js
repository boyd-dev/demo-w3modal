import {Alert, Button, ButtonGroup, ButtonToolbar, Col, Container, Row, Stack} from "react-bootstrap";
import {Route, Routes} from "react-router-dom";
import React, {useEffect, useState} from "react";
import _ from "lodash";
import {useWeb3Modal} from "@web3modal/react";
import {useAccount, useDisconnect, useNetwork} from "wagmi";
import SendTest from "./SendTest";
import SignTest from "./SignTest";


function Main() {

    const { open } = useWeb3Modal();
    const { disconnect } = useDisconnect();
    const { chain } = useNetwork();

    const { isConnected } = useAccount({
        onConnect({ address }) {
            setAddress(address);
        },
        onDisconnect() {
            setAddress("");
            setAlert("Disconnected");
        }
    });

    const [address, setAddress] = useState("");
    const [alert, setAlert] = useState("");

    useEffect(()=>{
        if (chain !== undefined && !_.isEmpty(address)) {
            setAlert(`${chain.name} :: ${address}`);
        }
    }, [address, chain]);

    const handleOpen = async () => {
        if (_.isEmpty(address)) {
            await open();
        }
    }

    const handleDisconnect = () => {
        disconnect();
        setAddress("");
    }

    return (
        <Container fluid style={{marginTop:'20px'}}>
            <Row>
                <Col>
                    <Stack className="col-md-3">
                        <ButtonToolbar>
                            <ButtonGroup>
                                <Button variant="outline-primary" onClick={handleOpen}>Connect</Button>
                                <Button variant="outline-primary" onClick={handleDisconnect}>Disconnect</Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                    </Stack>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <Routes>
                        <Route path="*" element={<SendTest setAlert={setAlert}/>} />
                        <Route path="/sign" element={<SignTest/>} />
                    </Routes>
                </Col>
            </Row>
            <Row className="pt-3">
                <Col>
                    <Alert variant="success" className="text-break">{alert}</Alert>
                </Col>
            </Row>
        </Container>
    )

}

export default Main;