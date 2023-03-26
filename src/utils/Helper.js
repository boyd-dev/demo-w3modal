import {BigNumber, ethers} from "ethers";
import _ from "lodash";

export const TEST_TX_OBJ = {
    to: "0xafc4f9f3ba806dd2f8e47a524ffda2418bbfc08a",
    value: BigNumber.from(ethers.utils.parseEther("0.01")),
}

export const TEST_SIGN_MSG = "아래와 같이 개인정보를 수집 이용 및 제3자에게 제공합니다. 내용을 자세히 읽은 후 서명하십시오.";

export const TEST_CONTRACT = "0x43010A138d274aE123b3f7603aaacb2cd6a6c34b";


// TODO 트랜잭션 전송 후에 리턴되는 데이터 형식이 지갑마다 조금씩 다른 것 같은데?
export const checkTxHash = (tx) => {
    let h = null;
    if (_.isString(tx.hash)) {
        h = tx.hash;
    } else if (_.isObject(tx.hash)) {
        const key = Object.keys(tx.hash).find(k => k === "hash");
        h = tx.hash[key];
    }

    return h;
}
