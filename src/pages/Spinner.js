import React from "react";
import { Bars } from "react-loader-spinner";
import { Alert } from "react-bootstrap";

const Spinner = () => (
    <Alert variant="light">
        <Bars height={50} width={50} color="#4fa94d"/>
    </Alert>
);

export default Spinner;
