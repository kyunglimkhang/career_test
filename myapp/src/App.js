import React, { useState } from "react";
import { Link, Route, Switch, BrowserRouter as Router} from "react-router-dom";
import Home from "./Home"
import Intro from "./Intro"
import Test from "./Test"
import "./style.css";

export default function App() {
  return (
    <Router>
      <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/intro" component={Intro} />
          <Route path="/test" component={Test} />
      </Switch>
    </Router>
  );
}
