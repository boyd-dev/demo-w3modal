import {useEffect, useState} from "react";
import {Button, ButtonGroup, ButtonToolbar, Stack} from "react-bootstrap";
import _ from "lodash";
import {
    usePrepareSendTransaction,
    useSendTransaction,
    useSignMessage,
    useAccount, usePrepareContractWrite, useContractWrite,
} from "wagmi";

import { SimpleStorageAbi } from "../contracts/SimpleStorageAbi";
import {checkTxHash, TEST_CONTRACT, TEST_SIGN_MSG, TEST_TX_OBJ} from "../utils/Helper";
import useMinedTransaction from "../web3/useMinedTransaction";
import Spinner from "./Spinner";

function Main({setAlert}) {

    const { isConnected } = useAccount();
    const [txInfo, setTxInfo] = useState({});
    const [spinner, setSpinner] = useState(false);

    // 미리 트랜잭션을 테스트
    const { config } = usePrepareSendTransaction({
        request: TEST_TX_OBJ,
        onError(error) {
            console.log(error.message);
            if (isConnected) setAlert(error.message);
        }
    })

    // usePrepareSendTransaction 후에 성공한 경우에만 트랜잭션 전송 가능
    const { sendTransaction } = useSendTransaction(
        {
            ...config,
            onSuccess(tx) {
                const hash = checkTxHash(tx);
                console.log(`tx hash=${hash}`);
                setTxInfo({txHash: hash, toAddress: TEST_TX_OBJ.to});
            },
            onError(error) {
                console.log("sendTransaction failed");
                if (isConnected) setAlert(error.message);
                setSpinner(false);
            }
        }
    );


    const contract = usePrepareContractWrite({
        address: TEST_CONTRACT,
        abi: SimpleStorageAbi,
        functionName: "set",
        args: [1234],
        // onError(error) {
        //     console.log(error.message);
        //     if (isConnected) setAlert(error.message);
        // }
    })

    const { write } = useContractWrite(
        {
            ...contract.config,
            onSuccess(tx) {
                setTxInfo({txHash: checkTxHash(tx), toAddress: TEST_CONTRACT});
            },
            onError(error) {
                console.log("Contract write failed");
                if (isConnected) setAlert(error.message);
                setSpinner(false);
            }
        }
    );


    // personal_sign
    const signMessage = useSignMessage({
        message: TEST_SIGN_MSG,
        onError(error) {
            console.log(error.message);
        }
    });

    useEffect(()=> {
        console.log(_.isEmpty(signMessage.data)?"-":signMessage.data);
    }, [signMessage.data]);


    // 트랜잭션이 블록에 저장되면 화면에 트랜잭션 해시를 표시
    const {minedHash} = useMinedTransaction(txInfo);
    useEffect(()=>{
        if (!_.isEmpty(minedHash)) {
            setSpinner(false);
            setAlert(`Tx hash :: ${minedHash}`);
        }
    }, [minedHash]);

    const handleSend = () => {
        if (isConnected) {
            sendTransaction();
            setSpinner(true);
        }
    }

    const handleSign = () => {
        if (isConnected) signMessage.signMessage();
    }

    const handleSendContract = () => {
        if (isConnected) {
            write();
            setSpinner(true);
        }
    }

    return (
        <>
            <Stack className="mt-1">
                <ButtonToolbar>
                    <ButtonGroup>
                        <Button variant="outline-success" disabled={!sendTransaction} onClick={handleSend}>Send Tx</Button>
                        <Button variant="outline-success" onClick={handleSign}>Sign</Button>
                        <Button variant="outline-success" disabled={!write} onClick={handleSendContract}>Contract Tx</Button>
                    </ButtonGroup>
                </ButtonToolbar>
            </Stack>
            <Stack>
                {
                    spinner?<Spinner/>:null
                }
            </Stack>
        </>
    );

}

export default Main;