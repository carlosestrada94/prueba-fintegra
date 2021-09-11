import { Fragment } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
//Pages
import Home from "./pages/Home";
import Predictor from "./pages/Predictor";

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Switch>
          <Route exact path={"/"}>
            <Home />
          </Route>
          <Route exact path={"/predictor"}>
            <Predictor />
          </Route>
        </Switch>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
