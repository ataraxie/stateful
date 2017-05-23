"use strict";

let express = require('express');
let app = express();
let ws = require('express-ws')(app);
let fs = require('fs');

app.use(express.static('public', {
	index: 'index.html'
}));

app.ws('/', function(ws, req) {
	function send(type, name, content) {
		let json = JSON.stringify({
			type: type,
			name: name,
			content: content
		});
		ws.send(json);
	}

	send('script', 'jquery.js', file('public/js/jquery.js'));
	send('script', 'stateful.js', file('public/js/stateful.js'));
	send('style', 'stateful.css', file('public/css/stateful.css'));
});

app.listen(3000, function () {
	console.log('STATEFUL is now running on port 3000!');
});

function file(path) {
	return '\n' + fs.readFileSync(path, 'utf8') + '\n';
}