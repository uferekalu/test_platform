import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from 'react-bootstrap';
import { updateCategory, deleteCategory, createCategory } from "../actions/categories";
import CategoriesDataService from "../services/categories-services";

class CategoryCreat extends Component {
    constructor(props) {
        super(props);
        // this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeAlternatives = this.onChangeAlternatives.bind(this);
        this.getCategory = this.getCategory.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.updateContent = this.updateContent.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.newCategory = this.newCategory.bind(this);
        
        this.state = {
            currentQuestion: {
                id: null,
                description: "",
                alternative: []
            },
            name: "",
            message: "",
            submitted: false,
        };
    }

    componentDidMount() {
        if (this.props.history.location.pathname.includes("edit"))
        this.getCategory(this.props.match.params.id);
    }

    onChangeName(e) {

        this.setState({name: e.target.value});
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

    getCategory(id) {
        CategoriesDataService.get(id)
            .then((response) => {
                this.setState({
                    name: response.data.name,
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
            .updateCategory(this.state.currentQuestion.id, data)
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
        let data = {};
        data.name = this.state.name;
        this.props
            .updateCategory(this.props.match.params.id, data)
            .then((reponse) => {
                console.log(reponse);

                this.setState({ submitted: true });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    newCategory() {
        this.setState({ submitted: false });
    }

    addCategory() {
        this.props
            .createCategory(this.state.name)
            .then(() => {
                this.props.history.push("/Categoris");
            })
            .catch((e) => {
                console.log(e);
            });
    }

    render() {
        const { name } = this.state;
        let edit = this.props.history.location.pathname.includes("edit");
        return (
            <div>
                {this.state.submitted ? (
                    <div>
                        <h4>You submitted successfully!</h4>
                        <button className="btn btn-success" onClick={this.newCategory}>
                            Add
                        </button>
                    </div>
                ) : (

                    <div className="edit-form">
                        <h4>{edit ? "Edit" : "Add"} Category</h4>
                        <form className="mb-3 w-50">
                            <div className="form-group">
                                <label htmlFor="title">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    value={name}
                                    onChange={this.onChangeName}
                                />
                            </div>
                        </form>

                        <Button
                            //   className="badge badge-danger mr-2"
                            onClick={edit ? this.updateContent: this.addCategory}
                        >
                            {edit ? "Edit" : "Create"} Category
                        </Button>
                    </div>
                )}
            </div>
        );
    }
}

export default connect(null, { updateCategory, deleteCategory, createCategory })(CategoryCreat);