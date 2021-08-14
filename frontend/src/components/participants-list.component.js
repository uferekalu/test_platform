import React, { Component } from 'react'
import { connect } from "react-redux";
import { createQuestion, updateQuestion } from "../actions/questions";
import { retrieveCategory } from "../actions/categories";
import { retrieveQuestions } from "../actions/questions";
import { createTest, updateTest, retrieveTest } from "../actions/tests";
import { Row, Col, Form, FloatingLabel, Button, ListGroup } from 'react-bootstrap';
import ResultsDataService from "../services/results-service";

class ParticipantList extends Component {
    constructor(props) {
        super(props);
        this.saveTest = this.saveTest.bind(this);
        this.newQuestion = this.newQuestion.bind(this);
        this.handleSelectorChange = this.handleSelectorChange.bind(this);

        this.state = {
            participants: [],
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
        this.props.retrieveTest();
        this.getParticipants();
    }

    getParticipants() {
        ResultsDataService.getParticipants()
            .then((response) => {
                this.setState({
                    participants: response.data,
                });
                
                let tempquestionsClicked = [];
                this.props.questions.map((question) => {
                    tempquestionsClicked.push(false);
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    handleSelectorChange(e) {
        this.setState({ category: e.target.value });
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
        const { tests } = this.props;

        return (
            <>
                <Row className="justify-content-md-center">
                    <Col xs="auto">
                        <h4>All participants</h4>
                    </Col>
                </Row>
                {this.state.participants.map((participant) => (
                    <Row className="justify-content-md-center">
                        <>
                            <Form onSubmit={this.saveTest}>
                                <Row className="mb-2 mw-50 g-2 center-text">
                                <Col className="m-3" md>
                                    Name: {participant.name}
                                    </Col>
                                    <Col className="" md>
                                    selected Test: 
                                        <Form.Select value={this.state.category} onChange={this.handleSelectorChange} aria-label="Default select example">
                                            <option>select test</option>
                                            {tests.map((test) => (
                                                <option value={test._id}>{test.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Form>
                        </>
                    </Row>

                ))}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        categories: state.categories,
        tests: state.tests,
    };
};

export default connect(mapStateToProps, { createTest, retrieveTest })(ParticipantList);