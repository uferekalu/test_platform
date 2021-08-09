import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from 'react-bootstrap';

class Home extends Component {
    render() {
        return (
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col></Col>
                    <Col className="welcome"><h4>Welcome to Test Assessment Platform!</h4></Col>
                    <Col></Col>
                </Row>
                <Row className="justify-content-center">
                <Row className="account-button mt-5">
                    <Button variant="primary" className="mb-4"><Link to="/register" className="account-button-link">Click here to register...</Link></Button>
                    <Button variant="primary"><Link to="/login"className="account-button-link">Already have an account? Login!</Link></Button>
                </Row>
                </Row>
            </Container>
        )
    }
}

export default Home;