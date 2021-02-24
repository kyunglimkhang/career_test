import React, { useState } from "react";
import { Link, Route, Switch, BrowserRouter as Router} from "react-router-dom";
// import Intro from "./Intro";
import Home from "./Home"
import Intro from "./Intro"
import "./style.css";

export default function App() {
  return (
    <Router>
      <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/intro" component={Intro} />
      </Switch>
    </Router>
  );
}
