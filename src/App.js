import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashBoard from "./pages/Dashboard";
import MainPage from "./pages/MainPage";
import Addpost from "./pages/addPost";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Register />
        </Route>
        <Route exact path="/Login">
          <Login />
        </Route>
        <Route path="/dashboard">
          <DashBoard />
        </Route>
        <Route path="/Posts">
          <MainPage />
        </Route>
        <Route path="/addpost">
          <Addpost />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
