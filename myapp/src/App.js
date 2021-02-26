import React, { useState } from "react";
import { Link, Route, Switch, BrowserRouter as Router} from "react-router-dom";
import Home from "./Home"
import Intro from "./Intro"
import Test from "./Test"
import Outro from "./Outro"
import Result from "./Result"
import "./style.css";

export default function App() {
  return (
    <Router>
      <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/intro" component={Intro} />
          <Route path="/test" component={Test} />
          <Route path="/outro" component={Outro} />
          <Route path="/result" component={Result} />
      </Switch>
    </Router>
  );
}
