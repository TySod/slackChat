import React, { Component } from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import firebase from "./firebase";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import {setUser, clearUser} from './actions'
import Spinner from './components/Spinner'

const store = createStore(rootReducer, composeWithDevTools());

class Root extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.setUser(user)
        this.props.history.push("/");
      }else{
        this.props.history.push("/login");
        this.props.clearUser()
      }
    });
  }
  render() {
    return this.props.isLoading ? <Spinner/> :(
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}
const mapStateToProps= state =>({
  isLoading : state.user.isLoading
})

const RouteWithAuth = withRouter(connect(mapStateToProps, {setUser, clearUser})(Root));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RouteWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
