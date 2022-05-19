import { useLocation, Switch, Route } from "react-router-dom";
import Nav from "./components/Nav";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
import CreateProject from "./components/CreateProject";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { retrieveSession } from "./state/actions";
import PrivateRoute from "./components/PrivateRoute";

function App({ retrieveSession }) {
  const [formOpen, setFormOpen] = useState(false);
  const [navModals, setNavModals] = useState({ projects: false, teams: false });
  useEffect(retrieveSession, [retrieveSession]);
  const location = useLocation();

  return (
    <div className="App">
      <Nav
        setFormOpen={setFormOpen}
        navModals={navModals}
        setNavModals={setNavModals}
      />
      <div
        className="nav-padding"
        onClick={() => setNavModals({ projects: false, teams: false })}
      >
        <Switch location={location} key={location.pathname}>
          <Route exact path="/signin" component={SignIn} />
          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute
            exact
            path="/projects/create"
            component={CreateProject}
          />
        </Switch>
      </div>
    </div>
  );
}

export default connect(null, { retrieveSession })(App);
