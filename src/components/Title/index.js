import React from 'react';

import './style.css';

const Title = ({ title, url }) => {
	return (
		<div className="title">
			<h1>{title}</h1>
			{url && (
				<a href={url} target="_blank">
					More info
				</a>
			)}
		</div>
	);
};

export default Title;
