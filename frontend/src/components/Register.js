import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../actions/authActions";
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import classnames from "classnames";
import Loader from './Loader'

class Register extends Component {
  constructor() {
    super();
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            errors: {}
        };
    }

     componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    componentWillReceiveProps(nextProps) {
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
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };
        this.props.registerUser(newUser, this.props.history);
    };
    render() {
        const { errors } = this.state;
        return (
            <>
            <Container>
                <Row className="justify-content-md-center">
                    <Link to="/" className="back-to-home mb-3">
                        Back to home
                    </Link>
                    <Col></Col>
                    <Col className="welcome mb-4"><h4>Register to Take Your Assessment</h4></Col>
                    <Col></Col>
                </Row>
                <Row>
                <Col>
                    <Col className="mb-4">
                        <p className="grey-text text-darken-1">
                            Already have an account? {' '}
                            <Button variant="primary">
                                <Link className="account-button-link " to="/login">Login</Link>
                            </Button>
                        </p>
                    </Col>
                </Col>
                </Row>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">
                                Name
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control 
                                    onChange={this.onChange}
                                    value={this.state.name}
                                    error={errors.name}
                                    id="name"
                                    type="text" 
                                    placeholder="Enter your fullname" 
                                    className={classnames("", {
                                        invalid: errors.name
                                    })}
                                />
                                <span style={{color:"red"}}>{errors.name}</span>
                            </Col>
                        </Form.Group>
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
                                        invalid: errors.email
                                    })}
                                />
                                <span style={{color:"red"}}>{errors.email}</span>
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
                                        invalid: errors.password
                                    })}
                                />
                                <span style={{color:"red"}}>{errors.password}</span>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">
                                Confirm password
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control 
                                    onChange={this.onChange}
                                    value={this.state.password2}
                                    error={errors.password2}
                                    id="password2"
                                    type="password" 
                                    placeholder="Confirm your password" 
                                    className={classnames("", {
                                        invalid: errors.password2
                                    })}
                                />
                                <span style={{color:"red"}}>{errors.password2}</span>
                            </Col>
                        </Form.Group>
                        <Row className="mt-5">
                            <Button type="submit" variant="primary" className="mb-4">
                                <Link to="/register" className="account-button-link">
                                   {this.props.auth.loading && <Loader />} Sign up...
                                </Link>
                            </Button>
                        </Row>
                    </Form>
                </Container>
                    </>
        );
    }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth.user,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
