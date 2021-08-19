import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, logoutUser } from "../actions/authActions";
import { Container, Row, Col, Button } from 'react-bootstrap';

class Home extends Component {

    render() {
        console.log("This is Admin status ", this.props.auth.user.isAdmin)
        return (
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col></Col>
                    <Col className="welcome"><h4>Welcome to Test Assessment Platform!</h4></Col>
                    <Col></Col>
                </Row>
                <Row className="justify-content-center">
                {!this.props.auth.isAuthenticated ? (
                    <Container>
                        <Col className="col-md-12 text-center mt-3 mb-3">
                            <Button variant="primary">
                                <Link to="/register" className="account-button-link">
                                    Click here to register...
                                </Link>
                            </Button>
                        </Col>
                        <Col className="col-md-12 text-center">
                            <Button variant="primary">
                                <Link to="/login" className="account-button-link">
                                    Already have an account? Login!
                                </Link>
                            </Button>
                        </Col>
                    </Container>
                    // <Row className="account-button mt-5">
                    //     <Button variant="primary" className="mb-4">
                    //         <Link to="/register" className="account-button-link">
                    //             Click here to register...
                    //         </Link>
                    //     </Button>
                    //     <Button variant="primary">
                    //         <Link to="/login"className="account-button-link">
                    //             Already have an account? Login!
                    //         </Link>
                    //     </Button>
                    // </Row>
                ) : (
                    <Container>
                        <Col className="col-md-12 text-center mt-3">
                            <Button variant="primary" className="pr-5">
                                <Link to="/instruction" className="account-button-link">
                                    Read Instructions before taking the test...
                                </Link>
                            </Button>
                            {/* <Button variant="primary" onClick={this.onLogoutClick}>
                                <Link to="/login" className="account-button-link">
                                    Logout
                                </Link>
                            </Button> */}
                        </Col>
                        {/* <Col className="col-md-6 text-center">
                        </Col> */}
                    </Container>
                    // <Row className="account-button mt-5">
                    //     <Button variant="primary" className="mb-4">
                    //         <Link to="/instruction" className="account-button-link">
                    //             Read Instructions before taking the test...
                    //         </Link>
                    //     </Button>
                    //     <Button variant="primary" className="mb-4" onClick={this.onLogoutClick}>
                    //         Logout
                    //     </Button>
                    // </Row>
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
