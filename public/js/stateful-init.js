"use strict";
let Stateful = (function() {

	let ws;
	let users = [], posts = [], postsFlat = [];

	function saveUsers(rawData) {
		for (let user of rawData) {
			users.push(user);
		}
	}

	function savePosts(rawData) {
		let saveChildren = function(post) {
			let children = post.children;
			for (let childPost of children) {
				postsFlat.push(childPost);
				saveChildren(childPost);
			}
		};

		for (let post of rawData) {
			posts.push(post);
			postsFlat.push(post);
			saveChildren(post);
		}
	}

	function onMessage(event) {
		let eventData = JSON.parse(event.data);
		let element;
		if (eventData.contentType === 'script') {
			element = document.createElement('script');
			element.text = eventData.content;
			document.body.appendChild(element);
		} else if (eventData.contentType === 'style') {
			element = document.createElement('style');
			element.type = 'text/css';
			element.appendChild(document.createTextNode(eventData.content));
			document.head.appendChild(element);
		} else if (eventData.contentType === 'json') {
			let contentObj = JSON.parse(eventData.content);
			if (eventData.name === 'users.json') {
				saveUsers(contentObj);
			} else if (eventData.name === 'class_content.json') {
				savePosts(contentObj);
				console.log(postsFlat);
			}
		}
	}

	ws = window.STATEFUL_WS;
	ws.addEventListener('message', onMessage);

	console.log('END: stateful-init.js');

	return {

	};

}());