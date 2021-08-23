import React, { Component } from "react";
import { connect } from "react-redux";
import { retrieveResult } from "../actions/results";
import { Container, Row, Col, Button, Pagination } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';
import PaginationComp from "./partials/pagination.component";

class ResultsList extends Component {
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
            idToDelete: 0,
        };
    }

    componentDidMount() {
        console.log(this.props)
        this.props.history.push({
            search: '?page=1'
        });

        this.props.retrieveResult()
            .then(() => {
                this.setState({ total: Math.ceil(this.props.results.length / 10) });
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
            .deleteAllResult()
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

    removeResult() {
        this.props
            .deleteResult(this.state.idToDelete)
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

        const { results } = this.props;
        // console.log(results)

        return (
            <div>
                <Row className="justify-content-md-center">
                    <Col md="auto mb-4">
                        <h4>Edit and delete results</h4>
                    </Col>
                </Row>
                <Container>
                    <>
                        <Row className="mb-3">
                            <Col>
                                <Button variant="primary"><span>There are {results.length} results</span> </Button>
                            </Col>
                            <Col></Col><Col></Col>
                            <Col>
                                {/* <Button variant="primary"><span><CountDown hoursMinsSecs={hoursMinsSecs} /> </span> </Button> */}
                            </Col>
                        </Row>
                        <Row>
                            {results && results.slice(
                                pageSize * (page - 1),
                                pageSize * (page - 1) + pageSize
                            ).map((Result, index) => (
                                <>
                                    <Col style={{ marginTop: "30px", minWidth: "400px", maxWidth: "400px" }}>
                                        <span>{index + 1}- Participant {Result.user.name} with {Result.attempt} {Result.attempt > 1 ? 'attempts' : 'attempt'} got {Result.correctAnsweredCount} right answers in {Result.test.name} test{' '}</span>
                                        <br />
                                        <br />
                                        <Button onClick={() => this.props.history.push("/results/" + Result._id)} variant="outline-success">View Details</Button>{' '}
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
                            onConfirm={() => this.removeResult()}
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
        results: state.results,
    };
};


export default connect(mapStateToProps, { retrieveResult })(ResultsList);