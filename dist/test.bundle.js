(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var OpenShare = {
	share: require('open-share/share'),
	count: require('open-share/count'),
	analytics: require('open-share/analytics')
};

// OpenShare.analytics('tagManager', function () {
//   console.log('tag manager loaded');
// });
//
// OpenShare.analytics('event', function () {
//   console.log('google analytics loaded');
// });
//
// OpenShare.analytics('social', function () {
//   console.log('google analytics loaded');
// });

var dynamicNodeData = {
	'url': 'http://www.digitalsurgeons.com',
	'via': 'digitalsurgeons',
	'text': 'Forward Obsessed',
	'hashtags': 'forwardobsessed',
	'button': 'Open Share Watcher!'
};

function createOpenShareNode(data) {
	var openShare = document.createElement('a');

	openShare.classList.add('open-share-link', 'twitter');
	openShare.setAttribute('data-open-share', 'twitter');
	openShare.setAttribute('data-open-share-url', data.url);
	openShare.setAttribute('data-open-share-via', data.via);
	openShare.setAttribute('data-open-share-text', data.text);
	openShare.setAttribute('data-open-share-hashtags', data.hashtags);
	openShare.innerHTML = '<span class="fa fa-twitter"></span>' + data.button;

	var node = new OpenShare.share({
		type: 'twitter',
		url: 'http://www.digitalsurgeons.com',
		via: 'digitalsurgeons',
		hashtags: 'forwardobsessed',
		appendTo: document.querySelector('.open-share-watch'),
		innerHTML: 'Created via OpenShareAPI',
		element: 'div',
		classes: ['wow', 'such', 'classes']
	});

	return openShare;
}

function addNode() {
	var data = dynamicNodeData;
	document.querySelector('.open-share-watch').appendChild(createOpenShareNode(data));
}

window.addNode = addNode;

function addNodeWithCount() {
	var data = dynamicNodeData;

	new OpenShare.count({
		type: 'facebook',
		url: 'https://www.digitalsurgeons.com/'
	}, function (node) {
		var os = new OpenShare.share({
			type: 'twitter',
			url: 'http://www.digitalsurgeons.com',
			via: 'digitalsurgeons',
			hashtags: 'forwardobsessed',
			innerHTML: 'Created via OpenShareAPI',
			element: 'div',
			classes: ['wow', 'such', 'classes']
		});
		document.querySelector('.create-node.w-count').appendChild(os);
		os.appendChild(node);
	});
}

window.addNodeWithCount = addNodeWithCount;

function createCountNode() {
	var container = document.querySelector('.create-node.count-nodes');
	var type = container.querySelector('input.count-type').value;
	var url = container.querySelector('input.count-url').value;

	new OpenShare.count({
		type: type,
		url: url,
		appendTo: container,
		classes: ['test']
	}, function (node) {
		node.style.position = 'relative';
	});

	container.querySelector('input.count-type').value = '';
	container.querySelector('input.count-url').value = '';
}

window.createCountNode = createCountNode;

// test JS OpenShare API with dashes

new OpenShare.share({
	type: 'googleMaps',
	center: '40.765819,-73.975866',
	view: 'traffic',
	zoom: 14,
	appendTo: document.body,
	innerHTML: 'Maps'
});

new OpenShare.share({
	type: 'twitter-follow',
	screenName: 'digitalsurgeons',
	userId: '18189130',
	appendTo: document.body,
	innerHTML: 'Follow Test'
});

// test PayPal
new OpenShare.share({
	type: 'paypal',
	buttonId: '2P3RJYEFL7Z62',
	sandbox: true,
	appendTo: document.body,
	innerHTML: 'PayPal Test'
});

// bind to count loaded event
document.addEventListener('OpenShare.count-loaded', function () {
	console.log('OpenShare (count) loaded');
});

// bind to share loaded event
document.addEventListener('OpenShare.share-loaded', function () {
	console.log('OpenShare (share) loaded');

	// bind to shared event on each individual node
	[].forEach.call(document.querySelectorAll('[data-open-share]'), function (node) {
		node.addEventListener('OpenShare.shared', function (e) {
			console.log('Open Share Shared', e);
		});
	});

	var examples = {
		twitter: new OpenShare.share({
			type: 'twitter',
			bindClick: true,
			url: 'http://digitalsurgeons.com',
			via: 'digitalsurgeons',
			text: 'Digital Surgeons',
			hashtags: 'forwardobsessed'
		}, document.querySelector('[data-api-example="twitter"]')),

		facebook: new OpenShare.share({
			type: 'facebook',
			bindClick: true,
			link: 'http://digitalsurgeons.com',
			picture: 'http://www.digitalsurgeons.com/img/about/bg_office_team.jpg',
			caption: 'Digital Surgeons',
			description: 'forwardobsessed'
		}, document.querySelector('[data-api-example="facebook"]')),

		pinterest: new OpenShare.share({
			type: 'pinterest',
			bindClick: true,
			url: 'http://digitalsurgeons.com',
			media: 'http://www.digitalsurgeons.com/img/about/bg_office_team.jpg',
			description: 'Digital Surgeons',
			appendTo: document.body
		}, document.querySelector('[data-api-example="pinterest"]')),

		email: new OpenShare.share({
			type: 'email',
			bindClick: true,
			to: 'techroom@digitalsurgeons.com',
			subject: 'Digital Surgeons',
			body: 'Forward Obsessed'
		}, document.querySelector('[data-api-example="email"]'))
	};
});

// Example of listening for counted events on individual urls or arrays of urls
var urls = ['facebook', 'google', 'linkedin', 'reddit', 'pinterest', ['google', 'linkedin', 'reddit', 'pinterest']];

urls.forEach(function (url) {
	if (Array.isArray(url)) {
		url = url.join(',');
	}
	var countNode = document.querySelectorAll('[data-open-share-count="' + url + '"]');

	[].forEach.call(countNode, function (node) {
		node.addEventListener('OpenShare.counted-' + url, function () {
			var counts = node.innerHTML;
			if (counts) console.log(url, 'shares: ', counts);
		});
	});
});

},{"open-share/analytics":2,"open-share/count":3,"open-share/share":14}],2:[function(require,module,exports){
module.exports = function (type, cb) {
   let count = 10;

   // document.addEventListener('DOMContentLoaded', function () {

	   const isGA = type === 'event' || type === 'social';
	   const isTagManager = type === 'tagManager';

	   if (isGA) checkIfAnalyticsLoaded(type, cb, count);
	   if (isTagManager) setTagManager(cb);
   // });
};

function checkIfAnalyticsLoaded(type, cb, count) {
	count--;
	if (window.ga) {
		  if (cb) cb();
		  // bind to shared event on each individual node
		  listen(function (e) {
			const platform = e.target.getAttribute('data-open-share');
			const target = e.target.getAttribute('data-open-share-link') ||
				e.target.getAttribute('data-open-share-url') ||
				e.target.getAttribute('data-open-share-username') ||
			    e.target.getAttribute('data-open-share-center') ||
				e.target.getAttribute('data-open-share-search') ||
				e.target.getAttribute('data-open-share-body');

			if (type === 'event') {
				ga('send', 'event', {
					eventCategory: 'OpenShare Click',
					eventAction: platform,
					eventLabel: target,
					transport: 'beacon'
				});
			}

			if (type === 'social') {
				ga('send', {
					hitType: 'social',
					socialNetwork: platform,
					socialAction: 'share',
					socialTarget: target
				});
			}
		});

	}
	else {
		  if (count) {
			  setTimeout(function () {
			  checkIfAnalyticsLoaded(type, cb, count);
		  }, 1000);
  		}
	}
}

function setTagManager (cb) {
	if (cb) cb();

	window.dataLayer = window.dataLayer || [];

	listen(onShareTagManger);

	getCounts(function(e) {
		const count = e.target ?
		  e.target.innerHTML :
		  e.innerHTML;

		const platform = e.target ?
		   e.target.getAttribute('data-open-share-count-url') :
		   e.getAttribute('data-open-share-count-url');

		window.dataLayer.push({
			'event' : 'OpenShare Count',
			'platform': platform,
			'resource': count,
			'activity': 'count'
		});
	});
}

function listen (cb) {
	// bind to shared event on each individual node
	[].forEach.call(document.querySelectorAll('[data-open-share]'), function(node) {
		node.addEventListener('OpenShare.shared', cb);
	});
}

function getCounts (cb) {
	var countNode = document.querySelectorAll('[data-open-share-count]');

	[].forEach.call(countNode, function(node) {
		if (node.textContent) cb(node);
		else node.addEventListener('OpenShare.counted-' + node.getAttribute('data-open-share-count-url'), cb);
	});
}

function onShareTagManger (e) {
	const platform = e.target.getAttribute('data-open-share');
	const target = e.target.getAttribute('data-open-share-link') ||
		e.target.getAttribute('data-open-share-url') ||
		e.target.getAttribute('data-open-share-username') ||
		e.target.getAttribute('data-open-share-center') ||
		e.target.getAttribute('data-open-share-search') ||
		e.target.getAttribute('data-open-share-body');

	window.dataLayer.push({
		'event' : 'OpenShare Share',
		'platform': platform,
		'resource': target,
		'activity': 'share'
	});
}

},{}],3:[function(require,module,exports){
module.exports = (function() {
	document.addEventListener('DOMContentLoaded', require('./lib/init')({
		api: 'count',
		selector: '[data-open-share-count]:not([data-open-share-node])',
		cb: require('./lib/initializeCountNode')
	}));

	return require('./src/modules/count-api')();
})();

},{"./lib/init":6,"./lib/initializeCountNode":7,"./src/modules/count-api":15}],4:[function(require,module,exports){
module.exports = countReduce;

function round(x, precision) {
	if (typeof x !== 'number') {
		throw new TypeError('Expected value to be a number');
	}

	var exponent = precision > 0 ? 'e' : 'e-';
	var exponentNeg = precision > 0 ? 'e-' : 'e';
	precision = Math.abs(precision);

	return Number(Math.round(x + exponent + precision) + exponentNeg + precision);
}

function thousandify (num) {
	return round(num/1000, 1) + 'K';
}

function millionify (num) {
	return round(num/1000000, 1) + 'M';
}

function countReduce (el, count, cb) {
	if (count > 999999)  {
		el.innerHTML = millionify(count);
		if (cb  && typeof cb === 'function') cb(el);
	} else if (count > 999) {
		el.innerHTML = thousandify(count);
		if (cb  && typeof cb === 'function') cb(el);
	} else {
		el.innerHTML = count;
		if (cb  && typeof cb === 'function') cb(el);
	}
}

},{}],5:[function(require,module,exports){
// type contains a dash
// transform to camelcase for function reference
// TODO: only supports single dash, should should support multiple
module.exports = (dash, type) => {
	let nextChar = type.substr(dash + 1, 1),
		group = type.substr(dash, 2);

	type = type.replace(group, nextChar.toUpperCase());
	return type;
};

},{}],6:[function(require,module,exports){
const initializeNodes = require('./initializeNodes');
const initializeWatcher = require('./initializeWatcher');

module.exports = init;

function init(opts) {
	return () => {
		const initNodes = initializeNodes({
			api: opts.api || null,
			container: opts.container || document,
			selector: opts.selector,
			cb: opts.cb
		});

		initNodes();

		// check for mutation observers before using, IE11 only
		if (window.MutationObserver !== undefined) {
			initializeWatcher(document.querySelectorAll('[data-open-share-watch]'), initNodes);
		}
	};
}

},{"./initializeNodes":8,"./initializeWatcher":10}],7:[function(require,module,exports){
const Count = require('../src/modules/count');

module.exports = initializeCountNode;

function initializeCountNode(os) {
	// initialize open share object with type attribute
	let type = os.getAttribute('data-open-share-count'),
		url = os.getAttribute('data-open-share-count-repo') ||
			os.getAttribute('data-open-share-count-shot') ||
			os.getAttribute('data-open-share-count-url'),
		count = new Count(type, url);

	count.count(os);
	os.setAttribute('data-open-share-node', type);
}

},{"../src/modules/count":17}],8:[function(require,module,exports){
const Events = require('../src/modules/events');
const analytics = require('../analytics');


module.exports = initializeNodes;

function initializeNodes(opts) {
	// loop through open share node collection
	return () => {
		// check for analytics
		checkAnalytics();

		if (opts.api) {
			let nodes = opts.container.querySelectorAll(opts.selector);
			[].forEach.call(nodes, opts.cb);

			// trigger completed event
			Events.trigger(document, opts.api + '-loaded');
		} else {
			// loop through open share node collection
			let shareNodes = opts.container.querySelectorAll(opts.selector.share);
			[].forEach.call(shareNodes, opts.cb.share);

			// trigger completed event
			Events.trigger(document, 'share-loaded');

			// loop through count node collection
			let countNodes = opts.container.querySelectorAll(opts.selector.count);
			[].forEach.call(countNodes, opts.cb.count);

			// trigger completed event
			Events.trigger(document, 'count-loaded');
		}
	};
}

function checkAnalytics () {
	// check for analytics
	if (document.querySelector('[data-open-share-analytics]')) {
		const provider = document.querySelector('[data-open-share-analytics]')
			.getAttribute('data-open-share-analytics');

		if (provider.indexOf(',') > -1) {
			const providers = provider.split(',');
			providers.forEach(p => analytics(p));
		} else analytics(provider);

	}
}

},{"../analytics":2,"../src/modules/events":18}],9:[function(require,module,exports){
const ShareTransforms = require('../src/modules/share-transforms');
const OpenShare = require('../src/modules/open-share');
const setData = require('./setData');
const share = require('./share');
const dashToCamel = require('./dashToCamel');

module.exports = initializeShareNode;

function initializeShareNode(os) {
	// initialize open share object with type attribute
	let type = os.getAttribute('data-open-share'),
		dash = type.indexOf('-'),
		openShare;

	if (dash > -1) {
		type = dashToCamel(dash, type);
	}

	let transform = ShareTransforms[type];

	if (!transform) {
		throw new Error(`Open Share: ${type} is an invalid type`);
	}

	openShare = new OpenShare(type, transform);

	// specify if this is a dynamic instance
	if (os.getAttribute('data-open-share-dynamic')) {
		openShare.dynamic = true;
	}

	// specify if this is a popup instance
	if (os.getAttribute('data-open-share-popup')) {
		openShare.popup = true;
	}

	// set all optional attributes on open share instance
	setData(openShare, os);

	// open share dialog on click
	os.addEventListener('click', (e) => {
		share(e, os, openShare);
	});

	os.addEventListener('OpenShare.trigger', (e) => {
		share(e, os, openShare);
	});

	os.setAttribute('data-open-share-node', type);
}

},{"../src/modules/open-share":19,"../src/modules/share-transforms":21,"./dashToCamel":5,"./setData":11,"./share":12}],10:[function(require,module,exports){
module.exports = initializeWatcher;

function initializeWatcher(watcher, fn) {
	[].forEach.call(watcher, (w) => {
		var observer = new MutationObserver((mutations) => {
			// target will match between all mutations so just use first
			fn(mutations[0].target);
		});

		observer.observe(w, {
			childList: true
		});
	});
}

},{}],11:[function(require,module,exports){
module.exports = setData;

function setData(osInstance, osElement) {
	osInstance.setData({
		url: osElement.getAttribute('data-open-share-url'),
		text: osElement.getAttribute('data-open-share-text'),
		via: osElement.getAttribute('data-open-share-via'),
		hashtags: osElement.getAttribute('data-open-share-hashtags'),
		tweetId: osElement.getAttribute('data-open-share-tweet-id'),
		related: osElement.getAttribute('data-open-share-related'),
		screenName: osElement.getAttribute('data-open-share-screen-name'),
		userId: osElement.getAttribute('data-open-share-user-id'),
		link: osElement.getAttribute('data-open-share-link'),
		picture: osElement.getAttribute('data-open-share-picture'),
		caption: osElement.getAttribute('data-open-share-caption'),
		description: osElement.getAttribute('data-open-share-description'),
		user: osElement.getAttribute('data-open-share-user'),
		video: osElement.getAttribute('data-open-share-video'),
		username: osElement.getAttribute('data-open-share-username'),
		title: osElement.getAttribute('data-open-share-title'),
		media: osElement.getAttribute('data-open-share-media'),
		to: osElement.getAttribute('data-open-share-to'),
		subject: osElement.getAttribute('data-open-share-subject'),
		body: osElement.getAttribute('data-open-share-body'),
		ios: osElement.getAttribute('data-open-share-ios'),
		type: osElement.getAttribute('data-open-share-type'),
		center: osElement.getAttribute('data-open-share-center'),
		views: osElement.getAttribute('data-open-share-views'),
		zoom: osElement.getAttribute('data-open-share-zoom'),
		search: osElement.getAttribute('data-open-share-search'),
		saddr: osElement.getAttribute('data-open-share-saddr'),
		daddr: osElement.getAttribute('data-open-share-daddr'),
		directionsmode: osElement.getAttribute('data-open-share-directions-mode'),
		repo: osElement.getAttribute('data-open-share-repo'),
		shot: osElement.getAttribute('data-open-share-shot'),
		pen: osElement.getAttribute('data-open-share-pen'),
		view: osElement.getAttribute('data-open-share-view'),
		issue: osElement.getAttribute('data-open-share-issue'),
		buttonId: osElement.getAttribute('data-open-share-buttonId'),
		popUp: osElement.getAttribute('data-open-share-popup')
	});
}

},{}],12:[function(require,module,exports){
const Events = require('../src/modules/events');
const setData = require('./setData');

module.exports = share;

function share(e, os, openShare) {
	// if dynamic instance then fetch attributes again in case of updates
	if (openShare.dynamic) {
		setData(openShare, os);
	}

	openShare.share(e);

	// trigger shared event
	Events.trigger(os, 'shared');
}

},{"../src/modules/events":18,"./setData":11}],13:[function(require,module,exports){
/*
   Sometimes social platforms get confused and drop share counts.
   In this module we check if the returned count is less than the count in
   localstorage.
   If the local count is greater than the returned count,
   we store the local count + the returned count.
   Otherwise, store the returned count.
*/

module.exports = (t, count) => {
	const isArr = t.type.indexOf(',') > -1;
	const local = Number(t.storeGet(t.type + '-' + t.shared));

	if (local > count && !isArr) {
		const latestCount = Number(t.storeGet(t.type + '-' + t.shared + '-latestCount'));
		t.storeSet(t.type + '-' + t.shared + '-latestCount', count);

		count = isNumeric(latestCount) && latestCount > 0 ?
			count += local - latestCount :
			count += local;

	}

	if (!isArr) t.storeSet(t.type + '-' + t.shared, count);
	return count;
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

},{}],14:[function(require,module,exports){
module.exports = (function() {
	document.addEventListener('DOMContentLoaded', require('./lib/init')({
		api: 'share',
		selector: '[data-open-share]:not([data-open-share-node])',
		cb: require('./lib/initializeShareNode')
	}));

	return require('./src/modules/share-api')();
})();

},{"./lib/init":6,"./lib/initializeShareNode":9,"./src/modules/share-api":20}],15:[function(require,module,exports){
/**
 * count API
 */

var count = require('./count');

module.exports = function() {

	// global OpenShare referencing internal class for instance generation
	class Count {

		constructor({
			type,
			url,
			appendTo = false,
			element,
			classes}, cb) {
			var countNode = document.createElement(element || 'span');

			countNode.setAttribute('data-open-share-count', type);
			countNode.setAttribute('data-open-share-count-url', url);

			countNode.classList.add('open-share-count');

			if (classes && Array.isArray(classes)) {
				classes.forEach(cssCLass => {
					countNode.classList.add(cssCLass);
				});
			}

			if (appendTo) {
				return new count(type, url).count(countNode, cb, appendTo);
			}

			return new count(type, url).count(countNode, cb);
		}
	}

	return Count;
};

},{"./count":17}],16:[function(require,module,exports){
const countReduce = require('../../lib/countReduce');
const storeCount = require('../../lib/storeCount');

/**
 * Object of transform functions for each openshare api
 * Transform functions passed into OpenShare instance when instantiated
 * Return object containing URL and key/value args
 */
module.exports = {

	// facebook count data
	facebook (url) {
		return {
			type: 'get',
			url: `//graph.facebook.com/?id=${url}`,
			transform: function(xhr) {
				let count = JSON.parse(xhr.responseText).shares;
				return storeCount(this, count);
			}
		};
	},

	// pinterest count data
	pinterest (url) {
		return {
			type: 'jsonp',
			url: `//api.pinterest.com/v1/urls/count.json?callback=?&url=${url}`,
			transform: function(data) {
				let count = data.count;
				return storeCount(this, count);
			}
		};
	},

	// linkedin count data
	linkedin (url) {
		return {
			type: 'jsonp',
			url: `//www.linkedin.com/countserv/count/share?url=${url}&format=jsonp&callback=?`,
			transform: function(data) {
				let count = data.count;
				return storeCount(this, count);
			}
		};
	},

	// reddit count data
	reddit (url) {
		return {
			type: 'get',
			url: `//www.reddit.com/api/info.json?url=${url}`,
			transform: function(xhr) {
				let posts = JSON.parse(xhr.responseText).data.children,
					ups = 0;

				posts.forEach((post) => {
					ups += Number(post.data.ups);
				});

				return storeCount(this, ups);
			}
		};
	},

	// google count data
	google (url) {
		return {
			type: 'post',
			data: {
				method: 'pos.plusones.get',
				id: 'p',
				params: {
					nolog: true,
					id: url,
					source: 'widget',
					userId: '@viewer',
					groupId: '@self'
				},
				jsonrpc: '2.0',
				key: 'p',
				apiVersion: 'v1'
			},
			url: `https://clients6.google.com/rpc`,
			transform: function(xhr) {
				let count = JSON.parse(xhr.responseText).result.metadata.globalCounts.count;
				return storeCount(this, count);
			}
		};
	},

	// github star count
	githubStars (repo) {
		repo = repo.indexOf('github.com/') > -1 ?
			repo.split('github.com/')[1] :
			repo;
		return {
			type: 'get',
			url: `//api.github.com/repos/${repo}`,
			transform: function(xhr) {
				let count = JSON.parse(xhr.responseText).stargazers_count;
				return storeCount(this, count);
			}
		};
	},

	// github forks count
	githubForks (repo) {
		repo = repo.indexOf('github.com/') > -1 ?
			repo.split('github.com/')[1] :
			repo;
		return {
			type: 'get',
			url: `//api.github.com/repos/${repo}`,
			transform: function(xhr) {
				let count = JSON.parse(xhr.responseText).forks_count;
				return storeCount(this, count);
			}
		};
	},

	// github watchers count
	githubWatchers (repo) {
		repo = repo.indexOf('github.com/') > -1 ?
			repo.split('github.com/')[1] :
			repo;
		return {
			type: 'get',
			url: `//api.github.com/repos/${repo}`,
			transform: function(xhr) {
				let count = JSON.parse(xhr.responseText).watchers_count;
				return storeCount(this, count);
			}
		};
	},

	// dribbble likes count
	dribbble (shot) {
		shot = shot.indexOf('dribbble.com/shots') > -1 ?
			shot.split('shots/')[1] :
			shot;
		const url = `https://api.dribbble.com/v1/shots/${shot}/likes`;
		return {
			type: 'get',
			url: url,
			transform: function(xhr, Events) {
				let count = JSON.parse(xhr.responseText).length;

				// at this time dribbble limits a response of 12 likes per page
				if (count === 12) {
					let page = 2;
					recursiveCount(url, page, count, finalCount => {
						if (this.appendTo && typeof this.appendTo !== 'function') {
							this.appendTo.appendChild(this.os);
						}
						countReduce(this.os, finalCount, this.cb);
						Events.trigger(this.os, 'counted-' + this.url);
						return storeCount(this, finalCount);
					});
				} else {
					return storeCount(this, count);
				}
			}
		};
	},

	twitter (url) {
		return {
			type: 'get',
			url: `//api.openshare.social/job?url=${url}`,
			transform: function(xhr) {
				let count = JSON.parse(xhr.responseText).count;
				return storeCount(this, count);
			}
		};
	}
};

function recursiveCount (url, page, count, cb) {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', url + '?page=' + page);
	xhr.addEventListener('load', function () {
		const likes = JSON.parse(this.response);
		count += likes.length;

		// dribbble like per page is 12
		if (likes.length === 12) {
			page++;
			recursiveCount(url, page, count, cb);
		}
		else {
			cb(count);
		}
	});
	xhr.send();
}

},{"../../lib/countReduce":4,"../../lib/storeCount":13}],17:[function(require,module,exports){
/**
 * Generate share count instance from one to many networks
 */

const CountTransforms = require('./count-transforms');
const Events = require('./events');
const countReduce = require('../../lib/countReduce');
const storeCount = require('../../lib/storeCount');

module.exports = class Count {

	constructor(type, url) {

		// throw error if no url provided
		if (!url) {
			throw new Error(`Open Share: no url provided for count`);
		}

		// check for Github counts
		if (type.indexOf('github') === 0) {
			if (type === 'github-stars') {
				type = 'githubStars';
			} else if (type === 'github-forks') {
				type = 'githubForks';
			} else if (type === 'github-watchers') {
				type = 'githubWatchers';
			} else {
				console.error('Invalid Github count type. Try github-stars, github-forks, or github-watchers.');
			}
		}

		// if type is comma separate list create array
		if (type.indexOf(',') > -1) {
			this.type = type;
			this.typeArr = this.type.split(',');
			this.countData = [];

			// check each type supplied is valid
			this.typeArr.forEach((t) => {
				if (!CountTransforms[t]) {
					throw new Error(`Open Share: ${type} is an invalid count type`);
				}

				this.countData.push(CountTransforms[t](url));
			});

		// throw error if invalid type provided
		} else if (!CountTransforms[type]) {
			throw new Error(`Open Share: ${type} is an invalid count type`);

		// single count
		// store count URL and transform function
		} else {
			this.type = type;
			this.countData = CountTransforms[type](url);
		}
	}

	// handle calling getCount / getCounts
	// depending on number of types
	count(os, cb, appendTo) {
		this.os = os;
		this.appendTo = appendTo;
		this.cb = cb;
    	this.url = this.os.getAttribute('data-open-share-count');
		this.shared = this.os.getAttribute('data-open-share-count-url');

		if (!Array.isArray(this.countData)) {
			this.getCount();
		} else {
			this.getCounts();
		}
	}

	// fetch count either AJAX or JSONP
	getCount() {
		var count = this.storeGet(this.type + '-' + this.shared);

		if (count) {
			if (this.appendTo && typeof this.appendTo !== 'function') {
				this.appendTo.appendChild(this.os);
			}
			countReduce(this.os, count);
		}
		this[this.countData.type](this.countData);
	}

	// fetch multiple counts and aggregate
	getCounts() {
		this.total = [];

		var count = this.storeGet(this.type + '-' + this.shared);

		if (count) {
			if (this.appendTo  && typeof this.appendTo !== 'function') {
				this.appendTo.appendChild(this.os);
			}
			countReduce(this.os, count);
		}

		this.countData.forEach(countData => {

			this[countData.type](countData, (num) => {
				this.total.push(num);

				// total counts length now equals type array length
				// so aggregate, store and insert into DOM
				if (this.total.length === this.typeArr.length) {
					let tot = 0;

					this.total.forEach((t) => {
						tot += t;
					});

					if (this.appendTo  && typeof this.appendTo !== 'function') {
						this.appendTo.appendChild(this.os);
					}

					const local = Number(this.storeGet(this.type + '-' + this.shared));
					if (local > tot) {
						const latestCount = Number(this.storeGet(this.type + '-' + this.shared + '-latestCount'));
						this.storeSet(this.type + '-' + this.shared + '-latestCount', tot);

						tot = isNumeric(latestCount) && latestCount > 0 ?
							tot += local - latestCount :
							tot += local;

					}
					this.storeSet(this.type + '-' + this.shared, tot);

					countReduce(this.os, tot);
				}
			});
		});

		if (this.appendTo  && typeof this.appendTo !== 'function') {
			this.appendTo.appendChild(this.os);
		}
	}

	// handle JSONP requests
	jsonp(countData, cb) {
		// define random callback and assign transform function
		let callback = Math.random().toString(36).substring(7).replace(/[^a-zA-Z]/g, '');
		window[callback] = (data) => {
			let count = countData.transform.apply(this, [data]) || 0;

			if (cb && typeof cb === 'function') {
				cb(count);
			} else {
				if (this.appendTo  && typeof this.appendTo !== 'function') {
					this.appendTo.appendChild(this.os);
				}
				countReduce(this.os, count, this.cb);
			}

			Events.trigger(this.os, 'counted-' + this.url);
		};

		// append JSONP script tag to page
		let script = document.createElement('script');
		script.src = countData.url.replace('callback=?', `callback=${callback}`);
		document.getElementsByTagName('head')[0].appendChild(script);

		return;
	}

	// handle AJAX GET request
	get(countData, cb) {
		let xhr = new XMLHttpRequest();

		// on success pass response to transform function
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					let count = countData.transform.apply(this, [xhr, Events]) || 0;

					if (cb && typeof cb === 'function') {
						cb(count);
					} else {
						if (this.appendTo && typeof this.appendTo !== 'function') {
							this.appendTo.appendChild(this.os);
						}
						countReduce(this.os, count, this.cb);
					}

					Events.trigger(this.os, 'counted-' + this.url);
				} else {
					console.error('Failed to get API data from', countData.url, '. Please use the latest version of OpenShare.');
				}
			}
		};

		xhr.open('GET', countData.url);
		xhr.send();
	}

	// handle AJAX POST request
	post(countData, cb) {
		let xhr = new XMLHttpRequest();

		// on success pass response to transform function
		xhr.onreadystatechange = () => {
			if (xhr.readyState !== XMLHttpRequest.DONE ||
				xhr.status !== 200) {
				return;
			}

			let count = countData.transform.apply(this, [xhr]) || 0;

			if (cb && typeof cb === 'function') {
				cb(count);
			} else {
				if (this.appendTo && typeof this.appendTo !== 'function') {
					this.appendTo.appendChild(this.os);
				}
				countReduce(this.os, count, this.cb);
			}
			Events.trigger(this.os, 'counted-' + this.url);
		};

		xhr.open('POST', countData.url);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xhr.send(JSON.stringify(countData.data));
	}

	storeSet(type, count = 0) {
		if (!window.localStorage || !type) {
			return;
		}

		localStorage.setItem(`OpenShare-${type}`, count);
	}

	storeGet(type) {
		if (!window.localStorage || !type) {
			return;
		}

		return localStorage.getItem(`OpenShare-${type}`);
	}

};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

},{"../../lib/countReduce":4,"../../lib/storeCount":13,"./count-transforms":16,"./events":18}],18:[function(require,module,exports){
/**
 * Trigger custom OpenShare namespaced event
 */
module.exports = {
	trigger: function(element, event) {
		let ev = document.createEvent('Event');
		ev.initEvent('OpenShare.' + event, true, true);
		element.dispatchEvent(ev);
	}
};

},{}],19:[function(require,module,exports){
/**
 * OpenShare generates a single share link
 */
module.exports = class OpenShare {

	constructor(type, transform) {
		this.ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
		this.type = type;
		this.dynamic = false;
		this.transform = transform;

		// capitalized type
		this.typeCaps = type.charAt(0).toUpperCase() + type.slice(1);
	}

	// returns function named as type set in constructor
	// e.g twitter()
	setData(data) {
		// if iOS user and ios data attribute defined
		// build iOS URL scheme as single string
		if (this.ios) {
			this.transformData = this.transform(data, true);
			this.mobileShareUrl = this.template(this.transformData.url, this.transformData.data);
		}

		this.transformData = this.transform(data);
		this.shareUrl = this.template(this.transformData.url, this.transformData.data);
	}

	// open share URL defined in individual platform functions
	share(e) {
		// if iOS share URL has been set then use timeout hack
		// test for native app and fall back to web
		if (this.mobileShareUrl) {
			var start = (new Date()).valueOf();

			setTimeout(() => {
				var end = (new Date()).valueOf();

				// if the user is still here, fall back to web
				if (end - start > 1600) {
					return;
				}

				window.location = this.shareUrl;
			}, 1500);

			window.location = this.mobileShareUrl;

		// open mailto links in same window
		} else if (this.type === 'email') {
			window.location = this.shareUrl;

		// open social share URLs in new window
		} else {
			let windowOptions = false;

			// if popup object present then set window dimensions / position
			if(this.popup && this.transformData.popup) {
				windowOptions = this.transformData.popup;
			}

			this.openWindow(this.shareUrl, windowOptions);
		}
	}

	// create share URL with GET params
	// appending valid properties to query string
	template(url, data) {
		let nonURLProps = [
			'appendTo',
			'innerHTML',
			'classes'
		];

		let shareUrl = url,
			i;

		for (i in data) {
			// only append valid properties
			if (!data[i] || nonURLProps.indexOf(i) > -1) {
				continue;
			}

			// append URL encoded GET param to share URL
			data[i] = encodeURIComponent(data[i]);
			shareUrl += `${i}=${data[i]}&`;
		}

		return shareUrl.substr(0, shareUrl.length - 1);
	}

	// center popup window supporting dual screens
	openWindow(url, options) {
		let dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left,
			dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top,
			width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
			height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
			left = ((width / 2) - (options.width / 2)) + dualScreenLeft,
			top = ((height / 2) - (options.height / 2)) + dualScreenTop,
			newWindow = window.open(url, 'OpenShare', `width=${options.width}, height=${options.height}, top=${top}, left=${left}`);

		// Puts focus on the newWindow
		if (window.focus) {
			newWindow.focus();
		}
	}
};

},{}],20:[function(require,module,exports){
/**
 * Global OpenShare API to generate instances programmatically
 */

const OS = require('./open-share');
const ShareTransforms = require('./share-transforms');
const Events = require('./events');
const dashToCamel = require('../../lib/dashToCamel');

module.exports = function() {

	// global OpenShare referencing internal class for instance generation
	class OpenShare {

		constructor(data, element) {

			if (!data.bindClick) data.bindClick = true;

			let dash = data.type.indexOf('-');

			if (dash > -1) {
				data.type = dashToCamel(dash, data.type);
			}

			let node;
			this.element = element;
			this.data = data;

			this.os = new OS(data.type, ShareTransforms[data.type]);
			this.os.setData(data);

			if (!element || data.element) {
				element = data.element;
				node = document.createElement(element || 'a');
				if (data.type) {
					node.classList.add('open-share-link', data.type);
					node.setAttribute('data-open-share', data.type);
					node.setAttribute('data-open-share-node', data.type);
				}
				if (data.innerHTML) node.innerHTML = data.innerHTML;
			}
			if (node) element = node;

			if (data.bindClick) {
				element.addEventListener('click', (e) => {
					this.share();
				});
			}

			if (data.appendTo) {
				data.appendTo.appendChild(element);
			}

			if (data.classes && Array.isArray(data.classes)) {
				data.classes.forEach(cssClass => {
					element.classList.add(cssClass);
				});
			}

			if (data.type.toLowerCase() === 'paypal') {
				const action = data.sandbox ?
				   "https://www.sandbox.paypal.com/cgi-bin/webscr" :
				   "https://www.paypal.com/cgi-bin/webscr";

				const buyGIF = data.sandbox ?
					"https://www.sandbox.paypal.com/en_US/i/btn/btn_buynow_LG.gif" :
					"https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif";

				const pixelGIF = data.sandbox ?
					"https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif" :
					"https://www.paypalobjects.com/en_US/i/scr/pixel.gif";


				const paypalButton = `<form action=${action} method="post" target="_blank">

				  <!-- Saved buttons use the "secure click" command -->
				  <input type="hidden" name="cmd" value="_s-xclick">

				  <!-- Saved buttons are identified by their button IDs -->
				  <input type="hidden" name="hosted_button_id" value="${data.buttonId}">

				  <!-- Saved buttons display an appropriate button image. -->
				  <input type="image" name="submit"
				    src=${buyGIF}
				    alt="PayPal - The safer, easier way to pay online">
				  <img alt="" width="1" height="1"
				    src=${pixelGIF} >

				</form>`;

				const hiddenDiv = document.createElement('div');
				hiddenDiv.style.display = 'none';
				hiddenDiv.innerHTML = paypalButton;
				document.body.appendChild(hiddenDiv);

				this.paypal = hiddenDiv.querySelector('form');
			}

			this.element = element;
			return element;
		}

		// public share method to trigger share programmatically
		share(e) {
			// if dynamic instance then fetch attributes again in case of updates
			if (this.data.dynamic) {
				this.os.setData(data);
			}

			if (this.data.type.toLowerCase() === 'paypal') {
				this.paypal.submit();
			} else this.os.share(e);

			Events.trigger(this.element, 'shared');
		}
	}

	return OpenShare;
};

},{"../../lib/dashToCamel":5,"./events":18,"./open-share":19,"./share-transforms":21}],21:[function(require,module,exports){
/**
 * Object of transform functions for each openshare api
 * Transform functions passed into OpenShare instance when instantiated
 * Return object containing URL and key/value args
 */
module.exports = {

	// set Twitter share URL
	twitter: function(data, ios = false) {
		// if iOS user and ios data attribute defined
		// build iOS URL scheme as single string
		if (ios && data.ios) {

			let message = ``;

			if (data.text) {
				message += data.text;
			}

			if (data.url) {
				message += ` - ${data.url}`;
			}

			if (data.hashtags) {
				let tags = data.hashtags.split(',');
				tags.forEach(function(tag) {
					message += ` #${tag}`;
				});
			}

			if (data.via) {
				message += ` via ${data.via}`;
			}

			return {
				url: 'twitter://post?',
				data: {
					message: message
				}
			};
		}

		return {
			url: 'https://twitter.com/share?',
			data: data,
			popup: {
				width: 700,
				height: 296
			}
		};
	},

	// set Twitter retweet URL
	twitterRetweet: function(data, ios = false) {
		// if iOS user and ios data attribute defined
		if (ios && data.ios) {
			return {
				url: 'twitter://status?',
				data: {
					id: data.tweetId
				}
			};
		}

		return {
			url: 'https://twitter.com/intent/retweet?',
			data: {
				tweet_id: data.tweetId,
				related: data.related
			},
			popup: {
				width: 700,
				height: 296
			}
		};
	},

	// set Twitter like URL
	twitterLike: function(data, ios = false) {
		// if iOS user and ios data attribute defined
		if (ios && data.ios) {
			return {
				url: 'twitter://status?',
				data: {
					id: data.tweetId
				}
			};
		}

		return {
			url: 'https://twitter.com/intent/favorite?',
			data: {
				tweet_id: data.tweetId,
				related: data.related
			},
			popup: {
				width: 700,
				height: 296
			}
		};
	},

	// set Twitter follow URL
	twitterFollow: function(data, ios = false) {
		// if iOS user and ios data attribute defined
		if (ios && data.ios) {
			let iosData = data.screenName ? {
				'screen_name': data.screenName
			} : {
				'id': data.userId
			};

			return {
				url: 'twitter://user?',
				data: iosData
			};
		}

		return {
			url: 'https://twitter.com/intent/user?',
			data: {
				screen_name: data.screenName,
				user_id: data.userId
			},
			popup: {
				width: 700,
				height: 296
			}
		};
	},

	// set Facebook share URL
	facebook: function(data) {
		return {
			url: 'https://www.facebook.com/dialog/feed?app_id=961342543922322&redirect_uri=http://facebook.com&',
			data: data,
			popup: {
				width: 560,
				height: 593
			}
		};
	},

	// set Facebook send URL
	facebookSend: function(data) {
		return {
			url: 'https://www.facebook.com/dialog/send?app_id=961342543922322&redirect_uri=http://facebook.com&',
			data: data,
			popup: {
				width: 980,
				height: 596
			}
		};
	},

	// set YouTube play URL
	youtube: function(data, ios = false) {
		// if iOS user
		if (ios && data.ios) {
			return {
				url: `youtube:${data.video}?`
			};
		} else {
			return {
				url: `https://www.youtube.com/watch?v=${data.video}?`,
				popup: {
					width: 1086,
					height: 608
				}
			};
		}
	},

	// set YouTube subcribe URL
	youtubeSubscribe: function(data, ios = false) {
		// if iOS user
		if (ios && data.ios) {
			return {
				url: `youtube://www.youtube.com/user/${data.user}?`
			};
		} else {
			return {
				url: `https://www.youtube.com/user/${data.user}?`,
				popup: {
					width: 880,
					height: 350
				}
			};
		}
	},

	// set Instagram follow URL
	instagram: function(data) {
		return {
			url: `instagram://camera?`
		};
	},

	// set Instagram follow URL
	instagramFollow: function(data, ios = false) {
		// if iOS user
		if (ios && data.ios) {
			return {
				url: 'instagram://user?',
				data: data
			};
		} else {
			return {
				url: `http://www.instagram.com/${data.username}?`,
				popup: {
					width: 980,
					height: 655
				}
			};
		}
	},

	// set Snapchat follow URL
	snapchat (data) {
		return {
			url: `snapchat://add/${data.username}?`
		};
	},

	// set Google share URL
	google (data) {
		return {
			url: 'https://plus.google.com/share?',
			data: data,
			popup: {
				width: 495,
				height: 815
			}
		};
	},

	// set Google maps URL
	googleMaps (data, ios = false) {

		if (data.search) {
			data.q = data.search;
			delete data.search;
		}

		// if iOS user and ios data attribute defined
		if (ios && data.ios) {
			return {
				url: 'comgooglemaps://?',
				data: ios
			};
		}

		if (!ios && data.ios) {
			delete data.ios;
		}

		return {
			url: 'https://maps.google.com/?',
			data: data,
			popup: {
				width: 800,
				height: 600
			}
		};
	},

	// set Pinterest share URL
	pinterest (data) {
		return {
			url: 'https://pinterest.com/pin/create/bookmarklet/?',
			data: data,
			popup: {
				width: 745,
				height: 620
			}
		};
	},

	// set LinkedIn share URL
	linkedin (data) {
		return {
			url: 'http://www.linkedin.com/shareArticle?',
			data: data,
			popup: {
				width: 780,
				height: 492
			}
		};
	},

	// set Buffer share URL
	buffer (data) {
		return {
			url: 'http://bufferapp.com/add?',
			data: data,
			popup: {
				width: 745,
				height: 345
			}
		};
	},

	// set Tumblr share URL
	tumblr (data) {
		return {
			url: 'https://www.tumblr.com/widgets/share/tool?',
			data: data,
			popup: {
				width: 540,
				height: 940
			}
		};
	},

	// set Reddit share URL
	reddit (data) {
		return {
			url: 'http://reddit.com/submit?',
			data: data,
			popup: {
				width: 860,
				height: 880
			}
		};
	},

	// set Flickr follow URL
	flickr (data, ios = false) {
		// if iOS user
		if (ios && data.ios) {
			return {
				url: `flickr://photos/${data.username}?`
			};
		} else {
			return {
				url: `http://www.flickr.com/photos/${data.username}?`,
				popup: {
					width: 600,
					height: 650
				}
			};
		}
	},

	// set WhatsApp share URL
	whatsapp (data) {
		return {
			url: 'whatsapp://send?',
			data: data
		};
	},

	// set sms share URL
	sms (data, ios = false) {
		return {
			url: ios ? 'sms:&' : 'sms:?',
			data: data
		};
	},

	// set Email share URL
	email (data) {

		var url = `mailto:`;

		// if to address specified then add to URL
		if (data.to !== null) {
			url += `${data.to}`;
		}

		url += `?`;

		return {
			url: url,
			data: {
				subject: data.subject,
				body: data.body
			}
		};
	},

	// set Github fork URL
	github (data, ios = false) {
		let url = data.repo ?
			`https://github.com/${data.repo}` :
			data.url;

		if (data.issue) {
			url += '/issues/new?title=' +
				data.issue +
				'&body=' +
				data.body;
		}

		return {
			url: url + '?',
			popup: {
				width: 1020,
				height: 323
			}
		};
	},

	// set Dribbble share URL
	dribbble (data, ios = false) {
		const url = data.shot ?
			`https://dribbble.com/shots/${data.shot}?` :
			data.url + '?';
		return {
			url: url,
			popup: {
				width: 440,
				height: 640
			}
		};
	},

	codepen (data) {
		const url = (data.pen && data.username && data.view) ?
			`https://codepen.io/${data.username}/${data.view}/${data.pen}?` :
			data.url + '?';
		return {
			url: url,
			popup: {
				width: 1200,
				height: 800
			}
		};
	},

	paypal (data) {
		return {
			data: data
		};
	}
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyL2pzL3Rlc3QuanMiLCJub2RlX21vZHVsZXMvb3Blbi1zaGFyZS9hbmFseXRpY3MuanMiLCJub2RlX21vZHVsZXMvb3Blbi1zaGFyZS9jb3VudC5qcyIsIm5vZGVfbW9kdWxlcy9vcGVuLXNoYXJlL2xpYi9jb3VudFJlZHVjZS5qcyIsIm5vZGVfbW9kdWxlcy9vcGVuLXNoYXJlL2xpYi9kYXNoVG9DYW1lbC5qcyIsIm5vZGVfbW9kdWxlcy9vcGVuLXNoYXJlL2xpYi9pbml0LmpzIiwibm9kZV9tb2R1bGVzL29wZW4tc2hhcmUvbGliL2luaXRpYWxpemVDb3VudE5vZGUuanMiLCJub2RlX21vZHVsZXMvb3Blbi1zaGFyZS9saWIvaW5pdGlhbGl6ZU5vZGVzLmpzIiwibm9kZV9tb2R1bGVzL29wZW4tc2hhcmUvbGliL2luaXRpYWxpemVTaGFyZU5vZGUuanMiLCJub2RlX21vZHVsZXMvb3Blbi1zaGFyZS9saWIvaW5pdGlhbGl6ZVdhdGNoZXIuanMiLCJub2RlX21vZHVsZXMvb3Blbi1zaGFyZS9saWIvc2V0RGF0YS5qcyIsIm5vZGVfbW9kdWxlcy9vcGVuLXNoYXJlL2xpYi9zaGFyZS5qcyIsIm5vZGVfbW9kdWxlcy9vcGVuLXNoYXJlL2xpYi9zdG9yZUNvdW50LmpzIiwibm9kZV9tb2R1bGVzL29wZW4tc2hhcmUvc2hhcmUuanMiLCJub2RlX21vZHVsZXMvb3Blbi1zaGFyZS9zcmMvbW9kdWxlcy9jb3VudC1hcGkuanMiLCJub2RlX21vZHVsZXMvb3Blbi1zaGFyZS9zcmMvbW9kdWxlcy9jb3VudC10cmFuc2Zvcm1zLmpzIiwibm9kZV9tb2R1bGVzL29wZW4tc2hhcmUvc3JjL21vZHVsZXMvY291bnQuanMiLCJub2RlX21vZHVsZXMvb3Blbi1zaGFyZS9zcmMvbW9kdWxlcy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvb3Blbi1zaGFyZS9zcmMvbW9kdWxlcy9vcGVuLXNoYXJlLmpzIiwibm9kZV9tb2R1bGVzL29wZW4tc2hhcmUvc3JjL21vZHVsZXMvc2hhcmUtYXBpLmpzIiwibm9kZV9tb2R1bGVzL29wZW4tc2hhcmUvc3JjL21vZHVsZXMvc2hhcmUtdHJhbnNmb3Jtcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBSSxZQUFZO0FBQ2YsUUFBTyxRQUFRLGtCQUFSLENBRFE7QUFFZixRQUFPLFFBQVEsa0JBQVIsQ0FGUTtBQUdmLFlBQVcsUUFBUSxzQkFBUjtBQUhJLENBQWhCOztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxrQkFBa0I7QUFDckIsUUFBTyxnQ0FEYztBQUVyQixRQUFPLGlCQUZjO0FBR3JCLFNBQVEsa0JBSGE7QUFJckIsYUFBWSxpQkFKUztBQUtyQixXQUFVO0FBTFcsQ0FBdEI7O0FBUUEsU0FBUyxtQkFBVCxDQUE2QixJQUE3QixFQUFtQztBQUNsQyxLQUFJLFlBQVksU0FBUyxhQUFULENBQXVCLEdBQXZCLENBQWhCOztBQUVBLFdBQVUsU0FBVixDQUFvQixHQUFwQixDQUF3QixpQkFBeEIsRUFBMkMsU0FBM0M7QUFDQSxXQUFVLFlBQVYsQ0FBdUIsaUJBQXZCLEVBQTBDLFNBQTFDO0FBQ0EsV0FBVSxZQUFWLENBQXVCLHFCQUF2QixFQUE4QyxLQUFLLEdBQW5EO0FBQ0EsV0FBVSxZQUFWLENBQXVCLHFCQUF2QixFQUE4QyxLQUFLLEdBQW5EO0FBQ0EsV0FBVSxZQUFWLENBQXVCLHNCQUF2QixFQUErQyxLQUFLLElBQXBEO0FBQ0EsV0FBVSxZQUFWLENBQXVCLDBCQUF2QixFQUFtRCxLQUFLLFFBQXhEO0FBQ0EsV0FBVSxTQUFWLEdBQXNCLHdDQUF3QyxLQUFLLE1BQW5FOztBQUVBLEtBQUksT0FBTyxJQUFJLFVBQVUsS0FBZCxDQUFvQjtBQUM5QixRQUFNLFNBRHdCO0FBRTlCLE9BQUssZ0NBRnlCO0FBRzlCLE9BQUssaUJBSHlCO0FBSTlCLFlBQVUsaUJBSm9CO0FBSzlCLFlBQVUsU0FBUyxhQUFULENBQXVCLG1CQUF2QixDQUxvQjtBQU05QixhQUFXLDBCQU5tQjtBQU85QixXQUFTLEtBUHFCO0FBUTlCLFdBQVMsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixTQUFoQjtBQVJxQixFQUFwQixDQUFYOztBQVdBLFFBQU8sU0FBUDtBQUNBOztBQUVELFNBQVMsT0FBVCxHQUFtQjtBQUNsQixLQUFJLE9BQU8sZUFBWDtBQUNBLFVBQVMsYUFBVCxDQUF1QixtQkFBdkIsRUFDRSxXQURGLENBQ2Msb0JBQW9CLElBQXBCLENBRGQ7QUFFQTs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsT0FBakI7O0FBRUEsU0FBUyxnQkFBVCxHQUE0QjtBQUMzQixLQUFJLE9BQU8sZUFBWDs7QUFFQSxLQUFJLFVBQVUsS0FBZCxDQUFvQjtBQUNuQixRQUFNLFVBRGE7QUFFbkIsT0FBSztBQUZjLEVBQXBCLEVBR0csVUFBVSxJQUFWLEVBQWdCO0FBQ2xCLE1BQUksS0FBSyxJQUFJLFVBQVUsS0FBZCxDQUFvQjtBQUMzQixTQUFNLFNBRHFCO0FBRTNCLFFBQUssZ0NBRnNCO0FBRzNCLFFBQUssaUJBSHNCO0FBSTNCLGFBQVUsaUJBSmlCO0FBSzNCLGNBQVcsMEJBTGdCO0FBTTNCLFlBQVMsS0FOa0I7QUFPM0IsWUFBUyxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLFNBQWhCO0FBUGtCLEdBQXBCLENBQVQ7QUFTQSxXQUFTLGFBQVQsQ0FBdUIsc0JBQXZCLEVBQ0csV0FESCxDQUNlLEVBRGY7QUFFRSxLQUFHLFdBQUgsQ0FBZSxJQUFmO0FBQ0YsRUFoQkQ7QUFpQkE7O0FBRUQsT0FBTyxnQkFBUCxHQUEwQixnQkFBMUI7O0FBRUEsU0FBUyxlQUFULEdBQTJCO0FBQ3pCLEtBQUksWUFBWSxTQUFTLGFBQVQsQ0FBdUIsMEJBQXZCLENBQWhCO0FBQ0QsS0FBSSxPQUFPLFVBQVUsYUFBVixDQUF3QixrQkFBeEIsRUFBNEMsS0FBdkQ7QUFDQSxLQUFJLE1BQU0sVUFBVSxhQUFWLENBQXdCLGlCQUF4QixFQUEyQyxLQUFyRDs7QUFFQSxLQUFJLFVBQVUsS0FBZCxDQUFvQjtBQUNuQixRQUFNLElBRGE7QUFFbkIsT0FBSyxHQUZjO0FBR25CLFlBQVUsU0FIUztBQUluQixXQUFTLENBQUMsTUFBRDtBQUpVLEVBQXBCLEVBS0csVUFBVSxJQUFWLEVBQWdCO0FBQ2xCLE9BQUssS0FBTCxDQUFXLFFBQVgsR0FBc0IsVUFBdEI7QUFDQSxFQVBEOztBQVVBLFdBQVUsYUFBVixDQUF3QixrQkFBeEIsRUFBNEMsS0FBNUMsR0FBb0QsRUFBcEQ7QUFDQSxXQUFVLGFBQVYsQ0FBd0IsaUJBQXhCLEVBQTJDLEtBQTNDLEdBQW1ELEVBQW5EO0FBQ0E7O0FBRUQsT0FBTyxlQUFQLEdBQXlCLGVBQXpCOztBQUVBOztBQUVBLElBQUksVUFBVSxLQUFkLENBQW9CO0FBQ25CLE9BQU0sWUFEYTtBQUVuQixTQUFRLHNCQUZXO0FBR25CLE9BQU0sU0FIYTtBQUluQixPQUFNLEVBSmE7QUFLbkIsV0FBVSxTQUFTLElBTEE7QUFNbkIsWUFBVztBQU5RLENBQXBCOztBQVNBLElBQUksVUFBVSxLQUFkLENBQW9CO0FBQ25CLE9BQU0sZ0JBRGE7QUFFbkIsYUFBWSxpQkFGTztBQUduQixTQUFRLFVBSFc7QUFJbkIsV0FBVSxTQUFTLElBSkE7QUFLbkIsWUFBVztBQUxRLENBQXBCOztBQVFBO0FBQ0EsSUFBSSxVQUFVLEtBQWQsQ0FBb0I7QUFDbkIsT0FBTSxRQURhO0FBRW5CLFdBQVUsZUFGUztBQUduQixVQUFTLElBSFU7QUFJbkIsV0FBVSxTQUFTLElBSkE7QUFLbkIsWUFBVztBQUxRLENBQXBCOztBQVFBO0FBQ0EsU0FBUyxnQkFBVCxDQUEwQix3QkFBMUIsRUFBb0QsWUFBVztBQUM5RCxTQUFRLEdBQVIsQ0FBWSwwQkFBWjtBQUNBLENBRkQ7O0FBSUE7QUFDQSxTQUFTLGdCQUFULENBQTBCLHdCQUExQixFQUFvRCxZQUFXO0FBQzlELFNBQVEsR0FBUixDQUFZLDBCQUFaOztBQUVBO0FBQ0EsSUFBRyxPQUFILENBQVcsSUFBWCxDQUFnQixTQUFTLGdCQUFULENBQTBCLG1CQUExQixDQUFoQixFQUFnRSxVQUFTLElBQVQsRUFBZTtBQUM5RSxPQUFLLGdCQUFMLENBQXNCLGtCQUF0QixFQUEwQyxVQUFTLENBQVQsRUFBWTtBQUNyRCxXQUFRLEdBQVIsQ0FBWSxtQkFBWixFQUFpQyxDQUFqQztBQUNBLEdBRkQ7QUFHQSxFQUpEOztBQU1BLEtBQUksV0FBVztBQUNkLFdBQVMsSUFBSSxVQUFVLEtBQWQsQ0FBb0I7QUFDNUIsU0FBTSxTQURzQjtBQUU1QixjQUFXLElBRmlCO0FBRzVCLFFBQUssNEJBSHVCO0FBSTVCLFFBQUssaUJBSnVCO0FBSzVCLFNBQU0sa0JBTHNCO0FBTTVCLGFBQVU7QUFOa0IsR0FBcEIsRUFPTixTQUFTLGFBQVQsQ0FBdUIsOEJBQXZCLENBUE0sQ0FESzs7QUFVZCxZQUFVLElBQUksVUFBVSxLQUFkLENBQW9CO0FBQzdCLFNBQU0sVUFEdUI7QUFFN0IsY0FBVyxJQUZrQjtBQUc3QixTQUFNLDRCQUh1QjtBQUk3QixZQUFTLDZEQUpvQjtBQUs3QixZQUFTLGtCQUxvQjtBQU03QixnQkFBYTtBQU5nQixHQUFwQixFQU9QLFNBQVMsYUFBVCxDQUF1QiwrQkFBdkIsQ0FQTyxDQVZJOztBQW1CZCxhQUFXLElBQUksVUFBVSxLQUFkLENBQW9CO0FBQzlCLFNBQU0sV0FEd0I7QUFFOUIsY0FBVyxJQUZtQjtBQUc5QixRQUFLLDRCQUh5QjtBQUk5QixVQUFPLDZEQUp1QjtBQUs5QixnQkFBYSxrQkFMaUI7QUFNOUIsYUFBVSxTQUFTO0FBTlcsR0FBcEIsRUFPUixTQUFTLGFBQVQsQ0FBdUIsZ0NBQXZCLENBUFEsQ0FuQkc7O0FBNEJkLFNBQU8sSUFBSSxVQUFVLEtBQWQsQ0FBb0I7QUFDMUIsU0FBTSxPQURvQjtBQUUxQixjQUFXLElBRmU7QUFHMUIsT0FBSSw4QkFIc0I7QUFJMUIsWUFBUyxrQkFKaUI7QUFLMUIsU0FBTTtBQUxvQixHQUFwQixFQU1KLFNBQVMsYUFBVCxDQUF1Qiw0QkFBdkIsQ0FOSTtBQTVCTyxFQUFmO0FBb0NBLENBOUNEOztBQWdEQTtBQUNBLElBQUksT0FBTyxDQUNWLFVBRFUsRUFFVixRQUZVLEVBR1YsVUFIVSxFQUlWLFFBSlUsRUFLVixXQUxVLEVBTVYsQ0FDQyxRQURELEVBRUMsVUFGRCxFQUdDLFFBSEQsRUFJQyxXQUpELENBTlUsQ0FBWDs7QUFjQSxLQUFLLE9BQUwsQ0FBYSxVQUFTLEdBQVQsRUFBYztBQUMxQixLQUFJLE1BQU0sT0FBTixDQUFjLEdBQWQsQ0FBSixFQUF3QjtBQUN2QixRQUFNLElBQUksSUFBSixDQUFTLEdBQVQsQ0FBTjtBQUNBO0FBQ0QsS0FBSSxZQUFZLFNBQVMsZ0JBQVQsQ0FBMEIsNkJBQTZCLEdBQTdCLEdBQW1DLElBQTdELENBQWhCOztBQUVBLElBQUcsT0FBSCxDQUFXLElBQVgsQ0FBZ0IsU0FBaEIsRUFBMkIsVUFBUyxJQUFULEVBQWU7QUFDekMsT0FBSyxnQkFBTCxDQUFzQix1QkFBdUIsR0FBN0MsRUFBa0QsWUFBVztBQUM1RCxPQUFJLFNBQVMsS0FBSyxTQUFsQjtBQUNBLE9BQUksTUFBSixFQUFZLFFBQVEsR0FBUixDQUFZLEdBQVosRUFBaUIsVUFBakIsRUFBNkIsTUFBN0I7QUFDWixHQUhEO0FBSUEsRUFMRDtBQU1BLENBWkQ7OztBQ3pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBPcGVuU2hhcmUgPSB7XG5cdHNoYXJlOiByZXF1aXJlKCdvcGVuLXNoYXJlL3NoYXJlJyksXG5cdGNvdW50OiByZXF1aXJlKCdvcGVuLXNoYXJlL2NvdW50JyksXG5cdGFuYWx5dGljczogcmVxdWlyZSgnb3Blbi1zaGFyZS9hbmFseXRpY3MnKVxufTtcblxuLy8gT3BlblNoYXJlLmFuYWx5dGljcygndGFnTWFuYWdlcicsIGZ1bmN0aW9uICgpIHtcbi8vICAgY29uc29sZS5sb2coJ3RhZyBtYW5hZ2VyIGxvYWRlZCcpO1xuLy8gfSk7XG4vL1xuLy8gT3BlblNoYXJlLmFuYWx5dGljcygnZXZlbnQnLCBmdW5jdGlvbiAoKSB7XG4vLyAgIGNvbnNvbGUubG9nKCdnb29nbGUgYW5hbHl0aWNzIGxvYWRlZCcpO1xuLy8gfSk7XG4vL1xuLy8gT3BlblNoYXJlLmFuYWx5dGljcygnc29jaWFsJywgZnVuY3Rpb24gKCkge1xuLy8gICBjb25zb2xlLmxvZygnZ29vZ2xlIGFuYWx5dGljcyBsb2FkZWQnKTtcbi8vIH0pO1xuXG52YXIgZHluYW1pY05vZGVEYXRhID0ge1xuXHQndXJsJzogJ2h0dHA6Ly93d3cuZGlnaXRhbHN1cmdlb25zLmNvbScsXG5cdCd2aWEnOiAnZGlnaXRhbHN1cmdlb25zJyxcblx0J3RleHQnOiAnRm9yd2FyZCBPYnNlc3NlZCcsXG5cdCdoYXNodGFncyc6ICdmb3J3YXJkb2JzZXNzZWQnLFxuXHQnYnV0dG9uJzogJ09wZW4gU2hhcmUgV2F0Y2hlciEnXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVPcGVuU2hhcmVOb2RlKGRhdGEpIHtcblx0dmFyIG9wZW5TaGFyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblxuXHRvcGVuU2hhcmUuY2xhc3NMaXN0LmFkZCgnb3Blbi1zaGFyZS1saW5rJywgJ3R3aXR0ZXInKTtcblx0b3BlblNoYXJlLnNldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlJywgJ3R3aXR0ZXInKTtcblx0b3BlblNoYXJlLnNldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXVybCcsIGRhdGEudXJsKTtcblx0b3BlblNoYXJlLnNldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXZpYScsIGRhdGEudmlhKTtcblx0b3BlblNoYXJlLnNldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXRleHQnLCBkYXRhLnRleHQpO1xuXHRvcGVuU2hhcmUuc2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtaGFzaHRhZ3MnLCBkYXRhLmhhc2h0YWdzKTtcblx0b3BlblNoYXJlLmlubmVySFRNTCA9ICc8c3BhbiBjbGFzcz1cImZhIGZhLXR3aXR0ZXJcIj48L3NwYW4+JyArIGRhdGEuYnV0dG9uO1xuXG5cdHZhciBub2RlID0gbmV3IE9wZW5TaGFyZS5zaGFyZSh7XG5cdFx0dHlwZTogJ3R3aXR0ZXInLFxuXHRcdHVybDogJ2h0dHA6Ly93d3cuZGlnaXRhbHN1cmdlb25zLmNvbScsXG5cdFx0dmlhOiAnZGlnaXRhbHN1cmdlb25zJyxcblx0XHRoYXNodGFnczogJ2ZvcndhcmRvYnNlc3NlZCcsXG5cdFx0YXBwZW5kVG86IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vcGVuLXNoYXJlLXdhdGNoJyksXG5cdFx0aW5uZXJIVE1MOiAnQ3JlYXRlZCB2aWEgT3BlblNoYXJlQVBJJyxcblx0XHRlbGVtZW50OiAnZGl2Jyxcblx0XHRjbGFzc2VzOiBbJ3dvdycsICdzdWNoJywgJ2NsYXNzZXMnXVxuXHR9KTtcblxuXHRyZXR1cm4gb3BlblNoYXJlO1xufVxuXG5mdW5jdGlvbiBhZGROb2RlKCkge1xuXHR2YXIgZGF0YSA9IGR5bmFtaWNOb2RlRGF0YTtcblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm9wZW4tc2hhcmUtd2F0Y2gnKVxuXHRcdC5hcHBlbmRDaGlsZChjcmVhdGVPcGVuU2hhcmVOb2RlKGRhdGEpKTtcbn1cblxud2luZG93LmFkZE5vZGUgPSBhZGROb2RlO1xuXG5mdW5jdGlvbiBhZGROb2RlV2l0aENvdW50KCkge1xuXHR2YXIgZGF0YSA9IGR5bmFtaWNOb2RlRGF0YTtcblxuXHRuZXcgT3BlblNoYXJlLmNvdW50KHtcblx0XHR0eXBlOiAnZmFjZWJvb2snLFxuXHRcdHVybDogJ2h0dHBzOi8vd3d3LmRpZ2l0YWxzdXJnZW9ucy5jb20vJ1xuXHR9LCBmdW5jdGlvbiAobm9kZSkge1xuXHRcdHZhciBvcyA9IG5ldyBPcGVuU2hhcmUuc2hhcmUoe1xuXHRcdCAgdHlwZTogJ3R3aXR0ZXInLFxuXHRcdCAgdXJsOiAnaHR0cDovL3d3dy5kaWdpdGFsc3VyZ2VvbnMuY29tJyxcblx0XHQgIHZpYTogJ2RpZ2l0YWxzdXJnZW9ucycsXG5cdFx0ICBoYXNodGFnczogJ2ZvcndhcmRvYnNlc3NlZCcsXG5cdFx0ICBpbm5lckhUTUw6ICdDcmVhdGVkIHZpYSBPcGVuU2hhcmVBUEknLFxuXHRcdCAgZWxlbWVudDogJ2RpdicsXG5cdFx0ICBjbGFzc2VzOiBbJ3dvdycsICdzdWNoJywgJ2NsYXNzZXMnXVxuXHQgIH0pO1xuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcmVhdGUtbm9kZS53LWNvdW50Jylcblx0XHQgIC5hcHBlbmRDaGlsZChvcyk7XG5cdFx0ICBvcy5hcHBlbmRDaGlsZChub2RlKTtcblx0fSk7XG59XG5cbndpbmRvdy5hZGROb2RlV2l0aENvdW50ID0gYWRkTm9kZVdpdGhDb3VudDtcblxuZnVuY3Rpb24gY3JlYXRlQ291bnROb2RlKCkge1xuIFx0dmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcmVhdGUtbm9kZS5jb3VudC1ub2RlcycpO1xuXHR2YXIgdHlwZSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbnB1dC5jb3VudC10eXBlJykudmFsdWU7XG5cdHZhciB1cmwgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignaW5wdXQuY291bnQtdXJsJykudmFsdWU7XG5cblx0bmV3IE9wZW5TaGFyZS5jb3VudCh7XG5cdFx0dHlwZTogdHlwZSxcblx0XHR1cmw6IHVybCxcblx0XHRhcHBlbmRUbzogY29udGFpbmVyLFxuXHRcdGNsYXNzZXM6IFsndGVzdCddXG5cdH0sIGZ1bmN0aW9uIChub2RlKSB7XG5cdFx0bm9kZS5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG5cdH0pO1xuXG5cblx0Y29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0LmNvdW50LXR5cGUnKS52YWx1ZSA9ICcnO1xuXHRjb250YWluZXIucXVlcnlTZWxlY3RvcignaW5wdXQuY291bnQtdXJsJykudmFsdWUgPSAnJztcbn1cblxud2luZG93LmNyZWF0ZUNvdW50Tm9kZSA9IGNyZWF0ZUNvdW50Tm9kZTtcblxuLy8gdGVzdCBKUyBPcGVuU2hhcmUgQVBJIHdpdGggZGFzaGVzXG5cbm5ldyBPcGVuU2hhcmUuc2hhcmUoe1xuXHR0eXBlOiAnZ29vZ2xlTWFwcycsXG5cdGNlbnRlcjogJzQwLjc2NTgxOSwtNzMuOTc1ODY2Jyxcblx0dmlldzogJ3RyYWZmaWMnLFxuXHR6b29tOiAxNCxcblx0YXBwZW5kVG86IGRvY3VtZW50LmJvZHksXG5cdGlubmVySFRNTDogJ01hcHMnXG59KTtcblxubmV3IE9wZW5TaGFyZS5zaGFyZSh7XG5cdHR5cGU6ICd0d2l0dGVyLWZvbGxvdycsXG5cdHNjcmVlbk5hbWU6ICdkaWdpdGFsc3VyZ2VvbnMnLFxuXHR1c2VySWQ6ICcxODE4OTEzMCcsXG5cdGFwcGVuZFRvOiBkb2N1bWVudC5ib2R5LFxuXHRpbm5lckhUTUw6ICdGb2xsb3cgVGVzdCdcbn0pO1xuXG4vLyB0ZXN0IFBheVBhbFxubmV3IE9wZW5TaGFyZS5zaGFyZSh7XG5cdHR5cGU6ICdwYXlwYWwnLFxuXHRidXR0b25JZDogJzJQM1JKWUVGTDdaNjInLFxuXHRzYW5kYm94OiB0cnVlLFxuXHRhcHBlbmRUbzogZG9jdW1lbnQuYm9keSxcblx0aW5uZXJIVE1MOiAnUGF5UGFsIFRlc3QnXG59KTtcblxuLy8gYmluZCB0byBjb3VudCBsb2FkZWQgZXZlbnRcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ09wZW5TaGFyZS5jb3VudC1sb2FkZWQnLCBmdW5jdGlvbigpIHtcblx0Y29uc29sZS5sb2coJ09wZW5TaGFyZSAoY291bnQpIGxvYWRlZCcpO1xufSk7XG5cbi8vIGJpbmQgdG8gc2hhcmUgbG9hZGVkIGV2ZW50XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdPcGVuU2hhcmUuc2hhcmUtbG9hZGVkJywgZnVuY3Rpb24oKSB7XG5cdGNvbnNvbGUubG9nKCdPcGVuU2hhcmUgKHNoYXJlKSBsb2FkZWQnKTtcblxuXHQvLyBiaW5kIHRvIHNoYXJlZCBldmVudCBvbiBlYWNoIGluZGl2aWR1YWwgbm9kZVxuXHRbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtb3Blbi1zaGFyZV0nKSwgZnVuY3Rpb24obm9kZSkge1xuXHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignT3BlblNoYXJlLnNoYXJlZCcsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdPcGVuIFNoYXJlIFNoYXJlZCcsIGUpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHR2YXIgZXhhbXBsZXMgPSB7XG5cdFx0dHdpdHRlcjogbmV3IE9wZW5TaGFyZS5zaGFyZSh7XG5cdFx0XHR0eXBlOiAndHdpdHRlcicsXG5cdFx0XHRiaW5kQ2xpY2s6IHRydWUsXG5cdFx0XHR1cmw6ICdodHRwOi8vZGlnaXRhbHN1cmdlb25zLmNvbScsXG5cdFx0XHR2aWE6ICdkaWdpdGFsc3VyZ2VvbnMnLFxuXHRcdFx0dGV4dDogJ0RpZ2l0YWwgU3VyZ2VvbnMnLFxuXHRcdFx0aGFzaHRhZ3M6ICdmb3J3YXJkb2JzZXNzZWQnXG5cdFx0fSwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYXBpLWV4YW1wbGU9XCJ0d2l0dGVyXCJdJykpLFxuXG5cdFx0ZmFjZWJvb2s6IG5ldyBPcGVuU2hhcmUuc2hhcmUoe1xuXHRcdFx0dHlwZTogJ2ZhY2Vib29rJyxcblx0XHRcdGJpbmRDbGljazogdHJ1ZSxcblx0XHRcdGxpbms6ICdodHRwOi8vZGlnaXRhbHN1cmdlb25zLmNvbScsXG5cdFx0XHRwaWN0dXJlOiAnaHR0cDovL3d3dy5kaWdpdGFsc3VyZ2VvbnMuY29tL2ltZy9hYm91dC9iZ19vZmZpY2VfdGVhbS5qcGcnLFxuXHRcdFx0Y2FwdGlvbjogJ0RpZ2l0YWwgU3VyZ2VvbnMnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdmb3J3YXJkb2JzZXNzZWQnXG5cdFx0fSwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYXBpLWV4YW1wbGU9XCJmYWNlYm9va1wiXScpKSxcblxuXHRcdHBpbnRlcmVzdDogbmV3IE9wZW5TaGFyZS5zaGFyZSh7XG5cdFx0XHR0eXBlOiAncGludGVyZXN0Jyxcblx0XHRcdGJpbmRDbGljazogdHJ1ZSxcblx0XHRcdHVybDogJ2h0dHA6Ly9kaWdpdGFsc3VyZ2VvbnMuY29tJyxcblx0XHRcdG1lZGlhOiAnaHR0cDovL3d3dy5kaWdpdGFsc3VyZ2VvbnMuY29tL2ltZy9hYm91dC9iZ19vZmZpY2VfdGVhbS5qcGcnLFxuXHRcdFx0ZGVzY3JpcHRpb246ICdEaWdpdGFsIFN1cmdlb25zJyxcblx0XHRcdGFwcGVuZFRvOiBkb2N1bWVudC5ib2R5XG5cdFx0fSwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYXBpLWV4YW1wbGU9XCJwaW50ZXJlc3RcIl0nKSksXG5cblx0XHRlbWFpbDogbmV3IE9wZW5TaGFyZS5zaGFyZSh7XG5cdFx0XHR0eXBlOiAnZW1haWwnLFxuXHRcdFx0YmluZENsaWNrOiB0cnVlLFxuXHRcdFx0dG86ICd0ZWNocm9vbUBkaWdpdGFsc3VyZ2VvbnMuY29tJyxcblx0XHRcdHN1YmplY3Q6ICdEaWdpdGFsIFN1cmdlb25zJyxcblx0XHRcdGJvZHk6ICdGb3J3YXJkIE9ic2Vzc2VkJ1xuXHRcdH0sIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFwaS1leGFtcGxlPVwiZW1haWxcIl0nKSlcblx0fTtcbn0pO1xuXG4vLyBFeGFtcGxlIG9mIGxpc3RlbmluZyBmb3IgY291bnRlZCBldmVudHMgb24gaW5kaXZpZHVhbCB1cmxzIG9yIGFycmF5cyBvZiB1cmxzXG52YXIgdXJscyA9IFtcblx0J2ZhY2Vib29rJyxcblx0J2dvb2dsZScsXG5cdCdsaW5rZWRpbicsXG5cdCdyZWRkaXQnLFxuXHQncGludGVyZXN0Jyxcblx0W1xuXHRcdCdnb29nbGUnLFxuXHRcdCdsaW5rZWRpbicsXG5cdFx0J3JlZGRpdCcsXG5cdFx0J3BpbnRlcmVzdCdcblx0XVxuXTtcblxudXJscy5mb3JFYWNoKGZ1bmN0aW9uKHVybCkge1xuXHRpZiAoQXJyYXkuaXNBcnJheSh1cmwpKSB7XG5cdFx0dXJsID0gdXJsLmpvaW4oJywnKTtcblx0fVxuXHR2YXIgY291bnROb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtb3Blbi1zaGFyZS1jb3VudD1cIicgKyB1cmwgKyAnXCJdJyk7XG5cblx0W10uZm9yRWFjaC5jYWxsKGNvdW50Tm9kZSwgZnVuY3Rpb24obm9kZSkge1xuXHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignT3BlblNoYXJlLmNvdW50ZWQtJyArIHVybCwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgY291bnRzID0gbm9kZS5pbm5lckhUTUw7XG5cdFx0XHRpZiAoY291bnRzKSBjb25zb2xlLmxvZyh1cmwsICdzaGFyZXM6ICcsIGNvdW50cyk7XG5cdFx0fSk7XG5cdH0pO1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0eXBlLCBjYikge1xuICAgbGV0IGNvdW50ID0gMTA7XG5cbiAgIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG5cblx0ICAgY29uc3QgaXNHQSA9IHR5cGUgPT09ICdldmVudCcgfHwgdHlwZSA9PT0gJ3NvY2lhbCc7XG5cdCAgIGNvbnN0IGlzVGFnTWFuYWdlciA9IHR5cGUgPT09ICd0YWdNYW5hZ2VyJztcblxuXHQgICBpZiAoaXNHQSkgY2hlY2tJZkFuYWx5dGljc0xvYWRlZCh0eXBlLCBjYiwgY291bnQpO1xuXHQgICBpZiAoaXNUYWdNYW5hZ2VyKSBzZXRUYWdNYW5hZ2VyKGNiKTtcbiAgIC8vIH0pO1xufTtcblxuZnVuY3Rpb24gY2hlY2tJZkFuYWx5dGljc0xvYWRlZCh0eXBlLCBjYiwgY291bnQpIHtcblx0Y291bnQtLTtcblx0aWYgKHdpbmRvdy5nYSkge1xuXHRcdCAgaWYgKGNiKSBjYigpO1xuXHRcdCAgLy8gYmluZCB0byBzaGFyZWQgZXZlbnQgb24gZWFjaCBpbmRpdmlkdWFsIG5vZGVcblx0XHQgIGxpc3RlbihmdW5jdGlvbiAoZSkge1xuXHRcdFx0Y29uc3QgcGxhdGZvcm0gPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZScpO1xuXHRcdFx0Y29uc3QgdGFyZ2V0ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtbGluaycpIHx8XG5cdFx0XHRcdGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXVybCcpIHx8XG5cdFx0XHRcdGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXVzZXJuYW1lJykgfHxcblx0XHRcdCAgICBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1jZW50ZXInKSB8fFxuXHRcdFx0XHRlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1zZWFyY2gnKSB8fFxuXHRcdFx0XHRlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1ib2R5Jyk7XG5cblx0XHRcdGlmICh0eXBlID09PSAnZXZlbnQnKSB7XG5cdFx0XHRcdGdhKCdzZW5kJywgJ2V2ZW50Jywge1xuXHRcdFx0XHRcdGV2ZW50Q2F0ZWdvcnk6ICdPcGVuU2hhcmUgQ2xpY2snLFxuXHRcdFx0XHRcdGV2ZW50QWN0aW9uOiBwbGF0Zm9ybSxcblx0XHRcdFx0XHRldmVudExhYmVsOiB0YXJnZXQsXG5cdFx0XHRcdFx0dHJhbnNwb3J0OiAnYmVhY29uJ1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHR5cGUgPT09ICdzb2NpYWwnKSB7XG5cdFx0XHRcdGdhKCdzZW5kJywge1xuXHRcdFx0XHRcdGhpdFR5cGU6ICdzb2NpYWwnLFxuXHRcdFx0XHRcdHNvY2lhbE5ldHdvcms6IHBsYXRmb3JtLFxuXHRcdFx0XHRcdHNvY2lhbEFjdGlvbjogJ3NoYXJlJyxcblx0XHRcdFx0XHRzb2NpYWxUYXJnZXQ6IHRhcmdldFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHR9XG5cdGVsc2Uge1xuXHRcdCAgaWYgKGNvdW50KSB7XG5cdFx0XHQgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0ICBjaGVja0lmQW5hbHl0aWNzTG9hZGVkKHR5cGUsIGNiLCBjb3VudCk7XG5cdFx0ICB9LCAxMDAwKTtcbiAgXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBzZXRUYWdNYW5hZ2VyIChjYikge1xuXHRpZiAoY2IpIGNiKCk7XG5cblx0d2luZG93LmRhdGFMYXllciA9IHdpbmRvdy5kYXRhTGF5ZXIgfHwgW107XG5cblx0bGlzdGVuKG9uU2hhcmVUYWdNYW5nZXIpO1xuXG5cdGdldENvdW50cyhmdW5jdGlvbihlKSB7XG5cdFx0Y29uc3QgY291bnQgPSBlLnRhcmdldCA/XG5cdFx0ICBlLnRhcmdldC5pbm5lckhUTUwgOlxuXHRcdCAgZS5pbm5lckhUTUw7XG5cblx0XHRjb25zdCBwbGF0Zm9ybSA9IGUudGFyZ2V0ID9cblx0XHQgICBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1jb3VudC11cmwnKSA6XG5cdFx0ICAgZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1jb3VudC11cmwnKTtcblxuXHRcdHdpbmRvdy5kYXRhTGF5ZXIucHVzaCh7XG5cdFx0XHQnZXZlbnQnIDogJ09wZW5TaGFyZSBDb3VudCcsXG5cdFx0XHQncGxhdGZvcm0nOiBwbGF0Zm9ybSxcblx0XHRcdCdyZXNvdXJjZSc6IGNvdW50LFxuXHRcdFx0J2FjdGl2aXR5JzogJ2NvdW50J1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gbGlzdGVuIChjYikge1xuXHQvLyBiaW5kIHRvIHNoYXJlZCBldmVudCBvbiBlYWNoIGluZGl2aWR1YWwgbm9kZVxuXHRbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtb3Blbi1zaGFyZV0nKSwgZnVuY3Rpb24obm9kZSkge1xuXHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignT3BlblNoYXJlLnNoYXJlZCcsIGNiKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGdldENvdW50cyAoY2IpIHtcblx0dmFyIGNvdW50Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW9wZW4tc2hhcmUtY291bnRdJyk7XG5cblx0W10uZm9yRWFjaC5jYWxsKGNvdW50Tm9kZSwgZnVuY3Rpb24obm9kZSkge1xuXHRcdGlmIChub2RlLnRleHRDb250ZW50KSBjYihub2RlKTtcblx0XHRlbHNlIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignT3BlblNoYXJlLmNvdW50ZWQtJyArIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtY291bnQtdXJsJyksIGNiKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIG9uU2hhcmVUYWdNYW5nZXIgKGUpIHtcblx0Y29uc3QgcGxhdGZvcm0gPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZScpO1xuXHRjb25zdCB0YXJnZXQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1saW5rJykgfHxcblx0XHRlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS11cmwnKSB8fFxuXHRcdGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXVzZXJuYW1lJykgfHxcblx0XHRlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1jZW50ZXInKSB8fFxuXHRcdGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXNlYXJjaCcpIHx8XG5cdFx0ZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtYm9keScpO1xuXG5cdHdpbmRvdy5kYXRhTGF5ZXIucHVzaCh7XG5cdFx0J2V2ZW50JyA6ICdPcGVuU2hhcmUgU2hhcmUnLFxuXHRcdCdwbGF0Zm9ybSc6IHBsYXRmb3JtLFxuXHRcdCdyZXNvdXJjZSc6IHRhcmdldCxcblx0XHQnYWN0aXZpdHknOiAnc2hhcmUnXG5cdH0pO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCByZXF1aXJlKCcuL2xpYi9pbml0Jykoe1xuXHRcdGFwaTogJ2NvdW50Jyxcblx0XHRzZWxlY3RvcjogJ1tkYXRhLW9wZW4tc2hhcmUtY291bnRdOm5vdChbZGF0YS1vcGVuLXNoYXJlLW5vZGVdKScsXG5cdFx0Y2I6IHJlcXVpcmUoJy4vbGliL2luaXRpYWxpemVDb3VudE5vZGUnKVxuXHR9KSk7XG5cblx0cmV0dXJuIHJlcXVpcmUoJy4vc3JjL21vZHVsZXMvY291bnQtYXBpJykoKTtcbn0pKCk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNvdW50UmVkdWNlO1xuXG5mdW5jdGlvbiByb3VuZCh4LCBwcmVjaXNpb24pIHtcblx0aWYgKHR5cGVvZiB4ICE9PSAnbnVtYmVyJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHZhbHVlIHRvIGJlIGEgbnVtYmVyJyk7XG5cdH1cblxuXHR2YXIgZXhwb25lbnQgPSBwcmVjaXNpb24gPiAwID8gJ2UnIDogJ2UtJztcblx0dmFyIGV4cG9uZW50TmVnID0gcHJlY2lzaW9uID4gMCA/ICdlLScgOiAnZSc7XG5cdHByZWNpc2lvbiA9IE1hdGguYWJzKHByZWNpc2lvbik7XG5cblx0cmV0dXJuIE51bWJlcihNYXRoLnJvdW5kKHggKyBleHBvbmVudCArIHByZWNpc2lvbikgKyBleHBvbmVudE5lZyArIHByZWNpc2lvbik7XG59XG5cbmZ1bmN0aW9uIHRob3VzYW5kaWZ5IChudW0pIHtcblx0cmV0dXJuIHJvdW5kKG51bS8xMDAwLCAxKSArICdLJztcbn1cblxuZnVuY3Rpb24gbWlsbGlvbmlmeSAobnVtKSB7XG5cdHJldHVybiByb3VuZChudW0vMTAwMDAwMCwgMSkgKyAnTSc7XG59XG5cbmZ1bmN0aW9uIGNvdW50UmVkdWNlIChlbCwgY291bnQsIGNiKSB7XG5cdGlmIChjb3VudCA+IDk5OTk5OSkgIHtcblx0XHRlbC5pbm5lckhUTUwgPSBtaWxsaW9uaWZ5KGNvdW50KTtcblx0XHRpZiAoY2IgICYmIHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgY2IoZWwpO1xuXHR9IGVsc2UgaWYgKGNvdW50ID4gOTk5KSB7XG5cdFx0ZWwuaW5uZXJIVE1MID0gdGhvdXNhbmRpZnkoY291bnQpO1xuXHRcdGlmIChjYiAgJiYgdHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSBjYihlbCk7XG5cdH0gZWxzZSB7XG5cdFx0ZWwuaW5uZXJIVE1MID0gY291bnQ7XG5cdFx0aWYgKGNiICAmJiB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIGNiKGVsKTtcblx0fVxufVxuIiwiLy8gdHlwZSBjb250YWlucyBhIGRhc2hcbi8vIHRyYW5zZm9ybSB0byBjYW1lbGNhc2UgZm9yIGZ1bmN0aW9uIHJlZmVyZW5jZVxuLy8gVE9ETzogb25seSBzdXBwb3J0cyBzaW5nbGUgZGFzaCwgc2hvdWxkIHNob3VsZCBzdXBwb3J0IG11bHRpcGxlXG5tb2R1bGUuZXhwb3J0cyA9IChkYXNoLCB0eXBlKSA9PiB7XG5cdGxldCBuZXh0Q2hhciA9IHR5cGUuc3Vic3RyKGRhc2ggKyAxLCAxKSxcblx0XHRncm91cCA9IHR5cGUuc3Vic3RyKGRhc2gsIDIpO1xuXG5cdHR5cGUgPSB0eXBlLnJlcGxhY2UoZ3JvdXAsIG5leHRDaGFyLnRvVXBwZXJDYXNlKCkpO1xuXHRyZXR1cm4gdHlwZTtcbn07XG4iLCJjb25zdCBpbml0aWFsaXplTm9kZXMgPSByZXF1aXJlKCcuL2luaXRpYWxpemVOb2RlcycpO1xuY29uc3QgaW5pdGlhbGl6ZVdhdGNoZXIgPSByZXF1aXJlKCcuL2luaXRpYWxpemVXYXRjaGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdDtcblxuZnVuY3Rpb24gaW5pdChvcHRzKSB7XG5cdHJldHVybiAoKSA9PiB7XG5cdFx0Y29uc3QgaW5pdE5vZGVzID0gaW5pdGlhbGl6ZU5vZGVzKHtcblx0XHRcdGFwaTogb3B0cy5hcGkgfHwgbnVsbCxcblx0XHRcdGNvbnRhaW5lcjogb3B0cy5jb250YWluZXIgfHwgZG9jdW1lbnQsXG5cdFx0XHRzZWxlY3Rvcjogb3B0cy5zZWxlY3Rvcixcblx0XHRcdGNiOiBvcHRzLmNiXG5cdFx0fSk7XG5cblx0XHRpbml0Tm9kZXMoKTtcblxuXHRcdC8vIGNoZWNrIGZvciBtdXRhdGlvbiBvYnNlcnZlcnMgYmVmb3JlIHVzaW5nLCBJRTExIG9ubHlcblx0XHRpZiAod2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0aW5pdGlhbGl6ZVdhdGNoZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtb3Blbi1zaGFyZS13YXRjaF0nKSwgaW5pdE5vZGVzKTtcblx0XHR9XG5cdH07XG59XG4iLCJjb25zdCBDb3VudCA9IHJlcXVpcmUoJy4uL3NyYy9tb2R1bGVzL2NvdW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdGlhbGl6ZUNvdW50Tm9kZTtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUNvdW50Tm9kZShvcykge1xuXHQvLyBpbml0aWFsaXplIG9wZW4gc2hhcmUgb2JqZWN0IHdpdGggdHlwZSBhdHRyaWJ1dGVcblx0bGV0IHR5cGUgPSBvcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1jb3VudCcpLFxuXHRcdHVybCA9IG9zLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWNvdW50LXJlcG8nKSB8fFxuXHRcdFx0b3MuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtY291bnQtc2hvdCcpIHx8XG5cdFx0XHRvcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1jb3VudC11cmwnKSxcblx0XHRjb3VudCA9IG5ldyBDb3VudCh0eXBlLCB1cmwpO1xuXG5cdGNvdW50LmNvdW50KG9zKTtcblx0b3Muc2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtbm9kZScsIHR5cGUpO1xufVxuIiwiY29uc3QgRXZlbnRzID0gcmVxdWlyZSgnLi4vc3JjL21vZHVsZXMvZXZlbnRzJyk7XG5jb25zdCBhbmFseXRpY3MgPSByZXF1aXJlKCcuLi9hbmFseXRpY3MnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRpYWxpemVOb2RlcztcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZU5vZGVzKG9wdHMpIHtcblx0Ly8gbG9vcCB0aHJvdWdoIG9wZW4gc2hhcmUgbm9kZSBjb2xsZWN0aW9uXG5cdHJldHVybiAoKSA9PiB7XG5cdFx0Ly8gY2hlY2sgZm9yIGFuYWx5dGljc1xuXHRcdGNoZWNrQW5hbHl0aWNzKCk7XG5cblx0XHRpZiAob3B0cy5hcGkpIHtcblx0XHRcdGxldCBub2RlcyA9IG9wdHMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwob3B0cy5zZWxlY3Rvcik7XG5cdFx0XHRbXS5mb3JFYWNoLmNhbGwobm9kZXMsIG9wdHMuY2IpO1xuXG5cdFx0XHQvLyB0cmlnZ2VyIGNvbXBsZXRlZCBldmVudFxuXHRcdFx0RXZlbnRzLnRyaWdnZXIoZG9jdW1lbnQsIG9wdHMuYXBpICsgJy1sb2FkZWQnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gbG9vcCB0aHJvdWdoIG9wZW4gc2hhcmUgbm9kZSBjb2xsZWN0aW9uXG5cdFx0XHRsZXQgc2hhcmVOb2RlcyA9IG9wdHMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwob3B0cy5zZWxlY3Rvci5zaGFyZSk7XG5cdFx0XHRbXS5mb3JFYWNoLmNhbGwoc2hhcmVOb2Rlcywgb3B0cy5jYi5zaGFyZSk7XG5cblx0XHRcdC8vIHRyaWdnZXIgY29tcGxldGVkIGV2ZW50XG5cdFx0XHRFdmVudHMudHJpZ2dlcihkb2N1bWVudCwgJ3NoYXJlLWxvYWRlZCcpO1xuXG5cdFx0XHQvLyBsb29wIHRocm91Z2ggY291bnQgbm9kZSBjb2xsZWN0aW9uXG5cdFx0XHRsZXQgY291bnROb2RlcyA9IG9wdHMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwob3B0cy5zZWxlY3Rvci5jb3VudCk7XG5cdFx0XHRbXS5mb3JFYWNoLmNhbGwoY291bnROb2Rlcywgb3B0cy5jYi5jb3VudCk7XG5cblx0XHRcdC8vIHRyaWdnZXIgY29tcGxldGVkIGV2ZW50XG5cdFx0XHRFdmVudHMudHJpZ2dlcihkb2N1bWVudCwgJ2NvdW50LWxvYWRlZCcpO1xuXHRcdH1cblx0fTtcbn1cblxuZnVuY3Rpb24gY2hlY2tBbmFseXRpY3MgKCkge1xuXHQvLyBjaGVjayBmb3IgYW5hbHl0aWNzXG5cdGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1vcGVuLXNoYXJlLWFuYWx5dGljc10nKSkge1xuXHRcdGNvbnN0IHByb3ZpZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtb3Blbi1zaGFyZS1hbmFseXRpY3NdJylcblx0XHRcdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1hbmFseXRpY3MnKTtcblxuXHRcdGlmIChwcm92aWRlci5pbmRleE9mKCcsJykgPiAtMSkge1xuXHRcdFx0Y29uc3QgcHJvdmlkZXJzID0gcHJvdmlkZXIuc3BsaXQoJywnKTtcblx0XHRcdHByb3ZpZGVycy5mb3JFYWNoKHAgPT4gYW5hbHl0aWNzKHApKTtcblx0XHR9IGVsc2UgYW5hbHl0aWNzKHByb3ZpZGVyKTtcblxuXHR9XG59XG4iLCJjb25zdCBTaGFyZVRyYW5zZm9ybXMgPSByZXF1aXJlKCcuLi9zcmMvbW9kdWxlcy9zaGFyZS10cmFuc2Zvcm1zJyk7XG5jb25zdCBPcGVuU2hhcmUgPSByZXF1aXJlKCcuLi9zcmMvbW9kdWxlcy9vcGVuLXNoYXJlJyk7XG5jb25zdCBzZXREYXRhID0gcmVxdWlyZSgnLi9zZXREYXRhJyk7XG5jb25zdCBzaGFyZSA9IHJlcXVpcmUoJy4vc2hhcmUnKTtcbmNvbnN0IGRhc2hUb0NhbWVsID0gcmVxdWlyZSgnLi9kYXNoVG9DYW1lbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRpYWxpemVTaGFyZU5vZGU7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVTaGFyZU5vZGUob3MpIHtcblx0Ly8gaW5pdGlhbGl6ZSBvcGVuIHNoYXJlIG9iamVjdCB3aXRoIHR5cGUgYXR0cmlidXRlXG5cdGxldCB0eXBlID0gb3MuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUnKSxcblx0XHRkYXNoID0gdHlwZS5pbmRleE9mKCctJyksXG5cdFx0b3BlblNoYXJlO1xuXG5cdGlmIChkYXNoID4gLTEpIHtcblx0XHR0eXBlID0gZGFzaFRvQ2FtZWwoZGFzaCwgdHlwZSk7XG5cdH1cblxuXHRsZXQgdHJhbnNmb3JtID0gU2hhcmVUcmFuc2Zvcm1zW3R5cGVdO1xuXG5cdGlmICghdHJhbnNmb3JtKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBPcGVuIFNoYXJlOiAke3R5cGV9IGlzIGFuIGludmFsaWQgdHlwZWApO1xuXHR9XG5cblx0b3BlblNoYXJlID0gbmV3IE9wZW5TaGFyZSh0eXBlLCB0cmFuc2Zvcm0pO1xuXG5cdC8vIHNwZWNpZnkgaWYgdGhpcyBpcyBhIGR5bmFtaWMgaW5zdGFuY2Vcblx0aWYgKG9zLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWR5bmFtaWMnKSkge1xuXHRcdG9wZW5TaGFyZS5keW5hbWljID0gdHJ1ZTtcblx0fVxuXG5cdC8vIHNwZWNpZnkgaWYgdGhpcyBpcyBhIHBvcHVwIGluc3RhbmNlXG5cdGlmIChvcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1wb3B1cCcpKSB7XG5cdFx0b3BlblNoYXJlLnBvcHVwID0gdHJ1ZTtcblx0fVxuXG5cdC8vIHNldCBhbGwgb3B0aW9uYWwgYXR0cmlidXRlcyBvbiBvcGVuIHNoYXJlIGluc3RhbmNlXG5cdHNldERhdGEob3BlblNoYXJlLCBvcyk7XG5cblx0Ly8gb3BlbiBzaGFyZSBkaWFsb2cgb24gY2xpY2tcblx0b3MuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXHRcdHNoYXJlKGUsIG9zLCBvcGVuU2hhcmUpO1xuXHR9KTtcblxuXHRvcy5hZGRFdmVudExpc3RlbmVyKCdPcGVuU2hhcmUudHJpZ2dlcicsIChlKSA9PiB7XG5cdFx0c2hhcmUoZSwgb3MsIG9wZW5TaGFyZSk7XG5cdH0pO1xuXG5cdG9zLnNldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLW5vZGUnLCB0eXBlKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gaW5pdGlhbGl6ZVdhdGNoZXI7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVXYXRjaGVyKHdhdGNoZXIsIGZuKSB7XG5cdFtdLmZvckVhY2guY2FsbCh3YXRjaGVyLCAodykgPT4ge1xuXHRcdHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcblx0XHRcdC8vIHRhcmdldCB3aWxsIG1hdGNoIGJldHdlZW4gYWxsIG11dGF0aW9ucyBzbyBqdXN0IHVzZSBmaXJzdFxuXHRcdFx0Zm4obXV0YXRpb25zWzBdLnRhcmdldCk7XG5cdFx0fSk7XG5cblx0XHRvYnNlcnZlci5vYnNlcnZlKHcsIHtcblx0XHRcdGNoaWxkTGlzdDogdHJ1ZVxuXHRcdH0pO1xuXHR9KTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gc2V0RGF0YTtcblxuZnVuY3Rpb24gc2V0RGF0YShvc0luc3RhbmNlLCBvc0VsZW1lbnQpIHtcblx0b3NJbnN0YW5jZS5zZXREYXRhKHtcblx0XHR1cmw6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS11cmwnKSxcblx0XHR0ZXh0OiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtdGV4dCcpLFxuXHRcdHZpYTogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXZpYScpLFxuXHRcdGhhc2h0YWdzOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtaGFzaHRhZ3MnKSxcblx0XHR0d2VldElkOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtdHdlZXQtaWQnKSxcblx0XHRyZWxhdGVkOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtcmVsYXRlZCcpLFxuXHRcdHNjcmVlbk5hbWU6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1zY3JlZW4tbmFtZScpLFxuXHRcdHVzZXJJZDogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXVzZXItaWQnKSxcblx0XHRsaW5rOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtbGluaycpLFxuXHRcdHBpY3R1cmU6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1waWN0dXJlJyksXG5cdFx0Y2FwdGlvbjogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWNhcHRpb24nKSxcblx0XHRkZXNjcmlwdGlvbjogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWRlc2NyaXB0aW9uJyksXG5cdFx0dXNlcjogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXVzZXInKSxcblx0XHR2aWRlbzogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXZpZGVvJyksXG5cdFx0dXNlcm5hbWU6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS11c2VybmFtZScpLFxuXHRcdHRpdGxlOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtdGl0bGUnKSxcblx0XHRtZWRpYTogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLW1lZGlhJyksXG5cdFx0dG86IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS10bycpLFxuXHRcdHN1YmplY3Q6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1zdWJqZWN0JyksXG5cdFx0Ym9keTogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWJvZHknKSxcblx0XHRpb3M6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1pb3MnKSxcblx0XHR0eXBlOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtdHlwZScpLFxuXHRcdGNlbnRlcjogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWNlbnRlcicpLFxuXHRcdHZpZXdzOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtdmlld3MnKSxcblx0XHR6b29tOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtem9vbScpLFxuXHRcdHNlYXJjaDogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXNlYXJjaCcpLFxuXHRcdHNhZGRyOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtc2FkZHInKSxcblx0XHRkYWRkcjogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWRhZGRyJyksXG5cdFx0ZGlyZWN0aW9uc21vZGU6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1kaXJlY3Rpb25zLW1vZGUnKSxcblx0XHRyZXBvOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtcmVwbycpLFxuXHRcdHNob3Q6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1zaG90JyksXG5cdFx0cGVuOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtcGVuJyksXG5cdFx0dmlldzogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXZpZXcnKSxcblx0XHRpc3N1ZTogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWlzc3VlJyksXG5cdFx0YnV0dG9uSWQ6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1idXR0b25JZCcpLFxuXHRcdHBvcFVwOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtcG9wdXAnKVxuXHR9KTtcbn1cbiIsImNvbnN0IEV2ZW50cyA9IHJlcXVpcmUoJy4uL3NyYy9tb2R1bGVzL2V2ZW50cycpO1xuY29uc3Qgc2V0RGF0YSA9IHJlcXVpcmUoJy4vc2V0RGF0YScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNoYXJlO1xuXG5mdW5jdGlvbiBzaGFyZShlLCBvcywgb3BlblNoYXJlKSB7XG5cdC8vIGlmIGR5bmFtaWMgaW5zdGFuY2UgdGhlbiBmZXRjaCBhdHRyaWJ1dGVzIGFnYWluIGluIGNhc2Ugb2YgdXBkYXRlc1xuXHRpZiAob3BlblNoYXJlLmR5bmFtaWMpIHtcblx0XHRzZXREYXRhKG9wZW5TaGFyZSwgb3MpO1xuXHR9XG5cblx0b3BlblNoYXJlLnNoYXJlKGUpO1xuXG5cdC8vIHRyaWdnZXIgc2hhcmVkIGV2ZW50XG5cdEV2ZW50cy50cmlnZ2VyKG9zLCAnc2hhcmVkJyk7XG59XG4iLCIvKlxuICAgU29tZXRpbWVzIHNvY2lhbCBwbGF0Zm9ybXMgZ2V0IGNvbmZ1c2VkIGFuZCBkcm9wIHNoYXJlIGNvdW50cy5cbiAgIEluIHRoaXMgbW9kdWxlIHdlIGNoZWNrIGlmIHRoZSByZXR1cm5lZCBjb3VudCBpcyBsZXNzIHRoYW4gdGhlIGNvdW50IGluXG4gICBsb2NhbHN0b3JhZ2UuXG4gICBJZiB0aGUgbG9jYWwgY291bnQgaXMgZ3JlYXRlciB0aGFuIHRoZSByZXR1cm5lZCBjb3VudCxcbiAgIHdlIHN0b3JlIHRoZSBsb2NhbCBjb3VudCArIHRoZSByZXR1cm5lZCBjb3VudC5cbiAgIE90aGVyd2lzZSwgc3RvcmUgdGhlIHJldHVybmVkIGNvdW50LlxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSAodCwgY291bnQpID0+IHtcblx0Y29uc3QgaXNBcnIgPSB0LnR5cGUuaW5kZXhPZignLCcpID4gLTE7XG5cdGNvbnN0IGxvY2FsID0gTnVtYmVyKHQuc3RvcmVHZXQodC50eXBlICsgJy0nICsgdC5zaGFyZWQpKTtcblxuXHRpZiAobG9jYWwgPiBjb3VudCAmJiAhaXNBcnIpIHtcblx0XHRjb25zdCBsYXRlc3RDb3VudCA9IE51bWJlcih0LnN0b3JlR2V0KHQudHlwZSArICctJyArIHQuc2hhcmVkICsgJy1sYXRlc3RDb3VudCcpKTtcblx0XHR0LnN0b3JlU2V0KHQudHlwZSArICctJyArIHQuc2hhcmVkICsgJy1sYXRlc3RDb3VudCcsIGNvdW50KTtcblxuXHRcdGNvdW50ID0gaXNOdW1lcmljKGxhdGVzdENvdW50KSAmJiBsYXRlc3RDb3VudCA+IDAgP1xuXHRcdFx0Y291bnQgKz0gbG9jYWwgLSBsYXRlc3RDb3VudCA6XG5cdFx0XHRjb3VudCArPSBsb2NhbDtcblxuXHR9XG5cblx0aWYgKCFpc0FycikgdC5zdG9yZVNldCh0LnR5cGUgKyAnLScgKyB0LnNoYXJlZCwgY291bnQpO1xuXHRyZXR1cm4gY291bnQ7XG59O1xuXG5mdW5jdGlvbiBpc051bWVyaWMobikge1xuICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCByZXF1aXJlKCcuL2xpYi9pbml0Jykoe1xuXHRcdGFwaTogJ3NoYXJlJyxcblx0XHRzZWxlY3RvcjogJ1tkYXRhLW9wZW4tc2hhcmVdOm5vdChbZGF0YS1vcGVuLXNoYXJlLW5vZGVdKScsXG5cdFx0Y2I6IHJlcXVpcmUoJy4vbGliL2luaXRpYWxpemVTaGFyZU5vZGUnKVxuXHR9KSk7XG5cblx0cmV0dXJuIHJlcXVpcmUoJy4vc3JjL21vZHVsZXMvc2hhcmUtYXBpJykoKTtcbn0pKCk7XG4iLCIvKipcbiAqIGNvdW50IEFQSVxuICovXG5cbnZhciBjb3VudCA9IHJlcXVpcmUoJy4vY291bnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblxuXHQvLyBnbG9iYWwgT3BlblNoYXJlIHJlZmVyZW5jaW5nIGludGVybmFsIGNsYXNzIGZvciBpbnN0YW5jZSBnZW5lcmF0aW9uXG5cdGNsYXNzIENvdW50IHtcblxuXHRcdGNvbnN0cnVjdG9yKHtcblx0XHRcdHR5cGUsXG5cdFx0XHR1cmwsXG5cdFx0XHRhcHBlbmRUbyA9IGZhbHNlLFxuXHRcdFx0ZWxlbWVudCxcblx0XHRcdGNsYXNzZXN9LCBjYikge1xuXHRcdFx0dmFyIGNvdW50Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudCB8fCAnc3BhbicpO1xuXG5cdFx0XHRjb3VudE5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtY291bnQnLCB0eXBlKTtcblx0XHRcdGNvdW50Tm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1jb3VudC11cmwnLCB1cmwpO1xuXG5cdFx0XHRjb3VudE5vZGUuY2xhc3NMaXN0LmFkZCgnb3Blbi1zaGFyZS1jb3VudCcpO1xuXG5cdFx0XHRpZiAoY2xhc3NlcyAmJiBBcnJheS5pc0FycmF5KGNsYXNzZXMpKSB7XG5cdFx0XHRcdGNsYXNzZXMuZm9yRWFjaChjc3NDTGFzcyA9PiB7XG5cdFx0XHRcdFx0Y291bnROb2RlLmNsYXNzTGlzdC5hZGQoY3NzQ0xhc3MpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGFwcGVuZFRvKSB7XG5cdFx0XHRcdHJldHVybiBuZXcgY291bnQodHlwZSwgdXJsKS5jb3VudChjb3VudE5vZGUsIGNiLCBhcHBlbmRUbyk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBuZXcgY291bnQodHlwZSwgdXJsKS5jb3VudChjb3VudE5vZGUsIGNiKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gQ291bnQ7XG59O1xuIiwiY29uc3QgY291bnRSZWR1Y2UgPSByZXF1aXJlKCcuLi8uLi9saWIvY291bnRSZWR1Y2UnKTtcbmNvbnN0IHN0b3JlQ291bnQgPSByZXF1aXJlKCcuLi8uLi9saWIvc3RvcmVDb3VudCcpO1xuXG4vKipcbiAqIE9iamVjdCBvZiB0cmFuc2Zvcm0gZnVuY3Rpb25zIGZvciBlYWNoIG9wZW5zaGFyZSBhcGlcbiAqIFRyYW5zZm9ybSBmdW5jdGlvbnMgcGFzc2VkIGludG8gT3BlblNoYXJlIGluc3RhbmNlIHdoZW4gaW5zdGFudGlhdGVkXG4gKiBSZXR1cm4gb2JqZWN0IGNvbnRhaW5pbmcgVVJMIGFuZCBrZXkvdmFsdWUgYXJnc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuXHQvLyBmYWNlYm9vayBjb3VudCBkYXRhXG5cdGZhY2Vib29rICh1cmwpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogJ2dldCcsXG5cdFx0XHR1cmw6IGAvL2dyYXBoLmZhY2Vib29rLmNvbS8/aWQ9JHt1cmx9YCxcblx0XHRcdHRyYW5zZm9ybTogZnVuY3Rpb24oeGhyKSB7XG5cdFx0XHRcdGxldCBjb3VudCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuc2hhcmVzO1xuXHRcdFx0XHRyZXR1cm4gc3RvcmVDb3VudCh0aGlzLCBjb3VudCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSxcblxuXHQvLyBwaW50ZXJlc3QgY291bnQgZGF0YVxuXHRwaW50ZXJlc3QgKHVybCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0eXBlOiAnanNvbnAnLFxuXHRcdFx0dXJsOiBgLy9hcGkucGludGVyZXN0LmNvbS92MS91cmxzL2NvdW50Lmpzb24/Y2FsbGJhY2s9PyZ1cmw9JHt1cmx9YCxcblx0XHRcdHRyYW5zZm9ybTogZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRsZXQgY291bnQgPSBkYXRhLmNvdW50O1xuXHRcdFx0XHRyZXR1cm4gc3RvcmVDb3VudCh0aGlzLCBjb3VudCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSxcblxuXHQvLyBsaW5rZWRpbiBjb3VudCBkYXRhXG5cdGxpbmtlZGluICh1cmwpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogJ2pzb25wJyxcblx0XHRcdHVybDogYC8vd3d3LmxpbmtlZGluLmNvbS9jb3VudHNlcnYvY291bnQvc2hhcmU/dXJsPSR7dXJsfSZmb3JtYXQ9anNvbnAmY2FsbGJhY2s9P2AsXG5cdFx0XHR0cmFuc2Zvcm06IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0bGV0IGNvdW50ID0gZGF0YS5jb3VudDtcblx0XHRcdFx0cmV0dXJuIHN0b3JlQ291bnQodGhpcywgY291bnQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0Ly8gcmVkZGl0IGNvdW50IGRhdGFcblx0cmVkZGl0ICh1cmwpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogJ2dldCcsXG5cdFx0XHR1cmw6IGAvL3d3dy5yZWRkaXQuY29tL2FwaS9pbmZvLmpzb24/dXJsPSR7dXJsfWAsXG5cdFx0XHR0cmFuc2Zvcm06IGZ1bmN0aW9uKHhocikge1xuXHRcdFx0XHRsZXQgcG9zdHMgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpLmRhdGEuY2hpbGRyZW4sXG5cdFx0XHRcdFx0dXBzID0gMDtcblxuXHRcdFx0XHRwb3N0cy5mb3JFYWNoKChwb3N0KSA9PiB7XG5cdFx0XHRcdFx0dXBzICs9IE51bWJlcihwb3N0LmRhdGEudXBzKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuIHN0b3JlQ291bnQodGhpcywgdXBzKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9LFxuXG5cdC8vIGdvb2dsZSBjb3VudCBkYXRhXG5cdGdvb2dsZSAodXJsKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHR5cGU6ICdwb3N0Jyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0bWV0aG9kOiAncG9zLnBsdXNvbmVzLmdldCcsXG5cdFx0XHRcdGlkOiAncCcsXG5cdFx0XHRcdHBhcmFtczoge1xuXHRcdFx0XHRcdG5vbG9nOiB0cnVlLFxuXHRcdFx0XHRcdGlkOiB1cmwsXG5cdFx0XHRcdFx0c291cmNlOiAnd2lkZ2V0Jyxcblx0XHRcdFx0XHR1c2VySWQ6ICdAdmlld2VyJyxcblx0XHRcdFx0XHRncm91cElkOiAnQHNlbGYnXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGpzb25ycGM6ICcyLjAnLFxuXHRcdFx0XHRrZXk6ICdwJyxcblx0XHRcdFx0YXBpVmVyc2lvbjogJ3YxJ1xuXHRcdFx0fSxcblx0XHRcdHVybDogYGh0dHBzOi8vY2xpZW50czYuZ29vZ2xlLmNvbS9ycGNgLFxuXHRcdFx0dHJhbnNmb3JtOiBmdW5jdGlvbih4aHIpIHtcblx0XHRcdFx0bGV0IGNvdW50ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS5yZXN1bHQubWV0YWRhdGEuZ2xvYmFsQ291bnRzLmNvdW50O1xuXHRcdFx0XHRyZXR1cm4gc3RvcmVDb3VudCh0aGlzLCBjb3VudCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fSxcblxuXHQvLyBnaXRodWIgc3RhciBjb3VudFxuXHRnaXRodWJTdGFycyAocmVwbykge1xuXHRcdHJlcG8gPSByZXBvLmluZGV4T2YoJ2dpdGh1Yi5jb20vJykgPiAtMSA/XG5cdFx0XHRyZXBvLnNwbGl0KCdnaXRodWIuY29tLycpWzFdIDpcblx0XHRcdHJlcG87XG5cdFx0cmV0dXJuIHtcblx0XHRcdHR5cGU6ICdnZXQnLFxuXHRcdFx0dXJsOiBgLy9hcGkuZ2l0aHViLmNvbS9yZXBvcy8ke3JlcG99YCxcblx0XHRcdHRyYW5zZm9ybTogZnVuY3Rpb24oeGhyKSB7XG5cdFx0XHRcdGxldCBjb3VudCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuc3RhcmdhemVyc19jb3VudDtcblx0XHRcdFx0cmV0dXJuIHN0b3JlQ291bnQodGhpcywgY291bnQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0Ly8gZ2l0aHViIGZvcmtzIGNvdW50XG5cdGdpdGh1YkZvcmtzIChyZXBvKSB7XG5cdFx0cmVwbyA9IHJlcG8uaW5kZXhPZignZ2l0aHViLmNvbS8nKSA+IC0xID9cblx0XHRcdHJlcG8uc3BsaXQoJ2dpdGh1Yi5jb20vJylbMV0gOlxuXHRcdFx0cmVwbztcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogJ2dldCcsXG5cdFx0XHR1cmw6IGAvL2FwaS5naXRodWIuY29tL3JlcG9zLyR7cmVwb31gLFxuXHRcdFx0dHJhbnNmb3JtOiBmdW5jdGlvbih4aHIpIHtcblx0XHRcdFx0bGV0IGNvdW50ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS5mb3Jrc19jb3VudDtcblx0XHRcdFx0cmV0dXJuIHN0b3JlQ291bnQodGhpcywgY291bnQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0Ly8gZ2l0aHViIHdhdGNoZXJzIGNvdW50XG5cdGdpdGh1YldhdGNoZXJzIChyZXBvKSB7XG5cdFx0cmVwbyA9IHJlcG8uaW5kZXhPZignZ2l0aHViLmNvbS8nKSA+IC0xID9cblx0XHRcdHJlcG8uc3BsaXQoJ2dpdGh1Yi5jb20vJylbMV0gOlxuXHRcdFx0cmVwbztcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogJ2dldCcsXG5cdFx0XHR1cmw6IGAvL2FwaS5naXRodWIuY29tL3JlcG9zLyR7cmVwb31gLFxuXHRcdFx0dHJhbnNmb3JtOiBmdW5jdGlvbih4aHIpIHtcblx0XHRcdFx0bGV0IGNvdW50ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS53YXRjaGVyc19jb3VudDtcblx0XHRcdFx0cmV0dXJuIHN0b3JlQ291bnQodGhpcywgY291bnQpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0Ly8gZHJpYmJibGUgbGlrZXMgY291bnRcblx0ZHJpYmJibGUgKHNob3QpIHtcblx0XHRzaG90ID0gc2hvdC5pbmRleE9mKCdkcmliYmJsZS5jb20vc2hvdHMnKSA+IC0xID9cblx0XHRcdHNob3Quc3BsaXQoJ3Nob3RzLycpWzFdIDpcblx0XHRcdHNob3Q7XG5cdFx0Y29uc3QgdXJsID0gYGh0dHBzOi8vYXBpLmRyaWJiYmxlLmNvbS92MS9zaG90cy8ke3Nob3R9L2xpa2VzYDtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogJ2dldCcsXG5cdFx0XHR1cmw6IHVybCxcblx0XHRcdHRyYW5zZm9ybTogZnVuY3Rpb24oeGhyLCBFdmVudHMpIHtcblx0XHRcdFx0bGV0IGNvdW50ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS5sZW5ndGg7XG5cblx0XHRcdFx0Ly8gYXQgdGhpcyB0aW1lIGRyaWJiYmxlIGxpbWl0cyBhIHJlc3BvbnNlIG9mIDEyIGxpa2VzIHBlciBwYWdlXG5cdFx0XHRcdGlmIChjb3VudCA9PT0gMTIpIHtcblx0XHRcdFx0XHRsZXQgcGFnZSA9IDI7XG5cdFx0XHRcdFx0cmVjdXJzaXZlQ291bnQodXJsLCBwYWdlLCBjb3VudCwgZmluYWxDb3VudCA9PiB7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5hcHBlbmRUbyAmJiB0eXBlb2YgdGhpcy5hcHBlbmRUbyAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmFwcGVuZFRvLmFwcGVuZENoaWxkKHRoaXMub3MpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y291bnRSZWR1Y2UodGhpcy5vcywgZmluYWxDb3VudCwgdGhpcy5jYik7XG5cdFx0XHRcdFx0XHRFdmVudHMudHJpZ2dlcih0aGlzLm9zLCAnY291bnRlZC0nICsgdGhpcy51cmwpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHN0b3JlQ291bnQodGhpcywgZmluYWxDb3VudCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIHN0b3JlQ291bnQodGhpcywgY291bnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0fSxcblxuXHR0d2l0dGVyICh1cmwpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dHlwZTogJ2dldCcsXG5cdFx0XHR1cmw6IGAvL2FwaS5vcGVuc2hhcmUuc29jaWFsL2pvYj91cmw9JHt1cmx9YCxcblx0XHRcdHRyYW5zZm9ybTogZnVuY3Rpb24oeGhyKSB7XG5cdFx0XHRcdGxldCBjb3VudCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuY291bnQ7XG5cdFx0XHRcdHJldHVybiBzdG9yZUNvdW50KHRoaXMsIGNvdW50KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG59O1xuXG5mdW5jdGlvbiByZWN1cnNpdmVDb3VudCAodXJsLCBwYWdlLCBjb3VudCwgY2IpIHtcblx0Y29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdHhoci5vcGVuKCdHRVQnLCB1cmwgKyAnP3BhZ2U9JyArIHBhZ2UpO1xuXHR4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcblx0XHRjb25zdCBsaWtlcyA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZSk7XG5cdFx0Y291bnQgKz0gbGlrZXMubGVuZ3RoO1xuXG5cdFx0Ly8gZHJpYmJibGUgbGlrZSBwZXIgcGFnZSBpcyAxMlxuXHRcdGlmIChsaWtlcy5sZW5ndGggPT09IDEyKSB7XG5cdFx0XHRwYWdlKys7XG5cdFx0XHRyZWN1cnNpdmVDb3VudCh1cmwsIHBhZ2UsIGNvdW50LCBjYik7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Y2IoY291bnQpO1xuXHRcdH1cblx0fSk7XG5cdHhoci5zZW5kKCk7XG59XG4iLCIvKipcbiAqIEdlbmVyYXRlIHNoYXJlIGNvdW50IGluc3RhbmNlIGZyb20gb25lIHRvIG1hbnkgbmV0d29ya3NcbiAqL1xuXG5jb25zdCBDb3VudFRyYW5zZm9ybXMgPSByZXF1aXJlKCcuL2NvdW50LXRyYW5zZm9ybXMnKTtcbmNvbnN0IEV2ZW50cyA9IHJlcXVpcmUoJy4vZXZlbnRzJyk7XG5jb25zdCBjb3VudFJlZHVjZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9jb3VudFJlZHVjZScpO1xuY29uc3Qgc3RvcmVDb3VudCA9IHJlcXVpcmUoJy4uLy4uL2xpYi9zdG9yZUNvdW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ291bnQge1xuXG5cdGNvbnN0cnVjdG9yKHR5cGUsIHVybCkge1xuXG5cdFx0Ly8gdGhyb3cgZXJyb3IgaWYgbm8gdXJsIHByb3ZpZGVkXG5cdFx0aWYgKCF1cmwpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgT3BlbiBTaGFyZTogbm8gdXJsIHByb3ZpZGVkIGZvciBjb3VudGApO1xuXHRcdH1cblxuXHRcdC8vIGNoZWNrIGZvciBHaXRodWIgY291bnRzXG5cdFx0aWYgKHR5cGUuaW5kZXhPZignZ2l0aHViJykgPT09IDApIHtcblx0XHRcdGlmICh0eXBlID09PSAnZ2l0aHViLXN0YXJzJykge1xuXHRcdFx0XHR0eXBlID0gJ2dpdGh1YlN0YXJzJztcblx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gJ2dpdGh1Yi1mb3JrcycpIHtcblx0XHRcdFx0dHlwZSA9ICdnaXRodWJGb3Jrcyc7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT09ICdnaXRodWItd2F0Y2hlcnMnKSB7XG5cdFx0XHRcdHR5cGUgPSAnZ2l0aHViV2F0Y2hlcnMnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcignSW52YWxpZCBHaXRodWIgY291bnQgdHlwZS4gVHJ5IGdpdGh1Yi1zdGFycywgZ2l0aHViLWZvcmtzLCBvciBnaXRodWItd2F0Y2hlcnMuJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gaWYgdHlwZSBpcyBjb21tYSBzZXBhcmF0ZSBsaXN0IGNyZWF0ZSBhcnJheVxuXHRcdGlmICh0eXBlLmluZGV4T2YoJywnKSA+IC0xKSB7XG5cdFx0XHR0aGlzLnR5cGUgPSB0eXBlO1xuXHRcdFx0dGhpcy50eXBlQXJyID0gdGhpcy50eXBlLnNwbGl0KCcsJyk7XG5cdFx0XHR0aGlzLmNvdW50RGF0YSA9IFtdO1xuXG5cdFx0XHQvLyBjaGVjayBlYWNoIHR5cGUgc3VwcGxpZWQgaXMgdmFsaWRcblx0XHRcdHRoaXMudHlwZUFyci5mb3JFYWNoKCh0KSA9PiB7XG5cdFx0XHRcdGlmICghQ291bnRUcmFuc2Zvcm1zW3RdKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBPcGVuIFNoYXJlOiAke3R5cGV9IGlzIGFuIGludmFsaWQgY291bnQgdHlwZWApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5jb3VudERhdGEucHVzaChDb3VudFRyYW5zZm9ybXNbdF0odXJsKSk7XG5cdFx0XHR9KTtcblxuXHRcdC8vIHRocm93IGVycm9yIGlmIGludmFsaWQgdHlwZSBwcm92aWRlZFxuXHRcdH0gZWxzZSBpZiAoIUNvdW50VHJhbnNmb3Jtc1t0eXBlXSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBPcGVuIFNoYXJlOiAke3R5cGV9IGlzIGFuIGludmFsaWQgY291bnQgdHlwZWApO1xuXG5cdFx0Ly8gc2luZ2xlIGNvdW50XG5cdFx0Ly8gc3RvcmUgY291bnQgVVJMIGFuZCB0cmFuc2Zvcm0gZnVuY3Rpb25cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy50eXBlID0gdHlwZTtcblx0XHRcdHRoaXMuY291bnREYXRhID0gQ291bnRUcmFuc2Zvcm1zW3R5cGVdKHVybCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gaGFuZGxlIGNhbGxpbmcgZ2V0Q291bnQgLyBnZXRDb3VudHNcblx0Ly8gZGVwZW5kaW5nIG9uIG51bWJlciBvZiB0eXBlc1xuXHRjb3VudChvcywgY2IsIGFwcGVuZFRvKSB7XG5cdFx0dGhpcy5vcyA9IG9zO1xuXHRcdHRoaXMuYXBwZW5kVG8gPSBhcHBlbmRUbztcblx0XHR0aGlzLmNiID0gY2I7XG4gICAgXHR0aGlzLnVybCA9IHRoaXMub3MuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtY291bnQnKTtcblx0XHR0aGlzLnNoYXJlZCA9IHRoaXMub3MuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtY291bnQtdXJsJyk7XG5cblx0XHRpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5jb3VudERhdGEpKSB7XG5cdFx0XHR0aGlzLmdldENvdW50KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZ2V0Q291bnRzKCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gZmV0Y2ggY291bnQgZWl0aGVyIEFKQVggb3IgSlNPTlBcblx0Z2V0Q291bnQoKSB7XG5cdFx0dmFyIGNvdW50ID0gdGhpcy5zdG9yZUdldCh0aGlzLnR5cGUgKyAnLScgKyB0aGlzLnNoYXJlZCk7XG5cblx0XHRpZiAoY291bnQpIHtcblx0XHRcdGlmICh0aGlzLmFwcGVuZFRvICYmIHR5cGVvZiB0aGlzLmFwcGVuZFRvICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRoaXMuYXBwZW5kVG8uYXBwZW5kQ2hpbGQodGhpcy5vcyk7XG5cdFx0XHR9XG5cdFx0XHRjb3VudFJlZHVjZSh0aGlzLm9zLCBjb3VudCk7XG5cdFx0fVxuXHRcdHRoaXNbdGhpcy5jb3VudERhdGEudHlwZV0odGhpcy5jb3VudERhdGEpO1xuXHR9XG5cblx0Ly8gZmV0Y2ggbXVsdGlwbGUgY291bnRzIGFuZCBhZ2dyZWdhdGVcblx0Z2V0Q291bnRzKCkge1xuXHRcdHRoaXMudG90YWwgPSBbXTtcblxuXHRcdHZhciBjb3VudCA9IHRoaXMuc3RvcmVHZXQodGhpcy50eXBlICsgJy0nICsgdGhpcy5zaGFyZWQpO1xuXG5cdFx0aWYgKGNvdW50KSB7XG5cdFx0XHRpZiAodGhpcy5hcHBlbmRUbyAgJiYgdHlwZW9mIHRoaXMuYXBwZW5kVG8gIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0dGhpcy5hcHBlbmRUby5hcHBlbmRDaGlsZCh0aGlzLm9zKTtcblx0XHRcdH1cblx0XHRcdGNvdW50UmVkdWNlKHRoaXMub3MsIGNvdW50KTtcblx0XHR9XG5cblx0XHR0aGlzLmNvdW50RGF0YS5mb3JFYWNoKGNvdW50RGF0YSA9PiB7XG5cblx0XHRcdHRoaXNbY291bnREYXRhLnR5cGVdKGNvdW50RGF0YSwgKG51bSkgPT4ge1xuXHRcdFx0XHR0aGlzLnRvdGFsLnB1c2gobnVtKTtcblxuXHRcdFx0XHQvLyB0b3RhbCBjb3VudHMgbGVuZ3RoIG5vdyBlcXVhbHMgdHlwZSBhcnJheSBsZW5ndGhcblx0XHRcdFx0Ly8gc28gYWdncmVnYXRlLCBzdG9yZSBhbmQgaW5zZXJ0IGludG8gRE9NXG5cdFx0XHRcdGlmICh0aGlzLnRvdGFsLmxlbmd0aCA9PT0gdGhpcy50eXBlQXJyLmxlbmd0aCkge1xuXHRcdFx0XHRcdGxldCB0b3QgPSAwO1xuXG5cdFx0XHRcdFx0dGhpcy50b3RhbC5mb3JFYWNoKCh0KSA9PiB7XG5cdFx0XHRcdFx0XHR0b3QgKz0gdDtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLmFwcGVuZFRvICAmJiB0eXBlb2YgdGhpcy5hcHBlbmRUbyAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0dGhpcy5hcHBlbmRUby5hcHBlbmRDaGlsZCh0aGlzLm9zKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zdCBsb2NhbCA9IE51bWJlcih0aGlzLnN0b3JlR2V0KHRoaXMudHlwZSArICctJyArIHRoaXMuc2hhcmVkKSk7XG5cdFx0XHRcdFx0aWYgKGxvY2FsID4gdG90KSB7XG5cdFx0XHRcdFx0XHRjb25zdCBsYXRlc3RDb3VudCA9IE51bWJlcih0aGlzLnN0b3JlR2V0KHRoaXMudHlwZSArICctJyArIHRoaXMuc2hhcmVkICsgJy1sYXRlc3RDb3VudCcpKTtcblx0XHRcdFx0XHRcdHRoaXMuc3RvcmVTZXQodGhpcy50eXBlICsgJy0nICsgdGhpcy5zaGFyZWQgKyAnLWxhdGVzdENvdW50JywgdG90KTtcblxuXHRcdFx0XHRcdFx0dG90ID0gaXNOdW1lcmljKGxhdGVzdENvdW50KSAmJiBsYXRlc3RDb3VudCA+IDAgP1xuXHRcdFx0XHRcdFx0XHR0b3QgKz0gbG9jYWwgLSBsYXRlc3RDb3VudCA6XG5cdFx0XHRcdFx0XHRcdHRvdCArPSBsb2NhbDtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLnN0b3JlU2V0KHRoaXMudHlwZSArICctJyArIHRoaXMuc2hhcmVkLCB0b3QpO1xuXG5cdFx0XHRcdFx0Y291bnRSZWR1Y2UodGhpcy5vcywgdG90KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRpZiAodGhpcy5hcHBlbmRUbyAgJiYgdHlwZW9mIHRoaXMuYXBwZW5kVG8gIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHRoaXMuYXBwZW5kVG8uYXBwZW5kQ2hpbGQodGhpcy5vcyk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gaGFuZGxlIEpTT05QIHJlcXVlc3RzXG5cdGpzb25wKGNvdW50RGF0YSwgY2IpIHtcblx0XHQvLyBkZWZpbmUgcmFuZG9tIGNhbGxiYWNrIGFuZCBhc3NpZ24gdHJhbnNmb3JtIGZ1bmN0aW9uXG5cdFx0bGV0IGNhbGxiYWNrID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDcpLnJlcGxhY2UoL1teYS16QS1aXS9nLCAnJyk7XG5cdFx0d2luZG93W2NhbGxiYWNrXSA9IChkYXRhKSA9PiB7XG5cdFx0XHRsZXQgY291bnQgPSBjb3VudERhdGEudHJhbnNmb3JtLmFwcGx5KHRoaXMsIFtkYXRhXSkgfHwgMDtcblxuXHRcdFx0aWYgKGNiICYmIHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRjYihjb3VudCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAodGhpcy5hcHBlbmRUbyAgJiYgdHlwZW9mIHRoaXMuYXBwZW5kVG8gIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHR0aGlzLmFwcGVuZFRvLmFwcGVuZENoaWxkKHRoaXMub3MpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvdW50UmVkdWNlKHRoaXMub3MsIGNvdW50LCB0aGlzLmNiKTtcblx0XHRcdH1cblxuXHRcdFx0RXZlbnRzLnRyaWdnZXIodGhpcy5vcywgJ2NvdW50ZWQtJyArIHRoaXMudXJsKTtcblx0XHR9O1xuXG5cdFx0Ly8gYXBwZW5kIEpTT05QIHNjcmlwdCB0YWcgdG8gcGFnZVxuXHRcdGxldCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRzY3JpcHQuc3JjID0gY291bnREYXRhLnVybC5yZXBsYWNlKCdjYWxsYmFjaz0/JywgYGNhbGxiYWNrPSR7Y2FsbGJhY2t9YCk7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gaGFuZGxlIEFKQVggR0VUIHJlcXVlc3Rcblx0Z2V0KGNvdW50RGF0YSwgY2IpIHtcblx0XHRsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cblx0XHQvLyBvbiBzdWNjZXNzIHBhc3MgcmVzcG9uc2UgdG8gdHJhbnNmb3JtIGZ1bmN0aW9uXG5cdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcblx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuXHRcdFx0XHRpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdFx0bGV0IGNvdW50ID0gY291bnREYXRhLnRyYW5zZm9ybS5hcHBseSh0aGlzLCBbeGhyLCBFdmVudHNdKSB8fCAwO1xuXG5cdFx0XHRcdFx0aWYgKGNiICYmIHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0Y2IoY291bnQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5hcHBlbmRUbyAmJiB0eXBlb2YgdGhpcy5hcHBlbmRUbyAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmFwcGVuZFRvLmFwcGVuZENoaWxkKHRoaXMub3MpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y291bnRSZWR1Y2UodGhpcy5vcywgY291bnQsIHRoaXMuY2IpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdEV2ZW50cy50cmlnZ2VyKHRoaXMub3MsICdjb3VudGVkLScgKyB0aGlzLnVybCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcignRmFpbGVkIHRvIGdldCBBUEkgZGF0YSBmcm9tJywgY291bnREYXRhLnVybCwgJy4gUGxlYXNlIHVzZSB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgT3BlblNoYXJlLicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHhoci5vcGVuKCdHRVQnLCBjb3VudERhdGEudXJsKTtcblx0XHR4aHIuc2VuZCgpO1xuXHR9XG5cblx0Ly8gaGFuZGxlIEFKQVggUE9TVCByZXF1ZXN0XG5cdHBvc3QoY291bnREYXRhLCBjYikge1xuXHRcdGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuXHRcdC8vIG9uIHN1Y2Nlc3MgcGFzcyByZXNwb25zZSB0byB0cmFuc2Zvcm0gZnVuY3Rpb25cblx0XHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuXHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlICE9PSBYTUxIdHRwUmVxdWVzdC5ET05FIHx8XG5cdFx0XHRcdHhoci5zdGF0dXMgIT09IDIwMCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBjb3VudCA9IGNvdW50RGF0YS50cmFuc2Zvcm0uYXBwbHkodGhpcywgW3hocl0pIHx8IDA7XG5cblx0XHRcdGlmIChjYiAmJiB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0Y2IoY291bnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHRoaXMuYXBwZW5kVG8gJiYgdHlwZW9mIHRoaXMuYXBwZW5kVG8gIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHR0aGlzLmFwcGVuZFRvLmFwcGVuZENoaWxkKHRoaXMub3MpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvdW50UmVkdWNlKHRoaXMub3MsIGNvdW50LCB0aGlzLmNiKTtcblx0XHRcdH1cblx0XHRcdEV2ZW50cy50cmlnZ2VyKHRoaXMub3MsICdjb3VudGVkLScgKyB0aGlzLnVybCk7XG5cdFx0fTtcblxuXHRcdHhoci5vcGVuKCdQT1NUJywgY291bnREYXRhLnVybCk7XG5cdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnKTtcblx0XHR4aHIuc2VuZChKU09OLnN0cmluZ2lmeShjb3VudERhdGEuZGF0YSkpO1xuXHR9XG5cblx0c3RvcmVTZXQodHlwZSwgY291bnQgPSAwKSB7XG5cdFx0aWYgKCF3aW5kb3cubG9jYWxTdG9yYWdlIHx8ICF0eXBlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oYE9wZW5TaGFyZS0ke3R5cGV9YCwgY291bnQpO1xuXHR9XG5cblx0c3RvcmVHZXQodHlwZSkge1xuXHRcdGlmICghd2luZG93LmxvY2FsU3RvcmFnZSB8fCAhdHlwZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgT3BlblNoYXJlLSR7dHlwZX1gKTtcblx0fVxuXG59O1xuXG5mdW5jdGlvbiBpc051bWVyaWMobikge1xuICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xufVxuIiwiLyoqXG4gKiBUcmlnZ2VyIGN1c3RvbSBPcGVuU2hhcmUgbmFtZXNwYWNlZCBldmVudFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0dHJpZ2dlcjogZnVuY3Rpb24oZWxlbWVudCwgZXZlbnQpIHtcblx0XHRsZXQgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcblx0XHRldi5pbml0RXZlbnQoJ09wZW5TaGFyZS4nICsgZXZlbnQsIHRydWUsIHRydWUpO1xuXHRcdGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldik7XG5cdH1cbn07XG4iLCIvKipcbiAqIE9wZW5TaGFyZSBnZW5lcmF0ZXMgYSBzaW5nbGUgc2hhcmUgbGlua1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIE9wZW5TaGFyZSB7XG5cblx0Y29uc3RydWN0b3IodHlwZSwgdHJhbnNmb3JtKSB7XG5cdFx0dGhpcy5pb3MgPSAvaVBhZHxpUGhvbmV8aVBvZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAhd2luZG93Lk1TU3RyZWFtO1xuXHRcdHRoaXMudHlwZSA9IHR5cGU7XG5cdFx0dGhpcy5keW5hbWljID0gZmFsc2U7XG5cdFx0dGhpcy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG5cblx0XHQvLyBjYXBpdGFsaXplZCB0eXBlXG5cdFx0dGhpcy50eXBlQ2FwcyA9IHR5cGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eXBlLnNsaWNlKDEpO1xuXHR9XG5cblx0Ly8gcmV0dXJucyBmdW5jdGlvbiBuYW1lZCBhcyB0eXBlIHNldCBpbiBjb25zdHJ1Y3RvclxuXHQvLyBlLmcgdHdpdHRlcigpXG5cdHNldERhdGEoZGF0YSkge1xuXHRcdC8vIGlmIGlPUyB1c2VyIGFuZCBpb3MgZGF0YSBhdHRyaWJ1dGUgZGVmaW5lZFxuXHRcdC8vIGJ1aWxkIGlPUyBVUkwgc2NoZW1lIGFzIHNpbmdsZSBzdHJpbmdcblx0XHRpZiAodGhpcy5pb3MpIHtcblx0XHRcdHRoaXMudHJhbnNmb3JtRGF0YSA9IHRoaXMudHJhbnNmb3JtKGRhdGEsIHRydWUpO1xuXHRcdFx0dGhpcy5tb2JpbGVTaGFyZVVybCA9IHRoaXMudGVtcGxhdGUodGhpcy50cmFuc2Zvcm1EYXRhLnVybCwgdGhpcy50cmFuc2Zvcm1EYXRhLmRhdGEpO1xuXHRcdH1cblxuXHRcdHRoaXMudHJhbnNmb3JtRGF0YSA9IHRoaXMudHJhbnNmb3JtKGRhdGEpO1xuXHRcdHRoaXMuc2hhcmVVcmwgPSB0aGlzLnRlbXBsYXRlKHRoaXMudHJhbnNmb3JtRGF0YS51cmwsIHRoaXMudHJhbnNmb3JtRGF0YS5kYXRhKTtcblx0fVxuXG5cdC8vIG9wZW4gc2hhcmUgVVJMIGRlZmluZWQgaW4gaW5kaXZpZHVhbCBwbGF0Zm9ybSBmdW5jdGlvbnNcblx0c2hhcmUoZSkge1xuXHRcdC8vIGlmIGlPUyBzaGFyZSBVUkwgaGFzIGJlZW4gc2V0IHRoZW4gdXNlIHRpbWVvdXQgaGFja1xuXHRcdC8vIHRlc3QgZm9yIG5hdGl2ZSBhcHAgYW5kIGZhbGwgYmFjayB0byB3ZWJcblx0XHRpZiAodGhpcy5tb2JpbGVTaGFyZVVybCkge1xuXHRcdFx0dmFyIHN0YXJ0ID0gKG5ldyBEYXRlKCkpLnZhbHVlT2YoKTtcblxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdHZhciBlbmQgPSAobmV3IERhdGUoKSkudmFsdWVPZigpO1xuXG5cdFx0XHRcdC8vIGlmIHRoZSB1c2VyIGlzIHN0aWxsIGhlcmUsIGZhbGwgYmFjayB0byB3ZWJcblx0XHRcdFx0aWYgKGVuZCAtIHN0YXJ0ID4gMTYwMCkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMuc2hhcmVVcmw7XG5cdFx0XHR9LCAxNTAwKTtcblxuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gdGhpcy5tb2JpbGVTaGFyZVVybDtcblxuXHRcdC8vIG9wZW4gbWFpbHRvIGxpbmtzIGluIHNhbWUgd2luZG93XG5cdFx0fSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdlbWFpbCcpIHtcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMuc2hhcmVVcmw7XG5cblx0XHQvLyBvcGVuIHNvY2lhbCBzaGFyZSBVUkxzIGluIG5ldyB3aW5kb3dcblx0XHR9IGVsc2Uge1xuXHRcdFx0bGV0IHdpbmRvd09wdGlvbnMgPSBmYWxzZTtcblxuXHRcdFx0Ly8gaWYgcG9wdXAgb2JqZWN0IHByZXNlbnQgdGhlbiBzZXQgd2luZG93IGRpbWVuc2lvbnMgLyBwb3NpdGlvblxuXHRcdFx0aWYodGhpcy5wb3B1cCAmJiB0aGlzLnRyYW5zZm9ybURhdGEucG9wdXApIHtcblx0XHRcdFx0d2luZG93T3B0aW9ucyA9IHRoaXMudHJhbnNmb3JtRGF0YS5wb3B1cDtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5vcGVuV2luZG93KHRoaXMuc2hhcmVVcmwsIHdpbmRvd09wdGlvbnMpO1xuXHRcdH1cblx0fVxuXG5cdC8vIGNyZWF0ZSBzaGFyZSBVUkwgd2l0aCBHRVQgcGFyYW1zXG5cdC8vIGFwcGVuZGluZyB2YWxpZCBwcm9wZXJ0aWVzIHRvIHF1ZXJ5IHN0cmluZ1xuXHR0ZW1wbGF0ZSh1cmwsIGRhdGEpIHtcblx0XHRsZXQgbm9uVVJMUHJvcHMgPSBbXG5cdFx0XHQnYXBwZW5kVG8nLFxuXHRcdFx0J2lubmVySFRNTCcsXG5cdFx0XHQnY2xhc3Nlcydcblx0XHRdO1xuXG5cdFx0bGV0IHNoYXJlVXJsID0gdXJsLFxuXHRcdFx0aTtcblxuXHRcdGZvciAoaSBpbiBkYXRhKSB7XG5cdFx0XHQvLyBvbmx5IGFwcGVuZCB2YWxpZCBwcm9wZXJ0aWVzXG5cdFx0XHRpZiAoIWRhdGFbaV0gfHwgbm9uVVJMUHJvcHMuaW5kZXhPZihpKSA+IC0xKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBhcHBlbmQgVVJMIGVuY29kZWQgR0VUIHBhcmFtIHRvIHNoYXJlIFVSTFxuXHRcdFx0ZGF0YVtpXSA9IGVuY29kZVVSSUNvbXBvbmVudChkYXRhW2ldKTtcblx0XHRcdHNoYXJlVXJsICs9IGAke2l9PSR7ZGF0YVtpXX0mYDtcblx0XHR9XG5cblx0XHRyZXR1cm4gc2hhcmVVcmwuc3Vic3RyKDAsIHNoYXJlVXJsLmxlbmd0aCAtIDEpO1xuXHR9XG5cblx0Ly8gY2VudGVyIHBvcHVwIHdpbmRvdyBzdXBwb3J0aW5nIGR1YWwgc2NyZWVuc1xuXHRvcGVuV2luZG93KHVybCwgb3B0aW9ucykge1xuXHRcdGxldCBkdWFsU2NyZWVuTGVmdCA9IHdpbmRvdy5zY3JlZW5MZWZ0ICE9IHVuZGVmaW5lZCA/IHdpbmRvdy5zY3JlZW5MZWZ0IDogc2NyZWVuLmxlZnQsXG5cdFx0XHRkdWFsU2NyZWVuVG9wID0gd2luZG93LnNjcmVlblRvcCAhPSB1bmRlZmluZWQgPyB3aW5kb3cuc2NyZWVuVG9wIDogc2NyZWVuLnRvcCxcblx0XHRcdHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggPyB3aW5kb3cuaW5uZXJXaWR0aCA6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCA6IHNjcmVlbi53aWR0aCxcblx0XHRcdGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCA/IHdpbmRvdy5pbm5lckhlaWdodCA6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgPyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IDogc2NyZWVuLmhlaWdodCxcblx0XHRcdGxlZnQgPSAoKHdpZHRoIC8gMikgLSAob3B0aW9ucy53aWR0aCAvIDIpKSArIGR1YWxTY3JlZW5MZWZ0LFxuXHRcdFx0dG9wID0gKChoZWlnaHQgLyAyKSAtIChvcHRpb25zLmhlaWdodCAvIDIpKSArIGR1YWxTY3JlZW5Ub3AsXG5cdFx0XHRuZXdXaW5kb3cgPSB3aW5kb3cub3Blbih1cmwsICdPcGVuU2hhcmUnLCBgd2lkdGg9JHtvcHRpb25zLndpZHRofSwgaGVpZ2h0PSR7b3B0aW9ucy5oZWlnaHR9LCB0b3A9JHt0b3B9LCBsZWZ0PSR7bGVmdH1gKTtcblxuXHRcdC8vIFB1dHMgZm9jdXMgb24gdGhlIG5ld1dpbmRvd1xuXHRcdGlmICh3aW5kb3cuZm9jdXMpIHtcblx0XHRcdG5ld1dpbmRvdy5mb2N1cygpO1xuXHRcdH1cblx0fVxufTtcbiIsIi8qKlxuICogR2xvYmFsIE9wZW5TaGFyZSBBUEkgdG8gZ2VuZXJhdGUgaW5zdGFuY2VzIHByb2dyYW1tYXRpY2FsbHlcbiAqL1xuXG5jb25zdCBPUyA9IHJlcXVpcmUoJy4vb3Blbi1zaGFyZScpO1xuY29uc3QgU2hhcmVUcmFuc2Zvcm1zID0gcmVxdWlyZSgnLi9zaGFyZS10cmFuc2Zvcm1zJyk7XG5jb25zdCBFdmVudHMgPSByZXF1aXJlKCcuL2V2ZW50cycpO1xuY29uc3QgZGFzaFRvQ2FtZWwgPSByZXF1aXJlKCcuLi8uLi9saWIvZGFzaFRvQ2FtZWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblxuXHQvLyBnbG9iYWwgT3BlblNoYXJlIHJlZmVyZW5jaW5nIGludGVybmFsIGNsYXNzIGZvciBpbnN0YW5jZSBnZW5lcmF0aW9uXG5cdGNsYXNzIE9wZW5TaGFyZSB7XG5cblx0XHRjb25zdHJ1Y3RvcihkYXRhLCBlbGVtZW50KSB7XG5cblx0XHRcdGlmICghZGF0YS5iaW5kQ2xpY2spIGRhdGEuYmluZENsaWNrID0gdHJ1ZTtcblxuXHRcdFx0bGV0IGRhc2ggPSBkYXRhLnR5cGUuaW5kZXhPZignLScpO1xuXG5cdFx0XHRpZiAoZGFzaCA+IC0xKSB7XG5cdFx0XHRcdGRhdGEudHlwZSA9IGRhc2hUb0NhbWVsKGRhc2gsIGRhdGEudHlwZSk7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBub2RlO1xuXHRcdFx0dGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblx0XHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cblx0XHRcdHRoaXMub3MgPSBuZXcgT1MoZGF0YS50eXBlLCBTaGFyZVRyYW5zZm9ybXNbZGF0YS50eXBlXSk7XG5cdFx0XHR0aGlzLm9zLnNldERhdGEoZGF0YSk7XG5cblx0XHRcdGlmICghZWxlbWVudCB8fCBkYXRhLmVsZW1lbnQpIHtcblx0XHRcdFx0ZWxlbWVudCA9IGRhdGEuZWxlbWVudDtcblx0XHRcdFx0bm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudCB8fCAnYScpO1xuXHRcdFx0XHRpZiAoZGF0YS50eXBlKSB7XG5cdFx0XHRcdFx0bm9kZS5jbGFzc0xpc3QuYWRkKCdvcGVuLXNoYXJlLWxpbmsnLCBkYXRhLnR5cGUpO1xuXHRcdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUnLCBkYXRhLnR5cGUpO1xuXHRcdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtbm9kZScsIGRhdGEudHlwZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGRhdGEuaW5uZXJIVE1MKSBub2RlLmlubmVySFRNTCA9IGRhdGEuaW5uZXJIVE1MO1xuXHRcdFx0fVxuXHRcdFx0aWYgKG5vZGUpIGVsZW1lbnQgPSBub2RlO1xuXG5cdFx0XHRpZiAoZGF0YS5iaW5kQ2xpY2spIHtcblx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5zaGFyZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGRhdGEuYXBwZW5kVG8pIHtcblx0XHRcdFx0ZGF0YS5hcHBlbmRUby5hcHBlbmRDaGlsZChlbGVtZW50KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGRhdGEuY2xhc3NlcyAmJiBBcnJheS5pc0FycmF5KGRhdGEuY2xhc3NlcykpIHtcblx0XHRcdFx0ZGF0YS5jbGFzc2VzLmZvckVhY2goY3NzQ2xhc3MgPT4ge1xuXHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjc3NDbGFzcyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZGF0YS50eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdwYXlwYWwnKSB7XG5cdFx0XHRcdGNvbnN0IGFjdGlvbiA9IGRhdGEuc2FuZGJveCA/XG5cdFx0XHRcdCAgIFwiaHR0cHM6Ly93d3cuc2FuZGJveC5wYXlwYWwuY29tL2NnaS1iaW4vd2Vic2NyXCIgOlxuXHRcdFx0XHQgICBcImh0dHBzOi8vd3d3LnBheXBhbC5jb20vY2dpLWJpbi93ZWJzY3JcIjtcblxuXHRcdFx0XHRjb25zdCBidXlHSUYgPSBkYXRhLnNhbmRib3ggP1xuXHRcdFx0XHRcdFwiaHR0cHM6Ly93d3cuc2FuZGJveC5wYXlwYWwuY29tL2VuX1VTL2kvYnRuL2J0bl9idXlub3dfTEcuZ2lmXCIgOlxuXHRcdFx0XHRcdFwiaHR0cHM6Ly93d3cucGF5cGFsb2JqZWN0cy5jb20vZW5fVVMvaS9idG4vYnRuX2J1eW5vd19MRy5naWZcIjtcblxuXHRcdFx0XHRjb25zdCBwaXhlbEdJRiA9IGRhdGEuc2FuZGJveCA/XG5cdFx0XHRcdFx0XCJodHRwczovL3d3dy5zYW5kYm94LnBheXBhbC5jb20vZW5fVVMvaS9zY3IvcGl4ZWwuZ2lmXCIgOlxuXHRcdFx0XHRcdFwiaHR0cHM6Ly93d3cucGF5cGFsb2JqZWN0cy5jb20vZW5fVVMvaS9zY3IvcGl4ZWwuZ2lmXCI7XG5cblxuXHRcdFx0XHRjb25zdCBwYXlwYWxCdXR0b24gPSBgPGZvcm0gYWN0aW9uPSR7YWN0aW9ufSBtZXRob2Q9XCJwb3N0XCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG5cblx0XHRcdFx0ICA8IS0tIFNhdmVkIGJ1dHRvbnMgdXNlIHRoZSBcInNlY3VyZSBjbGlja1wiIGNvbW1hbmQgLS0+XG5cdFx0XHRcdCAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiY21kXCIgdmFsdWU9XCJfcy14Y2xpY2tcIj5cblxuXHRcdFx0XHQgIDwhLS0gU2F2ZWQgYnV0dG9ucyBhcmUgaWRlbnRpZmllZCBieSB0aGVpciBidXR0b24gSURzIC0tPlxuXHRcdFx0XHQgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImhvc3RlZF9idXR0b25faWRcIiB2YWx1ZT1cIiR7ZGF0YS5idXR0b25JZH1cIj5cblxuXHRcdFx0XHQgIDwhLS0gU2F2ZWQgYnV0dG9ucyBkaXNwbGF5IGFuIGFwcHJvcHJpYXRlIGJ1dHRvbiBpbWFnZS4gLS0+XG5cdFx0XHRcdCAgPGlucHV0IHR5cGU9XCJpbWFnZVwiIG5hbWU9XCJzdWJtaXRcIlxuXHRcdFx0XHQgICAgc3JjPSR7YnV5R0lGfVxuXHRcdFx0XHQgICAgYWx0PVwiUGF5UGFsIC0gVGhlIHNhZmVyLCBlYXNpZXIgd2F5IHRvIHBheSBvbmxpbmVcIj5cblx0XHRcdFx0ICA8aW1nIGFsdD1cIlwiIHdpZHRoPVwiMVwiIGhlaWdodD1cIjFcIlxuXHRcdFx0XHQgICAgc3JjPSR7cGl4ZWxHSUZ9ID5cblxuXHRcdFx0XHQ8L2Zvcm0+YDtcblxuXHRcdFx0XHRjb25zdCBoaWRkZW5EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdFx0aGlkZGVuRGl2LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHRcdGhpZGRlbkRpdi5pbm5lckhUTUwgPSBwYXlwYWxCdXR0b247XG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaGlkZGVuRGl2KTtcblxuXHRcdFx0XHR0aGlzLnBheXBhbCA9IGhpZGRlbkRpdi5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cdFx0XHRyZXR1cm4gZWxlbWVudDtcblx0XHR9XG5cblx0XHQvLyBwdWJsaWMgc2hhcmUgbWV0aG9kIHRvIHRyaWdnZXIgc2hhcmUgcHJvZ3JhbW1hdGljYWxseVxuXHRcdHNoYXJlKGUpIHtcblx0XHRcdC8vIGlmIGR5bmFtaWMgaW5zdGFuY2UgdGhlbiBmZXRjaCBhdHRyaWJ1dGVzIGFnYWluIGluIGNhc2Ugb2YgdXBkYXRlc1xuXHRcdFx0aWYgKHRoaXMuZGF0YS5keW5hbWljKSB7XG5cdFx0XHRcdHRoaXMub3Muc2V0RGF0YShkYXRhKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuZGF0YS50eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdwYXlwYWwnKSB7XG5cdFx0XHRcdHRoaXMucGF5cGFsLnN1Ym1pdCgpO1xuXHRcdFx0fSBlbHNlIHRoaXMub3Muc2hhcmUoZSk7XG5cblx0XHRcdEV2ZW50cy50cmlnZ2VyKHRoaXMuZWxlbWVudCwgJ3NoYXJlZCcpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBPcGVuU2hhcmU7XG59O1xuIiwiLyoqXG4gKiBPYmplY3Qgb2YgdHJhbnNmb3JtIGZ1bmN0aW9ucyBmb3IgZWFjaCBvcGVuc2hhcmUgYXBpXG4gKiBUcmFuc2Zvcm0gZnVuY3Rpb25zIHBhc3NlZCBpbnRvIE9wZW5TaGFyZSBpbnN0YW5jZSB3aGVuIGluc3RhbnRpYXRlZFxuICogUmV0dXJuIG9iamVjdCBjb250YWluaW5nIFVSTCBhbmQga2V5L3ZhbHVlIGFyZ3NcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0Ly8gc2V0IFR3aXR0ZXIgc2hhcmUgVVJMXG5cdHR3aXR0ZXI6IGZ1bmN0aW9uKGRhdGEsIGlvcyA9IGZhbHNlKSB7XG5cdFx0Ly8gaWYgaU9TIHVzZXIgYW5kIGlvcyBkYXRhIGF0dHJpYnV0ZSBkZWZpbmVkXG5cdFx0Ly8gYnVpbGQgaU9TIFVSTCBzY2hlbWUgYXMgc2luZ2xlIHN0cmluZ1xuXHRcdGlmIChpb3MgJiYgZGF0YS5pb3MpIHtcblxuXHRcdFx0bGV0IG1lc3NhZ2UgPSBgYDtcblxuXHRcdFx0aWYgKGRhdGEudGV4dCkge1xuXHRcdFx0XHRtZXNzYWdlICs9IGRhdGEudGV4dDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGRhdGEudXJsKSB7XG5cdFx0XHRcdG1lc3NhZ2UgKz0gYCAtICR7ZGF0YS51cmx9YDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGRhdGEuaGFzaHRhZ3MpIHtcblx0XHRcdFx0bGV0IHRhZ3MgPSBkYXRhLmhhc2h0YWdzLnNwbGl0KCcsJyk7XG5cdFx0XHRcdHRhZ3MuZm9yRWFjaChmdW5jdGlvbih0YWcpIHtcblx0XHRcdFx0XHRtZXNzYWdlICs9IGAgIyR7dGFnfWA7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZGF0YS52aWEpIHtcblx0XHRcdFx0bWVzc2FnZSArPSBgIHZpYSAke2RhdGEudmlhfWA7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHVybDogJ3R3aXR0ZXI6Ly9wb3N0PycsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRtZXNzYWdlOiBtZXNzYWdlXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHVybDogJ2h0dHBzOi8vdHdpdHRlci5jb20vc2hhcmU/Jyxcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRwb3B1cDoge1xuXHRcdFx0XHR3aWR0aDogNzAwLFxuXHRcdFx0XHRoZWlnaHQ6IDI5NlxuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0Ly8gc2V0IFR3aXR0ZXIgcmV0d2VldCBVUkxcblx0dHdpdHRlclJldHdlZXQ6IGZ1bmN0aW9uKGRhdGEsIGlvcyA9IGZhbHNlKSB7XG5cdFx0Ly8gaWYgaU9TIHVzZXIgYW5kIGlvcyBkYXRhIGF0dHJpYnV0ZSBkZWZpbmVkXG5cdFx0aWYgKGlvcyAmJiBkYXRhLmlvcykge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dXJsOiAndHdpdHRlcjovL3N0YXR1cz8nLFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0aWQ6IGRhdGEudHdlZXRJZFxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR1cmw6ICdodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC9yZXR3ZWV0PycsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHR3ZWV0X2lkOiBkYXRhLnR3ZWV0SWQsXG5cdFx0XHRcdHJlbGF0ZWQ6IGRhdGEucmVsYXRlZFxuXHRcdFx0fSxcblx0XHRcdHBvcHVwOiB7XG5cdFx0XHRcdHdpZHRoOiA3MDAsXG5cdFx0XHRcdGhlaWdodDogMjk2XG5cdFx0XHR9XG5cdFx0fTtcblx0fSxcblxuXHQvLyBzZXQgVHdpdHRlciBsaWtlIFVSTFxuXHR0d2l0dGVyTGlrZTogZnVuY3Rpb24oZGF0YSwgaW9zID0gZmFsc2UpIHtcblx0XHQvLyBpZiBpT1MgdXNlciBhbmQgaW9zIGRhdGEgYXR0cmlidXRlIGRlZmluZWRcblx0XHRpZiAoaW9zICYmIGRhdGEuaW9zKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR1cmw6ICd0d2l0dGVyOi8vc3RhdHVzPycsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRpZDogZGF0YS50d2VldElkXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHVybDogJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L2Zhdm9yaXRlPycsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHR3ZWV0X2lkOiBkYXRhLnR3ZWV0SWQsXG5cdFx0XHRcdHJlbGF0ZWQ6IGRhdGEucmVsYXRlZFxuXHRcdFx0fSxcblx0XHRcdHBvcHVwOiB7XG5cdFx0XHRcdHdpZHRoOiA3MDAsXG5cdFx0XHRcdGhlaWdodDogMjk2XG5cdFx0XHR9XG5cdFx0fTtcblx0fSxcblxuXHQvLyBzZXQgVHdpdHRlciBmb2xsb3cgVVJMXG5cdHR3aXR0ZXJGb2xsb3c6IGZ1bmN0aW9uKGRhdGEsIGlvcyA9IGZhbHNlKSB7XG5cdFx0Ly8gaWYgaU9TIHVzZXIgYW5kIGlvcyBkYXRhIGF0dHJpYnV0ZSBkZWZpbmVkXG5cdFx0aWYgKGlvcyAmJiBkYXRhLmlvcykge1xuXHRcdFx0bGV0IGlvc0RhdGEgPSBkYXRhLnNjcmVlbk5hbWUgPyB7XG5cdFx0XHRcdCdzY3JlZW5fbmFtZSc6IGRhdGEuc2NyZWVuTmFtZVxuXHRcdFx0fSA6IHtcblx0XHRcdFx0J2lkJzogZGF0YS51c2VySWRcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHVybDogJ3R3aXR0ZXI6Ly91c2VyPycsXG5cdFx0XHRcdGRhdGE6IGlvc0RhdGFcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHVybDogJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3VzZXI/Jyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0c2NyZWVuX25hbWU6IGRhdGEuc2NyZWVuTmFtZSxcblx0XHRcdFx0dXNlcl9pZDogZGF0YS51c2VySWRcblx0XHRcdH0sXG5cdFx0XHRwb3B1cDoge1xuXHRcdFx0XHR3aWR0aDogNzAwLFxuXHRcdFx0XHRoZWlnaHQ6IDI5NlxuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0Ly8gc2V0IEZhY2Vib29rIHNoYXJlIFVSTFxuXHRmYWNlYm9vazogZnVuY3Rpb24oZGF0YSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR1cmw6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vZGlhbG9nL2ZlZWQ/YXBwX2lkPTk2MTM0MjU0MzkyMjMyMiZyZWRpcmVjdF91cmk9aHR0cDovL2ZhY2Vib29rLmNvbSYnLFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdHBvcHVwOiB7XG5cdFx0XHRcdHdpZHRoOiA1NjAsXG5cdFx0XHRcdGhlaWdodDogNTkzXG5cdFx0XHR9XG5cdFx0fTtcblx0fSxcblxuXHQvLyBzZXQgRmFjZWJvb2sgc2VuZCBVUkxcblx0ZmFjZWJvb2tTZW5kOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHVybDogJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9kaWFsb2cvc2VuZD9hcHBfaWQ9OTYxMzQyNTQzOTIyMzIyJnJlZGlyZWN0X3VyaT1odHRwOi8vZmFjZWJvb2suY29tJicsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0cG9wdXA6IHtcblx0XHRcdFx0d2lkdGg6IDk4MCxcblx0XHRcdFx0aGVpZ2h0OiA1OTZcblx0XHRcdH1cblx0XHR9O1xuXHR9LFxuXG5cdC8vIHNldCBZb3VUdWJlIHBsYXkgVVJMXG5cdHlvdXR1YmU6IGZ1bmN0aW9uKGRhdGEsIGlvcyA9IGZhbHNlKSB7XG5cdFx0Ly8gaWYgaU9TIHVzZXJcblx0XHRpZiAoaW9zICYmIGRhdGEuaW9zKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR1cmw6IGB5b3V0dWJlOiR7ZGF0YS52aWRlb30/YFxuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dXJsOiBgaHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj0ke2RhdGEudmlkZW99P2AsXG5cdFx0XHRcdHBvcHVwOiB7XG5cdFx0XHRcdFx0d2lkdGg6IDEwODYsXG5cdFx0XHRcdFx0aGVpZ2h0OiA2MDhcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gc2V0IFlvdVR1YmUgc3ViY3JpYmUgVVJMXG5cdHlvdXR1YmVTdWJzY3JpYmU6IGZ1bmN0aW9uKGRhdGEsIGlvcyA9IGZhbHNlKSB7XG5cdFx0Ly8gaWYgaU9TIHVzZXJcblx0XHRpZiAoaW9zICYmIGRhdGEuaW9zKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR1cmw6IGB5b3V0dWJlOi8vd3d3LnlvdXR1YmUuY29tL3VzZXIvJHtkYXRhLnVzZXJ9P2Bcblx0XHRcdH07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHVybDogYGh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3VzZXIvJHtkYXRhLnVzZXJ9P2AsXG5cdFx0XHRcdHBvcHVwOiB7XG5cdFx0XHRcdFx0d2lkdGg6IDg4MCxcblx0XHRcdFx0XHRoZWlnaHQ6IDM1MFxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblx0fSxcblxuXHQvLyBzZXQgSW5zdGFncmFtIGZvbGxvdyBVUkxcblx0aW5zdGFncmFtOiBmdW5jdGlvbihkYXRhKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHVybDogYGluc3RhZ3JhbTovL2NhbWVyYT9gXG5cdFx0fTtcblx0fSxcblxuXHQvLyBzZXQgSW5zdGFncmFtIGZvbGxvdyBVUkxcblx0aW5zdGFncmFtRm9sbG93OiBmdW5jdGlvbihkYXRhLCBpb3MgPSBmYWxzZSkge1xuXHRcdC8vIGlmIGlPUyB1c2VyXG5cdFx0aWYgKGlvcyAmJiBkYXRhLmlvcykge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dXJsOiAnaW5zdGFncmFtOi8vdXNlcj8nLFxuXHRcdFx0XHRkYXRhOiBkYXRhXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR1cmw6IGBodHRwOi8vd3d3Lmluc3RhZ3JhbS5jb20vJHtkYXRhLnVzZXJuYW1lfT9gLFxuXHRcdFx0XHRwb3B1cDoge1xuXHRcdFx0XHRcdHdpZHRoOiA5ODAsXG5cdFx0XHRcdFx0aGVpZ2h0OiA2NTVcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gc2V0IFNuYXBjaGF0IGZvbGxvdyBVUkxcblx0c25hcGNoYXQgKGRhdGEpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXJsOiBgc25hcGNoYXQ6Ly9hZGQvJHtkYXRhLnVzZXJuYW1lfT9gXG5cdFx0fTtcblx0fSxcblxuXHQvLyBzZXQgR29vZ2xlIHNoYXJlIFVSTFxuXHRnb29nbGUgKGRhdGEpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXJsOiAnaHR0cHM6Ly9wbHVzLmdvb2dsZS5jb20vc2hhcmU/Jyxcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRwb3B1cDoge1xuXHRcdFx0XHR3aWR0aDogNDk1LFxuXHRcdFx0XHRoZWlnaHQ6IDgxNVxuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0Ly8gc2V0IEdvb2dsZSBtYXBzIFVSTFxuXHRnb29nbGVNYXBzIChkYXRhLCBpb3MgPSBmYWxzZSkge1xuXG5cdFx0aWYgKGRhdGEuc2VhcmNoKSB7XG5cdFx0XHRkYXRhLnEgPSBkYXRhLnNlYXJjaDtcblx0XHRcdGRlbGV0ZSBkYXRhLnNlYXJjaDtcblx0XHR9XG5cblx0XHQvLyBpZiBpT1MgdXNlciBhbmQgaW9zIGRhdGEgYXR0cmlidXRlIGRlZmluZWRcblx0XHRpZiAoaW9zICYmIGRhdGEuaW9zKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR1cmw6ICdjb21nb29nbGVtYXBzOi8vPycsXG5cdFx0XHRcdGRhdGE6IGlvc1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoIWlvcyAmJiBkYXRhLmlvcykge1xuXHRcdFx0ZGVsZXRlIGRhdGEuaW9zO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHR1cmw6ICdodHRwczovL21hcHMuZ29vZ2xlLmNvbS8/Jyxcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRwb3B1cDoge1xuXHRcdFx0XHR3aWR0aDogODAwLFxuXHRcdFx0XHRoZWlnaHQ6IDYwMFxuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0Ly8gc2V0IFBpbnRlcmVzdCBzaGFyZSBVUkxcblx0cGludGVyZXN0IChkYXRhKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHVybDogJ2h0dHBzOi8vcGludGVyZXN0LmNvbS9waW4vY3JlYXRlL2Jvb2ttYXJrbGV0Lz8nLFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdHBvcHVwOiB7XG5cdFx0XHRcdHdpZHRoOiA3NDUsXG5cdFx0XHRcdGhlaWdodDogNjIwXG5cdFx0XHR9XG5cdFx0fTtcblx0fSxcblxuXHQvLyBzZXQgTGlua2VkSW4gc2hhcmUgVVJMXG5cdGxpbmtlZGluIChkYXRhKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHVybDogJ2h0dHA6Ly93d3cubGlua2VkaW4uY29tL3NoYXJlQXJ0aWNsZT8nLFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdHBvcHVwOiB7XG5cdFx0XHRcdHdpZHRoOiA3ODAsXG5cdFx0XHRcdGhlaWdodDogNDkyXG5cdFx0XHR9XG5cdFx0fTtcblx0fSxcblxuXHQvLyBzZXQgQnVmZmVyIHNoYXJlIFVSTFxuXHRidWZmZXIgKGRhdGEpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXJsOiAnaHR0cDovL2J1ZmZlcmFwcC5jb20vYWRkPycsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0cG9wdXA6IHtcblx0XHRcdFx0d2lkdGg6IDc0NSxcblx0XHRcdFx0aGVpZ2h0OiAzNDVcblx0XHRcdH1cblx0XHR9O1xuXHR9LFxuXG5cdC8vIHNldCBUdW1ibHIgc2hhcmUgVVJMXG5cdHR1bWJsciAoZGF0YSkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR1cmw6ICdodHRwczovL3d3dy50dW1ibHIuY29tL3dpZGdldHMvc2hhcmUvdG9vbD8nLFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdHBvcHVwOiB7XG5cdFx0XHRcdHdpZHRoOiA1NDAsXG5cdFx0XHRcdGhlaWdodDogOTQwXG5cdFx0XHR9XG5cdFx0fTtcblx0fSxcblxuXHQvLyBzZXQgUmVkZGl0IHNoYXJlIFVSTFxuXHRyZWRkaXQgKGRhdGEpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXJsOiAnaHR0cDovL3JlZGRpdC5jb20vc3VibWl0PycsXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0cG9wdXA6IHtcblx0XHRcdFx0d2lkdGg6IDg2MCxcblx0XHRcdFx0aGVpZ2h0OiA4ODBcblx0XHRcdH1cblx0XHR9O1xuXHR9LFxuXG5cdC8vIHNldCBGbGlja3IgZm9sbG93IFVSTFxuXHRmbGlja3IgKGRhdGEsIGlvcyA9IGZhbHNlKSB7XG5cdFx0Ly8gaWYgaU9TIHVzZXJcblx0XHRpZiAoaW9zICYmIGRhdGEuaW9zKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR1cmw6IGBmbGlja3I6Ly9waG90b3MvJHtkYXRhLnVzZXJuYW1lfT9gXG5cdFx0XHR9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR1cmw6IGBodHRwOi8vd3d3LmZsaWNrci5jb20vcGhvdG9zLyR7ZGF0YS51c2VybmFtZX0/YCxcblx0XHRcdFx0cG9wdXA6IHtcblx0XHRcdFx0XHR3aWR0aDogNjAwLFxuXHRcdFx0XHRcdGhlaWdodDogNjUwXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXHR9LFxuXG5cdC8vIHNldCBXaGF0c0FwcCBzaGFyZSBVUkxcblx0d2hhdHNhcHAgKGRhdGEpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXJsOiAnd2hhdHNhcHA6Ly9zZW5kPycsXG5cdFx0XHRkYXRhOiBkYXRhXG5cdFx0fTtcblx0fSxcblxuXHQvLyBzZXQgc21zIHNoYXJlIFVSTFxuXHRzbXMgKGRhdGEsIGlvcyA9IGZhbHNlKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHVybDogaW9zID8gJ3NtczomJyA6ICdzbXM6PycsXG5cdFx0XHRkYXRhOiBkYXRhXG5cdFx0fTtcblx0fSxcblxuXHQvLyBzZXQgRW1haWwgc2hhcmUgVVJMXG5cdGVtYWlsIChkYXRhKSB7XG5cblx0XHR2YXIgdXJsID0gYG1haWx0bzpgO1xuXG5cdFx0Ly8gaWYgdG8gYWRkcmVzcyBzcGVjaWZpZWQgdGhlbiBhZGQgdG8gVVJMXG5cdFx0aWYgKGRhdGEudG8gIT09IG51bGwpIHtcblx0XHRcdHVybCArPSBgJHtkYXRhLnRvfWA7XG5cdFx0fVxuXG5cdFx0dXJsICs9IGA/YDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHR1cmw6IHVybCxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0c3ViamVjdDogZGF0YS5zdWJqZWN0LFxuXHRcdFx0XHRib2R5OiBkYXRhLmJvZHlcblx0XHRcdH1cblx0XHR9O1xuXHR9LFxuXG5cdC8vIHNldCBHaXRodWIgZm9yayBVUkxcblx0Z2l0aHViIChkYXRhLCBpb3MgPSBmYWxzZSkge1xuXHRcdGxldCB1cmwgPSBkYXRhLnJlcG8gP1xuXHRcdFx0YGh0dHBzOi8vZ2l0aHViLmNvbS8ke2RhdGEucmVwb31gIDpcblx0XHRcdGRhdGEudXJsO1xuXG5cdFx0aWYgKGRhdGEuaXNzdWUpIHtcblx0XHRcdHVybCArPSAnL2lzc3Vlcy9uZXc/dGl0bGU9JyArXG5cdFx0XHRcdGRhdGEuaXNzdWUgK1xuXHRcdFx0XHQnJmJvZHk9JyArXG5cdFx0XHRcdGRhdGEuYm9keTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0dXJsOiB1cmwgKyAnPycsXG5cdFx0XHRwb3B1cDoge1xuXHRcdFx0XHR3aWR0aDogMTAyMCxcblx0XHRcdFx0aGVpZ2h0OiAzMjNcblx0XHRcdH1cblx0XHR9O1xuXHR9LFxuXG5cdC8vIHNldCBEcmliYmJsZSBzaGFyZSBVUkxcblx0ZHJpYmJibGUgKGRhdGEsIGlvcyA9IGZhbHNlKSB7XG5cdFx0Y29uc3QgdXJsID0gZGF0YS5zaG90ID9cblx0XHRcdGBodHRwczovL2RyaWJiYmxlLmNvbS9zaG90cy8ke2RhdGEuc2hvdH0/YCA6XG5cdFx0XHRkYXRhLnVybCArICc/Jztcblx0XHRyZXR1cm4ge1xuXHRcdFx0dXJsOiB1cmwsXG5cdFx0XHRwb3B1cDoge1xuXHRcdFx0XHR3aWR0aDogNDQwLFxuXHRcdFx0XHRoZWlnaHQ6IDY0MFxuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0Y29kZXBlbiAoZGF0YSkge1xuXHRcdGNvbnN0IHVybCA9IChkYXRhLnBlbiAmJiBkYXRhLnVzZXJuYW1lICYmIGRhdGEudmlldykgP1xuXHRcdFx0YGh0dHBzOi8vY29kZXBlbi5pby8ke2RhdGEudXNlcm5hbWV9LyR7ZGF0YS52aWV3fS8ke2RhdGEucGVufT9gIDpcblx0XHRcdGRhdGEudXJsICsgJz8nO1xuXHRcdHJldHVybiB7XG5cdFx0XHR1cmw6IHVybCxcblx0XHRcdHBvcHVwOiB7XG5cdFx0XHRcdHdpZHRoOiAxMjAwLFxuXHRcdFx0XHRoZWlnaHQ6IDgwMFxuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0cGF5cGFsIChkYXRhKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGRhdGE6IGRhdGFcblx0XHR9O1xuXHR9XG59O1xuIl19
