import React from "react";
import { Col, Container, Row, Stack } from "react-bootstrap";

function About() {
    return (
        <Container fluid style={{marginTop:'20px'}}>
            <Row>
                <Col>
                    <Stack className="col-md-3">
                       Web3Modal V2
                    </Stack>
                </Col>
            </Row>
        </Container>
    );
}

export default About;