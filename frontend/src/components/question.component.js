import React, { Component } from "react";
import { connect } from "react-redux";
import { updateQuestion, deleteQuestion } from "../actions/questions";
import QuestionDataService from "../services/question-service";

class Question extends Component {
  constructor(props) {
    super(props);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeAlternatives = this.onChangeAlternatives.bind(this);
    this.getQuestion = this.getQuestion.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);

    this.state = {
      currentQuestion: {
        id: null,
        description: "",
        alternative: ""
      },
      message: "",
    };
  }

  componentDidMount() {
    this.getQuestion(this.props.match.params.id);
  }

  onChangeDescription(e) {
    const description = e.target.value;

    this.setState(function (prevState) {
      return {
        currentQuestion: {
          ...prevState.currentQuestion,
          description: description,
        },
      };
    });
  }

  onChangeAlternatives(e) {
    const alternatives = e.target.value;

    this.setState((prevState) => ({
      currentQuestion: {
        ...prevState.currentQuestion,
        alternatives: alternatives,
      },
    }));
  }

  getQuestion(id) {
    QuestionDataService.get(id)
      .then((response) => {
        this.setState({
            currentQuestion: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateStatus(status) {
    var data = {
      id: this.state.currentQuestion.id,
      description: this.state.currentQuestion.description,
      alternatives: this.state.currentQuestion.alternatives
    };

    this.props
      .updateQuestion(this.state.currentQuestion.id, data)
      .then((reponse) => {
        console.log(reponse);

        this.setState((prevState) => ({
            currentQuestion: {
            ...prevState.currentQuestion
          },
        }));

        this.setState({ message: "The status was updated successfully!" });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateContent() {
    this.props
      .updateQuestion(this.state.currentQuestion.id, this.state.currentQuestion)
      .then((reponse) => {
        console.log(reponse);
        
        this.setState({ message: "The question was updated successfully!" });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  removeQuestion() {
    this.props
      .deleteQuestion(this.state.currentQuestion.id)
      .then(() => {
        this.props.history.push("/questions");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { currentQuestion } = this.state;

    return (
      <div>
        {currentQuestion ? (
          <div className="edit-form">
            <h4>Question</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentQuestion.description}
                  onChange={this.onChangeDescription}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Alternatives</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentQuestion.alternatives}
                  onChange={this.onChangeAlternatives}
                />
              </div>
            </form>

            <button
              className="badge badge-danger mr-2"
              onClick={this.removeQuestion}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateContent}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Question...</p>
          </div>
        )}
      </div>
    );
  }
}

export default connect(null, { updateQuestion, deleteQuestion })(Question);