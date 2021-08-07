import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Container } from 'react-bootstrap';
import "./App.css";

import AddQuestion from './components/add-question.component'
import QuestionsList from './components/questions-list.component'
import Question from './components/question.component'
class App extends Component {
  render() {
    return (
      <Router>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/tutorials"} className="navbar-brand">
            Exam Platform
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/tutorials"} className="nav-link">
                Tutorials
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/add"} className="nav-link">
                Add
              </Link>
            </li>
          </div>
        </nav>

        <Container className="mt-3">
          <Switch>
            <Route exact path={["/", "/tutorials"]} component={QuestionsList} />
            <Route exact path="/add" component={AddQuestion} />
            <Route path="/tutorials/:id" component={Question} />
          </Switch>
        </Container>
      </Router>
    )
  }
}

export default App;