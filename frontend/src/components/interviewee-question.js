import React, { Component } from "react";
import { connect } from "react-redux";
import { retrieveQuestions, deleteAllQuestions, userUpdateQuestion, deleteQuestion } from "../actions/questions";
import { submitResult } from "../actions/authActions";
import { retrieveTest } from "../actions/tests";
import TestsDataService from "../services/tests-services";


import CountDown from './countdown'
import { Container, Row, Col, Button, Badge, ListGroup } from 'react-bootstrap';


class TestTab extends Component {
  constructor(props) {
    super(props);
    this.refreshData = this.refreshData.bind(this);
    this.setActiveQuestion = this.setActiveQuestion.bind(this);
    this.removeAllQuestions = this.removeAllQuestions.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);

    this.state = {
      notAssigned: false,
      currentQuestion: 0,
      currentIndex: -1,
      showScore: false,
      count: localStorage.getItem("questionNumber") && localStorage.getItem("questionNumber").length ?  localStorage.getItem("questionNumber") :  1,
      score: 0,
      active: false,
      currentAns: false,
      pageSize: 10,
      total: 0,
      lastQuestion: false,
      questionAnswers: [],
      answerAr: localStorage.getItem("answerAr") && localStorage.getItem("answerAr").length > 0 ? JSON.parse(localStorage.getItem("answerAr")) : [],
      questions: [],
      items: [],
    };
  }

  componentDidMount() {
    console.log(this.props.auth)
    console.log(this.props.auth.user.attempt)
    
    let currentAssignedTest = this.props.auth.user.currentAssignedTest ? this.props.auth.user.currentAssignedTest : localStorage.getItem('currentAssignedTest');
    localStorage.setItem('currentAssignedTest', currentAssignedTest);

    if (!currentAssignedTest) {
      this.setState({ notAssigned: true })
    }
    else {
      TestsDataService.get(currentAssignedTest)
        .then((response) => {
          let answerAr = [];
          response.data.questions.map(qustion => {
            answerAr.push({ id: qustion._id, choosen: -1 })
          });

          this.setState({ questionAnswers: answerAr });
          // this.setState({ questions: questionList });
          this.props.userUpdateQuestion(response.data.questions);
          localStorage.setItem('currentAssignedTest', currentAssignedTest);
          localStorage.setItem('passPercentage', response.data.passPercentage);
          localStorage.setItem('attempt', this.props.auth.user.attempt);
          if (localStorage.getItem("questionNumber") && localStorage.getItem("questionNumber") === response.data.questions.length) {
            this.setState({ lastQuestion: true });
          }    
        })
    }
  }

  refreshData() {
    this.setState({
      currentQuestion: null,
      currentIndex: -1,
    });
  }

  saveTestDataTolocalStorage(counter, questionNumber, previousAnswers) {

    let testData = localStorage.getItem('testData').length > 0 ? JSON.parse(localStorage.getItem('testData')) : {};
    if (counter) {
      testData.counter = counter;
    }
    if (questionNumber) {
      testData.questionNumber = questionNumber;
    }
    localStorage.setItem('testData', JSON.parse(testData));

  }

  handleAnswerOptionClick(isCorrect, id, index, questionIndex, answerStr) {

    this.setState({ currentAns: isCorrect });
    let objIndex = this.state.questionAnswers.findIndex(obj => obj.id === id);
    let quesArr = this.state.questionAnswers;
    quesArr[objIndex].choosen = index;
    this.setState({
      questionAnswers: quesArr
    });
    this.setState({ currentAns: isCorrect });
    let btnTickIcon = document.getElementById(`questionTicker-${id}`)
    btnTickIcon.classList.add("d-block")
    btnTickIcon.classList.remove("d-none")

    // add to answer array
    let answerAr = this.state.answerAr;
    if(questionIndex !== this.state.answerAr.length - 1){
      answerAr.push({
        questionId: id,
        answer: answerStr,
        isCorrect,
        timeTaken: localStorage.getItem("hours")+":" + localStorage.getItem("minutes")+":"+localStorage.getItem("seconds"),
      });

      this.setState({answerAr});        
    }
    else {
      answerAr[questionIndex].answer = answerStr;
      answerAr[questionIndex].isCorrect = isCorrect;
      this.setState({answerAr});
    }

  }

  setActiveQuestion(question, index) {
    this.setState({
      currentQuestion: question,
      currentIndex: index,
    });
  }

  removeAllQuestions() {
    this.props
      .deleteAllQuestions()
      .then((response) => {
        console.log(response);
        this.refreshData();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  removeQuestion(id) {
    this.props.deleteQuestion(id).catch((e) => {
      console.log(e);
    });
  }

  nextQuestion() {
    if (this.state.currentAns) {
      this.setState({
        score: this.state.score + 1,
      })
    }
    if (!this.state.lastQuestion) {
      let currentCount = this.state.count;
      currentCount++;
      this.setState({ count: currentCount });
      localStorage.setItem("questionNumber", currentCount);
      console.log(currentCount + " " + this.props.questions.length)
      if (currentCount === this.props.questions.length) {
        this.setState({ lastQuestion: true });
      }
      document.getElementById('countDown').click();
    }
    else { // submit action
      this.setState({ showScore: true })
      // send submit
      this.props.submitResult({ 
      test: localStorage.getItem("currentAssignedTest"),
      answers: this.state.answerAr,
      passPercentage: localStorage.getItem('passPercentage'), 
      attempt: parseInt(localStorage.getItem('attempt')) + 1, });
      // add attempts
    }
    localStorage.setItem("answerAr", JSON.stringify(this.state.answerAr));
  }


  render() {
    const { showScore, score, count, lastQuestion } = this.state;
    const { questions } = this.props;
    // console.log(questions);
    // console.log(questions)
    const hoursMinsSecs = { hours: localStorage.getItem("hours"), minutes: localStorage.getItem("minutes"), seconds: localStorage.getItem("seconds") };

    return (
      <div>
        {this.state.notAssigned ?
          <div>
            <Row className="justify-content-md-center">
              <Col md="auto mb-4">
                <h4>You have not been assigned a test yet</h4>
              </Col>
            </Row>
          </div>
          :
          (
            <div>
              <Row className="justify-content-md-center">
                <Col md="auto mb-4">
                  <h4>
                    {!showScore
                      ? "Instruction: You have 30 sec to solve the question and go to the next one!"
                      : "Congrats, You finished your test!"}
                  </h4>
                </Col>
              </Row>
              <Container>
                {showScore ? (
                  <Button variant="primary">
                    You scored <Badge bg="secondary">{score}</Badge> out of{" "}
                    <Badge bg="secondary">{questions.length}</Badge>
                    <span className="visually-hidden">unread messages</span>
                  </Button>
                ) : (
                  <>
                    <Row className="mb-3">
                      <Col>
                        <Button variant="primary">
                          <span>
                            Question {count} from {questions.length} questions
                          </span>{" "}
                        </Button>
                      </Col>
                      <Col></Col>
                      <Col>
                        <Button variant="secondary">
                          <CountDown saveTestDataTolocalStorage={this.saveTestDataTolocalStorage} hoursMinsSecs={hoursMinsSecs} />{" "}
                        </Button>
                      </Col>
                      <Col></Col>
                      <Col>
                        <Button
                          id="nexQuestion"
                          style={{ color: "white", display: {} }}
                          color="white"
                          onClick={this.nextQuestion}
                          variant="info"
                        >
                          {!lastQuestion ? "Next Question >" : "submit"}{" "}
                        </Button>{" "}
                      </Col>
                    </Row>
                    <Row className=" justify-content-center">
                      {questions[count - 1] && (
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
                              {questions.length > 0
                                ? questions[count - 1].description
                                : ""}{" "}
                            </span>
                            {questions.length > 0 &&
                              questions[count - 1].alternatives.map(
                                (answerOption, index) => (
                                  <ListGroup className="mb-1">
                                    <ListGroup.Item
                                      action
                                      active={
                                        this.state.questionAnswers.length > 0 &&
                                        this.state.questionAnswers[
                                          this.state.questionAnswers.findIndex(
                                            (obj) =>
                                              obj.id === questions[count - 1]._id
                                          )
                                        ].choosen === index
                                      }
                                      onClick={() =>
                                        this.handleAnswerOptionClick(
                                          answerOption.isCorrect,
                                          questions[count - 1]._id,
                                          index,
                                          count - 1,
                                          answerOption.text,
                                        )
                                      }
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
                            {questions.map((question, index) => (
                              <>
                                <ListGroup className="mb-1">
                                  <ListGroup.Item className="ml-5" key={index}>
                                    <Row>
                                      <Col md="2" className="mt-1">
                                        <i id={`questionTicker-${question._id}`}
                                          className="far fa-check-circle d-none"
                                          style={{ marginRight: "6px", color: "green" }}
                                        >
                                        </i>
                                      </Col>
                                      <Col md="10">
                                        Question No {index + 1}
                                      </Col>
                                    </Row>
                                  </ListGroup.Item>
                                </ListGroup>
                              </>
                            ))}
                          </div>
                        </>
                      )}
                    </Row>
                    {/* <Row>
                <div>
                  {questions.map((question, index) => (
                      <ListGroup className="mb-1">
                        <ListGroup.Item>
                          Question No {index + 1}
                        </ListGroup.Item>
                      </ListGroup>
                  ))}
                </div>
              </Row> */}
                  </>
                )}
              </Container>
            </div>)
        }
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
