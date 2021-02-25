import React, { useState } from "react";
import { Link, Route, Switch, BrowserRouter as Router} from "react-router-dom";
// import Test from "./Test";
import Home from "./Home"
import Test from "./Test"
import "./style.css";

export default function App() {
  return (
    <Router>
      <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/test" component={Test} />
      </Switch>
    </Router>
  );
}
