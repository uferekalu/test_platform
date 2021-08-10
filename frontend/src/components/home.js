import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, logoutUser } from "../actions/authActions";
import { Container, Row, Col, Button } from 'react-bootstrap';

class Home extends Component {
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };


    render() {
        console.log("This is ", this.props.auth.user)
        return (
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col></Col>
                    <Col className="welcome"><h4>Welcome to Test Assessment Platform!</h4></Col>
                    <Col></Col>
                </Row>
                <Row className="justify-content-center">
                {!this.props.auth.isAuthenticated ? (
                    <Row className="account-button mt-5">
                        <Button variant="primary" className="mb-4">
                            <Link to="/register" className="account-button-link">
                                Click here to register...
                            </Link>
                        </Button>
                        <Button variant="primary">
                            <Link to="/login"className="account-button-link">
                                Already have an account? Login!
                            </Link>
                        </Button>
                    </Row>
                ) : (
                    <Row className="account-button mt-5">
                        <Button variant="primary" className="mb-4">
                            <Link to="/test" className="account-button-link">
                                Click here to take your test...
                            </Link>
                        </Button>
                        <Button variant="primary" className="mb-4" onClick={this.onLogoutClick}>
                            Logout
                        </Button>
                    </Row>
                )}
                </Row>
            </Container>
        )
    }
}

Home.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser, logoutUser }
)(Home);
