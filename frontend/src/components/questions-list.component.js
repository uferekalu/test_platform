import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { retrieveQuestions, deleteAllQuestions, simpleUpdateQuestion, deleteQuestion } from "../actions/questions";
import CountDown from './countdown'
import { Container, Row, Col, Button, Badge, ListGroup, Pagination } from 'react-bootstrap';


class QuestionsList extends Component {
  constructor(props) {
    super(props);
    this.refreshData = this.refreshData.bind(this);
    this.setActiveQuestion = this.setActiveQuestion.bind(this);
    this.removeAllQuestions = this.removeAllQuestions.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    
    this.state = {
      currentQuestion: 0,
      currentIndex: -1,
      showScore: false,
      score: 0,
      active: false,
      pageSize: 10,
      total: 0,
      items: [],
    };
  }

  componentDidMount() {
    console.log(this.props)
    this.props.history.push({
      search: '?page=1'
    });

    this.props.retrieveQuestions()
      .then(() => {
        // pagination items
        let items = [];
        // init pagination
        // get total pages
        let total = Math.ceil(this.props.questions.length / 10);
        for (let number = 1; number <= total; number++) {
          items.push(
            <Pagination.Item onClick={() => {
              this.props.history.push({
                search: `?page=${number}`
              });
            }}
              active={number === 1}>{number}</Pagination.Item>
          );
        }
        this.setState({
          items
        });
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

  handleAnswerOptionClick(isCorrect) {
    if (isCorrect) {
      this.setState({
        score: this.state.score + 1
      })
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
    this.props
      .deleteQuestion(id)
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { currentQuestion, currentIndex, showScore, score, pageSize } = this.state;
    // get query from url
    const search = this.props.location.search;
    const page = new URLSearchParams(search).get("page");

    const { questions } = this.props;
    console.log(questions)
    const hoursMinsSecs = { hours: 1, minutes: 20, seconds: 40 }

    return (
      <div>
        <Row className="justify-content-md-center">
          <Col md="auto mb-4">
            <h4>Instruction: Choose an answer to move to the next question!</h4>
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
                  <Button variant="primary"><span>There are {questions.length} questions</span> </Button>
                </Col>
                <Col></Col><Col></Col>
                <Col>
                  <Button variant="primary"><span><CountDown hoursMinsSecs={hoursMinsSecs} /> </span> </Button>
                </Col>
              </Row>
              <Row>
                {questions && questions.slice(
                  pageSize * (page - 1),
                  pageSize * (page - 1) + pageSize
                ).map((question, index) => (
                  <>
                    <Col style={{ marginTop: "30px", minWidth: "400px", maxWidth: "400px" }}><span>No. {index + 1}: {question.description}{' '}</span>
                      {question.alternatives.map((answerOption) => (
                        <ListGroup className="mb-1">
                          <ListGroup.Item onClick={() => this.handleAnswerOptionClick(answerOption.isCorrect)}>
                            {answerOption.text}
                          </ListGroup.Item>
                        </ListGroup>
                      ))}
                      <Button onClick={() => this.props.history.push("/question/edit/" + question._id)} variant="outline-warning">Edit</Button>{' '}
                      <Button onClick={() => this.removeQuestion(question._id)} variant="outline-danger">Delete</Button>{' '}
                    </Col>

                  </>
                ))}
              </Row>
              {/* <Row>
              {questions && questions.map((question, index) => (
                <Col key={index}><span>No. {index+1}: {' '}</span>{question.description}
                    {question.alternatives.map((answerOption, index) => (
                      <ListGroup className="options" key={index}>
                        <ListGroup.Item onClick={() => this.handleAnswerOptionClick(answerOption.isCorrect)}>
                          {answerOption.text}
                        </ListGroup.Item>
                      </ListGroup>
                    ))}
                </Col>
              ))}
            </Row> */}
            </>
          )}
          <div className="mt-5 d-flex justify-content-center">
            <Pagination bsSize="medium">
              <Pagination.First />
              <Pagination.Prev />
              {this.state.items}
              <Pagination.Next />
              <Pagination.Last />
            </Pagination>
          </div>
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


export default connect(mapStateToProps, { retrieveQuestions, deleteAllQuestions, deleteQuestion })(QuestionsList);