import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { retrieveCategory, deleteAllCategory, simpleUpdateCategory, deleteCategory } from "../actions/categories";
import CountDown from './countdown'
import { Container, Row, Col, Button, Badge, ListGroup, Pagination, Alert } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import categories from "./categories";

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.refreshData = this.refreshData.bind(this);
    this.setActiveQuestion = this.setActiveQuestion.bind(this);
    this.removeAllQuestions = this.removeAllQuestions.bind(this);
    this.triggerAlert = this.triggerAlert.bind(this);
    this.closeAlert = this.closeAlert.bind(this);

    this.state = {
      currentQuestion: 0,
      currentIndex: -1,
      showScore: false,
      score: 0,
      active: false,
      show: false,
      pageSize: 10,
      total: 0,
      questionAnswers: [],
      items: [],
      idToDelete:0,
    };
  }

  componentDidMount() {
    console.log(this.props)
    this.props.history.push({
      search: '?page=1'
    });

    this.props.retrieveCategory()
      .then(() => {

        // pagination items
        let items = [];
        // init pagination
        // get total pages
        let total = Math.ceil(this.props.categories.length / 10);
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
        console.error(err);
      });
  }

  refreshData() {
    this.setState({
      currentQuestion: null,
      currentIndex: -1,
    });
  }

  handleAnswerOptionClick(isCorrect, id, index) {

    let objIndex = this.state.questionAnswers.findIndex(obj => obj.id === id);
    let quesArr = this.state.questionAnswers;
    console.log(id + "  " + JSON.stringify(this.state.questionAnswers))
    quesArr[objIndex].choosen = index;
    this.setState({
      questionAnswers: quesArr
    });
    console.log(id + "  " + JSON.stringify(quesArr))
  }

  setActiveQuestion(question, index) {
    this.setState({
      currentQuestion: question,
      currentIndex: index,
    });
  }

  removeAllQuestions() {
    this.props
      .deleteAllCategory()
      .then((response) => {
        console.log(response);
        this.refreshData();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  triggerAlert(id) {
    this.setState({ show: true, idToDelete: id});    
  }

  closeAlert() {
    this.setState({ show: false });
  }

  removeCategory() {
    this.props
      .deleteCategory(this.state.idToDelete)
      .then (() => this.closeAlert())
      .catch((e) => {
        console.log(e);
        this.closeAlert();
      });
  }

  render() {
    const { show, showScore, score, pageSize } = this.state;
    // get query from url
    const search = this.props.location.search;
    const page = new URLSearchParams(search).get("page");

    const { categories } = this.props;
    // console.log(categories)
    const hoursMinsSecs = { hours: 1, minutes: 20, seconds: 40 }

    return (
      <div>
        <Row className="justify-content-md-center">
          <Col md="auto mb-4">
            <h4>Edit and delete Categories</h4>
          </Col>
        </Row>
        <Container>
            <>
              <Row className="mb-3">
                <Col>
                  <Button variant="primary"><span>There are {categories.length} categories</span> </Button>
                </Col>
                <Col></Col><Col></Col>
                <Col>
                  {/* <Button variant="primary"><span><CountDown hoursMinsSecs={hoursMinsSecs} /> </span> </Button> */}
                </Col>
              </Row>
              <Row>
                {categories && categories.slice(
                  pageSize * (page - 1),
                  pageSize * (page - 1) + pageSize
                ).map((category, index) => (
                  <>
                    <Col style={{ marginTop: "30px", minWidth: "400px", maxWidth: "400px" }}><span>No. {index + 1}: {category.name}{' '}</span>

                      <Button onClick={() => this.props.history.push("/Categoris/edit/" + category._id)} variant="outline-warning">Edit</Button>{' '}
                      <Button onClick={() => this.triggerAlert(category._id)} variant="outline-danger">Delete</Button>{' '}
                    </Col>
                  </>
                ))}
              </Row>
              <SweetAlert
                      warning
                      showCancel
                      confirmBtnText="Yes, delete it!"
                      confirmBtnBsStyle="danger"
                      title="Are you sure?"
                      onConfirm={() => this.removeCategory()}
                      onCancel={this.closeAlert}
                      focusCancelBtn
                      show={show} 
                    >
                      You will not be able to recover this question!
                    </SweetAlert>
              {/* <Alert show={show} variant="success">
        <Alert.Heading>Caution!!</Alert.Heading>
        <p>
          Do you want to delete selected question ?
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={} variant="outline-success">
            No take me back
          </Button>
          <Button onClick={} variant="outline-danger">
            Delete
          </Button>

        </div>
      </Alert> */}

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
    categories: state.categories,
  };
};


export default connect(mapStateToProps, { retrieveCategory, deleteAllCategory, deleteCategory })(CategoryList);