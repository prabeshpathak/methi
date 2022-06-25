import "./style.scss";
import { useLocation, Switch, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Landing from "./components/Landing";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { retrieveSession } from "./state/actions";
import CreateProject from "./components/CreateProject";
import Backlog from "./components/Backlog";
import Create from "./components/Create";
import Boards from "./components/Boards";
import Issue from "./components/Issue";
import Team from "./components/Team";
import CreateTeam from "./components/CreateTeam";
import ProjectSettings from "./components/ProjectSettings";
import Profile from "./components/Profile";
import Notification from "./components/Notification";
import Roadmap from "./components/Roadmap";
import About from "./components/About";
import Jitsu from "./components/Jitsu";

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
      {formOpen && <Create setFormOpen={setFormOpen} />}
      <div
        className={`${location.pathname !== "/" && "nav-padding"}`}
        onClick={() => setNavModals({ projects: false, teams: false })}
      >
        <Notification />
        <Switch location={location} key={location.pathname}>
          <Route exact path="/" component={Landing} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/about" component={About} />
          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute
            exact
            path="/projects/create"
            component={CreateProject}
          />
          <PrivateRoute
            exact
            path="/projects/backlog/:id"
            component={Backlog}
          />
          <PrivateRoute exact path="/projects/boards/:id" component={Boards} />
          <PrivateRoute
            exact
            path="/projects/roadmap/:id"
            component={Roadmap}
          />
          <PrivateRoute
            exact
            path="/projects/settings/:id"
            component={ProjectSettings}
          />
          <PrivateRoute exact path="/jitsu" component={Jitsu} />
          <PrivateRoute exact path="/teams/create" component={CreateTeam} />
          <PrivateRoute exact path="/teams/:id" component={Team} />
          <PrivateRoute exact path="/issues/:id" component={Issue} />
        </Switch>
      </div>
    </div>
  );
}

export default connect(null, { retrieveSession })(App);
