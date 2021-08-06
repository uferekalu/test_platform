import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { retrieveQuestions, deleteAllQuestions } from "../actions/questions";

class QuestionsList extends Component {
  constructor(props) {
    super(props);
    this.refreshData = this.refreshData.bind(this);
    this.setActiveQuestion = this.setActiveQuestion.bind(this);
    this.removeAllQuestions = this.removeAllQuestions.bind(this);

    this.state = {
      currentQuestion: null,
      currentIndex: -1
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
    const { currentQuestion, currentIndex } = this.state;
    const { questions } = this.props;

    return (
      <div className="list row">
        <div className="col-md-8">
        </div>
        <div className="col-md-6">
          <h4>Questions lists</h4>
          <ul className="list-group">
            {questions &&
              questions.map((question, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveQuestion(question, index)}
                  key={index}
                >
                  {question.description}
                </li>
              ))}
          </ul>

          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.deleteAllQuestions}
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {currentQuestion ? (
            <div>
              <h4>Question</h4>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentQuestion.description}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentQuestion.alternatives}
              </div>
              <Link
                to={"/questions/" + currentQuestion.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Question...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    questions: state.questions,
  };
};

export default connect(mapStateToProps, { retrieveQuestions, deleteAllQuestions })(QuestionsList);