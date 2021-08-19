import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
import classnames from "classnames";
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Loader from './Loader'

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated && this.props.auth.user.isAdmin === true) {
            this.props.history.push("/dashboard");
        }
        if (this.props.auth.isAuthenticated && !this.props.auth.user.isAdmin === true) {
            this.props.history.push("/instruction");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated && nextProps.auth.user.isAdmin === true) {
            this.props.history.push("/dashboard");
        }

        if (nextProps.auth.isAuthenticated && !nextProps.auth.user.isAdmin === true) {
            this.props.history.push("/instruction");
        }

        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };
    
    onSubmit = e => {
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData);
    };

    render() {
    const { errors } = this.state;
    console.log("This is loading", !this.props.auth.loading)
    
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Link to="/" className="back-to-home mb-3">
                    {'<<<'} Back to home
                </Link>
                <Col></Col>
                <Col className="welcome mb-4"><h4>Login to Take Your Assessment</h4></Col>
                <Col></Col>
            </Row>
            <Row>
                <Col>
                    <Col className="mb-4">
                        <p className="grey-text text-darken-1">
                            Don't have an account? {' '}
                            <Button variant="primary">
                                <Link className="account-button-link " to="/register">Register</Link>
                            </Button>
                        </p>
                    </Col>
                </Col>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                            Email
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control 
                                onChange={this.onChange}
                                value={this.state.email}
                                error={errors.email}
                                id="email"
                                type="email" 
                                placeholder="Enter your email" 
                                className={classnames("", {
                                    invalid: errors.email || errors.emailnotfound
                                })}
                            />
                            <span style={{color:"red"}}>
                                {errors.email}
                                {errors.emailnotfound}
                            </span>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                            Password
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control 
                                onChange={this.onChange}
                                value={this.state.password}
                                error={errors.password}
                                id="password"
                                type="password" 
                                placeholder="Enter your password" 
                                className={classnames("", {
                                    invalid: errors.password || errors.passwordincorrect
                                })}
                            />
                            <span style={{color:"red"}}>
                                {errors.password}
                                {errors.passwordincorrect}
                            </span>
                        </Col>
                    </Form.Group>
                    <Row className="mt-5">
                        <Button type="submit" variant="primary" className="mb-4">
                            {!this.props.auth.loading ? (
                                <Link to="/login" className="account-button-link">
                                    Login...
                                </Link>                               
                            ) : (
                                <>
                                    <Loader /> Logging in...
                                </>
                            )}
                        </Button>
                    </Row>
                </Form>
            </Row>
            {/* <div style={{ marginTop: "4rem" }} className="row">
            <div className="col s8 offset-s2">
                <Link to="/" className="btn-flat waves-effect">
                <i className="material-icons left">keyboard_backspace</i> Back to
                home
                </Link>
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <h4>
                    <b>Login</b> below
                </h4>
                <p className="grey-text text-darken-1">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                <div className="input-field col s12">
                    <input
                    onChange={this.onChange}
                    value={this.state.email}
                    error={errors.email}
                    id="email"
                    type="email"
                    />
                    <label htmlFor="email">Email</label>
                </div>
                <div className="input-field col s12">
                    <input
                    onChange={this.onChange}
                    value={this.state.password}
                    error={errors.password}
                    id="password"
                    type="password"
                    />
                    <label htmlFor="password">Password</label>
                </div>
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                    <button
                    style={{
                        width: "150px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "1rem"
                    }}
                    type="submit"
                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                    >
                    Login
                    </button>
                </div>
                </form>
            </div>
            </div> */}
        </Container>
    );
  }
}
Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);