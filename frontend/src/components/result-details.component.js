import React, { Component } from "react";
import { connect } from "react-redux";
import { retrieveQuestions, deleteAllQuestions, userUpdateQuestion, deleteQuestion } from "../actions/questions";
import { submitResult } from "../actions/authActions";
import { retrieveTest } from "../actions/tests";
import ResultsDataService from "../services/results-service";

import { Container, Row, Col, Button, Badge, ListGroup } from 'react-bootstrap';


class TestTab extends Component {
    constructor(props) {
        super(props);
        this.refreshData = this.refreshData.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);

        this.state = {
            notAssigned: false,
            currentQuestion: 0,
            currentIndex: -1,
            showScore: false,
            count: 1,
            score: 0,
            active: false,
            showSummery: false,
            pageSize: 10,
            total: 0,
            lastQuestion: false,
            questionAnswers: [],
            answerAr: [],
            questions: [],
            results: [],
            items: [],
        };
    }

    componentDidMount() {
        ResultsDataService.get(this.props.match.params.id)
            .then((response) => {
                //   let answerAr = [];
                //   response.data.results.map(qustion => {
                //     answerAr.push({ id: qustion._id, choosen: -1 })
                //   });

                this.setState({ results: response.data });
                if(response.data.answers.length == 1)
                    this.setState({ lastQuestion: true });
                // this.setState({ questions: questionList });
            })
    }

    refreshData() {
        this.setState({
            currentQuestion: null,
            currentIndex: -1,
        });
    }

    nextQuestion() {
        if (!this.state.lastQuestion) {
            let currentCount = this.state.count;
            currentCount++;
            this.setState({ count: currentCount });
            if (currentCount === this.state.results.answers.length) {
                this.setState({ lastQuestion: true });
            }
        }
        else {
            this.setState({ showSummery: true });
        }
    }


    render() {
        const { count, lastQuestion } = this.state;

        const { results, showSummery } = this.state;

        return (
            <div>
                <Container>
                    {!showSummery ?
                        <>
                            <Row className="mb-3">
                                <Col>
                                    <Button variant="primary">
                                        <span>
                                            Question {count} from {results.answers && results.answers.length} questions
                                        </span>{" "}
                                    </Button>
                                </Col>
                                <Col>
                                    <Button variant="secondary">
                                        {console.log(results.answers)}
                                        Finished at: {results.answers && results.answers.length > 0 &&  results.answers[count - 1].timeTaken}
                                        {/* <CountDown saveTestDataTolocalStorage={this.saveTestDataTolocalStorage} hoursMinsSecs={hoursMinsSecs} />{" "} */}
                                    </Button>
                                </Col>

                                <Col>
                                    <Button
                                        id="nexQuestion"
                                        style={{ color: "white", display: {} }}
                                        color="white"
                                        onClick={this.nextQuestion}
                                        variant="info"
                                    >
                                        {!lastQuestion ? "Next Question >" : "Show Summery"}
                                    </Button>
                                </Col>
                            </Row>
                            <Row className=" justify-content-center">
                                {results.answers && results.answers.length > 0 && (
                                    <>
                                        <div
                                            style={{
                                                marginTop: "30px",
                                                minWidth: "400px",
                                                maxWidth: "700px",
                                            }}
                                        >
                                            <span>
                                                No. {count}:{" "}
                                                {results.answers.length > 0
                                                    ? results.answers[count - 1].questionId.description
                                                    : ""}{" "}
                                            {results.answers[count - 1].isCorrect ? <Badge bg="success">Correct Answer</Badge>:  <Badge bg="danger">{results.answers[count - 1].answer.length === 0 ? "Did not answer" : "False Answer"}</Badge>}
                                            </span>
                                            {results.answers.length > 0 &&
                                                results.answers[count - 1].questionId.alternatives.map(
                                                    (answerOption, index) => (
                                                        <ListGroup className="mb-1">
                                                            <ListGroup.Item
                                                            variant={ answerOption.isCorrect ? "success" : answerOption.text === results.answers[count - 1].answer ? "danger" : null}
                                                                action
                                                            >
                                                                {answerOption.text}
                                                            </ListGroup.Item>
                                                        </ListGroup>
                                                    )
                                                )}
                                        </div>
                                        <div
                                            style={{
                                                minWidth: "150px",
                                                maxWidth: "200px",
                                                marginLeft: "100px"
                                            }}
                                        >
                                        </div>
                                    </>
                                )}
                            </Row>
                        </>
                        :
                        <h3>
                            Participant {results.isPassed ? "passed" : "Didn't pass"}, he answered {results.correctAnsweredCount} questions correctly as was shown
                        </h3>
                    }
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        questions: state.questions,
        tests: state.tests,
        auth: state.auth,
    };
};


export default connect(mapStateToProps, { userUpdateQuestion, retrieveTest, submitResult, retrieveQuestions, deleteAllQuestions, deleteQuestion })(TestTab);
