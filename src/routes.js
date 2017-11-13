import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import Home from './components/Home';
import D1 from './day/D1';
import D2 from './day/D2';
import D3 from './day/D3';
import D4 from './day/D4';
import D5 from './day/D5';
import D6 from './day/D6';

const history = createBrowserHistory();

const Routes = props => (
	<HashRouter>
		<div>
			<Route exact path="/" component={Home} />
			<Route exact path="/D1" component={D1} />
			<Route exact path="/D2" component={D2} />
			<Route exact path="/D3" component={D3} />
			<Route exact path="/D4" component={D4} />
			<Route exact path="/D5" component={D5} />
			<Route exact path="/D6" component={D6} />
		</div>
	</HashRouter>
);

export default Routes;
