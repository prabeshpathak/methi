import { HashRouter, Switch, Route } from "react-router-dom";
import Nav from "./components/Nav";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect, useState } from "react";
import { connect } from 'react-redux'
import { retrieveSession } from "./state/actions";

function App({ retrieveSession }) {
	const [formOpen, setFormOpen] = useState(false)
	const [navModals, setNavModals] = useState({ projects : false, teams : false })
	useEffect(retrieveSession, [retrieveSession])

	return (
		<HashRouter>
			<div className="App">
				<Nav setFormOpen={setFormOpen} navModals={navModals} setNavModals={setNavModals} />
				<div className="nav-padding" onClick={() => setNavModals({ projects: false, teams: false })}>
					<Switch>
						<Route exact path="/signin" component={SignIn} />
					</Switch>
				</div>
			</div>
		</HashRouter>
	);
}

export default connect(null, { retrieveSession })(App);