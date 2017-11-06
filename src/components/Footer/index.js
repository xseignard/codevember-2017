import React from 'react';

import './style.css';

const Title = () => {
	return (
		<div className="footer">
			<p>
				Made by{' '}
				<a href="https://twitter.com/xavier_seignard" target="_blank">
					@xavier_seignard
				</a>
			</p>
			<p>
				Code available at{' '}
				<a href="https://github.com/xseignard/codevember-2017" target="_blank">
					https://github.com/xseignard/codevember-2017
				</a>
			</p>
		</div>
	);
};

export default Title;
