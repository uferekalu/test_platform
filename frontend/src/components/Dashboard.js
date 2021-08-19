import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import { Container, Row, Col, Button } from 'react-bootstrap';

class Dashboard extends Component {

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;

    return (
      <Container>
        <Row className="justify-content-md-center mt-5">
          <Col className="welcome mb-4"><h4>
            <b>Welcome,</b> {user.name.split(" ")[0]}
            <p className="flow-text grey-text text-darken-1">
              You are logged into the{" "}
              <span style={{ fontFamily: "monospace" }}>ADMIN</span> platform 👏
            </p>
          </h4>
          </Col>
        </Row>
        <Row className="admin-guide">
          <p className="mt-1">
            Here, you have access to the results of the participants through Results in Navbar.
            You can add, edit and delete categories, questions and tests...
          </p>
        </Row>
      </Container>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);
