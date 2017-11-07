import React from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import d1 from './img/d1.png';

const days = [
	{
		title: 'Hommage to Bill Etra & Steve Rutt',
		picture: d1,
	},
];

const Home = props => {
	const articles = days.map((day, index) => {
		return (
			<Link to={`/D${index + 1}`} key={index} className="day">
				{index % 2 === 1 && (
					<div className="picture" style={{ backgroundImage: `url(${day.picture})` }} />
				)}
				<div className="info">
					<div>
						<h2>Day {index + 1}</h2>
						<h3>{day.title}</h3>
					</div>
				</div>
				{index % 2 === 0 && (
					<div className="picture" style={{ backgroundImage: `url(${day.picture})` }} />
				)}
			</Link>
		);
	});
	return (
		<div className="home">
			<header>
				<h1>Codevember 2017</h1>
				<div>
					<a href="https://twitter.com/xavier_seignard" target="_blank">
						@xavier_seignard
					</a>{' '}
					-{' '}
					<a href="https://github.com/xseignard/codevember-2017" target="_blank">
						codevember-2017
					</a>
				</div>
			</header>
			<section>{articles}</section>
		</div>
	);
};

export default Home;