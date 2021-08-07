import React, { Component } from "react";
import { connect } from "react-redux";
import { createQuestion } from "../actions/questions";
import { Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap';

class AddQuestion extends Component {
  constructor(props) {
    super(props);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveQuestion = this.saveQuestion.bind(this);
    this.newQuestion = this.newQuestion.bind(this);

    this.state = {
      id: null,
      description: "",
      alternatives: []
    };
  }

  onChangeDescription(e) {
    this.setState({
        description: e.target.value,
    });
  }

  handleChange(e) {
    
  }

  saveQuestion() {
    const { description, alternatives } = this.state;

    this.props
      .createQuestion(description, alternatives)
      .then((data) => {
        this.setState({
          id: data._id,
          description: data.description,
          alternatives: data.alternatives,
          submitted: true,
        });
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  newQuestion() {
    this.setState({
      id: null,
      description: "",
      alternatives: [],

      submitted: false,
    });
  }

  render() {
    return (
      <>
      <Row className="justify-content-md-center">
        <Col xs="auto">
          <h4>Add a Question</h4>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newQuestion}>
              Add
            </button>
          </div>
        ) : (
          <>
          <Form>
            <Row className="g-2">
                <Col md>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Question</Form.Label>
                        <Form.Control as="textarea" placeholder="Enter question" rows={15} />
                      </Form.Group>
                    </Form.Group>
                </Col>
                <Col md>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Answer options with a checkbox for correct answer</Form.Label>
                      <Form.Check type="checkbox" label="Check for correct answer" />
                      <Form.Control className="mb-3"  placeholder="Enter answer option 1" />
                      <Form.Check type="checkbox" label="Check for correct answer" />
                      <Form.Control className="mb-3"  placeholder="Enter answer option 2" />
                      <Form.Check type="checkbox" label="Check for correct answer" />
                      <Form.Control className="mb-3"  placeholder="Enter answer option 3" />
                      <Form.Check type="checkbox" label="Check for correct answer" />
                      <Form.Control className="mb-3"  placeholder="Enter answer option 4" />
                      <Form.Check type="checkbox" label="Check for correct answer" />
                      <Form.Control className="mb-3"  placeholder="Enter answer option 5" />
                  </Form.Group>
                </Col>
              </Row>
                  <div className="d-grid gap-2">
                    <Button variant="outline-primary">Submit</Button>
                  </div>
          </Form>
          </>
        )}
      </Row>
    </>
    );
  }
}

export default connect(null, { createQuestion })(AddQuestion);