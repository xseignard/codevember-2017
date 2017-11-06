import React from 'react';

import './style.css';

const Title = ({ title, url }) => {
	return (
		<div className="title">
			<h1>{title}</h1>
			{url && (
				<a href={url} target="_blank">
					{url}
				</a>
			)}
		</div>
	);
};

export default Title;
