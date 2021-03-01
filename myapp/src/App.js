import React, { useState } from "react";
import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Home from "./Home"
import Intro from "./Intro"
import Test from "./Test"
import Outro from "./Outro"
import Result from "./Result"
import { UserContext } from "./UserContext"

export default function App() {
  const [userInfo, setUserInfo] = useState({ name: '', gender: '' });

  return (
    <Router>
      <Switch>
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
          <Route exact path="/" component={Home} />
          <Route path="/intro" component={Intro} />
          <Route path="/test" component={Test} />
          <Route path="/outro/:seq" component={Outro} />
          <Route path="/result/:seq" component={Result} />
        </UserContext.Provider>
      </Switch>
    </Router>
  );
}
