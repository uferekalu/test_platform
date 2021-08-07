import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { retrieveQuestions, deleteAllQuestions } from "../actions/questions";
import { Container, Row, Col, Button, Badge, ListGroup } from 'react-bootstrap';

class QuestionsList extends Component {
  constructor(props) {
    super(props);
    this.refreshData = this.refreshData.bind(this);
    this.setActiveQuestion = this.setActiveQuestion.bind(this);
    this.removeAllQuestions = this.removeAllQuestions.bind(this);

    this.state = {
      currentQuestion: 0,
      currentIndex: -1,
      showScore: false,
      score: 0
    };
  }

  componentDidMount() {
    this.props.retrieveQuestions();
  }

  refreshData() {
    this.setState({
      currentQuestion: null,
      currentIndex: -1,
    });
  }

  handleAnswerOptionClick (isCorrect) {
    if (isCorrect){
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

  render() {
    const { currentQuestion, currentIndex, showScore, score } = this.state;
    const { questions } = this.props;
    const que = questions.map((ques) => ques)
    console.log("this the question", que)

    return (
      <>
      <Row className="justify-content-md-center">
        <Col md="auto">
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
                  </Row>
                  <Row>
                    {questions && questions.map((question, index) => (
                    <>
                      <Col><span>No. {index+1}:</span>{question.description}
                
                    
                          {question.alternatives.map((answerOption) => (
                            <ListGroup>
                              <ListGroup.Item onClick={() => this.handleAnswerOptionClick(answerOption.isCorrect)}>
                                {answerOption.text}
                              </ListGroup.Item>
                            </ListGroup>
                          ))}
                      </Col>
                  </>
                    ))}
                  </Row>
                </>
              )
            }
      </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    questions: state.questions,
  };
};

export default connect(mapStateToProps, { retrieveQuestions, deleteAllQuestions })(QuestionsList);