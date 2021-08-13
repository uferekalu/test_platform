import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { connect } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser, loginUser } from "./actions/authActions";
import PropTypes from "prop-types";
import "./App.css";

import store from "./store";

import AddQuestion from './components/add-question.component'
import QuestionsList from './components/questions-list.component'
import CategoryList from './components/categories-list.component'
import Question from './components/question.component'
import Home from './components/home'
import Register from './components/Register'
import Login from './components/Login'
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/Dashboard";
import TestTab from "./components/interviewee-question";
import CategoryCreat from "./components/categories";

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
  render() {
    return (
      <Router>
        <nav className="navbar px-5 navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Exam Platform
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/test"} className="nav-link">
                Take Test
              </Link>
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
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </div>
        </nav>

        <Container className="mt-3">
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute exact path="/questions" component={QuestionsList} />
            <Route exact path="/add" component={AddQuestion} />
            <Route exact path="/question/edit/:id" component={AddQuestion} />
            <Route path="/test" component={TestTab} />
            <Route path="/question/:id" component={Question} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/Category/add" component={CategoryCreat} />
            <Route exact path="/Categoris" component={CategoryList} />
            <Route path="/Categoris/edit/:id" component={CategoryCreat} />

            <PrivateRoute exact path="/dashboard" component={Dashboard} />
          </Switch>
        </Container>
      </Router>
    )
  }
}

App.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(App);
