import React, { Component } from "react";
import { connect } from "react-redux";
import { retrieveTest, deleteAllTest, deleteTest } from "../actions/tests";
import { Container, Row, Col, Button, Badge, Pagination } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';

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
      idToDelete:0,
    };
  }
  mapCategoryIdToName (id) {
    console.log("1wwss " + id)
    // console.log("1ss " + this.props.categories)
    let name = "";
    if(this.props.categories){
      this.props.categories.map(category => {
        console.log("1ss " + category._id)
        if(category._id === id) {
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

        // pagination items
        let items = [];
        // init pagination
        // get total pages
        let total = Math.ceil(this.props.tests.length / 10);
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
    this.setState({ show: true, idToDelete: id});    
  }

  closeAlert() {
    this.setState({ show: false });
  }

  removeTest() {
    this.props
      .deleteTest(this.state.idToDelete)
      .then (() => this.closeAlert())
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
            <h4 className="testrelated">Edit and delete Tests</h4>
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
                    <Col style={{ marginTop: "30px", minWidth: "400px", maxWidth: "400px" }}><span className="testrelated">No. {index + 1}: {Test.name}{' '}
                    <Badge className="m-2" bg="secondary">{this.mapCategoryIdToName(Test.category)}</Badge>
                    </span>
                    <br/>

                      <Button onClick={() => this.props.history.push("/test/edit/" + Test._id)} variant="warning">Edit</Button>{' '}
                      <Button onClick={() => this.triggerAlert(Test._id)} variant="danger">Delete</Button>{' '}
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
    tests: state.tests,
    categories: state.categories,
  };
};


export default connect(mapStateToProps, { retrieveTest, deleteAllTest, deleteTest })(TestList);