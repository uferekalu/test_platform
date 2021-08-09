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
      question: {
        id: null,
        description: "",
        alternatives: [
          {
            "isCorrect": false,
            "text": ""
          },
          {
            "isCorrect": false,
            "text": ""
          },
          {
            "isCorrect": false,
            "text": ""
          },
          {
            "isCorrect": false,
            "text": ""
          }
        ]
      }
    };
  }

  onChangeDescription(e) {
    let question = this.state.question;
    question.description = e.target.value;
    this.setState({
      question,
    });
  }

  handleChange(e) {
    let question = this.state.question;
    question.alternatives[e.target.name].isCorrect = e.target.value;
    this.setState({
      question,
    });
  }

  handleQuestionChange(e) {
    let question = this.state.question;
    question.alternatives[e.target.name].text = e.target.value;
    this.setState({
      question,
    });
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
    const { question } = this.state;

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
                        <Form.Control as="textarea" onChange={this.onChangeDescription} placeholder="Enter question" rows={15} />
                      </Form.Group>
                    </Form.Group>
                  </Col>
                  <Col md>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Answer options with a checkbox for correct answer</Form.Label>
                      <Form.Check
                        name="0"
                        onChange={this.handleChange}
                        type="checkbox"
                        value={question.alternatives[0].text}
                        label="Check for correct answer" />
                      <Form.Control id="title"
                        name="0"                 
                        onChange={this.handleQuestionChange}
                        className="mb-3" placeholder="Enter answer option 1" />
                      <Form.Check
                        name="1"
                        onChange={this.handleChange}
                        type="checkbox" label="Check for correct answer" />
                      <Form.Control id="title"
                        name="1"                 
                        onChange={this.handleQuestionChange}
                        value={question.alternatives[1].text}
                        className="mb-3" placeholder="Enter answer option 2" />
                      <Form.Check
                        name="2"
                        onChange={this.handleChange}
                        type="checkbox" label="Check for correct answer" />
                      <Form.Control id="title"
                        name="2"                 
                        onChange={this.handleQuestionChange}
                        value={question.alternatives[2].text}
                        className="mb-3" placeholder="Enter answer option 3" />
                      <Form.Check
                        name="3"
                        onChange={this.handleChange}
                        type="checkbox" label="Check for correct answer" />
                      <Form.Control id="title"
                        name="3"                 
                        onChange={this.handleQuestionChange}
                        value={question.alternatives[3].text}
                        className="mb-3" placeholder="Enter answer option 4" />
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