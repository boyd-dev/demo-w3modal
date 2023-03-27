import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Main from "./Main";
import About from "./About";
import {Nav, Navbar} from "react-bootstrap";


function Home() {

    return (
        <BrowserRouter>
            <Navbar bg="primary" variant="dark" className="p-2 mb-3">
                <Navbar.Brand href="/">Web3Modal V2</Navbar.Brand>
                <Nav>
                    <Nav.Link href="/">Send Tx</Nav.Link>
                    <Nav.Link href="/sign">Sign</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                </Nav>
            </Navbar>
            <Routes>
                <Route path="*" element={<Main/>} />
                <Route path="/about" element={<About/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default Home;