import React, { Component } from "react";
import { connect } from "react-redux";
import { retrieveTest, deleteAllTest, deleteTest } from "../actions/tests";
import { Container, Row, Col, Button, Badge, Pagination } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import PaginationComp from "./partials/pagination.component";

class TestList extends Component {
  constructor(props) {
    super(props);
    this.refreshData = this.refreshData.bind(this);
    this.removeAllQuestions = this.removeAllQuestions.bind(this);
    this.triggerAlert = this.triggerAlert.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.mapCategoryIdToName = this.mapCategoryIdToName.bind(this);

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
      idToDelete: 0,
    };
  }
  mapCategoryIdToName(id) {
    let name = "";
    if (this.props.categories) {
      this.props.categories.map(category => {
        if (category._id === id) {
          name = category.name;
        }
      });
    }
    return name;
  }

  componentDidMount() {
    console.log(this.props)
    this.props.history.push({
      search: '?page=1'
    });

    this.props.retrieveTest()
      .then(() => {

        this.setState({ total: Math.ceil(this.props.tests.length / 10) })
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

  removeAllQuestions() {
    this.props
      .deleteAllTest()
      .then((response) => {
        console.log(response);
        this.refreshData();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  triggerAlert(id) {
    this.setState({ show: true, idToDelete: id });
  }

  closeAlert() {
    this.setState({ show: false });
  }

  removeTest() {
    this.props
      .deleteTest(this.state.idToDelete)
      .then(() => this.closeAlert())
      .catch((e) => {
        console.log(e);
        this.closeAlert();
      });
  }

  render() {
    const { show, pageSize } = this.state;
    // get query from url
    const search = this.props.location.search;
    const page = new URLSearchParams(search).get("page");

    const { tests } = this.props;

    return (
      <div>
        <Row className="justify-content-md-center">
          <Col md="auto mb-4">
            <h4>Edit and delete Tests</h4>
          </Col>
        </Row>
        <Container>
          <>
            <Row className="mb-3">
              <Col>
                <Button variant="primary"><span>There are {tests.length} tests</span> </Button>
              </Col>
              <Col></Col><Col></Col>
              <Col>
                {/* <Button variant="primary"><span><CountDown hoursMinsSecs={hoursMinsSecs} /> </span> </Button> */}
              </Col>
            </Row>
            <Row>
              {tests && tests.slice(
                pageSize * (page - 1),
                pageSize * (page - 1) + pageSize
              ).map((Test, index) => (
                <>
                  <Col style={{ marginTop: "30px", minWidth: "400px", maxWidth: "400px" }}><span>No. {index + 1}: {Test.name}{' '}
                    <Badge className="m-2" bg="secondary">{this.mapCategoryIdToName(Test.category)}</Badge>
                  </span>
                    <br />

                    <Button onClick={() => this.props.history.push("/test/edit/" + Test._id)} variant="outline-warning">Edit</Button>{' '}
                    <Button onClick={() => this.triggerAlert(Test._id)} variant="outline-danger">Delete</Button>{' '}
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
              onConfirm={() => this.removeTest()}
              onCancel={this.closeAlert}
              focusCancelBtn
              show={show}
            >
              You will not be able to recover this question!
            </SweetAlert>
          </>
          <div className="mt-5 d-flex justify-content-center">
            <Pagination bsSize="medium">
              <Pagination.First id={`firstPage${this.state.total}`} onClick={() => this.props.history.push({ search: `?page=${1}` })} />
              <Pagination.Prev onClick={() => page != 1 && this.props.history.push({ search: `?page=${parseInt(page) - 1}` })} />
              <PaginationComp total={this.state.total} num={parseInt(page)} history={this.props.history} />
              <Pagination.Next onClick={() => page != this.state.total && this.props.history.push({ search: `?page=${parseInt(page) + 1}` })} />
              <Pagination.Last onClick={() => this.props.history.push({ search: `?page=${this.state.total}` })} />
            </Pagination>
          </div>
        </Container>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    tests: state.tests,
    categories: state.categories,
  };
};


export default connect(mapStateToProps, { retrieveTest, deleteAllTest, deleteTest })(TestList);