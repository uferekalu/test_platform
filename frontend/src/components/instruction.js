import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

class Instruction extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Row className="center">
          <h3>Read these instructions carefully!!!</h3>
          <p className="mt-1">
            The Test assesses your knowledge on the required stacks expected of
            you for the role of a developer in Utopia TECH PTY. You are expected
            to score at least 80% in this assessment. This is a multi-choice
            test and time alloted for each question is 30 seconds and after that
            it goes over to the next question. The test would be submitted
            authomatically after the last question assuming you did not click
            the submit button.
          </p>
        </Row>
        <Row>
          <Container>
            <Col className="col-md-12 text-center">
              <Button variant="primary">
                <Link
                  to="/test"
                  className="account-button-link"
                  onClick={() => {
                    localStorage.setItem("questionNumber", "1");
                    localStorage.setItem("answerAr", "");
                    localStorage.setItem("hours", "0");
                    localStorage.setItem("minutes", "0");
                    localStorage.setItem("seconds", "30");
                  }}
                >
                  Take a Test
                </Link>
              </Button>
            </Col>
          </Container>
        </Row>
      </>
    );
  }
}

export default Instruction;
