"use strict";

let express = require('express');
let app = express();
let ws = require('express-ws')(app);
let fs = require('fs');

app.use(express.static('public', {
	index: 'index.html'
}));

app.ws('/', function(ws, req) {

	function file(path) {
		return '\n' + fs.readFileSync(path, 'utf8') + '\n';
	}

	function sendStatic(contentType, name, content) {
		let json = JSON.stringify({
			messageType: 'static',
			contentType: contentType,
			name: name,
			content: content
		});
		ws.send(json);
	}

	sendStatic('script', 'stateful-init.js', file('public/js/stateful-init.js'));

	sendStatic('script', 'jquery.js', file('public/js/jquery.js'));
	sendStatic('style', 'stateful.css', file('public/css/stateful.css'));

	sendStatic('json', 'users.json', file('data/users.json'));
	sendStatic('json', 'class_content.json', file('data/class_content.json'));
});

app.listen(3001, function () {
	console.log('STATEFUL WS is now running on port 3000!');
});