import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import Home from './components/Home';
import D1 from './day/D1';

const history = createBrowserHistory();

const Routes = props => (
	<HashRouter>
		<div>
			<Route exact path="/" component={Home} />
			<Route exact path="/D1" component={D1} />
		</div>
	</HashRouter>
);

export default Routes;
