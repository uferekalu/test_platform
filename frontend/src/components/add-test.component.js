import React, { Component } from "react";
import { connect } from "react-redux";
import { createQuestion, updateQuestion } from "../actions/questions";
import { retrieveCategory } from "../actions/categories";
import { retrieveQuestions } from "../actions/questions";
import { createTest, updateTest } from "../actions/tests";
import { Row, Col, Form, FloatingLabel, Button, ListGroup } from 'react-bootstrap';
import TestDataService from "../services/tests-services";

class AddTest extends Component {
    constructor(props) {
        super(props);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.saveTest = this.saveTest.bind(this);
        this.newQuestion = this.newQuestion.bind(this);
        this.handleSelectorChange = this.handleSelectorChange.bind(this);
        this.handleAnswerOptionClick = this.handleAnswerOptionClick.bind(this);
        this.handlePercentageChange = this.handlePercentageChange.bind(this);
        this.reset = this.reset.bind(this);

        this.state = {
            questions: [],
            questionsSel: [],
            questionsClicked: [],
            category: "",
            submitted: false,
            name: "",
            passPercentage: 0,
        };
        this.restState = {
            questions: [],
            questionsSel: [],
            questionsClicked: [],
            category: "",
            submitted: false,
            name: "",
            passPercentage: 0,
        };

    }

    componentDidMount() {
        this.props.retrieveCategory();
        this.props.retrieveQuestions();
        if (this.props.history.location.pathname.includes("edit"))
            this.getTest(this.props.match.params.id);
    }

    reset() {
        this.setState({
            questions: this.restState.questions,
            questionsSel: this.restState.questionsSel,
            questionsClicked: this.restState.questionsClicked,
            category: this.restState.category,
            submitted: this.restState.submitted,
            name: this.restState.name,
            passPercentage: this.restState.passPercentage,
        });
    }

    getTest(id) {
        TestDataService.get(id)
            .then((response) => {
                this.setState({
                    name: response.data.name,
                    category: response.data.category,
                    questionsSel: response.data.questions,
                    passPercentage: response.data.passPercentage
                });
                // choose questions with category
                let categoryQuestions = [];
                let tempquestionsClicked = [];
                this.props.questions.map((question) => {
                    console.log(response.data.category + " " + question.category)
                    if (response.data.category === question.category) {
                        categoryQuestions.push(question.description);
                        if (response.data.questions.includes(question._id))
                            tempquestionsClicked.push(true);
                        else
                            tempquestionsClicked.push(false);
                    }
                });
                this.setState({ questions: categoryQuestions });
                this.setState({ questionsClicked: tempquestionsClicked });

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
        question.alternatives.map(ele => {
            ele.isCorrect = false;
        })
        question.alternatives[e.target.name].isCorrect = e.target.checked;
        this.setState({
            question,
        });
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value
        });
    }

    handlePercentageChange(e) {
        this.setState({
            passPercentage: e.target.value
        });
    }

    handleSelectorChange(e) {
        this.setState({ category: e.target.value });

        // choose questions with category
        let categoryQuestions = [];
        let tempquestionsClicked = [];
        this.props.questions.map((question) => {
            if (e.target.value === question.category)
                categoryQuestions.push(question.description);
            if (!this.props.history.location.pathname.includes("edit") && this.state.questionsSel.length !== 0)
                tempquestionsClicked.push(false);
            else {
                if (this.state.questionsSel.includes(question._id))
                    tempquestionsClicked.push(true);
                else
                    tempquestionsClicked.push(false);

            }
        });
        this.setState({ questionsSel: [] });
        this.setState({ questions: categoryQuestions });
        this.setState({ questionsClicked: tempquestionsClicked });
    }

    handleAnswerOptionClick(index) {
        let tempquestionsClicked = [];
        tempquestionsClicked = this.state.questionsClicked;
        tempquestionsClicked[index] = !this.state.questionsClicked[index];
        this.setState({ questionsClicked: tempquestionsClicked });
    }

    saveTest(e) {
        const { question } = this.state;
        let questionsId = [];
        this.state.questions.map((question, index) => {
            if (this.state.questionsClicked[index] === true) {
                let id = this.props.questions.filter((q) => q.description === question)[0]._id;
                questionsId.push(id);
            }
        })
        e.preventDefault();
        if (!this.props.history.location.pathname.includes("edit"))
            this.props
                .createTest(this.state.name, this.state.category, questionsId, parseInt(this.state.passPercentage))
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
                .updateTest(this.props.match.params.id, { name: this.state.name, category: this.state.category, questions: questionsId, passPercentage: parseInt(this.state.passPercentage), })
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
                    },
                    {
                        "isCorrect": false,
                        "text": ""
                    }
                ]
            },
            submitted: false,
        });
    }

    render() {
        const { questions } = this.state;
        const { categories } = this.props;

        return (
            <>
                <Row className="justify-content-md-center">
                    <Col xs="auto">
                        <h4>{!this.props.history.location.pathname.includes("edit") ? "Add a Test" : "Edit Test"}</h4>
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
                            <Form onSubmit={this.saveTest}>

                                <Col className="mb-3">
                                    <Button onClick={this.reset} variant="primary"> Clear </Button>
                                </Col>

                                <Row className="mw-50 g-2">
                                    <Col className="" md>
                                        <Form.Label>Test Name </Form.Label>
                                        <Form.Control id="title"
                                            name="0"
                                            onChange={this.handleNameChange}
                                            value={this.state.name}
                                            className="mb-3" placeholder="Enter Test Name" />
                                    </Col>
                                </Row>
                                <Row className="mb-2 mw-50 g-2">
                                    <Col className="" md>
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select value={this.state.category} onChange={this.handleSelectorChange} aria-label="Default select example">
                                            <option>select category</option>
                                            {categories.map((category) => (
                                                <option value={category._id}>{category.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Row className="mw-50 g-2">
                                    <Col className="" md>
                                        <Form.Label>Success Percentage </Form.Label>
                                        <Form.Control id="title"
                                            name="0"
                                            type="number"
                                            onChange={this.handlePercentageChange}
                                            value={this.state.passPercentage}
                                            className="mb-3" placeholder="Enter Success Percentage" />
                                    </Col>
                                </Row>

                                <Row className="g-2">

                                    <Col md>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                                <Form.Label>Choose Questions:</Form.Label>
                                                {questions.length > 0 && questions.map((question, index) => (
                                                    <ListGroup className="mb-1">
                                                        <ListGroup.Item active={this.state.questionsClicked[index]} onClick={() => this.handleAnswerOptionClick(index)}>
                                                            {question}
                                                        </ListGroup.Item>
                                                    </ListGroup>
                                                ))}
                                            </Form.Group>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-grid gap-2">
                                    <Button type="submit" variant="outline-primary">Submit</Button>
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
        questions: state.questions,
    };
};

export default connect(mapStateToProps, { createTest, retrieveQuestions, retrieveCategory, createQuestion, updateTest })(AddTest);