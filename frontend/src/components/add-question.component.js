import React, { Component } from "react";
import { connect } from "react-redux";
import { createQuestion, updateQuestion } from "../actions/questions";
import { retrieveCategory } from "../actions/categories";
import { Row, Col, Form, Button } from "react-bootstrap";
import QuestionDataService from "../services/question-service";

class AddQuestion extends Component {
  constructor(props) {
    super(props);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.saveQuestion = this.saveQuestion.bind(this);
    this.newQuestion = this.newQuestion.bind(this);
    this.handleSelectorChange = this.handleSelectorChange.bind(this);

    this.state = {
      question: {
        description: "",
        alternatives: [
          {
            isCorrect: false,
            text: "",
          },
          {
            isCorrect: false,
            text: "",
          },
          {
            isCorrect: false,
            text: "",
          },
          {
            isCorrect: false,
            text: "",
          },
          {
            isCorrect: false,
            text: "",
          },
        ],
      },
      submitted: false,
    };
  }

  componentDidMount() {
    this.props.retrieveCategory();
    if (this.props.history.location.pathname.includes("edit"))
      this.getQuestion(this.props.match.params.id);
    
  }

  getQuestion(id) {
    QuestionDataService.get(id)
      .then((response) => {
        this.setState({
          question: response.data,
          category: response.data.category,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
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
    // only one
    question.alternatives.map((ele) => {
      return ele.isCorrect = false;
    });
    question.alternatives[e.target.name].isCorrect = e.target.checked;
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

  handleSelectorChange(e) {
    this.setState({ category: e.target.value });
  }

  saveQuestion(e) {
    const { question } = this.state;

    e.preventDefault();
    if (!this.props.history.location.pathname.includes("edit"))
      this.props
        .createQuestion(
          question.description,
          question.alternatives,
          this.state.category
        )
        .then((data) => {
          this.setState({
            // question: newQuestion,
            submitted: true,
          });
          console.log(data);
        })
        .catch((e) => {
          console.log(e);
        });
    else
      this.props
        .updateQuestion(this.props.match.params.id, {
          description: question.description,
          alternatives: question.alternatives,
          category: this.state.category,
        })
        .then((data) => {
          this.setState({
            // question: newQuestion,
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
      question: {
        description: "",
        category: "",
        alternatives: [
          {
            isCorrect: false,
            text: "",
          },
          {
            isCorrect: false,
            text: "",
          },
          {
            isCorrect: false,
            text: "",
          },
          {
            isCorrect: false,
            text: "",
          },
          {
            isCorrect: false,
            text: "",
          },
        ],
      },
      submitted: false,
    });
  }

  render() {
    const { question } = this.state;
    const { categories } = this.props;

    return (
      <>
        <Row className="justify-content-md-center">
          <Col xs="auto">
            <h4>
              {!this.props.history.location.pathname.includes("edit")
                ? "Add a Question"
                : "Edit Question"}
            </h4>
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
              <Form onSubmit={this.saveQuestion}>
                <Row className="mw-50 g-2">
                  <Col className="" md>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={this.state.category}
                      onChange={this.handleSelectorChange}
                      aria-label="Default select example"
                    >
                      <option>select category</option>
                      {categories.map((category) => (
                        <option value={category._id}>{category.name}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
                <Row className="g-2">
                  <Col md>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                      >
                        <Form.Label>Question</Form.Label>
                        <Form.Control
                          as="textarea"
                          value={question.description}
                          onChange={this.onChangeDescription}
                          placeholder="Enter question"
                          rows={15}
                        />
                      </Form.Group>
                    </Form.Group>
                  </Col>
                  <Col md>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <Form.Label>
                        Answer options with a checkbox for correct answer
                      </Form.Label>
                      <Form.Check
                        name="0"
                        onChange={this.handleChange}
                        type="checkbox"
                        checked={question.alternatives[0].isCorrect}
                        label="Check for correct answer"
                      />
                      <Form.Control
                        id="title"
                        name="0"
                        onChange={this.handleQuestionChange}
                        value={question.alternatives[0].text}
                        className="mb-3"
                        placeholder="Enter answer option 1"
                      />
                      <Form.Check
                        name="1"
                        onChange={this.handleChange}
                        checked={question.alternatives[1].isCorrect}
                        type="checkbox"
                        label="Check for correct answer"
                      />
                      <Form.Control
                        id="title"
                        name="1"
                        onChange={this.handleQuestionChange}
                        value={question.alternatives[1].text}
                        className="mb-3"
                        placeholder="Enter answer option 2"
                      />
                      <Form.Check
                        name="2"
                        onChange={this.handleChange}
                        checked={question.alternatives[2].isCorrect}
                        type="checkbox"
                        label="Check for correct answer"
                      />
                      <Form.Control
                        id="title"
                        name="2"
                        onChange={this.handleQuestionChange}
                        value={question.alternatives[2].text}
                        className="mb-3"
                        placeholder="Enter answer option 3"
                      />
                      <Form.Check
                        name="3"
                        onChange={this.handleChange}
                        checked={question.alternatives[3].isCorrect}
                        type="checkbox"
                        label="Check for correct answer"
                      />
                      <Form.Control
                        id="title"
                        name="3"
                        onChange={this.handleQuestionChange}
                        value={question.alternatives[3].text}
                        className="mb-3"
                        placeholder="Enter answer option 4"
                      />
                      <Form.Check
                        name="4"
                        onChange={this.handleChange}
                        checked={question.alternatives[4].isCorrect}
                        type="checkbox"
                        label="Check for correct answer"
                      />
                      <Form.Control
                        id="title"
                        name="4"
                        onChange={this.handleQuestionChange}
                        value={question.alternatives[4].text}
                        className="mb-3"
                        placeholder="Enter answer option 4"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-grid gap-2">
                  <Button type="submit" variant="outline-primary">
                    Submit
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Row>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.categories,
  };
};

export default connect(mapStateToProps, {
  retrieveCategory,
  createQuestion,
  updateQuestion,
})(AddQuestion);
