import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';

import './main.css';

import Routes from './routes';

const App = () => <Routes />;

ReactDOM.render(<App />, document.getElementById('root'));
