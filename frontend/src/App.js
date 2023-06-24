import React, { Component, Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Movies from "./components/Movies";
import Admin from "./components/Admin";
import Home from "./components/Home";
import OneMovie from "./components/OneMovie";
import Genres from "./components/Genres";
import OneGenre from "./components/OneGenre";
import EditMovie from "./components/EditMovie";
import Login from "./components/Login";
import GraphQL from "./components/Query";
import OneMovieGraphQL from "./components/OneMovieGraphQL";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jwt: "",
    };
    this.handleJWTChange(this.handleJWTChange.bind(this));

    // start changes
    this.counterRef = React.createRef();
    this.counterSpan = null;

    this.setCounterSpan = () => {
      console.log("Called");
      if (this.counterSpan) {
        console.log("inside if");
        this.counterSpan = this.counterRef;
      }
    }
  }

  componentDidMount() {
    let t = window.localStorage.getItem("jwt");
    if (t) {
      if (this.state.jwt === "") {
        try {
          this.setState({ jwt: JSON.parse(t) });
        } catch (error) {
          console.error("Error parsing JSON from localStorage:", error);
          // Обработка ошибки при разборе JSON
        }
      }
    }
  }

  handleJWTChange = (jwt) => {
    this.setState({ jwt: jwt });
  };

  logout = () => {
    this.setState({ jwt: "" });
    window.localStorage.removeItem("jwt");
  };

  render() {
    let loginLink;
    if (this.state.jwt === "") {
      loginLink = <Link to="/login">Login</Link>;
    } else {
      loginLink = (
        <Link to="/logout" onClick={this.logout}>
          Logout
        </Link>
      );
    }

    return (
      <Router>
        <div className="container">
          <div className="row">
            <div className="col mt-3">
              <h1 className="mt-3">Golang</h1>
            </div>
            <div className="col mt-3 text-end">{loginLink}</div>
            <hr className="mb-3"></hr>
          </div>

          <div className="row">
            <div className="col-md-2">
              <nav>
                <ul className="list-group">
                  <li className="list-group-item">
                    <Link to="/">Главная</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/movies">Фильмы</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/genres">Жанры</Link>
                  </li>
                  {this.state.jwt !== "" && (
                    <Fragment>
                      <li className="list-group-item">
                        <Link to="/admin/movie/0">Добавить фильм</Link>
                      </li>
                      <li className="list-group-item">
                        <Link to="/admin">Управление каталогом</Link>
                      </li>
                    </Fragment>
                  )}
                  <li className="list-group-item">
                    <Link to="/graphql">GraphQL</Link>
                  </li>

                  <li className="list-group-item">
                    <Link to="/extra">Доп. информация</Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="col-md-10">
              <Switch>
                <Route path="/movies/:id" component={OneMovie} />
                <Route path="/moviesgraphql/:id" component={OneMovieGraphQL} />

                <Route path="/movies">
                  <Movies />
                </Route>

                <Route path="/genre/:id" component={OneGenre} />

                <Route
                  exact
                  path="/login"
                  component={(props) => (
                    <Login {...props} handleJWTChange={this.handleJWTChange} />
                  )}
                />

                <Route exact path="/genres">
                  <Genres />
                </Route>

                <Route exact path="/graphql">
                  <GraphQL />
                </Route>

                <Route
                  path="/admin/movie/:id"
                  component={(props) => (
                    <EditMovie {...props} jwt={this.state.jwt} />
                  )}
                />

                <Route
                  path="/admin"
                  component={(props) => (
                    <Admin {...props} jwt={this.state.jwt} />
                  )}
                />

                <Route path="/extra">
                  <Extras userCount={el => this.counterRef = el} />
                </Route>

                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

function Extras(props) {
  let [count, setCount] = useState(0);

  // const countRef = document.getElementById("counter");

  // useEffect(() => {
  //   console.log("I was called using the useEffect hook");
  // })

  useEffect(() => {
    console.log("I was called from useEffect");
    return () => {
      console.log("I am firing from the return statement");
    }
  })

  return (
    <Fragment>
      <p>
        <button
          className="btn btn-primary"
          onClick={() => setCount(count + 1)}
        >
          Add 1
        </button>

        <button
          className="btn btn-danger ms-2"
          onClick={() => setCount(count - 1)}
        >
          Subtract 1
        </button>
      </p>
      <div>{count}</div>
    </Fragment>
  );
}
