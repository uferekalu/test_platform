import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { retrieveQuestions, deleteAllQuestions, simpleUpdateQuestion, deleteQuestion } from "../actions/questions";
import CountDown from './countdown'
import { Container, Row, Col, Button, Badge, ListGroup, Pagination } from 'react-bootstrap';


class TestTab extends Component {
  constructor(props) {
    super(props);
    this.refreshData = this.refreshData.bind(this);
    this.setActiveQuestion = this.setActiveQuestion.bind(this);
    this.removeAllQuestions = this.removeAllQuestions.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    
    this.state = {
      currentQuestion: 0,
      currentIndex: -1,
      showScore: false,
      count: 1,
      score: 0,
      active: false,
      currentAns: false,
      pageSize: 10,
      total: 0,
      lastQuestion: false,
      questionAnswers: [],
      items: [],
    };
  }

  componentDidMount() {

    this.props.retrieveQuestions()
      .then(() => {

        // init ansersArr
        let answerAr = [];
        this.props.questions.map(qustion => {
          answerAr.push({id: qustion._id, choosen: -1})
        });
        console.log(answerAr)

        this.setState({questionAnswers: answerAr});
        // CountDown.reset();
      })
      .catch(err => {
        console.error(err.getMessage());
      });
  }

  refreshData() {
    this.setState({
      currentQuestion: null,
      currentIndex: -1,
    });
  }

  handleAnswerOptionClick(isCorrect, id, index) {

    this.setState({currentAns: isCorrect});
    let objIndex = this.state.questionAnswers.findIndex(obj => obj.id === id);
    let quesArr = this.state.questionAnswers;
    quesArr[objIndex].choosen = index;
    this.setState({
      questionAnswers : quesArr
    });
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
    this.props
      .deleteQuestion(id)
      .catch((e) => {
        console.log(e);
      });
  }

  nextQuestion() {
    if (this.state.currentAns) {
        this.setState({
          score: this.state.score + 1,
        })
      }
      if(!this.state.lastQuestion){
        let currentCount = this.state.count;
        currentCount++;
        this.setState({count: currentCount});
        if(currentCount === this.props.questions.length){
            this.setState({lastQuestion: true});
        }
        document.getElementById('countDown').click();    
      }
      else { // submit action
        this.setState({showScore: true})
      }
  }

  render() {
    const { showScore, score, count, lastQuestion } = this.state;
    // get query from url
    const search = this.props.location.search;
    const page = new URLSearchParams(search).get("page");

    const { questions } = this.props;
    // console.log(questions)
    const hoursMinsSecs = { hours: 0, minutes: 0, seconds: 30 }

    return (
      <div>
        <Row className="justify-content-md-center">
          <Col md="auto mb-4">
            <h4>{!showScore ? "Instruction: You have 30 sec to solve the question and go to the next one!" : "Congrats, You finished your test"}</h4>
          </Col>
        </Row>
        <Container>
          {showScore ? (
            <Button variant="primary">
              You scored <Badge bg="secondary">{score}</Badge> out of <Badge bg="secondary">{questions.length}</Badge>
              <span className="visually-hidden">unread messages</span>
            </Button>
          ) : (
            <>
              <Row className="mb-3">
                <Col>
                  <Button variant="primary"><span>Question {count} from {questions.length} questions</span> </Button>
                </Col>
                <Col></Col><Col>
                <Button variant="secondary"><CountDown hoursMinsSecs={hoursMinsSecs} />  </Button>
                </Col>
                <Col></Col> 
                <Col>
                  <Button id="nexQuestion" style={{color: "white", display: {}}} color="white" onClick={this.nextQuestion} variant="info">{!lastQuestion ? "Next Question >" : "submit"} </Button>{' '}
                </Col>
              </Row>
              <Row className=" justify-content-center">
                { questions[count-1] &&
                  <>
                    <div style={{ marginTop: "30px", minWidth: "400px", maxWidth: "700px" }}><span>No. {count}: {questions.length > 0 ? questions[count-1].description : ""}{' '}</span>
                      {questions.length > 0 && questions[count-1].alternatives.map((answerOption, index) => (
                        <ListGroup className="mb-1">
                          <ListGroup.Item action  active={this.state.questionAnswers.length > 0 && this.state.questionAnswers[this.state.questionAnswers.findIndex(obj => obj.id === questions[count-1]._id)].choosen === index} onClick={() => this.handleAnswerOptionClick(answerOption.isCorrect, questions[count-1]._id, index)}>
                            {answerOption.text}
                          </ListGroup.Item>
                        </ListGroup>
                      ))}
                    </div>

                  </>
                }
              </Row>
            </>
          )}
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    questions: state.questions,
  };
};


export default connect(mapStateToProps, { retrieveQuestions, deleteAllQuestions, deleteQuestion })(TestTab);