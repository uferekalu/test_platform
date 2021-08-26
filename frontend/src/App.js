import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  Container,
  Nav,
  NavDropdown,
  Navbar,
  Button,
  Form,
  FormControl
} from "react-bootstrap";
import { connect } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser, loginUser } from "./actions/authActions";
import PropTypes from "prop-types";
import "./App.css";

import store from "./store";

import AddQuestion from "./components/add-question.component";
import QuestionsList from "./components/questions-list.component";
import CategoryList from "./components/categories-list.component";
import Question from "./components/question.component";
import Home from "./components/home";
import Register from "./components/Register";
import Login from "./components/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/Dashboard";
import TestTab from "./components/interviewee-question";
import CategoryCreat from "./components/categories";
import TestsList from "./components/tests-list.component";
import TestCreat from "./components/add-test.component";
import ParticipantsList from "./components/participants-list.component";
import ResultsList from "./components/results-list.component";
import Results from "./components/result-details.component";
import Instruction from "./components/instruction";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };
  render() {
    return (
      <Router>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="/">Exam Platform</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto white" style={{ color: "white" }}>
                {this.props.auth.isAuthenticated && (
                  <Nav.Link
                    href="/test"
                    onClick={() => {
                      localStorage.setItem("questionNumber", "1");
                      localStorage.setItem("answerAr", "");
                      localStorage.setItem("hours", "0");
                      localStorage.setItem("minutes", "0");
                      localStorage.setItem("seconds", "30");
                    }}
                  >
                    Take Test
                  </Nav.Link>
                )}
                {this.props.auth.isAuthenticated &&
                  this.props.auth.user.isAdmin === true && (
                    <>
                      <NavDropdown title="Results" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/participants">
                          All Participants
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/results">
                          Results List
                        </NavDropdown.Item>
                      </NavDropdown>
                      <NavDropdown title="Add" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/add">
                          Add Question
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/Category/add">
                          Add Category
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/test/add">
                          Add Test
                        </NavDropdown.Item>
                      </NavDropdown>
                      <NavDropdown title="Edit/Delete" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/questions">
                          Question list
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/Categoris">
                          Category list
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/tests">
                          Test list
                        </NavDropdown.Item>
                      </NavDropdown>
                    </>
                  )}
              </Nav>
              <>
                {this.props.auth.isAuthenticated &&
                  this.props.auth.user.isAdmin === true && (
                    <Form className="d-flex">
                      <FormControl
                        type="search"
                        placeholder="Search"
                        className="mr-2"
                        aria-label="Search"
                      />
                      <Button variant="outline-success">Search</Button>
                    </Form>
                  )}
                {this.props.auth.isAuthenticated && (
                  <Button
                    variant="primary"
                    onClick={this.onLogoutClick}
                    style={{ marginLeft: "15px" }}
                  >
                    Logout
                  </Button>
                )}
              </>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {/* <nav className="navbar px-5 navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Exam Platform
          </Link>
          <div className="navbar-nav mr-auto">
            {this.props.auth.isAuthenticated && (
              <li className="nav-item">
                <Link to={"/test"} onClick={() => {
                  localStorage.setItem("questionNumber", "1");
                  localStorage.setItem("answerAr", "");
                  localStorage.setItem("hours", "0");
                  localStorage.setItem("minutes", "0");
                  localStorage.setItem("seconds", "30");
                }}
                  className="nav-link">
                  Take Test
                </Link>
              </li>
            )}
            {this.props.auth.isAuthenticated &&
              this.props.auth.user.isAdmin === true && (
                <>
                  <li className="nav-item">
                    <Navbar.Collapse id="navbar-dark-example">
                      <Nav>
                        <NavDropdown
                          id="nav-dropdown-dark-example"
                          title="Results"
                          menuVariant="dark"
                        >
                          <NavDropdown.Item>
                            <Link to={"/participants"} className="nav-link">
                              All Participants
                            </Link>
                          </NavDropdown.Item>
                          <NavDropdown.Item>
                            <Link to={"/results"} className="nav-link">
                              Results List
                            </Link>
                          </NavDropdown.Item>
                        </NavDropdown>
                      </Nav>
                    </Navbar.Collapse>
                  </li>
                  <li className="nav-item">
                    <Navbar.Collapse id="navbar-dark-example">
                      <Nav>
                        <NavDropdown
                          id="nav-dropdown-dark-example"
                          title="Add"
                          menuVariant="dark"
                        >
                          <NavDropdown.Item>
                            <Link to={"/add"} className="nav-link">
                              Add Question
                            </Link>
                          </NavDropdown.Item>
                          <NavDropdown.Item>
                            <Link to={"/Category/add"} className="nav-link">
                              Add Category
                            </Link>
                          </NavDropdown.Item>
                          <NavDropdown.Item>
                            <Link to={"/test/add"} className="nav-link">
                              Add Test
                            </Link>
                          </NavDropdown.Item>

                        </NavDropdown>
                      </Nav>
                    </Navbar.Collapse>
                  </li>
                  <Navbar.Toggle aria-controls="navbar-dark-example" />
                  <Navbar.Collapse id="navbar-dark-example">
                    <Nav>
                      <NavDropdown
                        id="nav-dropdown-dark-example"
                        title="Edit/Delete"
                        menuVariant="dark"
                      >
                        <NavDropdown.Item>
                          <Link to={"/questions"} className="nav-link">
                            Question list
                          </Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                          <Link to={"/Categoris"} className="nav-link">
                            Category list
                          </Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                          <Link to={"/tests"} className="nav-link">
                            Test list
                          </Link>
                        </NavDropdown.Item>
                      </NavDropdown>
                    </Nav>
                  </Navbar.Collapse>
                </>
              )}
          </div>
          {this.props.auth.isAuthenticated && (
            <Button variant="primary" className="mb-4" onClick={this.onLogoutClick} style={{ marginTop: "15px", marginLeft: "10px" }}>
              Logout
            </Button>
          )}
        </nav> */}

        <Container className="mt-3">
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute exact path="/questions" component={QuestionsList} />
            <PrivateRoute exact path="/test" component={TestTab} />
            <PrivateRoute exact path="/add" component={AddQuestion} />
            <PrivateRoute
              exact
              path="/question/edit/:id"
              component={AddQuestion}
            />
            <PrivateRoute exact path="/test/edit/:id" component={TestCreat} />
            <PrivateRoute exact path="/question/:id" component={Question} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/instruction" component={Instruction} />
            <PrivateRoute
              exact
              path="/Category/add"
              component={CategoryCreat}
            />
            <PrivateRoute exact path="/test/add" component={TestCreat} />
            <PrivateRoute exact path="/tests" component={TestsList} />
            <PrivateRoute exact path="/Categoris" component={CategoryList} />
            <PrivateRoute
              exact
              path="/Categoris/edit/:id"
              component={CategoryCreat}
            />
            <PrivateRoute
              exact
              path="/participants"
              component={ParticipantsList}
            />
            <PrivateRoute exact path="/results" component={ResultsList} />
            <PrivateRoute exact path="/results/:id" component={Results} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
          </Switch>
        </Container>
      </Router>
    );
  }
}

App.propTypes = {
  loginUser: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser, logoutUser })(App);
