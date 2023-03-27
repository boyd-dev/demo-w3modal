import React, {useEffect} from 'react';
import {Button, ButtonGroup, ButtonToolbar, Stack} from "react-bootstrap";
import {useAccount, useNetwork, useSignMessage, useSignTypedData} from "wagmi";
import {TEST_712_DOMAIN, TEST_712_MSG, TEST_712_TYPES, TEST_SIGN_MSG} from "../utils/Helper";
import _ from "lodash";

function SignTest() {

    const { isConnected } = useAccount();
    const { chain } = useNetwork();

    // personal_sign
    const signMessage = useSignMessage({
        message: TEST_SIGN_MSG,
        onError(error) {
            console.log(error.message);
        }
    });

    const { signTypedData, data } = useSignTypedData({
            domain: TEST_712_DOMAIN,
            types: TEST_712_TYPES,
            value: TEST_712_MSG
        }
    );

    useEffect(()=> {
        console.log(_.isEmpty(signMessage.data)?"-":signMessage.data);
    }, [signMessage.data]);

    useEffect(()=> {
        console.log(_.isEmpty(data)?"712":data);
    }, [data]);

    const handleSign = () => {
        if (isConnected) signMessage.signMessage();
    }

    const handleSign712 = () => {
        if (isConnected && chain.id === 11155111) signTypedData();
    }

    return (
        <>
            <Stack className="mt-1">
                <ButtonToolbar>
                    <ButtonGroup>
                        <Button variant="outline-success" onClick={handleSign}>Sign</Button>
                        <Button variant="outline-success" onClick={handleSign712}>Sign 712</Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </Stack>
        </>
    );
}

export default SignTest;