import {useEffect, useState} from "react";
import {useAccount, useWebSocketProvider} from "wagmi";
import _ from "lodash";

function useMinedTransaction({txHash, toAddress}) {

    const [subId, setSubId] = useState("");
    const [minedHash, setMinedHash] = useState("");
    const {address} = useAccount();
    const provider = useWebSocketProvider();

    // 웹소켓을 통한 subscription 후 서버로부터 오는 알림(notification)을 수신
    provider.websocket.onmessage = function (event) {
        if (!_.isEmpty(event)) {
            const data = JSON.parse(event.data);
            //console.log(data);
            if (data.method === "eth_subscription" && txHash === data.params.result.transaction.hash) {
                setMinedHash(data.params.result.transaction.hash);
            }
        }
    }

    // alchemy_minedTransactions 은 특정 트랜잭션(from-to)이 latest 블록에 저장되었을 때 알림을 전송
    useEffect(() => {
        if (provider) {
            provider.send("eth_subscribe", ["alchemy_minedTransactions", {"addresses": [{"to": toAddress, "from": address}],"includeRemoved": false,  "hashesOnly": true}]).then(id=>setSubId(id));
        }
    }, [provider, toAddress, address]);

    return {subscriptionId: subId, minedHash};
}

export default useMinedTransaction;