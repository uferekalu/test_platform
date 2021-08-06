import React, { Component } from "react";
import { connect } from "react-redux";
import { createQuestion } from "../actions/questions";

class AddQuestion extends Component {
  constructor(props) {
    super(props);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveQuestion = this.saveQuestion.bind(this);
    this.newQuestion = this.newQuestion.bind(this);

    this.state = {
      id: null,
      description: "",
      alternatives: []
    };
  }

  onChangeDescription(e) {
    this.setState({
        description: e.target.value,
    });
  }

  handleChange(e) {
    
  }

  saveQuestion() {
    const { description, alternatives } = this.state;

    this.props
      .createQuestion(description, alternatives)
      .then((data) => {
        this.setState({
          id: data._id,
          description: data.description,
          alternatives: data.alternatives,
          submitted: true,
        });
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  newQuestion() {
    this.setState({
      id: null,
      description: "",
      alternatives: [],

      submitted: false,
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newQuestion}>
              Add
            </button>
          </div>
        ) : (
          <div>
              <div className="container auto">
                  <div className="row">
                        <div className="col-8">
                    <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        className="form-control"
                        id="description"
                        required
                        value={this.state.description}
                        onChange={this.onChangeDescription}
                        name="description"
                    />
                    </div>

                    <div className="form-group">
                    <label htmlFor="alternatives">Option 1</label>
                    <label>
                        <input
                        type="checkbox"
                        name="hooks"
                        checked={this.state.isCorrect}
                        onChange={this.handleChange}
                        />
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputA"
                        required
                        value={this.state.inputA}
                        onChange={this.onChangeAlternatives}
                        name="inputA"
                    />
                    </div>
                    <div className="form-group">
                    <label htmlFor="alternatives">Option 2</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputB"
                        required
                        value={this.state.inputB}
                        onChange={this.onChangeAlternatives}
                        name="inputB"
                    />
                    <label>
                        <input
                        type="checkbox"
                        name="hooks"
                        checked={this.state.isCorrect}
                        onChange={this.handleChange}
                        />
                    </label>
                    </div>
                    <div className="form-group">
                    <label htmlFor="alternatives">Option 3</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputC"
                        required
                        value={this.state.inputC}
                        onChange={this.onChangeAlternatives}
                        name="inputC"
                    />
                    <label>
                        <input
                        type="checkbox"
                        name="hooks"
                        checked={this.state.isCorrect}
                        onChange={this.handleChange}
                        />
                    </label>
                    </div>
                    <div className="form-group">
                    <label htmlFor="alternatives">Option 4</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputD"
                        required
                        value={this.state.inputD}
                        onChange={this.onChangeAlternatives}
                        name="inputD"
                    />
                    <label>
                        <input
                        type="checkbox"
                        name="hooks"
                        checked={this.state.isCorrect}
                        onChange={this.handleChange}
                        />
                    </label>
                    </div>
                    <button onClick={this.saveQuestion} className="btn btn-success">
                    Submit
                    </button>
                </div>
            </div>
        </div>
        </div>
        )}
      </div>
    );
  }
}

export default connect(null, { createQuestion })(AddQuestion);