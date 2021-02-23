import React, { useState } from "react";
import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";
// import Intro from "./Intro";
import Home from "./Home"
import Intro from "./Intro"
import "./style.css";

export default function App() {
  return (
    <Router>
      <main>
        <Route exact path="/" component={Home} />
        <Route path="/intro" compoenet={Intro} />
      </main>
      <div>
        <Link to="/intro">
          <button type="submit" id="start_btn" disabled>검사 시작</button>
        </Link>
      </div>
    </Router>
  );
}
