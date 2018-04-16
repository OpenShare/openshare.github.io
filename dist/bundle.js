(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

require('openshare');
var xhr = require('xhr');
var animationMods = ['square', 'diamond', 'rectangle', 'rectangle-vert'];

var ui = {
	openShareNodes: document.querySelectorAll('.open-share-examples [data-open-share]'),
	burger: document.querySelector('.header__burger'),
	nav: document.querySelector('.header__nav'),
	appKey: document.getElementById('app-key'),
	secretKey: document.getElementById('secret-key'),
	urls: document.querySelectorAll('[data-url]'),
	submit: document.getElementById('account-submit'),
	account: document.querySelector('[data-account]'),
	accountSetup: document.querySelector('[data-account-setup]'),
	moreUrlsLinks: document.querySelectorAll('[data-more-urls-link]'),
	moreUrls: document.querySelector('[data-more-urls-form]'),
	appExampleLink: document.querySelector('[data-app-example-link]'),
	appExample: document.querySelector('[data-app-example]'),
	success: document.querySelector('[data-success]'),
	urlInstruction: document.querySelector('[data-url-instruction]'),
	deleteAccount: document.querySelector('[data-delete-account]'),
	status: document.querySelectorAll('[data-url-status]'),
	dstechroomPass: document.getElementById('dstechroomPass'),
	signups: document.getElementById('signups')
};

var validateFuncs = {
	// validate field based on value being set
	// unless custom validate function specified
	validate: function validate(field) {
		// custom validation function is set and passed
		// or custom validation function is not set but value is
		if (field.validate && field.validate(field.input.value) || !field.validate && field.input.value) {
			return true;

			// custom validation function is set and failed
			// or custom validation function not set and value not set either
		} else if (field.validate && !field.validate(field.input.value) || !field.validate && !field.input.value) {
			return false;
		}
	},

	// if value set then it must contain http
	// if not set then we good
	validateOptionalUrl: function validateOptionalUrl(value) {
		if (value) {
			return value.includes('http');
		}

		return true;
	}
};

var validateFields = [
// twitter consumer keys required
{ input: ui.appKey }, { input: ui.secretKey },

// at least one URL required
{
	input: ui.urls[0],
	validate: function validate(value) {
		return value && value.includes('http');
	}
},

// optional URLs, if value must contain http
{
	input: ui.urls[1],
	validate: validateFuncs.validateOptionalUrl
}, {
	input: ui.urls[2],
	validate: validateFuncs.validateOptionalUrl
}, {
	input: ui.urls[3],
	validate: validateFuncs.validateOptionalUrl
}, {
	input: ui.urls[4],
	validate: validateFuncs.validateOptionalUrl
}];

document.addEventListener('DOMContentLoaded', function () {
	var interval = new RecurringTimer(animationLoop, 6000);

	[].forEach.call(ui.openShareNodes, function (node) {
		if (!isInPage(node)) {
			return;
		}

		node.addEventListener('mouseenter', function () {
			interval.pause();
		});
		node.addEventListener('mouseleave', function () {
			interval.resume();
		});
	});

	if (isInPage(ui.burger)) {
		ui.burger.addEventListener('click', function () {
			ui.burger.querySelector('.burger-icon').classList.toggle('active');
			ui.nav.classList.toggle('active');
		});
	}

	if (isInPage(ui.submit)) {
		// validate fields on blur
		validateFields.forEach(function (field) {
			if (!field.input) return;
			field.input.addEventListener('blur', function validate(i) {
				var valid = validateFuncs.validate(i);
				if (valid) {
					i.input.classList.remove('account-form__input--error');
				} else {
					i.input.classList.add('account-form__input--error');
				}
			}.bind(undefined, field));
		});

		ui.submit.addEventListener('click', function () {
			var validationFailed = false,
			    firstFail = null;

			validateFields.forEach(function (field) {
				if (!field.input) return;

				var valid = validateFuncs.validate(field);

				if (!valid) {
					validationFailed = true;

					if (!firstFail) {
						firstFail = field.input;
					}

					field.input.classList.add('account-form__input--error');
				}
			});

			if (validationFailed) {
				document.body.scrollTop = firstFail.offsetTop - firstFail.scrollTop + firstFail.clientTop - 10;
				return false;
			}

			var payload = {
				appKey: isInPage(ui.appKey) ? ui.appKey.value : null,
				secretKey: isInPage(ui.secretKey) ? ui.secretKey.value : null,
				urls: [].map.call(ui.urls, function (url) {
					return url.value;
				})
			};

			xhr({
				body: JSON.stringify(payload),
				url: '/register',
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST'
			}, function (err, resp, body) {
				if (err) console.error(err);

				// TODO: if first submission slide to top to show API keys
				// subsequent submissions just show success message
				// pass true to showSuccess if first time user
				var res = JSON.parse(body);

				if (res) {
					showSuccess(res.firstTimeUser);
					ui.accountSetup.innerHTML = res.body;
					ui.urlInstruction.innerHTML = 'Paste the URLs you want to count here';

					if (res.spans) {
						[].forEach.call(ui.status, function (stat, i) {
							if (res.spans[i]) stat.innerHTML = res.spans[i];else stat.innerHTML = '';
						});
					}
				}
			});
		});
	}

	ui.moreUrlsLinks.forEach(function (moreUrlsLink) {
		if (!isInPage(moreUrlsLink)) {
			return;
		}

		moreUrlsLink.addEventListener('click', function (e) {
			e.preventDefault();
			ui.moreUrls.classList.add('more-urls--display');

			setTimeout(function () {
				ui.moreUrls.classList.add('more-urls--show');
			}, 200);
		});
	});

	if (isInPage(ui.appExampleLink)) {
		ui.appExampleLink.addEventListener('click', function (e) {
			e.preventDefault();
			ui.appExample.classList.add('account__app-examples--display');
			ui.appExampleLink.style.display = 'none';

			setTimeout(function () {
				ui.appExample.classList.add('account__app-examples--show');
			}, 200);
		});
	}

	if (isInPage(ui.deleteAccount)) {
		ui.deleteAccount.addEventListener('click', function (e) {
			e.preventDefault();

			if (confirm('Are you sure you want to delete your account and stop counting Twitter shares?')) {
				xhr({
					body: 'delete',
					url: '/delete',
					method: 'POST'
				}, function (err) {
					if (err) console.error(err);
					window.location = '/';
				});
			}
		});
	}

	setTimeout(function () {
		animationLoop();
	}, 1000);
});

if (isInPage(ui.dstechroomPass)) {
	ui.dstechroomPass.addEventListener('keypress', function (e) {
		if (e.keyCode === 13) {
			var payload = {
				password: ui.dstechroomPass.value
			};
			xhr({
				body: JSON.stringify(payload),
				url: '/dstechroom',
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST'
			}, function (err, resp, body) {
				if (err) console.error(err);
				ui.dstechroomPass.parentNode.removeChild(ui.dstechroomPass);
				var users = JSON.parse(body);
				var template = '<h1>Sign Ups</h1>';
				users.forEach(function (user) {
					var link = '<div style=\'margin: .5em;\'>\n\t\t\t\t\t\t<a\n\t\t\t\t\t\tstyle=\'color: #fff; font-size: 1.3em;\'\n\t\t\t\t\t\thref=\'https://twitter.com/' + user + '\'>\n\t\t\t\t\t\t\t@' + user + '\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</div>';
					template += link;
				});
				ui.signups.innerHTML = template;
				console.log(ui.signups, template);
			});
		}
	});
}

function showSuccess(firstTime) {
	if (firstTime) {
		document.body.scrollTop = ui.account.offsetTop - ui.account.scrollTop + ui.account.clientTop;
	}

	setTimeout(function () {
		ui.success.classList.add('account__success--active');
	}, 200);

	setTimeout(function () {
		ui.success.classList.remove('account__success--active');
	}, 2000);
}

function Timer(callback, delay) {
	var timerId = void 0,
	    start = void 0,
	    remaining = delay;

	this.pause = function () {
		window.clearTimeout(timerId);
		remaining -= new Date() - start;
	};

	this.resume = function () {
		start = new Date();
		window.clearTimeout(timerId);
		timerId = window.setTimeout(callback, remaining);
	};

	this.resume();
}

function RecurringTimer(callback, delay) {
	var timerId = void 0,
	    start = void 0,
	    remaining = delay;

	this.pause = function () {
		window.clearTimeout(timerId);
		remaining -= new Date() - start;
	};

	var resume = function resume() {
		start = new Date();
		timerId = window.setTimeout(function () {
			remaining = delay;
			resume();
			callback();
		}, remaining);
	};

	this.resume = resume;

	this.resume();
}

function animationLoop() {
	// loop through each animation modifier
	animationMods.forEach(function (mod, i) {
		// wait a second in between each animation segment
		var timer = new Timer(function () {
			// loop through open share nodes
			[].forEach.call(ui.openShareNodes, function (node, j) {
				// delay by index * 100ms
				new Timer(function timerCallback() {
					// out of mods so reset
					if (!mod) {
						this.setAttribute('class', 'open-share-example');

						// apply mod
					} else {
						this.setAttribute('class', 'open-share-example--' + mod);
					}

					// bind node to setTimeout so reference doesn't change on each loop
				}.bind(node), j * 100);
			});
		}, i * 1000);

		[].forEach.call(ui.openShareNodes, function (node) {
			node.addEventListener('mouseenter', function () {
				timer.pause();
			});

			node.addEventListener('mouseleave', function () {
				timer.resume();
			});
		});
	});
}

function isInPage(node) {
	return node === document.body ? false : document.body.contains(node);
}

},{"openshare":5,"xhr":8}],2:[function(require,module,exports){
var isFunction = require('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":4}],3:[function(require,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],5:[function(require,module,exports){
'use strict';

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    'use strict';

    /**
     * Trigger custom OpenShare namespaced event
     */

    var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
      }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
      };
    }();

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var Events = {
      trigger: function trigger(element, event) {
        var ev = document.createEvent('Event');
        ev.initEvent('OpenShare.' + event, true, true);
        element.dispatchEvent(ev);
      }
    };

    var analytics = function analytics(type, cb) {
      // eslint-disable-line
      var isGA = type === 'event' || type === 'social';
      var isTagManager = type === 'tagManager';

      if (isGA) checkIfAnalyticsLoaded(type, cb);
      if (isTagManager) setTagManager(cb);
    };

    function checkIfAnalyticsLoaded(type, cb) {
      if (window.ga) {
        if (cb) cb();
        // bind to shared event on each individual node
        listen(function (e) {
          var platform = e.target.getAttribute('data-open-share');
          var target = e.target.getAttribute('data-open-share-link') || e.target.getAttribute('data-open-share-url') || e.target.getAttribute('data-open-share-username') || e.target.getAttribute('data-open-share-center') || e.target.getAttribute('data-open-share-search') || e.target.getAttribute('data-open-share-body');

          if (type === 'event') {
            ga('send', 'event', { // eslint-disable-line no-undef
              eventCategory: 'OpenShare Click',
              eventAction: platform,
              eventLabel: target,
              transport: 'beacon'
            });
          }

          if (type === 'social') {
            ga('send', { // eslint-disable-line no-undef
              hitType: 'social',
              socialNetwork: platform,
              socialAction: 'share',
              socialTarget: target
            });
          }
        });
      } else {
        setTimeout(function () {
          checkIfAnalyticsLoaded(type, cb);
        }, 1000);
      }
    }

    function setTagManager(cb) {
      if (window.dataLayer && window.dataLayer[0]['gtm.start']) {
        if (cb) cb();

        listen(onShareTagManger);

        getCounts(function (e) {
          var count = e.target ? e.target.innerHTML : e.innerHTML;

          var platform = e.target ? e.target.getAttribute('data-open-share-count-url') : e.getAttribute('data-open-share-count-url');

          window.dataLayer.push({
            event: 'OpenShare Count',
            platform: platform,
            resource: count,
            activity: 'count'
          });
        });
      } else {
        setTimeout(function () {
          setTagManager(cb);
        }, 1000);
      }
    }

    function listen(cb) {
      // bind to shared event on each individual node
      [].forEach.call(document.querySelectorAll('[data-open-share]'), function (node) {
        node.addEventListener('OpenShare.shared', cb);
      });
    }

    function getCounts(cb) {
      var countNode = document.querySelectorAll('[data-open-share-count]');

      [].forEach.call(countNode, function (node) {
        if (node.textContent) cb(node);else node.addEventListener('OpenShare.counted-' + node.getAttribute('data-open-share-count-url'), cb);
      });
    }

    function onShareTagManger(e) {
      var platform = e.target.getAttribute('data-open-share');
      var target = e.target.getAttribute('data-open-share-link') || e.target.getAttribute('data-open-share-url') || e.target.getAttribute('data-open-share-username') || e.target.getAttribute('data-open-share-center') || e.target.getAttribute('data-open-share-search') || e.target.getAttribute('data-open-share-body');

      window.dataLayer.push({
        event: 'OpenShare Share',
        platform: platform,
        resource: target,
        activity: 'share'
      });
    }

    function initializeNodes(opts) {
      // loop through open share node collection
      return function () {
        // check for analytics
        checkAnalytics();

        if (opts.api) {
          var nodes = opts.container.querySelectorAll(opts.selector);
          [].forEach.call(nodes, opts.cb);

          // trigger completed event
          Events.trigger(document, opts.api + '-loaded');
        } else {
          // loop through open share node collection
          var shareNodes = opts.container.querySelectorAll(opts.selector.share);
          [].forEach.call(shareNodes, opts.cb.share);

          // trigger completed event
          Events.trigger(document, 'share-loaded');

          // loop through count node collection
          var countNodes = opts.container.querySelectorAll(opts.selector.count);
          [].forEach.call(countNodes, opts.cb.count);

          // trigger completed event
          Events.trigger(document, 'count-loaded');
        }
      };
    }

    function checkAnalytics() {
      // check for analytics
      if (document.querySelector('[data-open-share-analytics]')) {
        var provider = document.querySelector('[data-open-share-analytics]').getAttribute('data-open-share-analytics');

        if (provider.indexOf(',') > -1) {
          var providers = provider.split(',');
          providers.forEach(function (p) {
            return analytics(p);
          });
        } else analytics(provider);
      }
    }

    function initializeWatcher(watcher, fn) {
      [].forEach.call(watcher, function (w) {
        var observer = new MutationObserver(function (mutations) {
          // target will match between all mutations so just use first
          fn(mutations[0].target);
        });

        observer.observe(w, {
          childList: true
        });
      });
    }

    function init$1(opts) {
      return function () {
        var initNodes = initializeNodes({
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

    /**
     * Object of transform functions for each openshare api
     * Transform functions passed into OpenShare instance when instantiated
     * Return object containing URL and key/value args
     */
    var ShareTransforms = {

      // set Twitter share URL
      twitter: function twitter(data) {
        var ios = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        // if iOS user and ios data attribute defined
        // build iOS URL scheme as single string
        if (ios && data.ios) {
          var message = '';

          if (data.text) {
            message += data.text;
          }

          if (data.url) {
            message += ' - ' + data.url;
          }

          if (data.hashtags) {
            var tags = data.hashtags.split(',');
            tags.forEach(function (tag) {
              message += ' #' + tag;
            });
          }

          if (data.via) {
            message += ' via ' + data.via;
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
      twitterRetweet: function twitterRetweet(data) {
        var ios = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

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
      twitterLike: function twitterLike(data) {
        var ios = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

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
      twitterFollow: function twitterFollow(data) {
        var ios = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        // if iOS user and ios data attribute defined
        if (ios && data.ios) {
          var iosData = data.screenName ? {
            screen_name: data.screenName
          } : {
            id: data.userId
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
      facebook: function facebook(data) {
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
      facebookSend: function facebookSend(data) {
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
      youtube: function youtube(data) {
        var ios = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        // if iOS user
        if (ios && data.ios) {
          return {
            url: 'youtube:' + data.video + '?'
          };
        }

        return {
          url: 'https://www.youtube.com/watch?v=' + data.video + '?',
          popup: {
            width: 1086,
            height: 608
          }
        };
      },

      // set YouTube subcribe URL
      youtubeSubscribe: function youtubeSubscribe(data) {
        var ios = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        // if iOS user
        if (ios && data.ios) {
          return {
            url: 'youtube://www.youtube.com/user/' + data.user + '?'
          };
        }

        return {
          url: 'https://www.youtube.com/user/' + data.user + '?',
          popup: {
            width: 880,
            height: 350
          }
        };
      },

      // set Instagram follow URL
      instagram: function instagram() {
        return {
          url: 'instagram://camera?'
        };
      },

      // set Instagram follow URL
      instagramFollow: function instagramFollow(data) {
        var ios = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        // if iOS user
        if (ios && data.ios) {
          return {
            url: 'instagram://user?',
            data: data
          };
        }

        return {
          url: 'http://www.instagram.com/' + data.username + '?',
          popup: {
            width: 980,
            height: 655
          }
        };
      },

      // set Snapchat follow URL
      snapchat: function snapchat(data) {
        return {
          url: 'snapchat://add/' + data.username + '?'
        };
      },

      // set Google share URL
      google: function google(data) {
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
      googleMaps: function googleMaps(data) {
        var ios = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

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
      pinterest: function pinterest(data) {
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
      linkedin: function linkedin(data) {
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
      buffer: function buffer(data) {
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
      tumblr: function tumblr(data) {
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
      reddit: function reddit(data) {
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
      flickr: function flickr(data) {
        var ios = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        // if iOS user
        if (ios && data.ios) {
          return {
            url: 'flickr://photos/' + data.username + '?'
          };
        }
        return {
          url: 'http://www.flickr.com/photos/' + data.username + '?',
          popup: {
            width: 600,
            height: 650
          }
        };
      },

      // set WhatsApp share URL
      whatsapp: function whatsapp(data) {
        return {
          url: 'whatsapp://send?',
          data: data
        };
      },

      // set sms share URL
      sms: function sms(data) {
        var ios = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        return {
          url: ios ? 'sms:&' : 'sms:?',
          data: data
        };
      },

      // set Email share URL
      email: function email(data) {
        var url = 'mailto:';

        // if to address specified then add to URL
        if (data.to !== null) {
          url += '' + data.to;
        }

        url += '?';

        return {
          url: url,
          data: {
            subject: data.subject,
            body: data.body
          }
        };
      },

      // set Github fork URL
      github: function github(data) {
        var ios = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        // eslint-disable-line no-unused-vars
        var url = data.repo ? 'https://github.com/' + data.repo : data.url;

        if (data.issue) {
          url += '/issues/new?title=' + data.issue + '&body=' + data.body;
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
      dribbble: function dribbble(data) {
        var ios = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        // eslint-disable-line no-unused-vars
        var url = data.shot ? 'https://dribbble.com/shots/' + data.shot + '?' : data.url + '?';
        return {
          url: url,
          popup: {
            width: 440,
            height: 640
          }
        };
      },
      codepen: function codepen(data) {
        var url = data.pen && data.username && data.view ? 'https://codepen.io/' + data.username + '/' + data.view + '/' + data.pen + '?' : data.url + '?';
        return {
          url: url,
          popup: {
            width: 1200,
            height: 800
          }
        };
      },
      paypal: function paypal(data) {
        return {
          data: data
        };
      }
    };

    /**
     * OpenShare generates a single share link
     */

    var OpenShare = function () {
      function OpenShare(type, transform) {
        _classCallCheck(this, OpenShare);

        this.ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        this.type = type;
        this.dynamic = false;
        this.transform = transform;

        // capitalized type
        this.typeCaps = type.charAt(0).toUpperCase() + type.slice(1);
      }

      // returns function named as type set in constructor
      // e.g twitter()


      _createClass(OpenShare, [{
        key: 'setData',
        value: function setData(data) {
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

      }, {
        key: 'share',
        value: function share() {
          var _this = this;

          // if iOS share URL has been set then use timeout hack
          // test for native app and fall back to web
          if (this.mobileShareUrl) {
            (function () {
              var start = new Date().valueOf();

              setTimeout(function () {
                var end = new Date().valueOf();

                // if the user is still here, fall back to web
                if (end - start > 1600) {
                  return;
                }

                window.location = _this.shareUrl;
              }, 1500);

              window.location = _this.mobileShareUrl;

              // open mailto links in same window
            })();
          } else if (this.type === 'email') {
            window.location = this.shareUrl;

            // open social share URLs in new window
          } else {
            // if popup object present then set window dimensions / position
            if (this.popup && this.transformData.popup) {
              return this.openWindow(this.shareUrl, this.transformData.popup);
            }

            window.open(this.shareUrl);
          }
        }

        // create share URL with GET params
        // appending valid properties to query string

      }, {
        key: 'template',
        value: function template(url, data) {
          //eslint-disable-line
          var nonURLProps = ['appendTo', 'innerHTML', 'classes'];

          var shareUrl = url,
              i = void 0;

          for (i in data) {
            // only append valid properties
            if (!data[i] || nonURLProps.indexOf(i) > -1) {
              continue; //eslint-disable-line
            }

            // append URL encoded GET param to share URL
            data[i] = encodeURIComponent(data[i]);
            shareUrl += i + '=' + data[i] + '&';
          }

          return shareUrl.substr(0, shareUrl.length - 1);
        }

        // center popup window supporting dual screens

      }, {
        key: 'openWindow',
        value: function openWindow(url, options) {
          //eslint-disable-line
          var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left,
              dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top,
              width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,

          //eslint-disable-line
          height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,

          //eslint-disable-line
          left = width / 2 - options.width / 2 + dualScreenLeft,
              top = height / 2 - options.height / 2 + dualScreenTop,
              newWindow = window.open(url, 'OpenShare', 'width=' + options.width + ', height=' + options.height + ', top=' + top + ', left=' + left);

          // Puts focus on the newWindow
          if (window.focus) {
            newWindow.focus();
          }
        }
      }]);

      return OpenShare;
    }();

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
        popUp: osElement.getAttribute('data-open-share-popup'),
        key: osElement.getAttribute('data-open-share-key')
      });
    }

    function share(e, os, openShare) {
      // if dynamic instance then fetch attributes again in case of updates
      if (openShare.dynamic) {
        setData(openShare, os);
      }

      openShare.share(e);

      // trigger shared event
      Events.trigger(os, 'shared');
    }

    // type contains a dash
    // transform to camelcase for function reference
    // TODO: only supports single dash, should should support multiple
    var dashToCamel = function dashToCamel(dash, type) {
      var nextChar = type.substr(dash + 1, 1);
      var group = type.substr(dash, 2);

      type = type.replace(group, nextChar.toUpperCase());
      return type;
    };

    function initializeShareNode(os) {
      // initialize open share object with type attribute
      var type = os.getAttribute('data-open-share');
      var dash = type.indexOf('-');

      if (dash > -1) {
        type = dashToCamel(dash, type);
      }

      var transform = ShareTransforms[type];

      if (!transform) {
        throw new Error('Open Share: ' + type + ' is an invalid type');
      }

      var openShare = new OpenShare(type, transform);

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
      os.addEventListener('click', function (e) {
        share(e, os, openShare);
      });

      os.addEventListener('OpenShare.trigger', function (e) {
        share(e, os, openShare);
      });

      os.setAttribute('data-open-share-node', type);
    }

    function round(x, precision) {
      if (typeof x !== 'number') {
        throw new TypeError('Expected value to be a number');
      }

      var exponent = precision > 0 ? 'e' : 'e-';
      var exponentNeg = precision > 0 ? 'e-' : 'e';
      precision = Math.abs(precision);

      return Number(Math.round(x + exponent + precision) + exponentNeg + precision);
    }

    function thousandify(num) {
      return round(num / 1000, 1) + 'K';
    }

    function millionify(num) {
      return round(num / 1000000, 1) + 'M';
    }

    function countReduce(el, count, cb) {
      if (count > 999999) {
        el.innerHTML = millionify(count);
        if (cb && typeof cb === 'function') cb(el);
      } else if (count > 999) {
        el.innerHTML = thousandify(count);
        if (cb && typeof cb === 'function') cb(el);
      } else {
        el.innerHTML = count;
        if (cb && typeof cb === 'function') cb(el);
      }
    }

    /*
       Sometimes social platforms get confused and drop share counts.
       In this module we check if the returned count is less than the count in
       localstorage.
       If the local count is greater than the returned count,
       we store the local count + the returned count.
       Otherwise, store the returned count.
    */

    var storeCount = function storeCount(t, count) {
      var isArr = t.type.indexOf(',') > -1;
      var local = Number(t.storeGet(t.type + '-' + t.shared));

      if (local > count && !isArr) {
        var latestCount = Number(t.storeGet(t.type + '-' + t.shared + '-latestCount'));
        t.storeSet(t.type + '-' + t.shared + '-latestCount', count);

        count = isNumeric$1(latestCount) && latestCount > 0 ? count += local - latestCount : count += local;
      }

      if (!isArr) t.storeSet(t.type + '-' + t.shared, count);
      return count;
    };

    function isNumeric$1(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * Object of transform functions for each openshare api
     * Transform functions passed into OpenShare instance when instantiated
     * Return object containing URL and key/value args
     */
    var CountTransforms = {

      // facebook count data
      facebook: function facebook(url) {
        return {
          type: 'get',
          url: 'https://graph.facebook.com/?id=' + url,
          transform: function transform(xhr) {
            var fb = JSON.parse(xhr.responseText);

            var count = fb.share && fb.share.share_count || 0;

            return storeCount(this, count);
          }
        };
      },

      // pinterest count data
      pinterest: function pinterest(url) {
        return {
          type: 'jsonp',
          url: 'https://api.pinterest.com/v1/urls/count.json?callback=?&url=' + url,
          transform: function transform(data) {
            var count = data.count || 0;
            return storeCount(this, count);
          }
        };
      },

      // linkedin count data
      linkedin: function linkedin(url) {
        return {
          type: 'jsonp',
          url: 'https://www.linkedin.com/countserv/count/share?url=' + url + '&format=jsonp&callback=?',
          transform: function transform(data) {
            var count = data.count || 0;
            return storeCount(this, count);
          }
        };
      },

      // reddit count data
      reddit: function reddit(url) {
        return {
          type: 'get',
          url: 'https://www.reddit.com/api/info.json?url=' + url,
          transform: function transform(xhr) {
            var reddit = JSON.parse(xhr.responseText);
            var posts = reddit.data && reddit.data.children || null;
            var ups = 0;

            if (posts) {
              posts.forEach(function (post) {
                ups += Number(post.data.ups);
              });
            }

            return storeCount(this, ups);
          }
        };
      },

      // google count data
      google: function google(url) {
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
          url: 'https://clients6.google.com/rpc',
          transform: function transform(xhr) {
            var google = JSON.parse(xhr.responseText);
            var count = google.result && google.result.metadata && google.result.metadata.globalCounts && google.result.metadata.globalCounts.count || 0;
            return storeCount(this, count);
          }
        };
      },

      // github star count
      githubStars: function githubStars(repo) {
        repo = repo.indexOf('github.com/') > -1 ? repo.split('github.com/')[1] : repo;
        return {
          type: 'get',
          url: 'https://api.github.com/repos/' + repo,
          transform: function transform(xhr) {
            var count = JSON.parse(xhr.responseText).stargazers_count || 0;
            return storeCount(this, count);
          }
        };
      },

      // github forks count
      githubForks: function githubForks(repo) {
        repo = repo.indexOf('github.com/') > -1 ? repo.split('github.com/')[1] : repo;
        return {
          type: 'get',
          url: 'https://api.github.com/repos/' + repo,
          transform: function transform(xhr) {
            var count = JSON.parse(xhr.responseText).forks_count || 0;
            return storeCount(this, count);
          }
        };
      },

      // github watchers count
      githubWatchers: function githubWatchers(repo) {
        repo = repo.indexOf('github.com/') > -1 ? repo.split('github.com/')[1] : repo;
        return {
          type: 'get',
          url: 'https://api.github.com/repos/' + repo,
          transform: function transform(xhr) {
            var count = JSON.parse(xhr.responseText).watchers_count || 0;
            return storeCount(this, count);
          }
        };
      },

      // dribbble likes count
      dribbble: function dribbble(shot) {
        shot = shot.indexOf('dribbble.com/shots') > -1 ? shot.split('shots/')[1] : shot;
        var url = 'https://api.dribbble.com/v1/shots/' + shot + '/likes';
        return {
          type: 'get',
          url: url,
          transform: function transform(xhr, Events) {
            var _this2 = this;

            var count = JSON.parse(xhr.responseText).length;

            // at this time dribbble limits a response of 12 likes per page
            if (count === 12) {
              var page = 2;
              recursiveCount(url, page, count, function (finalCount) {
                if (_this2.appendTo && typeof _this2.appendTo !== 'function') {
                  _this2.appendTo.appendChild(_this2.os);
                }
                countReduce(_this2.os, finalCount, _this2.cb);
                Events.trigger(_this2.os, 'counted-' + _this2.url);
                return storeCount(_this2, finalCount);
              });
            } else {
              return storeCount(this, count);
            }
          }
        };
      },
      twitter: function twitter(url) {
        return {
          type: 'get',
          url: 'https://api.openshare.social/job?url=' + url + '&key=',
          transform: function transform(xhr) {
            var count = JSON.parse(xhr.responseText).count || 0;
            return storeCount(this, count);
          }
        };
      }
    };

    function recursiveCount(url, page, count, cb) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url + '?page=' + page);
      xhr.addEventListener('load', function () {
        //eslint-disable-line
        var likes = JSON.parse(this.response);
        count += likes.length;

        // dribbble like per page is 12
        if (likes.length === 12) {
          page++;
          recursiveCount(url, page, count, cb);
        } else {
          cb(count);
        }
      });
      xhr.send();
    }

    /**
     * Generate share count instance from one to many networks
     */

    var Count = function () {
      function Count(type, url) {
        var _this3 = this;

        _classCallCheck(this, Count);

        // throw error if no url provided
        if (!url) {
          throw new Error('Open Share: no url provided for count');
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
          this.typeArr.forEach(function (t) {
            if (!CountTransforms[t]) {
              throw new Error('Open Share: ' + type + ' is an invalid count type');
            }

            _this3.countData.push(CountTransforms[t](url));
          });

          var count = this.storeGet(this.type + '-' + this.shared);

          if (count) {
            if (this.appendTo && typeof this.appendTo !== 'function') {
              this.appendTo.appendChild(this.os);
            }
            countReduce(this.os, count);
          }

          // throw error if invalid type provided
        } else if (!CountTransforms[type]) {
          throw new Error('Open Share: ' + type + ' is an invalid count type');

          // single count
          // store count URL and transform function
        } else {
          this.type = type;
          this.countData = CountTransforms[type](url);
        }
      }

      // handle calling getCount / getCounts
      // depending on number of types


      _createClass(Count, [{
        key: 'count',
        value: function count(os, cb, appendTo) {
          this.os = os;
          this.appendTo = appendTo;
          this.cb = cb;
          this.url = this.os.getAttribute('data-open-share-count');
          this.shared = this.os.getAttribute('data-open-share-count-url');
          this.key = this.os.getAttribute('data-open-share-key');

          if (!Array.isArray(this.countData)) {
            this.getCount();
          } else {
            this.getCounts();
          }
        }

        // fetch count either AJAX or JSONP

      }, {
        key: 'getCount',
        value: function getCount() {
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

      }, {
        key: 'getCounts',
        value: function getCounts() {
          var _this4 = this;

          this.total = [];

          var count = this.storeGet(this.type + '-' + this.shared);

          if (count) {
            if (this.appendTo && typeof this.appendTo !== 'function') {
              this.appendTo.appendChild(this.os);
            }
            countReduce(this.os, count);
          }

          this.countData.forEach(function (countData) {
            _this4[countData.type](countData, function (num) {
              _this4.total.push(num);

              // total counts length now equals type array length
              // so aggregate, store and insert into DOM
              if (_this4.total.length === _this4.typeArr.length) {
                var tot = 0;

                _this4.total.forEach(function (t) {
                  tot += t;
                });

                if (_this4.appendTo && typeof _this4.appendTo !== 'function') {
                  _this4.appendTo.appendChild(_this4.os);
                }

                var local = Number(_this4.storeGet(_this4.type + '-' + _this4.shared));
                if (local > tot) {
                  // const latestCount = Number(this.storeGet(`${this.type}-${this.shared}-latestCount`));
                  // this.storeSet(`${this.type}-${this.shared}-latestCount`, tot);
                  //
                  // tot = isNumeric(latestCount) && latestCount > 0 ?
                  // tot += local - latestCount :
                  // tot += local;
                  tot = local;
                }
                _this4.storeSet(_this4.type + '-' + _this4.shared, tot);

                countReduce(_this4.os, tot);
              }
            });
          });

          if (this.appendTo && typeof this.appendTo !== 'function') {
            this.appendTo.appendChild(this.os);
          }
        }

        // handle JSONP requests

      }, {
        key: 'jsonp',
        value: function jsonp(countData, cb) {
          var _this5 = this;

          // define random callback and assign transform function
          var callback = Math.random().toString(36).substring(7).replace(/[^a-zA-Z]/g, '');
          window[callback] = function (data) {
            var count = countData.transform.apply(_this5, [data]) || 0;

            if (cb && typeof cb === 'function') {
              cb(count);
            } else {
              if (_this5.appendTo && typeof _this5.appendTo !== 'function') {
                _this5.appendTo.appendChild(_this5.os);
              }
              countReduce(_this5.os, count, _this5.cb);
            }

            Events.trigger(_this5.os, 'counted-' + _this5.url);
          };

          // append JSONP script tag to page
          var script = document.createElement('script');
          script.src = countData.url.replace('callback=?', 'callback=' + callback);
          document.getElementsByTagName('head')[0].appendChild(script);

          return;
        }

        // handle AJAX GET request

      }, {
        key: 'get',
        value: function get(countData, cb) {
          var _this6 = this;

          var xhr = new XMLHttpRequest();

          // on success pass response to transform function
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                var count = countData.transform.apply(_this6, [xhr, Events]) || 0;

                if (cb && typeof cb === 'function') {
                  cb(count);
                } else {
                  if (_this6.appendTo && typeof _this6.appendTo !== 'function') {
                    _this6.appendTo.appendChild(_this6.os);
                  }
                  countReduce(_this6.os, count, _this6.cb);
                }

                Events.trigger(_this6.os, 'counted-' + _this6.url);
                return;
              } else if (countData.url.toLowerCase().indexOf('https://api.openshare.social/job?') === 0) {
                console.warn('Please sign up for Twitter counts at https://openshare.social/twitter/auth');
                var _count = 0;

                if (cb && typeof cb === 'function') {
                  cb(_count);
                } else {
                  if (_this6.appendTo && typeof _this6.appendTo !== 'function') {
                    _this6.appendTo.appendChild(_this6.os);
                  }
                  countReduce(_this6.os, _count, _this6.cb);
                }

                Events.trigger(_this6.os, 'counted-' + _this6.url);
              } else {
                console.warn('Failed to get API data from', countData.url, '. Please use the latest version of OpenShare.');
                var _count2 = 0;

                if (cb && typeof cb === 'function') {
                  cb(_count2);
                } else {
                  if (_this6.appendTo && typeof _this6.appendTo !== 'function') {
                    _this6.appendTo.appendChild(_this6.os);
                  }
                  countReduce(_this6.os, _count2, _this6.cb);
                }

                Events.trigger(_this6.os, 'counted-' + _this6.url);
              }
            }
          };

          countData.url = countData.url.startsWith('https://api.openshare.social/job?') && this.key ? countData.url + this.key : countData.url;

          xhr.open('GET', countData.url);
          xhr.send();
        }

        // handle AJAX POST request

      }, {
        key: 'post',
        value: function post(countData, cb) {
          var _this7 = this;

          var xhr = new XMLHttpRequest();

          // on success pass response to transform function
          xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE || xhr.status !== 200) {
              return;
            }

            var count = countData.transform.apply(_this7, [xhr]) || 0;

            if (cb && typeof cb === 'function') {
              cb(count);
            } else {
              if (_this7.appendTo && typeof _this7.appendTo !== 'function') {
                _this7.appendTo.appendChild(_this7.os);
              }
              countReduce(_this7.os, count, _this7.cb);
            }
            Events.trigger(_this7.os, 'counted-' + _this7.url);
          };

          xhr.open('POST', countData.url);
          xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
          xhr.send(JSON.stringify(countData.data));
        }
      }, {
        key: 'storeSet',
        value: function storeSet(type) {
          var count = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
          //eslint-disable-line
          if (!window.localStorage || !type) {
            return;
          }

          localStorage.setItem('OpenShare-' + type, count);
        }
      }, {
        key: 'storeGet',
        value: function storeGet(type) {
          //eslint-disable-line
          if (!window.localStorage || !type) {
            return;
          }

          return localStorage.getItem('OpenShare-' + type);
        }
      }]);

      return Count;
    }();

    function initializeCountNode(os) {
      // initialize open share object with type attribute
      var type = os.getAttribute('data-open-share-count');
      var url = os.getAttribute('data-open-share-count-repo') || os.getAttribute('data-open-share-count-shot') || os.getAttribute('data-open-share-count-url');
      var count = new Count(type, url);

      count.count(os);
      os.setAttribute('data-open-share-node', type);
    }

    function init() {
      init$1({
        selector: {
          share: '[data-open-share]:not([data-open-share-node])',
          count: '[data-open-share-count]:not([data-open-share-node])'
        },
        cb: {
          share: initializeShareNode,
          count: initializeCountNode
        }
      })();
    }
    var DataAttr = function DataAttr() {
      if (document.readyState === 'complete') {
        return init();
      }
      document.addEventListener('readystatechange', function () {
        if (document.readyState === 'complete') {
          init();
        }
      }, false);
    };

    /**
     * Global OpenShare API to generate instances programmatically
     */
    var ShareAPI = function ShareAPI() {
      // global OpenShare referencing internal class for instance generation
      var OpenShare$$1 = function () {
        function OpenShare$$1(data, element) {
          var _this8 = this;

          _classCallCheck(this, OpenShare$$1);

          if (!data.bindClick) data.bindClick = true;

          var dash = data.type.indexOf('-');

          if (dash > -1) {
            data.type = dashToCamel(dash, data.type);
          }

          var node = void 0;
          this.element = element;
          this.data = data;

          this.os = new OpenShare(data.type, ShareTransforms[data.type]);
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
            element.addEventListener('click', function () {
              _this8.share();
            });
          }

          if (data.appendTo) {
            data.appendTo.appendChild(element);
          }

          if (data.classes && Array.isArray(data.classes)) {
            data.classes.forEach(function (cssClass) {
              element.classList.add(cssClass);
            });
          }

          if (data.type.toLowerCase() === 'paypal') {
            var action = data.sandbox ? 'https://www.sandbox.paypal.com/cgi-bin/webscr' : 'https://www.paypal.com/cgi-bin/webscr';

            var buyGIF = data.sandbox ? 'https://www.sandbox.paypal.com/en_US/i/btn/btn_buynow_LG.gif' : 'https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif';

            var pixelGIF = data.sandbox ? 'https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif' : 'https://www.paypalobjects.com/en_US/i/scr/pixel.gif';

            var paypalButton = '<form action=' + action + ' method="post" target="_blank">\n\n        <!-- Saved buttons use the "secure click" command -->\n        <input type="hidden" name="cmd" value="_s-xclick">\n\n        <!-- Saved buttons are identified by their button IDs -->\n        <input type="hidden" name="hosted_button_id" value="' + data.buttonId + '">\n\n        <!-- Saved buttons display an appropriate button image. -->\n        <input type="image" name="submit"\n        src=' + buyGIF + '\n        alt="PayPal - The safer, easier way to pay online">\n        <img alt="" width="1" height="1"\n        src=' + pixelGIF + ' >\n\n        </form>';

            var hiddenDiv = document.createElement('div');
            hiddenDiv.style.display = 'none';
            hiddenDiv.innerHTML = paypalButton;
            document.body.appendChild(hiddenDiv);

            this.paypal = hiddenDiv.querySelector('form');
          }

          this.element = element;
          return element;
        }

        // public share method to trigger share programmatically


        _createClass(OpenShare$$1, [{
          key: 'share',
          value: function share(e) {
            // if dynamic instance then fetch attributes again in case of updates
            if (this.data.dynamic) {
              //eslint-disable-next-line
              this.os.setData(data); // data is not defined
            }

            if (this.data.type.toLowerCase() === 'paypal') {
              this.paypal.submit();
            } else this.os.share(e);

            Events.trigger(this.element, 'shared');
          }
        }]);

        return OpenShare$$1;
      }();

      return OpenShare$$1;
    };

    /**
     * count API
     */

    var CountAPI = function CountAPI() {
      //eslint-disable-line
      // global OpenShare referencing internal class for instance generation
      var Count$$1 = function Count$$1(_ref, cb) {
        var type = _ref.type;
        var url = _ref.url;
        var _ref$appendTo = _ref.appendTo;
        var appendTo = _ref$appendTo === undefined ? false : _ref$appendTo;
        var element = _ref.element;
        var classes = _ref.classes;
        var _ref$key = _ref.key;
        var key = _ref$key === undefined ? null : _ref$key;

        _classCallCheck(this, Count$$1);

        var countNode = document.createElement(element || 'span');

        countNode.setAttribute('data-open-share-count', type);
        countNode.setAttribute('data-open-share-count-url', url);
        if (key) countNode.setAttribute('data-open-share-key', key);

        countNode.classList.add('open-share-count');

        if (classes && Array.isArray(classes)) {
          classes.forEach(function (cssCLass) {
            countNode.classList.add(cssCLass);
          });
        }

        if (appendTo) {
          return new Count(type, url).count(countNode, cb, appendTo);
        }

        return new Count(type, url).count(countNode, cb);
      };

      return Count$$1;
    };

    var browser = function browser() {
      DataAttr(OpenShare, Count, ShareTransforms, Events);
      window.OpenShare = {
        share: ShareAPI(OpenShare, ShareTransforms, Events),
        count: CountAPI(),
        analytics: analytics
      };
    };
    var browser_js = browser();

    module.exports = browser_js;
  }, {}] }, {}, [1]);

},{}],6:[function(require,module,exports){
var trim = require('trim')
  , forEach = require('for-each')
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}
},{"for-each":2,"trim":7}],7:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],8:[function(require,module,exports){
"use strict";
var window = require("global/window")
var isFunction = require("is-function")
var parseHeaders = require("parse-headers")
var xtend = require("xtend")

module.exports = createXHR
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest

forEachArray(["get", "put", "post", "patch", "head", "delete"], function(method) {
    createXHR[method === "delete" ? "del" : method] = function(uri, options, callback) {
        options = initParams(uri, options, callback)
        options.method = method.toUpperCase()
        return _createXHR(options)
    }
})

function forEachArray(array, iterator) {
    for (var i = 0; i < array.length; i++) {
        iterator(array[i])
    }
}

function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function initParams(uri, options, callback) {
    var params = uri

    if (isFunction(options)) {
        callback = options
        if (typeof uri === "string") {
            params = {uri:uri}
        }
    } else {
        params = xtend(options, {uri: uri})
    }

    params.callback = callback
    return params
}

function createXHR(uri, options, callback) {
    options = initParams(uri, options, callback)
    return _createXHR(options)
}

function _createXHR(options) {
    if(typeof options.callback === "undefined"){
        throw new Error("callback argument missing")
    }

    var called = false
    var callback = function cbOnce(err, response, body){
        if(!called){
            called = true
            options.callback(err, response, body)
        }
    }

    function readystatechange() {
        if (xhr.readyState === 4) {
            setTimeout(loadFunc, 0)
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else {
            body = xhr.responseText || getXml(xhr)
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") )
        }
        evt.statusCode = 0
        return callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if(options.useXDR && xhr.status===undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
        } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null

        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        return callback(err, response, response.body)
    }

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
        }else{
            xhr = new createXHR.XMLHttpRequest()
        }
    }

    var key
    var aborted
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer
    var failureResponse = {
        body: undefined,
        headers: {},
        statusCode: 0,
        method: method,
        url: uri,
        rawRequest: xhr
    }

    if ("json" in options && options.json !== false) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json === true ? body : options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.onabort = function(){
        aborted = true;
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            if (aborted) return
            aborted = true//IE9 may still call readystatechange
            xhr.abort("timeout")
            var e = new Error("XMLHttpRequest timeout")
            e.code = "ETIMEDOUT"
            errorFunc(e)
        }, options.timeout )
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    if ("beforeSend" in options &&
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    // Microsoft Edge browser sends "undefined" when send is called with undefined value.
    // XMLHttpRequest spec says to pass null as body to indicate no body
    // See https://github.com/naugtur/xhr/issues/100.
    xhr.send(body || null)

    return xhr


}

function getXml(xhr) {
    // xhr.responseXML will throw Exception "InvalidStateError" or "DOMException"
    // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML.
    try {
        if (xhr.responseType === "document") {
            return xhr.responseXML
        }
        var firefoxBugTakenEffect = xhr.responseXML && xhr.responseXML.documentElement.nodeName === "parsererror"
        if (xhr.responseType === "" && !firefoxBugTakenEffect) {
            return xhr.responseXML
        }
    } catch (e) {}

    return null
}

function noop() {}

},{"global/window":3,"is-function":4,"parse-headers":6,"xtend":9}],9:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mb3ItZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9nbG9iYWwvd2luZG93LmpzIiwibm9kZV9tb2R1bGVzL2lzLWZ1bmN0aW9uL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL29wZW5zaGFyZS9kaXN0L29wZW5zaGFyZS5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZS1oZWFkZXJzL3BhcnNlLWhlYWRlcnMuanMiLCJub2RlX21vZHVsZXMvdHJpbS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy94aHIvaW5kZXguanMiLCJub2RlX21vZHVsZXMveHRlbmQvaW1tdXRhYmxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxRQUFRLFdBQVI7QUFDQSxJQUFNLE1BQU0sUUFBUSxLQUFSLENBQVo7QUFDQSxJQUFNLGdCQUFnQixDQUFDLFFBQUQsRUFBVyxTQUFYLEVBQXNCLFdBQXRCLEVBQW1DLGdCQUFuQyxDQUF0Qjs7QUFFQSxJQUFNLEtBQUs7QUFDVixpQkFBZ0IsU0FBUyxnQkFBVCxDQUEwQix3Q0FBMUIsQ0FETjtBQUVWLFNBQVEsU0FBUyxhQUFULENBQXVCLGlCQUF2QixDQUZFO0FBR1YsTUFBSyxTQUFTLGFBQVQsQ0FBdUIsY0FBdkIsQ0FISztBQUlWLFNBQVEsU0FBUyxjQUFULENBQXdCLFNBQXhCLENBSkU7QUFLVixZQUFXLFNBQVMsY0FBVCxDQUF3QixZQUF4QixDQUxEO0FBTVYsT0FBTSxTQUFTLGdCQUFULENBQTBCLFlBQTFCLENBTkk7QUFPVixTQUFRLFNBQVMsY0FBVCxDQUF3QixnQkFBeEIsQ0FQRTtBQVFWLFVBQVMsU0FBUyxhQUFULENBQXVCLGdCQUF2QixDQVJDO0FBU1YsZUFBYyxTQUFTLGFBQVQsQ0FBdUIsc0JBQXZCLENBVEo7QUFVVixnQkFBZSxTQUFTLGdCQUFULENBQTBCLHVCQUExQixDQVZM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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwicmVxdWlyZSgnb3BlbnNoYXJlJyk7XG5jb25zdCB4aHIgPSByZXF1aXJlKCd4aHInKTtcbmNvbnN0IGFuaW1hdGlvbk1vZHMgPSBbJ3NxdWFyZScsICdkaWFtb25kJywgJ3JlY3RhbmdsZScsICdyZWN0YW5nbGUtdmVydCddO1xuXG5jb25zdCB1aSA9IHtcblx0b3BlblNoYXJlTm9kZXM6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5vcGVuLXNoYXJlLWV4YW1wbGVzIFtkYXRhLW9wZW4tc2hhcmVdJyksXG5cdGJ1cmdlcjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fYnVyZ2VyJyksXG5cdG5hdjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2JyksXG5cdGFwcEtleTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcC1rZXknKSxcblx0c2VjcmV0S2V5OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VjcmV0LWtleScpLFxuXHR1cmxzOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS11cmxdJyksXG5cdHN1Ym1pdDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjY291bnQtc3VibWl0JyksXG5cdGFjY291bnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFjY291bnRdJyksXG5cdGFjY291bnRTZXR1cDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtYWNjb3VudC1zZXR1cF0nKSxcblx0bW9yZVVybHNMaW5rczogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9yZS11cmxzLWxpbmtdJyksXG5cdG1vcmVVcmxzOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1tb3JlLXVybHMtZm9ybV0nKSxcblx0YXBwRXhhbXBsZUxpbms6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFwcC1leGFtcGxlLWxpbmtdJyksXG5cdGFwcEV4YW1wbGU6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWFwcC1leGFtcGxlXScpLFxuXHRzdWNjZXNzOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zdWNjZXNzXScpLFxuXHR1cmxJbnN0cnVjdGlvbjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdXJsLWluc3RydWN0aW9uXScpLFxuXHRkZWxldGVBY2NvdW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1kZWxldGUtYWNjb3VudF0nKSxcblx0c3RhdHVzOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS11cmwtc3RhdHVzXScpLFxuXHRkc3RlY2hyb29tUGFzczogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RzdGVjaHJvb21QYXNzJyksXG5cdHNpZ251cHM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWdudXBzJyksXG59O1xuXG5jb25zdCB2YWxpZGF0ZUZ1bmNzID0ge1xuXHQvLyB2YWxpZGF0ZSBmaWVsZCBiYXNlZCBvbiB2YWx1ZSBiZWluZyBzZXRcblx0Ly8gdW5sZXNzIGN1c3RvbSB2YWxpZGF0ZSBmdW5jdGlvbiBzcGVjaWZpZWRcblx0dmFsaWRhdGU6IChmaWVsZCkgPT4ge1xuXHRcdC8vIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9uIGlzIHNldCBhbmQgcGFzc2VkXG5cdFx0Ly8gb3IgY3VzdG9tIHZhbGlkYXRpb24gZnVuY3Rpb24gaXMgbm90IHNldCBidXQgdmFsdWUgaXNcblx0XHRpZiAoKGZpZWxkLnZhbGlkYXRlICYmIGZpZWxkLnZhbGlkYXRlKGZpZWxkLmlucHV0LnZhbHVlKSkgfHxcblx0XHRcdCghZmllbGQudmFsaWRhdGUgJiYgZmllbGQuaW5wdXQudmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdC8vIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9uIGlzIHNldCBhbmQgZmFpbGVkXG5cdFx0Ly8gb3IgY3VzdG9tIHZhbGlkYXRpb24gZnVuY3Rpb24gbm90IHNldCBhbmQgdmFsdWUgbm90IHNldCBlaXRoZXJcblx0XHR9IGVsc2UgaWYgKChmaWVsZC52YWxpZGF0ZSAmJiAhZmllbGQudmFsaWRhdGUoZmllbGQuaW5wdXQudmFsdWUpKSB8fFxuXHRcdFx0XHRcdCghZmllbGQudmFsaWRhdGUgJiYgIWZpZWxkLmlucHV0LnZhbHVlKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSxcblxuXHQvLyBpZiB2YWx1ZSBzZXQgdGhlbiBpdCBtdXN0IGNvbnRhaW4gaHR0cFxuXHQvLyBpZiBub3Qgc2V0IHRoZW4gd2UgZ29vZFxuXHR2YWxpZGF0ZU9wdGlvbmFsVXJsOiB2YWx1ZSA9PiB7XG5cdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWUuaW5jbHVkZXMoJ2h0dHAnKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSxcbn07XG5cbmNvbnN0IHZhbGlkYXRlRmllbGRzID0gW1xuXHQvLyB0d2l0dGVyIGNvbnN1bWVyIGtleXMgcmVxdWlyZWRcblx0eyBpbnB1dDogdWkuYXBwS2V5IH0sXG5cdHsgaW5wdXQ6IHVpLnNlY3JldEtleSB9LFxuXG5cdC8vIGF0IGxlYXN0IG9uZSBVUkwgcmVxdWlyZWRcblx0e1xuXHRcdGlucHV0OiB1aS51cmxzWzBdLFxuXHRcdHZhbGlkYXRlOiB2YWx1ZSA9PiB2YWx1ZSAmJiB2YWx1ZS5pbmNsdWRlcygnaHR0cCcpLFxuXHR9LFxuXG5cdC8vIG9wdGlvbmFsIFVSTHMsIGlmIHZhbHVlIG11c3QgY29udGFpbiBodHRwXG5cdHtcblx0XHRpbnB1dDogdWkudXJsc1sxXSxcblx0XHR2YWxpZGF0ZTogdmFsaWRhdGVGdW5jcy52YWxpZGF0ZU9wdGlvbmFsVXJsLFxuXHR9LFxuXHR7XG5cdFx0aW5wdXQ6IHVpLnVybHNbMl0sXG5cdFx0dmFsaWRhdGU6IHZhbGlkYXRlRnVuY3MudmFsaWRhdGVPcHRpb25hbFVybCxcblx0fSxcblx0e1xuXHRcdGlucHV0OiB1aS51cmxzWzNdLFxuXHRcdHZhbGlkYXRlOiB2YWxpZGF0ZUZ1bmNzLnZhbGlkYXRlT3B0aW9uYWxVcmwsXG5cdH0sXG5cdHtcblx0XHRpbnB1dDogdWkudXJsc1s0XSxcblx0XHR2YWxpZGF0ZTogdmFsaWRhdGVGdW5jcy52YWxpZGF0ZU9wdGlvbmFsVXJsLFxuXHR9LFxuXTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcblx0Y29uc3QgaW50ZXJ2YWwgPSBuZXcgUmVjdXJyaW5nVGltZXIoYW5pbWF0aW9uTG9vcCwgNjAwMCk7XG5cblx0W10uZm9yRWFjaC5jYWxsKHVpLm9wZW5TaGFyZU5vZGVzLCAobm9kZSkgPT4ge1xuXHRcdGlmICghaXNJblBhZ2Uobm9kZSkpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7XG5cdFx0XHRpbnRlcnZhbC5wYXVzZSgpO1xuXHRcdH0pO1xuXHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcblx0XHRcdGludGVydmFsLnJlc3VtZSgpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRpZiAoaXNJblBhZ2UodWkuYnVyZ2VyKSkge1xuXHRcdHVpLmJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdHVpLmJ1cmdlci5xdWVyeVNlbGVjdG9yKCcuYnVyZ2VyLWljb24nKS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcblx0XHRcdHVpLm5hdi5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmIChpc0luUGFnZSh1aS5zdWJtaXQpKSB7XG5cdFx0Ly8gdmFsaWRhdGUgZmllbGRzIG9uIGJsdXJcblx0XHR2YWxpZGF0ZUZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHtcblx0XHRcdGlmICghZmllbGQuaW5wdXQpIHJldHVybjtcblx0XHRcdGZpZWxkLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiB2YWxpZGF0ZShpKSB7XG5cdFx0XHRcdGNvbnN0IHZhbGlkID0gdmFsaWRhdGVGdW5jcy52YWxpZGF0ZShpKTtcblx0XHRcdFx0aWYgKHZhbGlkKSB7XG5cdFx0XHRcdFx0aS5pbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdhY2NvdW50LWZvcm1fX2lucHV0LS1lcnJvcicpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGkuaW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1mb3JtX19pbnB1dC0tZXJyb3InKTtcblx0XHRcdFx0fVxuXHRcdFx0fS5iaW5kKHRoaXMsIGZpZWxkKSk7XG5cdFx0fSk7XG5cblx0XHR1aS5zdWJtaXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdFx0XHRsZXQgdmFsaWRhdGlvbkZhaWxlZCA9IGZhbHNlLFxuXHRcdFx0XHRmaXJzdEZhaWwgPSBudWxsO1xuXG5cdFx0XHR2YWxpZGF0ZUZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHtcblx0XHRcdFx0aWYgKCFmaWVsZC5pbnB1dCkgcmV0dXJuO1xuXG5cdFx0XHRcdGNvbnN0IHZhbGlkID0gdmFsaWRhdGVGdW5jcy52YWxpZGF0ZShmaWVsZCk7XG5cblx0XHRcdFx0aWYgKCF2YWxpZCkge1xuXHRcdFx0XHRcdHZhbGlkYXRpb25GYWlsZWQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0aWYgKCFmaXJzdEZhaWwpIHtcblx0XHRcdFx0XHRcdGZpcnN0RmFpbCA9IGZpZWxkLmlucHV0O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGZpZWxkLmlucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtZm9ybV9faW5wdXQtLWVycm9yJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAodmFsaWRhdGlvbkZhaWxlZCkge1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IChmaXJzdEZhaWwub2Zmc2V0VG9wIC1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmaXJzdEZhaWwuc2Nyb2xsVG9wICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmaXJzdEZhaWwuY2xpZW50VG9wKSAtIDEwO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHBheWxvYWQgPSB7XG5cdFx0XHRcdGFwcEtleTogaXNJblBhZ2UodWkuYXBwS2V5KSA/IHVpLmFwcEtleS52YWx1ZSA6IG51bGwsXG5cdFx0XHRcdHNlY3JldEtleTogaXNJblBhZ2UodWkuc2VjcmV0S2V5KSA/IHVpLnNlY3JldEtleS52YWx1ZSA6IG51bGwsXG5cdFx0XHRcdHVybHM6IFtdLm1hcC5jYWxsKHVpLnVybHMsIHVybCA9PiB1cmwudmFsdWUpLFxuXHRcdFx0fTtcblxuXHRcdFx0eGhyKHtcblx0XHRcdFx0Ym9keTogSlNPTi5zdHJpbmdpZnkocGF5bG9hZCksXG5cdFx0XHRcdHVybDogJy9yZWdpc3RlcicsXG5cdFx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdH0sIChlcnIsIHJlc3AsIGJvZHkpID0+IHtcblx0XHRcdFx0aWYgKGVycikgY29uc29sZS5lcnJvcihlcnIpO1xuXG5cdFx0XHRcdC8vIFRPRE86IGlmIGZpcnN0IHN1Ym1pc3Npb24gc2xpZGUgdG8gdG9wIHRvIHNob3cgQVBJIGtleXNcblx0XHRcdFx0Ly8gc3Vic2VxdWVudCBzdWJtaXNzaW9ucyBqdXN0IHNob3cgc3VjY2VzcyBtZXNzYWdlXG5cdFx0XHRcdC8vIHBhc3MgdHJ1ZSB0byBzaG93U3VjY2VzcyBpZiBmaXJzdCB0aW1lIHVzZXJcblx0XHRcdFx0Y29uc3QgcmVzID0gSlNPTi5wYXJzZShib2R5KTtcblxuXHRcdFx0XHRpZiAocmVzKSB7XG5cdFx0XHRcdFx0c2hvd1N1Y2Nlc3MocmVzLmZpcnN0VGltZVVzZXIpO1xuXHRcdFx0XHRcdHVpLmFjY291bnRTZXR1cC5pbm5lckhUTUwgPSByZXMuYm9keTtcblx0XHRcdFx0XHR1aS51cmxJbnN0cnVjdGlvbi5pbm5lckhUTUwgPSAnUGFzdGUgdGhlIFVSTHMgeW91IHdhbnQgdG8gY291bnQgaGVyZSc7XG5cblx0XHRcdFx0XHRpZiAocmVzLnNwYW5zKSB7XG5cdFx0XHRcdFx0XHRbXS5mb3JFYWNoLmNhbGwodWkuc3RhdHVzLCAoc3RhdCwgaSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAocmVzLnNwYW5zW2ldKSBzdGF0LmlubmVySFRNTCA9IHJlcy5zcGFuc1tpXTtcblx0XHRcdFx0XHRcdFx0ZWxzZSBzdGF0LmlubmVySFRNTCA9ICcnO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdHVpLm1vcmVVcmxzTGlua3MuZm9yRWFjaChtb3JlVXJsc0xpbmsgPT4ge1xuXHRcdGlmICghaXNJblBhZ2UobW9yZVVybHNMaW5rKSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdG1vcmVVcmxzTGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dWkubW9yZVVybHMuY2xhc3NMaXN0LmFkZCgnbW9yZS11cmxzLS1kaXNwbGF5Jyk7XG5cblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR1aS5tb3JlVXJscy5jbGFzc0xpc3QuYWRkKCdtb3JlLXVybHMtLXNob3cnKTtcblx0XHRcdH0sIDIwMCk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdGlmIChpc0luUGFnZSh1aS5hcHBFeGFtcGxlTGluaykpIHtcblx0XHR1aS5hcHBFeGFtcGxlTGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dWkuYXBwRXhhbXBsZS5jbGFzc0xpc3QuYWRkKCdhY2NvdW50X19hcHAtZXhhbXBsZXMtLWRpc3BsYXknKTtcblx0XHRcdHVpLmFwcEV4YW1wbGVMaW5rLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHR1aS5hcHBFeGFtcGxlLmNsYXNzTGlzdC5hZGQoJ2FjY291bnRfX2FwcC1leGFtcGxlcy0tc2hvdycpO1xuXHRcdFx0fSwgMjAwKTtcblx0XHR9KTtcblx0fVxuXG5cdGlmIChpc0luUGFnZSh1aS5kZWxldGVBY2NvdW50KSkge1xuXHRcdHVpLmRlbGV0ZUFjY291bnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0aWYgKGNvbmZpcm0oJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgeW91ciBhY2NvdW50IGFuZCBzdG9wIGNvdW50aW5nIFR3aXR0ZXIgc2hhcmVzPycpKSB7XG5cdFx0XHRcdHhocih7XG5cdFx0XHRcdFx0Ym9keTogJ2RlbGV0ZScsXG5cdFx0XHRcdFx0dXJsOiAnL2RlbGV0ZScsXG5cdFx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXG5cdFx0XHRcdH0sIGVyciA9PiB7XG5cdFx0XHRcdFx0aWYgKGVycikgY29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9ICcvJztcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRhbmltYXRpb25Mb29wKCk7XG5cdH0sIDEwMDApO1xufSk7XG5cbmlmIChpc0luUGFnZSh1aS5kc3RlY2hyb29tUGFzcykpIHtcblx0dWkuZHN0ZWNocm9vbVBhc3MuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBlID0+IHtcblx0XHRpZiAoZS5rZXlDb2RlID09PSAxMykge1xuXHRcdFx0Y29uc3QgcGF5bG9hZCA9IHtcblx0XHRcdFx0cGFzc3dvcmQ6IHVpLmRzdGVjaHJvb21QYXNzLnZhbHVlLFxuXHRcdFx0fTtcblx0XHRcdHhocih7XG5cdFx0XHRcdGJvZHk6IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpLFxuXHRcdFx0XHR1cmw6ICcvZHN0ZWNocm9vbScsXG5cdFx0XHRcdGhlYWRlcnM6IHtcblx0XHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcblx0XHRcdH0sIChlcnIsIHJlc3AsIGJvZHkpID0+IHtcblx0XHRcdFx0aWYgKGVycikgY29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0XHR1aS5kc3RlY2hyb29tUGFzcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHVpLmRzdGVjaHJvb21QYXNzKTtcblx0XHRcdFx0Y29uc3QgdXNlcnMgPSBKU09OLnBhcnNlKGJvZHkpO1xuXHRcdFx0XHRsZXQgdGVtcGxhdGUgPSAnPGgxPlNpZ24gVXBzPC9oMT4nO1xuXHRcdFx0XHR1c2Vycy5mb3JFYWNoKHVzZXIgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGxpbmsgPSBgPGRpdiBzdHlsZT0nbWFyZ2luOiAuNWVtOyc+XG5cdFx0XHRcdFx0XHQ8YVxuXHRcdFx0XHRcdFx0c3R5bGU9J2NvbG9yOiAjZmZmOyBmb250LXNpemU6IDEuM2VtOydcblx0XHRcdFx0XHRcdGhyZWY9J2h0dHBzOi8vdHdpdHRlci5jb20vJHt1c2VyfSc+XG5cdFx0XHRcdFx0XHRcdEAke3VzZXJ9XG5cdFx0XHRcdFx0XHQ8L2E+XG5cdFx0XHRcdFx0PC9kaXY+YDtcblx0XHRcdFx0XHR0ZW1wbGF0ZSArPSBsaW5rO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0dWkuc2lnbnVwcy5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcblx0XHRcdFx0Y29uc29sZS5sb2codWkuc2lnbnVwcywgdGVtcGxhdGUpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuZnVuY3Rpb24gc2hvd1N1Y2Nlc3MoZmlyc3RUaW1lKSB7XG5cdGlmIChmaXJzdFRpbWUpIHtcblx0XHRkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IHVpLmFjY291bnQub2Zmc2V0VG9wIC1cblx0XHRcdFx0XHRcdFx0XHRcdHVpLmFjY291bnQuc2Nyb2xsVG9wICtcblx0XHRcdFx0XHRcdFx0XHRcdHVpLmFjY291bnQuY2xpZW50VG9wO1xuXHR9XG5cblx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0dWkuc3VjY2Vzcy5jbGFzc0xpc3QuYWRkKCdhY2NvdW50X19zdWNjZXNzLS1hY3RpdmUnKTtcblx0fSwgMjAwKTtcblxuXHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHR1aS5zdWNjZXNzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjY291bnRfX3N1Y2Nlc3MtLWFjdGl2ZScpO1xuXHR9LCAyMDAwKTtcbn1cblxuZnVuY3Rpb24gVGltZXIoY2FsbGJhY2ssIGRlbGF5KSB7XG5cdGxldCB0aW1lcklkLFxuXHRcdHN0YXJ0LFxuXHRcdHJlbWFpbmluZyA9IGRlbGF5O1xuXG5cdHRoaXMucGF1c2UgPSAoKSA9PiB7XG5cdFx0d2luZG93LmNsZWFyVGltZW91dCh0aW1lcklkKTtcblx0XHRyZW1haW5pbmcgLT0gbmV3IERhdGUoKSAtIHN0YXJ0O1xuXHR9O1xuXG5cdHRoaXMucmVzdW1lID0gKCkgPT4ge1xuXHRcdHN0YXJ0ID0gbmV3IERhdGUoKTtcblx0XHR3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuXHRcdHRpbWVySWQgPSB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgcmVtYWluaW5nKTtcblx0fTtcblxuXHR0aGlzLnJlc3VtZSgpO1xufVxuXG5cbmZ1bmN0aW9uIFJlY3VycmluZ1RpbWVyKGNhbGxiYWNrLCBkZWxheSkge1xuXHRsZXQgdGltZXJJZCxcblx0XHRzdGFydCxcblx0XHRyZW1haW5pbmcgPSBkZWxheTtcblxuXHR0aGlzLnBhdXNlID0gKCkgPT4ge1xuXHRcdHdpbmRvdy5jbGVhclRpbWVvdXQodGltZXJJZCk7XG5cdFx0cmVtYWluaW5nIC09IG5ldyBEYXRlKCkgLSBzdGFydDtcblx0fTtcblxuXHRjb25zdCByZXN1bWUgPSAoKSA9PiB7XG5cdFx0c3RhcnQgPSBuZXcgRGF0ZSgpO1xuXHRcdHRpbWVySWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRyZW1haW5pbmcgPSBkZWxheTtcblx0XHRcdHJlc3VtZSgpO1xuXHRcdFx0Y2FsbGJhY2soKTtcblx0XHR9LCByZW1haW5pbmcpO1xuXHR9O1xuXG5cdHRoaXMucmVzdW1lID0gcmVzdW1lO1xuXG5cdHRoaXMucmVzdW1lKCk7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGlvbkxvb3AoKSB7XG5cdC8vIGxvb3AgdGhyb3VnaCBlYWNoIGFuaW1hdGlvbiBtb2RpZmllclxuXHRhbmltYXRpb25Nb2RzLmZvckVhY2goKG1vZCwgaSkgPT4ge1xuXHRcdC8vIHdhaXQgYSBzZWNvbmQgaW4gYmV0d2VlbiBlYWNoIGFuaW1hdGlvbiBzZWdtZW50XG5cdFx0Y29uc3QgdGltZXIgPSBuZXcgVGltZXIoKCkgPT4ge1xuXHRcdFx0Ly8gbG9vcCB0aHJvdWdoIG9wZW4gc2hhcmUgbm9kZXNcblx0XHRcdFtdLmZvckVhY2guY2FsbCh1aS5vcGVuU2hhcmVOb2RlcywgKG5vZGUsIGopID0+IHtcblx0XHRcdFx0Ly8gZGVsYXkgYnkgaW5kZXggKiAxMDBtc1xuXHRcdFx0XHRuZXcgVGltZXIoZnVuY3Rpb24gdGltZXJDYWxsYmFjaygpIHtcblx0XHRcdFx0XHQvLyBvdXQgb2YgbW9kcyBzbyByZXNldFxuXHRcdFx0XHRcdGlmICghbW9kKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnb3Blbi1zaGFyZS1leGFtcGxlJyk7XG5cblx0XHRcdFx0XHQvLyBhcHBseSBtb2Rcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgYG9wZW4tc2hhcmUtZXhhbXBsZS0tJHttb2R9YCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGJpbmQgbm9kZSB0byBzZXRUaW1lb3V0IHNvIHJlZmVyZW5jZSBkb2Vzbid0IGNoYW5nZSBvbiBlYWNoIGxvb3Bcblx0XHRcdFx0fS5iaW5kKG5vZGUpLCBqICogMTAwKTtcblx0XHRcdH0pO1xuXHRcdH0sIGkgKiAxMDAwKTtcblxuXHRcdFtdLmZvckVhY2guY2FsbCh1aS5vcGVuU2hhcmVOb2RlcywgKG5vZGUpID0+IHtcblx0XHRcdG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHtcblx0XHRcdFx0dGltZXIucGF1c2UoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG5cdFx0XHRcdHRpbWVyLnJlc3VtZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBpc0luUGFnZShub2RlKSB7XG5cdHJldHVybiAobm9kZSA9PT0gZG9jdW1lbnQuYm9keSkgPyBmYWxzZSA6IGRvY3VtZW50LmJvZHkuY29udGFpbnMobm9kZSk7XG59XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2lzLWZ1bmN0aW9uJylcblxubW9kdWxlLmV4cG9ydHMgPSBmb3JFYWNoXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlcblxuZnVuY3Rpb24gZm9yRWFjaChsaXN0LCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXNGdW5jdGlvbihpdGVyYXRvcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaXRlcmF0b3IgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgY29udGV4dCA9IHRoaXNcbiAgICB9XG4gICAgXG4gICAgaWYgKHRvU3RyaW5nLmNhbGwobGlzdCkgPT09ICdbb2JqZWN0IEFycmF5XScpXG4gICAgICAgIGZvckVhY2hBcnJheShsaXN0LCBpdGVyYXRvciwgY29udGV4dClcbiAgICBlbHNlIGlmICh0eXBlb2YgbGlzdCA9PT0gJ3N0cmluZycpXG4gICAgICAgIGZvckVhY2hTdHJpbmcobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpXG4gICAgZWxzZVxuICAgICAgICBmb3JFYWNoT2JqZWN0KGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoQXJyYXkoYXJyYXksIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGFycmF5LCBpKSkge1xuICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBhcnJheVtpXSwgaSwgYXJyYXkpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZvckVhY2hTdHJpbmcoc3RyaW5nLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzdHJpbmcubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgLy8gbm8gc3VjaCB0aGluZyBhcyBhIHNwYXJzZSBzdHJpbmcuXG4gICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgc3RyaW5nLmNoYXJBdChpKSwgaSwgc3RyaW5nKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZm9yRWFjaE9iamVjdChvYmplY3QsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgayBpbiBvYmplY3QpIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrKSkge1xuICAgICAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmplY3Rba10sIGssIG9iamVjdClcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsInZhciB3aW47XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luID0gZ2xvYmFsO1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgd2luID0gc2VsZjtcbn0gZWxzZSB7XG4gICAgd2luID0ge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd2luO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcblxuZnVuY3Rpb24gaXNGdW5jdGlvbiAoZm4pIHtcbiAgdmFyIHN0cmluZyA9IHRvU3RyaW5nLmNhbGwoZm4pXG4gIHJldHVybiBzdHJpbmcgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScgfHxcbiAgICAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nICYmIHN0cmluZyAhPT0gJ1tvYmplY3QgUmVnRXhwXScpIHx8XG4gICAgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgIC8vIElFOCBhbmQgYmVsb3dcbiAgICAgKGZuID09PSB3aW5kb3cuc2V0VGltZW91dCB8fFxuICAgICAgZm4gPT09IHdpbmRvdy5hbGVydCB8fFxuICAgICAgZm4gPT09IHdpbmRvdy5jb25maXJtIHx8XG4gICAgICBmbiA9PT0gd2luZG93LnByb21wdCkpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scik7fXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFRyaWdnZXIgY3VzdG9tIE9wZW5TaGFyZSBuYW1lc3BhY2VkIGV2ZW50XG4gKi9cblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxudmFyIEV2ZW50cyA9IHtcbiAgdHJpZ2dlcjogZnVuY3Rpb24gdHJpZ2dlcihlbGVtZW50LCBldmVudCkge1xuICAgIHZhciBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgIGV2LmluaXRFdmVudCgnT3BlblNoYXJlLicgKyBldmVudCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2KTtcbiAgfVxufTtcblxudmFyIGFuYWx5dGljcyA9IGZ1bmN0aW9uIGFuYWx5dGljcyh0eXBlLCBjYikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIHZhciBpc0dBID0gdHlwZSA9PT0gJ2V2ZW50JyB8fCB0eXBlID09PSAnc29jaWFsJztcbiAgdmFyIGlzVGFnTWFuYWdlciA9IHR5cGUgPT09ICd0YWdNYW5hZ2VyJztcblxuICBpZiAoaXNHQSkgY2hlY2tJZkFuYWx5dGljc0xvYWRlZCh0eXBlLCBjYik7XG4gIGlmIChpc1RhZ01hbmFnZXIpIHNldFRhZ01hbmFnZXIoY2IpO1xufTtcblxuZnVuY3Rpb24gY2hlY2tJZkFuYWx5dGljc0xvYWRlZCh0eXBlLCBjYikge1xuICBpZiAod2luZG93LmdhKSB7XG4gICAgaWYgKGNiKSBjYigpO1xuICAgIC8vIGJpbmQgdG8gc2hhcmVkIGV2ZW50IG9uIGVhY2ggaW5kaXZpZHVhbCBub2RlXG4gICAgbGlzdGVuKGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgcGxhdGZvcm0gPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZScpO1xuICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWxpbmsnKSB8fCBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS11cmwnKSB8fCBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS11c2VybmFtZScpIHx8IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWNlbnRlcicpIHx8IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXNlYXJjaCcpIHx8IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWJvZHknKTtcblxuICAgICAgaWYgKHR5cGUgPT09ICdldmVudCcpIHtcbiAgICAgICAgZ2EoJ3NlbmQnLCAnZXZlbnQnLCB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiAgICAgICAgICBldmVudENhdGVnb3J5OiAnT3BlblNoYXJlIENsaWNrJyxcbiAgICAgICAgICBldmVudEFjdGlvbjogcGxhdGZvcm0sXG4gICAgICAgICAgZXZlbnRMYWJlbDogdGFyZ2V0LFxuICAgICAgICAgIHRyYW5zcG9ydDogJ2JlYWNvbidcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlID09PSAnc29jaWFsJykge1xuICAgICAgICBnYSgnc2VuZCcsIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuICAgICAgICAgIGhpdFR5cGU6ICdzb2NpYWwnLFxuICAgICAgICAgIHNvY2lhbE5ldHdvcms6IHBsYXRmb3JtLFxuICAgICAgICAgIHNvY2lhbEFjdGlvbjogJ3NoYXJlJyxcbiAgICAgICAgICBzb2NpYWxUYXJnZXQ6IHRhcmdldFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGNoZWNrSWZBbmFseXRpY3NMb2FkZWQodHlwZSwgY2IpO1xuICAgIH0sIDEwMDApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFRhZ01hbmFnZXIoY2IpIHtcbiAgaWYgKHdpbmRvdy5kYXRhTGF5ZXIgJiYgd2luZG93LmRhdGFMYXllclswXVsnZ3RtLnN0YXJ0J10pIHtcbiAgICBpZiAoY2IpIGNiKCk7XG5cbiAgICBsaXN0ZW4ob25TaGFyZVRhZ01hbmdlcik7XG5cbiAgICBnZXRDb3VudHMoZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciBjb3VudCA9IGUudGFyZ2V0ID8gZS50YXJnZXQuaW5uZXJIVE1MIDogZS5pbm5lckhUTUw7XG5cbiAgICAgIHZhciBwbGF0Zm9ybSA9IGUudGFyZ2V0ID8gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtY291bnQtdXJsJykgOiBlLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWNvdW50LXVybCcpO1xuXG4gICAgICB3aW5kb3cuZGF0YUxheWVyLnB1c2goe1xuICAgICAgICBldmVudDogJ09wZW5TaGFyZSBDb3VudCcsXG4gICAgICAgIHBsYXRmb3JtOiBwbGF0Zm9ybSxcbiAgICAgICAgcmVzb3VyY2U6IGNvdW50LFxuICAgICAgICBhY3Rpdml0eTogJ2NvdW50J1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBzZXRUYWdNYW5hZ2VyKGNiKTtcbiAgICB9LCAxMDAwKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBsaXN0ZW4oY2IpIHtcbiAgLy8gYmluZCB0byBzaGFyZWQgZXZlbnQgb24gZWFjaCBpbmRpdmlkdWFsIG5vZGVcbiAgW10uZm9yRWFjaC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW9wZW4tc2hhcmVdJyksIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdPcGVuU2hhcmUuc2hhcmVkJywgY2IpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q291bnRzKGNiKSB7XG4gIHZhciBjb3VudE5vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1vcGVuLXNoYXJlLWNvdW50XScpO1xuXG4gIFtdLmZvckVhY2guY2FsbChjb3VudE5vZGUsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKG5vZGUudGV4dENvbnRlbnQpIGNiKG5vZGUpO2Vsc2Ugbm9kZS5hZGRFdmVudExpc3RlbmVyKCdPcGVuU2hhcmUuY291bnRlZC0nICsgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1jb3VudC11cmwnKSwgY2IpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gb25TaGFyZVRhZ01hbmdlcihlKSB7XG4gIHZhciBwbGF0Zm9ybSA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlJyk7XG4gIHZhciB0YXJnZXQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1saW5rJykgfHwgZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtdXJsJykgfHwgZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtdXNlcm5hbWUnKSB8fCBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1jZW50ZXInKSB8fCBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1zZWFyY2gnKSB8fCBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1ib2R5Jyk7XG5cbiAgd2luZG93LmRhdGFMYXllci5wdXNoKHtcbiAgICBldmVudDogJ09wZW5TaGFyZSBTaGFyZScsXG4gICAgcGxhdGZvcm06IHBsYXRmb3JtLFxuICAgIHJlc291cmNlOiB0YXJnZXQsXG4gICAgYWN0aXZpdHk6ICdzaGFyZSdcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVOb2RlcyhvcHRzKSB7XG4gIC8vIGxvb3AgdGhyb3VnaCBvcGVuIHNoYXJlIG5vZGUgY29sbGVjdGlvblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIC8vIGNoZWNrIGZvciBhbmFseXRpY3NcbiAgICBjaGVja0FuYWx5dGljcygpO1xuXG4gICAgaWYgKG9wdHMuYXBpKSB7XG4gICAgICB2YXIgbm9kZXMgPSBvcHRzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKG9wdHMuc2VsZWN0b3IpO1xuICAgICAgW10uZm9yRWFjaC5jYWxsKG5vZGVzLCBvcHRzLmNiKTtcblxuICAgICAgLy8gdHJpZ2dlciBjb21wbGV0ZWQgZXZlbnRcbiAgICAgIEV2ZW50cy50cmlnZ2VyKGRvY3VtZW50LCBvcHRzLmFwaSArICctbG9hZGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGxvb3AgdGhyb3VnaCBvcGVuIHNoYXJlIG5vZGUgY29sbGVjdGlvblxuICAgICAgdmFyIHNoYXJlTm9kZXMgPSBvcHRzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKG9wdHMuc2VsZWN0b3Iuc2hhcmUpO1xuICAgICAgW10uZm9yRWFjaC5jYWxsKHNoYXJlTm9kZXMsIG9wdHMuY2Iuc2hhcmUpO1xuXG4gICAgICAvLyB0cmlnZ2VyIGNvbXBsZXRlZCBldmVudFxuICAgICAgRXZlbnRzLnRyaWdnZXIoZG9jdW1lbnQsICdzaGFyZS1sb2FkZWQnKTtcblxuICAgICAgLy8gbG9vcCB0aHJvdWdoIGNvdW50IG5vZGUgY29sbGVjdGlvblxuICAgICAgdmFyIGNvdW50Tm9kZXMgPSBvcHRzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKG9wdHMuc2VsZWN0b3IuY291bnQpO1xuICAgICAgW10uZm9yRWFjaC5jYWxsKGNvdW50Tm9kZXMsIG9wdHMuY2IuY291bnQpO1xuXG4gICAgICAvLyB0cmlnZ2VyIGNvbXBsZXRlZCBldmVudFxuICAgICAgRXZlbnRzLnRyaWdnZXIoZG9jdW1lbnQsICdjb3VudC1sb2FkZWQnKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNoZWNrQW5hbHl0aWNzKCkge1xuICAvLyBjaGVjayBmb3IgYW5hbHl0aWNzXG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1vcGVuLXNoYXJlLWFuYWx5dGljc10nKSkge1xuICAgIHZhciBwcm92aWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLW9wZW4tc2hhcmUtYW5hbHl0aWNzXScpLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWFuYWx5dGljcycpO1xuXG4gICAgaWYgKHByb3ZpZGVyLmluZGV4T2YoJywnKSA+IC0xKSB7XG4gICAgICB2YXIgcHJvdmlkZXJzID0gcHJvdmlkZXIuc3BsaXQoJywnKTtcbiAgICAgIHByb3ZpZGVycy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgIHJldHVybiBhbmFseXRpY3MocCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgYW5hbHl0aWNzKHByb3ZpZGVyKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplV2F0Y2hlcih3YXRjaGVyLCBmbikge1xuICBbXS5mb3JFYWNoLmNhbGwod2F0Y2hlciwgZnVuY3Rpb24gKHcpIHtcbiAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAvLyB0YXJnZXQgd2lsbCBtYXRjaCBiZXR3ZWVuIGFsbCBtdXRhdGlvbnMgc28ganVzdCB1c2UgZmlyc3RcbiAgICAgIGZuKG11dGF0aW9uc1swXS50YXJnZXQpO1xuICAgIH0pO1xuXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZSh3LCB7XG4gICAgICBjaGlsZExpc3Q6IHRydWVcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXQkMShvcHRzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGluaXROb2RlcyA9IGluaXRpYWxpemVOb2Rlcyh7XG4gICAgICBhcGk6IG9wdHMuYXBpIHx8IG51bGwsXG4gICAgICBjb250YWluZXI6IG9wdHMuY29udGFpbmVyIHx8IGRvY3VtZW50LFxuICAgICAgc2VsZWN0b3I6IG9wdHMuc2VsZWN0b3IsXG4gICAgICBjYjogb3B0cy5jYlxuICAgIH0pO1xuXG4gICAgaW5pdE5vZGVzKCk7XG5cbiAgICAvLyBjaGVjayBmb3IgbXV0YXRpb24gb2JzZXJ2ZXJzIGJlZm9yZSB1c2luZywgSUUxMSBvbmx5XG4gICAgaWYgKHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGluaXRpYWxpemVXYXRjaGVyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW9wZW4tc2hhcmUtd2F0Y2hdJyksIGluaXROb2Rlcyk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIE9iamVjdCBvZiB0cmFuc2Zvcm0gZnVuY3Rpb25zIGZvciBlYWNoIG9wZW5zaGFyZSBhcGlcbiAqIFRyYW5zZm9ybSBmdW5jdGlvbnMgcGFzc2VkIGludG8gT3BlblNoYXJlIGluc3RhbmNlIHdoZW4gaW5zdGFudGlhdGVkXG4gKiBSZXR1cm4gb2JqZWN0IGNvbnRhaW5pbmcgVVJMIGFuZCBrZXkvdmFsdWUgYXJnc1xuICovXG52YXIgU2hhcmVUcmFuc2Zvcm1zID0ge1xuXG4gIC8vIHNldCBUd2l0dGVyIHNoYXJlIFVSTFxuICB0d2l0dGVyOiBmdW5jdGlvbiB0d2l0dGVyKGRhdGEpIHtcbiAgICB2YXIgaW9zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XG5cbiAgICAvLyBpZiBpT1MgdXNlciBhbmQgaW9zIGRhdGEgYXR0cmlidXRlIGRlZmluZWRcbiAgICAvLyBidWlsZCBpT1MgVVJMIHNjaGVtZSBhcyBzaW5nbGUgc3RyaW5nXG4gICAgaWYgKGlvcyAmJiBkYXRhLmlvcykge1xuICAgICAgdmFyIG1lc3NhZ2UgPSAnJztcblxuICAgICAgaWYgKGRhdGEudGV4dCkge1xuICAgICAgICBtZXNzYWdlICs9IGRhdGEudGV4dDtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEudXJsKSB7XG4gICAgICAgIG1lc3NhZ2UgKz0gJyAtICcgKyBkYXRhLnVybDtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEuaGFzaHRhZ3MpIHtcbiAgICAgICAgdmFyIHRhZ3MgPSBkYXRhLmhhc2h0YWdzLnNwbGl0KCcsJyk7XG4gICAgICAgIHRhZ3MuZm9yRWFjaChmdW5jdGlvbiAodGFnKSB7XG4gICAgICAgICAgbWVzc2FnZSArPSAnICMnICsgdGFnO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEudmlhKSB7XG4gICAgICAgIG1lc3NhZ2UgKz0gJyB2aWEgJyArIGRhdGEudmlhO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cmw6ICd0d2l0dGVyOi8vcG9zdD8nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1cmw6ICdodHRwczovL3R3aXR0ZXIuY29tL3NoYXJlPycsXG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgcG9wdXA6IHtcbiAgICAgICAgd2lkdGg6IDcwMCxcbiAgICAgICAgaGVpZ2h0OiAyOTZcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG5cbiAgLy8gc2V0IFR3aXR0ZXIgcmV0d2VldCBVUkxcbiAgdHdpdHRlclJldHdlZXQ6IGZ1bmN0aW9uIHR3aXR0ZXJSZXR3ZWV0KGRhdGEpIHtcbiAgICB2YXIgaW9zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XG5cbiAgICAvLyBpZiBpT1MgdXNlciBhbmQgaW9zIGRhdGEgYXR0cmlidXRlIGRlZmluZWRcbiAgICBpZiAoaW9zICYmIGRhdGEuaW9zKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cmw6ICd0d2l0dGVyOi8vc3RhdHVzPycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBpZDogZGF0YS50d2VldElkXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3JldHdlZXQ/JyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdHdlZXRfaWQ6IGRhdGEudHdlZXRJZCxcbiAgICAgICAgcmVsYXRlZDogZGF0YS5yZWxhdGVkXG4gICAgICB9LFxuICAgICAgcG9wdXA6IHtcbiAgICAgICAgd2lkdGg6IDcwMCxcbiAgICAgICAgaGVpZ2h0OiAyOTZcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG5cbiAgLy8gc2V0IFR3aXR0ZXIgbGlrZSBVUkxcbiAgdHdpdHRlckxpa2U6IGZ1bmN0aW9uIHR3aXR0ZXJMaWtlKGRhdGEpIHtcbiAgICB2YXIgaW9zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XG5cbiAgICAvLyBpZiBpT1MgdXNlciBhbmQgaW9zIGRhdGEgYXR0cmlidXRlIGRlZmluZWRcbiAgICBpZiAoaW9zICYmIGRhdGEuaW9zKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cmw6ICd0d2l0dGVyOi8vc3RhdHVzPycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBpZDogZGF0YS50d2VldElkXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L2Zhdm9yaXRlPycsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHR3ZWV0X2lkOiBkYXRhLnR3ZWV0SWQsXG4gICAgICAgIHJlbGF0ZWQ6IGRhdGEucmVsYXRlZFxuICAgICAgfSxcbiAgICAgIHBvcHVwOiB7XG4gICAgICAgIHdpZHRoOiA3MDAsXG4gICAgICAgIGhlaWdodDogMjk2XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuXG4gIC8vIHNldCBUd2l0dGVyIGZvbGxvdyBVUkxcbiAgdHdpdHRlckZvbGxvdzogZnVuY3Rpb24gdHdpdHRlckZvbGxvdyhkYXRhKSB7XG4gICAgdmFyIGlvcyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuXG4gICAgLy8gaWYgaU9TIHVzZXIgYW5kIGlvcyBkYXRhIGF0dHJpYnV0ZSBkZWZpbmVkXG4gICAgaWYgKGlvcyAmJiBkYXRhLmlvcykge1xuICAgICAgdmFyIGlvc0RhdGEgPSBkYXRhLnNjcmVlbk5hbWUgPyB7XG4gICAgICAgIHNjcmVlbl9uYW1lOiBkYXRhLnNjcmVlbk5hbWVcbiAgICAgIH0gOiB7XG4gICAgICAgIGlkOiBkYXRhLnVzZXJJZFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXJsOiAndHdpdHRlcjovL3VzZXI/JyxcbiAgICAgICAgZGF0YTogaW9zRGF0YVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiAnaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdXNlcj8nLFxuICAgICAgZGF0YToge1xuICAgICAgICBzY3JlZW5fbmFtZTogZGF0YS5zY3JlZW5OYW1lLFxuICAgICAgICB1c2VyX2lkOiBkYXRhLnVzZXJJZFxuICAgICAgfSxcbiAgICAgIHBvcHVwOiB7XG4gICAgICAgIHdpZHRoOiA3MDAsXG4gICAgICAgIGhlaWdodDogMjk2XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuXG4gIC8vIHNldCBGYWNlYm9vayBzaGFyZSBVUkxcbiAgZmFjZWJvb2s6IGZ1bmN0aW9uIGZhY2Vib29rKGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2RpYWxvZy9mZWVkP2FwcF9pZD05NjEzNDI1NDM5MjIzMjImcmVkaXJlY3RfdXJpPWh0dHA6Ly9mYWNlYm9vay5jb20mJyxcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBwb3B1cDoge1xuICAgICAgICB3aWR0aDogNTYwLFxuICAgICAgICBoZWlnaHQ6IDU5M1xuICAgICAgfVxuICAgIH07XG4gIH0sXG5cblxuICAvLyBzZXQgRmFjZWJvb2sgc2VuZCBVUkxcbiAgZmFjZWJvb2tTZW5kOiBmdW5jdGlvbiBmYWNlYm9va1NlbmQoZGF0YSkge1xuICAgIHJldHVybiB7XG4gICAgICB1cmw6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vZGlhbG9nL3NlbmQ/YXBwX2lkPTk2MTM0MjU0MzkyMjMyMiZyZWRpcmVjdF91cmk9aHR0cDovL2ZhY2Vib29rLmNvbSYnLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIHBvcHVwOiB7XG4gICAgICAgIHdpZHRoOiA5ODAsXG4gICAgICAgIGhlaWdodDogNTk2XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuXG4gIC8vIHNldCBZb3VUdWJlIHBsYXkgVVJMXG4gIHlvdXR1YmU6IGZ1bmN0aW9uIHlvdXR1YmUoZGF0YSkge1xuICAgIHZhciBpb3MgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIC8vIGlmIGlPUyB1c2VyXG4gICAgaWYgKGlvcyAmJiBkYXRhLmlvcykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXJsOiAneW91dHViZTonICsgZGF0YS52aWRlbyArICc/J1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj0nICsgZGF0YS52aWRlbyArICc/JyxcbiAgICAgIHBvcHVwOiB7XG4gICAgICAgIHdpZHRoOiAxMDg2LFxuICAgICAgICBoZWlnaHQ6IDYwOFxuICAgICAgfVxuICAgIH07XG4gIH0sXG5cblxuICAvLyBzZXQgWW91VHViZSBzdWJjcmliZSBVUkxcbiAgeW91dHViZVN1YnNjcmliZTogZnVuY3Rpb24geW91dHViZVN1YnNjcmliZShkYXRhKSB7XG4gICAgdmFyIGlvcyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuXG4gICAgLy8gaWYgaU9TIHVzZXJcbiAgICBpZiAoaW9zICYmIGRhdGEuaW9zKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cmw6ICd5b3V0dWJlOi8vd3d3LnlvdXR1YmUuY29tL3VzZXIvJyArIGRhdGEudXNlciArICc/J1xuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vdXNlci8nICsgZGF0YS51c2VyICsgJz8nLFxuICAgICAgcG9wdXA6IHtcbiAgICAgICAgd2lkdGg6IDg4MCxcbiAgICAgICAgaGVpZ2h0OiAzNTBcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG5cbiAgLy8gc2V0IEluc3RhZ3JhbSBmb2xsb3cgVVJMXG4gIGluc3RhZ3JhbTogZnVuY3Rpb24gaW5zdGFncmFtKCkge1xuICAgIHJldHVybiB7XG4gICAgICB1cmw6ICdpbnN0YWdyYW06Ly9jYW1lcmE/J1xuICAgIH07XG4gIH0sXG5cblxuICAvLyBzZXQgSW5zdGFncmFtIGZvbGxvdyBVUkxcbiAgaW5zdGFncmFtRm9sbG93OiBmdW5jdGlvbiBpbnN0YWdyYW1Gb2xsb3coZGF0YSkge1xuICAgIHZhciBpb3MgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIC8vIGlmIGlPUyB1c2VyXG4gICAgaWYgKGlvcyAmJiBkYXRhLmlvcykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXJsOiAnaW5zdGFncmFtOi8vdXNlcj8nLFxuICAgICAgICBkYXRhOiBkYXRhXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1cmw6ICdodHRwOi8vd3d3Lmluc3RhZ3JhbS5jb20vJyArIGRhdGEudXNlcm5hbWUgKyAnPycsXG4gICAgICBwb3B1cDoge1xuICAgICAgICB3aWR0aDogOTgwLFxuICAgICAgICBoZWlnaHQ6IDY1NVxuICAgICAgfVxuICAgIH07XG4gIH0sXG5cblxuICAvLyBzZXQgU25hcGNoYXQgZm9sbG93IFVSTFxuICBzbmFwY2hhdDogZnVuY3Rpb24gc25hcGNoYXQoZGF0YSkge1xuICAgIHJldHVybiB7XG4gICAgICB1cmw6ICdzbmFwY2hhdDovL2FkZC8nICsgZGF0YS51c2VybmFtZSArICc/J1xuICAgIH07XG4gIH0sXG5cblxuICAvLyBzZXQgR29vZ2xlIHNoYXJlIFVSTFxuICBnb29nbGU6IGZ1bmN0aW9uIGdvb2dsZShkYXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogJ2h0dHBzOi8vcGx1cy5nb29nbGUuY29tL3NoYXJlPycsXG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgcG9wdXA6IHtcbiAgICAgICAgd2lkdGg6IDQ5NSxcbiAgICAgICAgaGVpZ2h0OiA4MTVcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG5cbiAgLy8gc2V0IEdvb2dsZSBtYXBzIFVSTFxuICBnb29nbGVNYXBzOiBmdW5jdGlvbiBnb29nbGVNYXBzKGRhdGEpIHtcbiAgICB2YXIgaW9zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMV07XG5cbiAgICBpZiAoZGF0YS5zZWFyY2gpIHtcbiAgICAgIGRhdGEucSA9IGRhdGEuc2VhcmNoO1xuICAgICAgZGVsZXRlIGRhdGEuc2VhcmNoO1xuICAgIH1cblxuICAgIC8vIGlmIGlPUyB1c2VyIGFuZCBpb3MgZGF0YSBhdHRyaWJ1dGUgZGVmaW5lZFxuICAgIGlmIChpb3MgJiYgZGF0YS5pb3MpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVybDogJ2NvbWdvb2dsZW1hcHM6Ly8/JyxcbiAgICAgICAgZGF0YTogaW9zXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghaW9zICYmIGRhdGEuaW9zKSB7XG4gICAgICBkZWxldGUgZGF0YS5pb3M7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogJ2h0dHBzOi8vbWFwcy5nb29nbGUuY29tLz8nLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIHBvcHVwOiB7XG4gICAgICAgIHdpZHRoOiA4MDAsXG4gICAgICAgIGhlaWdodDogNjAwXG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuXG4gIC8vIHNldCBQaW50ZXJlc3Qgc2hhcmUgVVJMXG4gIHBpbnRlcmVzdDogZnVuY3Rpb24gcGludGVyZXN0KGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiAnaHR0cHM6Ly9waW50ZXJlc3QuY29tL3Bpbi9jcmVhdGUvYm9va21hcmtsZXQvPycsXG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgcG9wdXA6IHtcbiAgICAgICAgd2lkdGg6IDc0NSxcbiAgICAgICAgaGVpZ2h0OiA2MjBcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG5cbiAgLy8gc2V0IExpbmtlZEluIHNoYXJlIFVSTFxuICBsaW5rZWRpbjogZnVuY3Rpb24gbGlua2VkaW4oZGF0YSkge1xuICAgIHJldHVybiB7XG4gICAgICB1cmw6ICdodHRwOi8vd3d3LmxpbmtlZGluLmNvbS9zaGFyZUFydGljbGU/JyxcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBwb3B1cDoge1xuICAgICAgICB3aWR0aDogNzgwLFxuICAgICAgICBoZWlnaHQ6IDQ5MlxuICAgICAgfVxuICAgIH07XG4gIH0sXG5cblxuICAvLyBzZXQgQnVmZmVyIHNoYXJlIFVSTFxuICBidWZmZXI6IGZ1bmN0aW9uIGJ1ZmZlcihkYXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogJ2h0dHA6Ly9idWZmZXJhcHAuY29tL2FkZD8nLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIHBvcHVwOiB7XG4gICAgICAgIHdpZHRoOiA3NDUsXG4gICAgICAgIGhlaWdodDogMzQ1XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuXG4gIC8vIHNldCBUdW1ibHIgc2hhcmUgVVJMXG4gIHR1bWJscjogZnVuY3Rpb24gdHVtYmxyKGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiAnaHR0cHM6Ly93d3cudHVtYmxyLmNvbS93aWRnZXRzL3NoYXJlL3Rvb2w/JyxcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBwb3B1cDoge1xuICAgICAgICB3aWR0aDogNTQwLFxuICAgICAgICBoZWlnaHQ6IDk0MFxuICAgICAgfVxuICAgIH07XG4gIH0sXG5cblxuICAvLyBzZXQgUmVkZGl0IHNoYXJlIFVSTFxuICByZWRkaXQ6IGZ1bmN0aW9uIHJlZGRpdChkYXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogJ2h0dHA6Ly9yZWRkaXQuY29tL3N1Ym1pdD8nLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIHBvcHVwOiB7XG4gICAgICAgIHdpZHRoOiA4NjAsXG4gICAgICAgIGhlaWdodDogODgwXG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuXG4gIC8vIHNldCBGbGlja3IgZm9sbG93IFVSTFxuICBmbGlja3I6IGZ1bmN0aW9uIGZsaWNrcihkYXRhKSB7XG4gICAgdmFyIGlvcyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuXG4gICAgLy8gaWYgaU9TIHVzZXJcbiAgICBpZiAoaW9zICYmIGRhdGEuaW9zKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cmw6ICdmbGlja3I6Ly9waG90b3MvJyArIGRhdGEudXNlcm5hbWUgKyAnPydcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB1cmw6ICdodHRwOi8vd3d3LmZsaWNrci5jb20vcGhvdG9zLycgKyBkYXRhLnVzZXJuYW1lICsgJz8nLFxuICAgICAgcG9wdXA6IHtcbiAgICAgICAgd2lkdGg6IDYwMCxcbiAgICAgICAgaGVpZ2h0OiA2NTBcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG5cbiAgLy8gc2V0IFdoYXRzQXBwIHNoYXJlIFVSTFxuICB3aGF0c2FwcDogZnVuY3Rpb24gd2hhdHNhcHAoZGF0YSkge1xuICAgIHJldHVybiB7XG4gICAgICB1cmw6ICd3aGF0c2FwcDovL3NlbmQ/JyxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9O1xuICB9LFxuXG5cbiAgLy8gc2V0IHNtcyBzaGFyZSBVUkxcbiAgc21zOiBmdW5jdGlvbiBzbXMoZGF0YSkge1xuICAgIHZhciBpb3MgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIHJldHVybiB7XG4gICAgICB1cmw6IGlvcyA/ICdzbXM6JicgOiAnc21zOj8nLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH07XG4gIH0sXG5cblxuICAvLyBzZXQgRW1haWwgc2hhcmUgVVJMXG4gIGVtYWlsOiBmdW5jdGlvbiBlbWFpbChkYXRhKSB7XG4gICAgdmFyIHVybCA9ICdtYWlsdG86JztcblxuICAgIC8vIGlmIHRvIGFkZHJlc3Mgc3BlY2lmaWVkIHRoZW4gYWRkIHRvIFVSTFxuICAgIGlmIChkYXRhLnRvICE9PSBudWxsKSB7XG4gICAgICB1cmwgKz0gJycgKyBkYXRhLnRvO1xuICAgIH1cblxuICAgIHVybCArPSAnPyc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHN1YmplY3Q6IGRhdGEuc3ViamVjdCxcbiAgICAgICAgYm9keTogZGF0YS5ib2R5XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuXG4gIC8vIHNldCBHaXRodWIgZm9yayBVUkxcbiAgZ2l0aHViOiBmdW5jdGlvbiBnaXRodWIoZGF0YSkge1xuICAgIHZhciBpb3MgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgdmFyIHVybCA9IGRhdGEucmVwbyA/ICdodHRwczovL2dpdGh1Yi5jb20vJyArIGRhdGEucmVwbyA6IGRhdGEudXJsO1xuXG4gICAgaWYgKGRhdGEuaXNzdWUpIHtcbiAgICAgIHVybCArPSAnL2lzc3Vlcy9uZXc/dGl0bGU9JyArIGRhdGEuaXNzdWUgKyAnJmJvZHk9JyArIGRhdGEuYm9keTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiB1cmwgKyAnPycsXG4gICAgICBwb3B1cDoge1xuICAgICAgICB3aWR0aDogMTAyMCxcbiAgICAgICAgaGVpZ2h0OiAzMjNcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG5cbiAgLy8gc2V0IERyaWJiYmxlIHNoYXJlIFVSTFxuICBkcmliYmJsZTogZnVuY3Rpb24gZHJpYmJibGUoZGF0YSkge1xuICAgIHZhciBpb3MgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1sxXTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgdmFyIHVybCA9IGRhdGEuc2hvdCA/ICdodHRwczovL2RyaWJiYmxlLmNvbS9zaG90cy8nICsgZGF0YS5zaG90ICsgJz8nIDogZGF0YS51cmwgKyAnPyc7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgcG9wdXA6IHtcbiAgICAgICAgd2lkdGg6IDQ0MCxcbiAgICAgICAgaGVpZ2h0OiA2NDBcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBjb2RlcGVuOiBmdW5jdGlvbiBjb2RlcGVuKGRhdGEpIHtcbiAgICB2YXIgdXJsID0gZGF0YS5wZW4gJiYgZGF0YS51c2VybmFtZSAmJiBkYXRhLnZpZXcgPyAnaHR0cHM6Ly9jb2RlcGVuLmlvLycgKyBkYXRhLnVzZXJuYW1lICsgJy8nICsgZGF0YS52aWV3ICsgJy8nICsgZGF0YS5wZW4gKyAnPycgOiBkYXRhLnVybCArICc/JztcbiAgICByZXR1cm4ge1xuICAgICAgdXJsOiB1cmwsXG4gICAgICBwb3B1cDoge1xuICAgICAgICB3aWR0aDogMTIwMCxcbiAgICAgICAgaGVpZ2h0OiA4MDBcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBwYXlwYWw6IGZ1bmN0aW9uIHBheXBhbChkYXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9O1xuICB9XG59O1xuXG4vKipcbiAqIE9wZW5TaGFyZSBnZW5lcmF0ZXMgYSBzaW5nbGUgc2hhcmUgbGlua1xuICovXG5cbnZhciBPcGVuU2hhcmUgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE9wZW5TaGFyZSh0eXBlLCB0cmFuc2Zvcm0pIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgT3BlblNoYXJlKTtcblxuICAgIHRoaXMuaW9zID0gL2lQYWR8aVBob25lfGlQb2QvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgIXdpbmRvdy5NU1N0cmVhbTtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMuZHluYW1pYyA9IGZhbHNlO1xuICAgIHRoaXMudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuXG4gICAgLy8gY2FwaXRhbGl6ZWQgdHlwZVxuICAgIHRoaXMudHlwZUNhcHMgPSB0eXBlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHlwZS5zbGljZSgxKTtcbiAgfVxuXG4gIC8vIHJldHVybnMgZnVuY3Rpb24gbmFtZWQgYXMgdHlwZSBzZXQgaW4gY29uc3RydWN0b3JcbiAgLy8gZS5nIHR3aXR0ZXIoKVxuXG5cbiAgX2NyZWF0ZUNsYXNzKE9wZW5TaGFyZSwgW3tcbiAgICBrZXk6ICdzZXREYXRhJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0RGF0YShkYXRhKSB7XG4gICAgICAvLyBpZiBpT1MgdXNlciBhbmQgaW9zIGRhdGEgYXR0cmlidXRlIGRlZmluZWRcbiAgICAgIC8vIGJ1aWxkIGlPUyBVUkwgc2NoZW1lIGFzIHNpbmdsZSBzdHJpbmdcbiAgICAgIGlmICh0aGlzLmlvcykge1xuICAgICAgICB0aGlzLnRyYW5zZm9ybURhdGEgPSB0aGlzLnRyYW5zZm9ybShkYXRhLCB0cnVlKTtcbiAgICAgICAgdGhpcy5tb2JpbGVTaGFyZVVybCA9IHRoaXMudGVtcGxhdGUodGhpcy50cmFuc2Zvcm1EYXRhLnVybCwgdGhpcy50cmFuc2Zvcm1EYXRhLmRhdGEpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRyYW5zZm9ybURhdGEgPSB0aGlzLnRyYW5zZm9ybShkYXRhKTtcbiAgICAgIHRoaXMuc2hhcmVVcmwgPSB0aGlzLnRlbXBsYXRlKHRoaXMudHJhbnNmb3JtRGF0YS51cmwsIHRoaXMudHJhbnNmb3JtRGF0YS5kYXRhKTtcbiAgICB9XG5cbiAgICAvLyBvcGVuIHNoYXJlIFVSTCBkZWZpbmVkIGluIGluZGl2aWR1YWwgcGxhdGZvcm0gZnVuY3Rpb25zXG5cbiAgfSwge1xuICAgIGtleTogJ3NoYXJlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2hhcmUoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAvLyBpZiBpT1Mgc2hhcmUgVVJMIGhhcyBiZWVuIHNldCB0aGVuIHVzZSB0aW1lb3V0IGhhY2tcbiAgICAgIC8vIHRlc3QgZm9yIG5hdGl2ZSBhcHAgYW5kIGZhbGwgYmFjayB0byB3ZWJcbiAgICAgIGlmICh0aGlzLm1vYmlsZVNoYXJlVXJsKSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHN0YXJ0ID0gbmV3IERhdGUoKS52YWx1ZU9mKCk7XG5cbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBlbmQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIHVzZXIgaXMgc3RpbGwgaGVyZSwgZmFsbCBiYWNrIHRvIHdlYlxuICAgICAgICAgICAgaWYgKGVuZCAtIHN0YXJ0ID4gMTYwMCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IF90aGlzLnNoYXJlVXJsO1xuICAgICAgICAgIH0sIDE1MDApO1xuXG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gX3RoaXMubW9iaWxlU2hhcmVVcmw7XG5cbiAgICAgICAgICAvLyBvcGVuIG1haWx0byBsaW5rcyBpbiBzYW1lIHdpbmRvd1xuICAgICAgICB9KSgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnR5cGUgPT09ICdlbWFpbCcpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5zaGFyZVVybDtcblxuICAgICAgICAvLyBvcGVuIHNvY2lhbCBzaGFyZSBVUkxzIGluIG5ldyB3aW5kb3dcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIHBvcHVwIG9iamVjdCBwcmVzZW50IHRoZW4gc2V0IHdpbmRvdyBkaW1lbnNpb25zIC8gcG9zaXRpb25cbiAgICAgICAgaWYgKHRoaXMucG9wdXAgJiYgdGhpcy50cmFuc2Zvcm1EYXRhLnBvcHVwKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub3BlbldpbmRvdyh0aGlzLnNoYXJlVXJsLCB0aGlzLnRyYW5zZm9ybURhdGEucG9wdXApO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93Lm9wZW4odGhpcy5zaGFyZVVybCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIHNoYXJlIFVSTCB3aXRoIEdFVCBwYXJhbXNcbiAgICAvLyBhcHBlbmRpbmcgdmFsaWQgcHJvcGVydGllcyB0byBxdWVyeSBzdHJpbmdcblxuICB9LCB7XG4gICAga2V5OiAndGVtcGxhdGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0ZW1wbGF0ZSh1cmwsIGRhdGEpIHtcbiAgICAgIC8vZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgdmFyIG5vblVSTFByb3BzID0gWydhcHBlbmRUbycsICdpbm5lckhUTUwnLCAnY2xhc3NlcyddO1xuXG4gICAgICB2YXIgc2hhcmVVcmwgPSB1cmwsXG4gICAgICAgICAgaSA9IHZvaWQgMDtcblxuICAgICAgZm9yIChpIGluIGRhdGEpIHtcbiAgICAgICAgLy8gb25seSBhcHBlbmQgdmFsaWQgcHJvcGVydGllc1xuICAgICAgICBpZiAoIWRhdGFbaV0gfHwgbm9uVVJMUHJvcHMuaW5kZXhPZihpKSA+IC0xKSB7XG4gICAgICAgICAgY29udGludWU7IC8vZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYXBwZW5kIFVSTCBlbmNvZGVkIEdFVCBwYXJhbSB0byBzaGFyZSBVUkxcbiAgICAgICAgZGF0YVtpXSA9IGVuY29kZVVSSUNvbXBvbmVudChkYXRhW2ldKTtcbiAgICAgICAgc2hhcmVVcmwgKz0gaSArICc9JyArIGRhdGFbaV0gKyAnJic7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzaGFyZVVybC5zdWJzdHIoMCwgc2hhcmVVcmwubGVuZ3RoIC0gMSk7XG4gICAgfVxuXG4gICAgLy8gY2VudGVyIHBvcHVwIHdpbmRvdyBzdXBwb3J0aW5nIGR1YWwgc2NyZWVuc1xuXG4gIH0sIHtcbiAgICBrZXk6ICdvcGVuV2luZG93JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gb3BlbldpbmRvdyh1cmwsIG9wdGlvbnMpIHtcbiAgICAgIC8vZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgdmFyIGR1YWxTY3JlZW5MZWZ0ID0gd2luZG93LnNjcmVlbkxlZnQgIT09IHVuZGVmaW5lZCA/IHdpbmRvdy5zY3JlZW5MZWZ0IDogc2NyZWVuLmxlZnQsXG4gICAgICAgICAgZHVhbFNjcmVlblRvcCA9IHdpbmRvdy5zY3JlZW5Ub3AgIT09IHVuZGVmaW5lZCA/IHdpbmRvdy5zY3JlZW5Ub3AgOiBzY3JlZW4udG9wLFxuICAgICAgICAgIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggPyB3aW5kb3cuaW5uZXJXaWR0aCA6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCA6IHNjcmVlbi53aWR0aCxcbiAgICAgICAgICAvL2VzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCA/IHdpbmRvdy5pbm5lckhlaWdodCA6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgPyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IDogc2NyZWVuLmhlaWdodCxcbiAgICAgICAgICAvL2VzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgIGxlZnQgPSB3aWR0aCAvIDIgLSBvcHRpb25zLndpZHRoIC8gMiArIGR1YWxTY3JlZW5MZWZ0LFxuICAgICAgICAgIHRvcCA9IGhlaWdodCAvIDIgLSBvcHRpb25zLmhlaWdodCAvIDIgKyBkdWFsU2NyZWVuVG9wLFxuICAgICAgICAgIG5ld1dpbmRvdyA9IHdpbmRvdy5vcGVuKHVybCwgJ09wZW5TaGFyZScsICd3aWR0aD0nICsgb3B0aW9ucy53aWR0aCArICcsIGhlaWdodD0nICsgb3B0aW9ucy5oZWlnaHQgKyAnLCB0b3A9JyArIHRvcCArICcsIGxlZnQ9JyArIGxlZnQpO1xuXG4gICAgICAvLyBQdXRzIGZvY3VzIG9uIHRoZSBuZXdXaW5kb3dcbiAgICAgIGlmICh3aW5kb3cuZm9jdXMpIHtcbiAgICAgICAgbmV3V2luZG93LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE9wZW5TaGFyZTtcbn0oKTtcblxuZnVuY3Rpb24gc2V0RGF0YShvc0luc3RhbmNlLCBvc0VsZW1lbnQpIHtcbiAgb3NJbnN0YW5jZS5zZXREYXRhKHtcbiAgICB1cmw6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS11cmwnKSxcbiAgICB0ZXh0OiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtdGV4dCcpLFxuICAgIHZpYTogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXZpYScpLFxuICAgIGhhc2h0YWdzOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtaGFzaHRhZ3MnKSxcbiAgICB0d2VldElkOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtdHdlZXQtaWQnKSxcbiAgICByZWxhdGVkOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtcmVsYXRlZCcpLFxuICAgIHNjcmVlbk5hbWU6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1zY3JlZW4tbmFtZScpLFxuICAgIHVzZXJJZDogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXVzZXItaWQnKSxcbiAgICBsaW5rOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtbGluaycpLFxuICAgIHBpY3R1cmU6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1waWN0dXJlJyksXG4gICAgY2FwdGlvbjogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWNhcHRpb24nKSxcbiAgICBkZXNjcmlwdGlvbjogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWRlc2NyaXB0aW9uJyksXG4gICAgdXNlcjogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXVzZXInKSxcbiAgICB2aWRlbzogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXZpZGVvJyksXG4gICAgdXNlcm5hbWU6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS11c2VybmFtZScpLFxuICAgIHRpdGxlOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtdGl0bGUnKSxcbiAgICBtZWRpYTogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLW1lZGlhJyksXG4gICAgdG86IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS10bycpLFxuICAgIHN1YmplY3Q6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1zdWJqZWN0JyksXG4gICAgYm9keTogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWJvZHknKSxcbiAgICBpb3M6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1pb3MnKSxcbiAgICB0eXBlOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtdHlwZScpLFxuICAgIGNlbnRlcjogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWNlbnRlcicpLFxuICAgIHZpZXdzOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtdmlld3MnKSxcbiAgICB6b29tOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtem9vbScpLFxuICAgIHNlYXJjaDogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXNlYXJjaCcpLFxuICAgIHNhZGRyOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtc2FkZHInKSxcbiAgICBkYWRkcjogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWRhZGRyJyksXG4gICAgZGlyZWN0aW9uc21vZGU6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1kaXJlY3Rpb25zLW1vZGUnKSxcbiAgICByZXBvOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtcmVwbycpLFxuICAgIHNob3Q6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1zaG90JyksXG4gICAgcGVuOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtcGVuJyksXG4gICAgdmlldzogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXZpZXcnKSxcbiAgICBpc3N1ZTogb3NFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWlzc3VlJyksXG4gICAgYnV0dG9uSWQ6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1idXR0b25JZCcpLFxuICAgIHBvcFVwOiBvc0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtcG9wdXAnKSxcbiAgICBrZXk6IG9zRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1rZXknKVxuICB9KTtcbn1cblxuZnVuY3Rpb24gc2hhcmUoZSwgb3MsIG9wZW5TaGFyZSkge1xuICAvLyBpZiBkeW5hbWljIGluc3RhbmNlIHRoZW4gZmV0Y2ggYXR0cmlidXRlcyBhZ2FpbiBpbiBjYXNlIG9mIHVwZGF0ZXNcbiAgaWYgKG9wZW5TaGFyZS5keW5hbWljKSB7XG4gICAgc2V0RGF0YShvcGVuU2hhcmUsIG9zKTtcbiAgfVxuXG4gIG9wZW5TaGFyZS5zaGFyZShlKTtcblxuICAvLyB0cmlnZ2VyIHNoYXJlZCBldmVudFxuICBFdmVudHMudHJpZ2dlcihvcywgJ3NoYXJlZCcpO1xufVxuXG4vLyB0eXBlIGNvbnRhaW5zIGEgZGFzaFxuLy8gdHJhbnNmb3JtIHRvIGNhbWVsY2FzZSBmb3IgZnVuY3Rpb24gcmVmZXJlbmNlXG4vLyBUT0RPOiBvbmx5IHN1cHBvcnRzIHNpbmdsZSBkYXNoLCBzaG91bGQgc2hvdWxkIHN1cHBvcnQgbXVsdGlwbGVcbnZhciBkYXNoVG9DYW1lbCA9IGZ1bmN0aW9uIGRhc2hUb0NhbWVsKGRhc2gsIHR5cGUpIHtcbiAgdmFyIG5leHRDaGFyID0gdHlwZS5zdWJzdHIoZGFzaCArIDEsIDEpO1xuICB2YXIgZ3JvdXAgPSB0eXBlLnN1YnN0cihkYXNoLCAyKTtcblxuICB0eXBlID0gdHlwZS5yZXBsYWNlKGdyb3VwLCBuZXh0Q2hhci50b1VwcGVyQ2FzZSgpKTtcbiAgcmV0dXJuIHR5cGU7XG59O1xuXG5mdW5jdGlvbiBpbml0aWFsaXplU2hhcmVOb2RlKG9zKSB7XG4gIC8vIGluaXRpYWxpemUgb3BlbiBzaGFyZSBvYmplY3Qgd2l0aCB0eXBlIGF0dHJpYnV0ZVxuICB2YXIgdHlwZSA9IG9zLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlJyk7XG4gIHZhciBkYXNoID0gdHlwZS5pbmRleE9mKCctJyk7XG5cbiAgaWYgKGRhc2ggPiAtMSkge1xuICAgIHR5cGUgPSBkYXNoVG9DYW1lbChkYXNoLCB0eXBlKTtcbiAgfVxuXG4gIHZhciB0cmFuc2Zvcm0gPSBTaGFyZVRyYW5zZm9ybXNbdHlwZV07XG5cbiAgaWYgKCF0cmFuc2Zvcm0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ09wZW4gU2hhcmU6ICcgKyB0eXBlICsgJyBpcyBhbiBpbnZhbGlkIHR5cGUnKTtcbiAgfVxuXG4gIHZhciBvcGVuU2hhcmUgPSBuZXcgT3BlblNoYXJlKHR5cGUsIHRyYW5zZm9ybSk7XG5cbiAgLy8gc3BlY2lmeSBpZiB0aGlzIGlzIGEgZHluYW1pYyBpbnN0YW5jZVxuICBpZiAob3MuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtZHluYW1pYycpKSB7XG4gICAgb3BlblNoYXJlLmR5bmFtaWMgPSB0cnVlO1xuICB9XG5cbiAgLy8gc3BlY2lmeSBpZiB0aGlzIGlzIGEgcG9wdXAgaW5zdGFuY2VcbiAgaWYgKG9zLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLXBvcHVwJykpIHtcbiAgICBvcGVuU2hhcmUucG9wdXAgPSB0cnVlO1xuICB9XG5cbiAgLy8gc2V0IGFsbCBvcHRpb25hbCBhdHRyaWJ1dGVzIG9uIG9wZW4gc2hhcmUgaW5zdGFuY2VcbiAgc2V0RGF0YShvcGVuU2hhcmUsIG9zKTtcblxuICAvLyBvcGVuIHNoYXJlIGRpYWxvZyBvbiBjbGlja1xuICBvcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgc2hhcmUoZSwgb3MsIG9wZW5TaGFyZSk7XG4gIH0pO1xuXG4gIG9zLmFkZEV2ZW50TGlzdGVuZXIoJ09wZW5TaGFyZS50cmlnZ2VyJywgZnVuY3Rpb24gKGUpIHtcbiAgICBzaGFyZShlLCBvcywgb3BlblNoYXJlKTtcbiAgfSk7XG5cbiAgb3Muc2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtbm9kZScsIHR5cGUpO1xufVxuXG5mdW5jdGlvbiByb3VuZCh4LCBwcmVjaXNpb24pIHtcbiAgaWYgKHR5cGVvZiB4ICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHZhbHVlIHRvIGJlIGEgbnVtYmVyJyk7XG4gIH1cblxuICB2YXIgZXhwb25lbnQgPSBwcmVjaXNpb24gPiAwID8gJ2UnIDogJ2UtJztcbiAgdmFyIGV4cG9uZW50TmVnID0gcHJlY2lzaW9uID4gMCA/ICdlLScgOiAnZSc7XG4gIHByZWNpc2lvbiA9IE1hdGguYWJzKHByZWNpc2lvbik7XG5cbiAgcmV0dXJuIE51bWJlcihNYXRoLnJvdW5kKHggKyBleHBvbmVudCArIHByZWNpc2lvbikgKyBleHBvbmVudE5lZyArIHByZWNpc2lvbik7XG59XG5cbmZ1bmN0aW9uIHRob3VzYW5kaWZ5KG51bSkge1xuICByZXR1cm4gcm91bmQobnVtIC8gMTAwMCwgMSkgKyAnSyc7XG59XG5cbmZ1bmN0aW9uIG1pbGxpb25pZnkobnVtKSB7XG4gIHJldHVybiByb3VuZChudW0gLyAxMDAwMDAwLCAxKSArICdNJztcbn1cblxuZnVuY3Rpb24gY291bnRSZWR1Y2UoZWwsIGNvdW50LCBjYikge1xuICBpZiAoY291bnQgPiA5OTk5OTkpIHtcbiAgICBlbC5pbm5lckhUTUwgPSBtaWxsaW9uaWZ5KGNvdW50KTtcbiAgICBpZiAoY2IgJiYgdHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSBjYihlbCk7XG4gIH0gZWxzZSBpZiAoY291bnQgPiA5OTkpIHtcbiAgICBlbC5pbm5lckhUTUwgPSB0aG91c2FuZGlmeShjb3VudCk7XG4gICAgaWYgKGNiICYmIHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykgY2IoZWwpO1xuICB9IGVsc2Uge1xuICAgIGVsLmlubmVySFRNTCA9IGNvdW50O1xuICAgIGlmIChjYiAmJiB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIGNiKGVsKTtcbiAgfVxufVxuXG4vKlxuICAgU29tZXRpbWVzIHNvY2lhbCBwbGF0Zm9ybXMgZ2V0IGNvbmZ1c2VkIGFuZCBkcm9wIHNoYXJlIGNvdW50cy5cbiAgIEluIHRoaXMgbW9kdWxlIHdlIGNoZWNrIGlmIHRoZSByZXR1cm5lZCBjb3VudCBpcyBsZXNzIHRoYW4gdGhlIGNvdW50IGluXG4gICBsb2NhbHN0b3JhZ2UuXG4gICBJZiB0aGUgbG9jYWwgY291bnQgaXMgZ3JlYXRlciB0aGFuIHRoZSByZXR1cm5lZCBjb3VudCxcbiAgIHdlIHN0b3JlIHRoZSBsb2NhbCBjb3VudCArIHRoZSByZXR1cm5lZCBjb3VudC5cbiAgIE90aGVyd2lzZSwgc3RvcmUgdGhlIHJldHVybmVkIGNvdW50LlxuKi9cblxudmFyIHN0b3JlQ291bnQgPSBmdW5jdGlvbiBzdG9yZUNvdW50KHQsIGNvdW50KSB7XG4gIHZhciBpc0FyciA9IHQudHlwZS5pbmRleE9mKCcsJykgPiAtMTtcbiAgdmFyIGxvY2FsID0gTnVtYmVyKHQuc3RvcmVHZXQodC50eXBlICsgJy0nICsgdC5zaGFyZWQpKTtcblxuICBpZiAobG9jYWwgPiBjb3VudCAmJiAhaXNBcnIpIHtcbiAgICB2YXIgbGF0ZXN0Q291bnQgPSBOdW1iZXIodC5zdG9yZUdldCh0LnR5cGUgKyAnLScgKyB0LnNoYXJlZCArICctbGF0ZXN0Q291bnQnKSk7XG4gICAgdC5zdG9yZVNldCh0LnR5cGUgKyAnLScgKyB0LnNoYXJlZCArICctbGF0ZXN0Q291bnQnLCBjb3VudCk7XG5cbiAgICBjb3VudCA9IGlzTnVtZXJpYyQxKGxhdGVzdENvdW50KSAmJiBsYXRlc3RDb3VudCA+IDAgPyBjb3VudCArPSBsb2NhbCAtIGxhdGVzdENvdW50IDogY291bnQgKz0gbG9jYWw7XG4gIH1cblxuICBpZiAoIWlzQXJyKSB0LnN0b3JlU2V0KHQudHlwZSArICctJyArIHQuc2hhcmVkLCBjb3VudCk7XG4gIHJldHVybiBjb3VudDtcbn07XG5cbmZ1bmN0aW9uIGlzTnVtZXJpYyQxKG4pIHtcbiAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbn1cblxuLyoqXG4gKiBPYmplY3Qgb2YgdHJhbnNmb3JtIGZ1bmN0aW9ucyBmb3IgZWFjaCBvcGVuc2hhcmUgYXBpXG4gKiBUcmFuc2Zvcm0gZnVuY3Rpb25zIHBhc3NlZCBpbnRvIE9wZW5TaGFyZSBpbnN0YW5jZSB3aGVuIGluc3RhbnRpYXRlZFxuICogUmV0dXJuIG9iamVjdCBjb250YWluaW5nIFVSTCBhbmQga2V5L3ZhbHVlIGFyZ3NcbiAqL1xudmFyIENvdW50VHJhbnNmb3JtcyA9IHtcblxuICAvLyBmYWNlYm9vayBjb3VudCBkYXRhXG4gIGZhY2Vib29rOiBmdW5jdGlvbiBmYWNlYm9vayh1cmwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ2dldCcsXG4gICAgICB1cmw6ICdodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8/aWQ9JyArIHVybCxcbiAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24gdHJhbnNmb3JtKHhocikge1xuICAgICAgICB2YXIgZmIgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuXG4gICAgICAgIHZhciBjb3VudCA9IGZiLnNoYXJlICYmIGZiLnNoYXJlLnNoYXJlX2NvdW50IHx8IDA7XG5cbiAgICAgICAgcmV0dXJuIHN0b3JlQ291bnQodGhpcywgY291bnQpO1xuICAgICAgfVxuICAgIH07XG4gIH0sXG5cblxuICAvLyBwaW50ZXJlc3QgY291bnQgZGF0YVxuICBwaW50ZXJlc3Q6IGZ1bmN0aW9uIHBpbnRlcmVzdCh1cmwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ2pzb25wJyxcbiAgICAgIHVybDogJ2h0dHBzOi8vYXBpLnBpbnRlcmVzdC5jb20vdjEvdXJscy9jb3VudC5qc29uP2NhbGxiYWNrPT8mdXJsPScgKyB1cmwsXG4gICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uIHRyYW5zZm9ybShkYXRhKSB7XG4gICAgICAgIHZhciBjb3VudCA9IGRhdGEuY291bnQgfHwgMDtcbiAgICAgICAgcmV0dXJuIHN0b3JlQ291bnQodGhpcywgY291bnQpO1xuICAgICAgfVxuICAgIH07XG4gIH0sXG5cblxuICAvLyBsaW5rZWRpbiBjb3VudCBkYXRhXG4gIGxpbmtlZGluOiBmdW5jdGlvbiBsaW5rZWRpbih1cmwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ2pzb25wJyxcbiAgICAgIHVybDogJ2h0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9jb3VudHNlcnYvY291bnQvc2hhcmU/dXJsPScgKyB1cmwgKyAnJmZvcm1hdD1qc29ucCZjYWxsYmFjaz0/JyxcbiAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24gdHJhbnNmb3JtKGRhdGEpIHtcbiAgICAgICAgdmFyIGNvdW50ID0gZGF0YS5jb3VudCB8fCAwO1xuICAgICAgICByZXR1cm4gc3RvcmVDb3VudCh0aGlzLCBjb3VudCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuXG4gIC8vIHJlZGRpdCBjb3VudCBkYXRhXG4gIHJlZGRpdDogZnVuY3Rpb24gcmVkZGl0KHVybCkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgIHVybDogJ2h0dHBzOi8vd3d3LnJlZGRpdC5jb20vYXBpL2luZm8uanNvbj91cmw9JyArIHVybCxcbiAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24gdHJhbnNmb3JtKHhocikge1xuICAgICAgICB2YXIgcmVkZGl0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgdmFyIHBvc3RzID0gcmVkZGl0LmRhdGEgJiYgcmVkZGl0LmRhdGEuY2hpbGRyZW4gfHwgbnVsbDtcbiAgICAgICAgdmFyIHVwcyA9IDA7XG5cbiAgICAgICAgaWYgKHBvc3RzKSB7XG4gICAgICAgICAgcG9zdHMuZm9yRWFjaChmdW5jdGlvbiAocG9zdCkge1xuICAgICAgICAgICAgdXBzICs9IE51bWJlcihwb3N0LmRhdGEudXBzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdG9yZUNvdW50KHRoaXMsIHVwcyk7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuXG4gIC8vIGdvb2dsZSBjb3VudCBkYXRhXG4gIGdvb2dsZTogZnVuY3Rpb24gZ29vZ2xlKHVybCkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAncG9zdCcsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG1ldGhvZDogJ3Bvcy5wbHVzb25lcy5nZXQnLFxuICAgICAgICBpZDogJ3AnLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBub2xvZzogdHJ1ZSxcbiAgICAgICAgICBpZDogdXJsLFxuICAgICAgICAgIHNvdXJjZTogJ3dpZGdldCcsXG4gICAgICAgICAgdXNlcklkOiAnQHZpZXdlcicsXG4gICAgICAgICAgZ3JvdXBJZDogJ0BzZWxmJ1xuICAgICAgICB9LFxuICAgICAgICBqc29ucnBjOiAnMi4wJyxcbiAgICAgICAga2V5OiAncCcsXG4gICAgICAgIGFwaVZlcnNpb246ICd2MSdcbiAgICAgIH0sXG4gICAgICB1cmw6ICdodHRwczovL2NsaWVudHM2Lmdvb2dsZS5jb20vcnBjJyxcbiAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24gdHJhbnNmb3JtKHhocikge1xuICAgICAgICB2YXIgZ29vZ2xlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgdmFyIGNvdW50ID0gZ29vZ2xlLnJlc3VsdCAmJiBnb29nbGUucmVzdWx0Lm1ldGFkYXRhICYmIGdvb2dsZS5yZXN1bHQubWV0YWRhdGEuZ2xvYmFsQ291bnRzICYmIGdvb2dsZS5yZXN1bHQubWV0YWRhdGEuZ2xvYmFsQ291bnRzLmNvdW50IHx8IDA7XG4gICAgICAgIHJldHVybiBzdG9yZUNvdW50KHRoaXMsIGNvdW50KTtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG5cbiAgLy8gZ2l0aHViIHN0YXIgY291bnRcbiAgZ2l0aHViU3RhcnM6IGZ1bmN0aW9uIGdpdGh1YlN0YXJzKHJlcG8pIHtcbiAgICByZXBvID0gcmVwby5pbmRleE9mKCdnaXRodWIuY29tLycpID4gLTEgPyByZXBvLnNwbGl0KCdnaXRodWIuY29tLycpWzFdIDogcmVwbztcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ2dldCcsXG4gICAgICB1cmw6ICdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zLycgKyByZXBvLFxuICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbiB0cmFuc2Zvcm0oeGhyKSB7XG4gICAgICAgIHZhciBjb3VudCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuc3RhcmdhemVyc19jb3VudCB8fCAwO1xuICAgICAgICByZXR1cm4gc3RvcmVDb3VudCh0aGlzLCBjb3VudCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuXG4gIC8vIGdpdGh1YiBmb3JrcyBjb3VudFxuICBnaXRodWJGb3JrczogZnVuY3Rpb24gZ2l0aHViRm9ya3MocmVwbykge1xuICAgIHJlcG8gPSByZXBvLmluZGV4T2YoJ2dpdGh1Yi5jb20vJykgPiAtMSA/IHJlcG8uc3BsaXQoJ2dpdGh1Yi5jb20vJylbMV0gOiByZXBvO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgIHVybDogJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvJyArIHJlcG8sXG4gICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uIHRyYW5zZm9ybSh4aHIpIHtcbiAgICAgICAgdmFyIGNvdW50ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS5mb3Jrc19jb3VudCB8fCAwO1xuICAgICAgICByZXR1cm4gc3RvcmVDb3VudCh0aGlzLCBjb3VudCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuXG4gIC8vIGdpdGh1YiB3YXRjaGVycyBjb3VudFxuICBnaXRodWJXYXRjaGVyczogZnVuY3Rpb24gZ2l0aHViV2F0Y2hlcnMocmVwbykge1xuICAgIHJlcG8gPSByZXBvLmluZGV4T2YoJ2dpdGh1Yi5jb20vJykgPiAtMSA/IHJlcG8uc3BsaXQoJ2dpdGh1Yi5jb20vJylbMV0gOiByZXBvO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgIHVybDogJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvJyArIHJlcG8sXG4gICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uIHRyYW5zZm9ybSh4aHIpIHtcbiAgICAgICAgdmFyIGNvdW50ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS53YXRjaGVyc19jb3VudCB8fCAwO1xuICAgICAgICByZXR1cm4gc3RvcmVDb3VudCh0aGlzLCBjb3VudCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuXG4gIC8vIGRyaWJiYmxlIGxpa2VzIGNvdW50XG4gIGRyaWJiYmxlOiBmdW5jdGlvbiBkcmliYmJsZShzaG90KSB7XG4gICAgc2hvdCA9IHNob3QuaW5kZXhPZignZHJpYmJibGUuY29tL3Nob3RzJykgPiAtMSA/IHNob3Quc3BsaXQoJ3Nob3RzLycpWzFdIDogc2hvdDtcbiAgICB2YXIgdXJsID0gJ2h0dHBzOi8vYXBpLmRyaWJiYmxlLmNvbS92MS9zaG90cy8nICsgc2hvdCArICcvbGlrZXMnO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbiB0cmFuc2Zvcm0oeGhyLCBFdmVudHMpIHtcbiAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgdmFyIGNvdW50ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS5sZW5ndGg7XG5cbiAgICAgICAgLy8gYXQgdGhpcyB0aW1lIGRyaWJiYmxlIGxpbWl0cyBhIHJlc3BvbnNlIG9mIDEyIGxpa2VzIHBlciBwYWdlXG4gICAgICAgIGlmIChjb3VudCA9PT0gMTIpIHtcbiAgICAgICAgICB2YXIgcGFnZSA9IDI7XG4gICAgICAgICAgcmVjdXJzaXZlQ291bnQodXJsLCBwYWdlLCBjb3VudCwgZnVuY3Rpb24gKGZpbmFsQ291bnQpIHtcbiAgICAgICAgICAgIGlmIChfdGhpczIuYXBwZW5kVG8gJiYgdHlwZW9mIF90aGlzMi5hcHBlbmRUbyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICBfdGhpczIuYXBwZW5kVG8uYXBwZW5kQ2hpbGQoX3RoaXMyLm9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvdW50UmVkdWNlKF90aGlzMi5vcywgZmluYWxDb3VudCwgX3RoaXMyLmNiKTtcbiAgICAgICAgICAgIEV2ZW50cy50cmlnZ2VyKF90aGlzMi5vcywgJ2NvdW50ZWQtJyArIF90aGlzMi51cmwpO1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JlQ291bnQoX3RoaXMyLCBmaW5hbENvdW50KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc3RvcmVDb3VudCh0aGlzLCBjb3VudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICB0d2l0dGVyOiBmdW5jdGlvbiB0d2l0dGVyKHVybCkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgIHVybDogJ2h0dHBzOi8vYXBpLm9wZW5zaGFyZS5zb2NpYWwvam9iP3VybD0nICsgdXJsICsgJyZrZXk9JyxcbiAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24gdHJhbnNmb3JtKHhocikge1xuICAgICAgICB2YXIgY291bnQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpLmNvdW50IHx8IDA7XG4gICAgICAgIHJldHVybiBzdG9yZUNvdW50KHRoaXMsIGNvdW50KTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59O1xuXG5mdW5jdGlvbiByZWN1cnNpdmVDb3VudCh1cmwsIHBhZ2UsIGNvdW50LCBjYikge1xuICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHhoci5vcGVuKCdHRVQnLCB1cmwgKyAnP3BhZ2U9JyArIHBhZ2UpO1xuICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAvL2VzbGludC1kaXNhYmxlLWxpbmVcbiAgICB2YXIgbGlrZXMgPSBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2UpO1xuICAgIGNvdW50ICs9IGxpa2VzLmxlbmd0aDtcblxuICAgIC8vIGRyaWJiYmxlIGxpa2UgcGVyIHBhZ2UgaXMgMTJcbiAgICBpZiAobGlrZXMubGVuZ3RoID09PSAxMikge1xuICAgICAgcGFnZSsrO1xuICAgICAgcmVjdXJzaXZlQ291bnQodXJsLCBwYWdlLCBjb3VudCwgY2IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYihjb3VudCk7XG4gICAgfVxuICB9KTtcbiAgeGhyLnNlbmQoKTtcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSBzaGFyZSBjb3VudCBpbnN0YW5jZSBmcm9tIG9uZSB0byBtYW55IG5ldHdvcmtzXG4gKi9cblxudmFyIENvdW50ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDb3VudCh0eXBlLCB1cmwpIHtcbiAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDb3VudCk7XG5cbiAgICAvLyB0aHJvdyBlcnJvciBpZiBubyB1cmwgcHJvdmlkZWRcbiAgICBpZiAoIXVybCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPcGVuIFNoYXJlOiBubyB1cmwgcHJvdmlkZWQgZm9yIGNvdW50Jyk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgZm9yIEdpdGh1YiBjb3VudHNcbiAgICBpZiAodHlwZS5pbmRleE9mKCdnaXRodWInKSA9PT0gMCkge1xuICAgICAgaWYgKHR5cGUgPT09ICdnaXRodWItc3RhcnMnKSB7XG4gICAgICAgIHR5cGUgPSAnZ2l0aHViU3RhcnMnO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnZ2l0aHViLWZvcmtzJykge1xuICAgICAgICB0eXBlID0gJ2dpdGh1YkZvcmtzJztcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2dpdGh1Yi13YXRjaGVycycpIHtcbiAgICAgICAgdHlwZSA9ICdnaXRodWJXYXRjaGVycyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIEdpdGh1YiBjb3VudCB0eXBlLiBUcnkgZ2l0aHViLXN0YXJzLCBnaXRodWItZm9ya3MsIG9yIGdpdGh1Yi13YXRjaGVycy4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiB0eXBlIGlzIGNvbW1hIHNlcGFyYXRlIGxpc3QgY3JlYXRlIGFycmF5XG4gICAgaWYgKHR5cGUuaW5kZXhPZignLCcpID4gLTEpIHtcbiAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICB0aGlzLnR5cGVBcnIgPSB0aGlzLnR5cGUuc3BsaXQoJywnKTtcbiAgICAgIHRoaXMuY291bnREYXRhID0gW107XG5cbiAgICAgIC8vIGNoZWNrIGVhY2ggdHlwZSBzdXBwbGllZCBpcyB2YWxpZFxuICAgICAgdGhpcy50eXBlQXJyLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgaWYgKCFDb3VudFRyYW5zZm9ybXNbdF0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ09wZW4gU2hhcmU6ICcgKyB0eXBlICsgJyBpcyBhbiBpbnZhbGlkIGNvdW50IHR5cGUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzMy5jb3VudERhdGEucHVzaChDb3VudFRyYW5zZm9ybXNbdF0odXJsKSk7XG4gICAgICB9KTtcblxuICAgICAgdmFyIGNvdW50ID0gdGhpcy5zdG9yZUdldCh0aGlzLnR5cGUgKyAnLScgKyB0aGlzLnNoYXJlZCk7XG5cbiAgICAgIGlmIChjb3VudCkge1xuICAgICAgICBpZiAodGhpcy5hcHBlbmRUbyAmJiB0eXBlb2YgdGhpcy5hcHBlbmRUbyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRoaXMuYXBwZW5kVG8uYXBwZW5kQ2hpbGQodGhpcy5vcyk7XG4gICAgICAgIH1cbiAgICAgICAgY291bnRSZWR1Y2UodGhpcy5vcywgY291bnQpO1xuICAgICAgfVxuXG4gICAgICAvLyB0aHJvdyBlcnJvciBpZiBpbnZhbGlkIHR5cGUgcHJvdmlkZWRcbiAgICB9IGVsc2UgaWYgKCFDb3VudFRyYW5zZm9ybXNbdHlwZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT3BlbiBTaGFyZTogJyArIHR5cGUgKyAnIGlzIGFuIGludmFsaWQgY291bnQgdHlwZScpO1xuXG4gICAgICAvLyBzaW5nbGUgY291bnRcbiAgICAgIC8vIHN0b3JlIGNvdW50IFVSTCBhbmQgdHJhbnNmb3JtIGZ1bmN0aW9uXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICB0aGlzLmNvdW50RGF0YSA9IENvdW50VHJhbnNmb3Jtc1t0eXBlXSh1cmwpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGhhbmRsZSBjYWxsaW5nIGdldENvdW50IC8gZ2V0Q291bnRzXG4gIC8vIGRlcGVuZGluZyBvbiBudW1iZXIgb2YgdHlwZXNcblxuXG4gIF9jcmVhdGVDbGFzcyhDb3VudCwgW3tcbiAgICBrZXk6ICdjb3VudCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvdW50KG9zLCBjYiwgYXBwZW5kVG8pIHtcbiAgICAgIHRoaXMub3MgPSBvcztcbiAgICAgIHRoaXMuYXBwZW5kVG8gPSBhcHBlbmRUbztcbiAgICAgIHRoaXMuY2IgPSBjYjtcbiAgICAgIHRoaXMudXJsID0gdGhpcy5vcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1jb3VudCcpO1xuICAgICAgdGhpcy5zaGFyZWQgPSB0aGlzLm9zLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWNvdW50LXVybCcpO1xuICAgICAgdGhpcy5rZXkgPSB0aGlzLm9zLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWtleScpO1xuXG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5jb3VudERhdGEpKSB7XG4gICAgICAgIHRoaXMuZ2V0Q291bnQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2V0Q291bnRzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZmV0Y2ggY291bnQgZWl0aGVyIEFKQVggb3IgSlNPTlBcblxuICB9LCB7XG4gICAga2V5OiAnZ2V0Q291bnQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRDb3VudCgpIHtcbiAgICAgIHZhciBjb3VudCA9IHRoaXMuc3RvcmVHZXQodGhpcy50eXBlICsgJy0nICsgdGhpcy5zaGFyZWQpO1xuXG4gICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVG8gJiYgdHlwZW9mIHRoaXMuYXBwZW5kVG8gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGlzLmFwcGVuZFRvLmFwcGVuZENoaWxkKHRoaXMub3MpO1xuICAgICAgICB9XG4gICAgICAgIGNvdW50UmVkdWNlKHRoaXMub3MsIGNvdW50KTtcbiAgICAgIH1cbiAgICAgIHRoaXNbdGhpcy5jb3VudERhdGEudHlwZV0odGhpcy5jb3VudERhdGEpO1xuICAgIH1cblxuICAgIC8vIGZldGNoIG11bHRpcGxlIGNvdW50cyBhbmQgYWdncmVnYXRlXG5cbiAgfSwge1xuICAgIGtleTogJ2dldENvdW50cycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldENvdW50cygpIHtcbiAgICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgICB0aGlzLnRvdGFsID0gW107XG5cbiAgICAgIHZhciBjb3VudCA9IHRoaXMuc3RvcmVHZXQodGhpcy50eXBlICsgJy0nICsgdGhpcy5zaGFyZWQpO1xuXG4gICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVG8gJiYgdHlwZW9mIHRoaXMuYXBwZW5kVG8gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGlzLmFwcGVuZFRvLmFwcGVuZENoaWxkKHRoaXMub3MpO1xuICAgICAgICB9XG4gICAgICAgIGNvdW50UmVkdWNlKHRoaXMub3MsIGNvdW50KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb3VudERhdGEuZm9yRWFjaChmdW5jdGlvbiAoY291bnREYXRhKSB7XG4gICAgICAgIF90aGlzNFtjb3VudERhdGEudHlwZV0oY291bnREYXRhLCBmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgICAgX3RoaXM0LnRvdGFsLnB1c2gobnVtKTtcblxuICAgICAgICAgIC8vIHRvdGFsIGNvdW50cyBsZW5ndGggbm93IGVxdWFscyB0eXBlIGFycmF5IGxlbmd0aFxuICAgICAgICAgIC8vIHNvIGFnZ3JlZ2F0ZSwgc3RvcmUgYW5kIGluc2VydCBpbnRvIERPTVxuICAgICAgICAgIGlmIChfdGhpczQudG90YWwubGVuZ3RoID09PSBfdGhpczQudHlwZUFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciB0b3QgPSAwO1xuXG4gICAgICAgICAgICBfdGhpczQudG90YWwuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICB0b3QgKz0gdDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoX3RoaXM0LmFwcGVuZFRvICYmIHR5cGVvZiBfdGhpczQuYXBwZW5kVG8gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgX3RoaXM0LmFwcGVuZFRvLmFwcGVuZENoaWxkKF90aGlzNC5vcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBsb2NhbCA9IE51bWJlcihfdGhpczQuc3RvcmVHZXQoX3RoaXM0LnR5cGUgKyAnLScgKyBfdGhpczQuc2hhcmVkKSk7XG4gICAgICAgICAgICBpZiAobG9jYWwgPiB0b3QpIHtcbiAgICAgICAgICAgICAgLy8gY29uc3QgbGF0ZXN0Q291bnQgPSBOdW1iZXIodGhpcy5zdG9yZUdldChgJHt0aGlzLnR5cGV9LSR7dGhpcy5zaGFyZWR9LWxhdGVzdENvdW50YCkpO1xuICAgICAgICAgICAgICAvLyB0aGlzLnN0b3JlU2V0KGAke3RoaXMudHlwZX0tJHt0aGlzLnNoYXJlZH0tbGF0ZXN0Q291bnRgLCB0b3QpO1xuICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAvLyB0b3QgPSBpc051bWVyaWMobGF0ZXN0Q291bnQpICYmIGxhdGVzdENvdW50ID4gMCA/XG4gICAgICAgICAgICAgIC8vIHRvdCArPSBsb2NhbCAtIGxhdGVzdENvdW50IDpcbiAgICAgICAgICAgICAgLy8gdG90ICs9IGxvY2FsO1xuICAgICAgICAgICAgICB0b3QgPSBsb2NhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzNC5zdG9yZVNldChfdGhpczQudHlwZSArICctJyArIF90aGlzNC5zaGFyZWQsIHRvdCk7XG5cbiAgICAgICAgICAgIGNvdW50UmVkdWNlKF90aGlzNC5vcywgdG90KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLmFwcGVuZFRvICYmIHR5cGVvZiB0aGlzLmFwcGVuZFRvICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kVG8uYXBwZW5kQ2hpbGQodGhpcy5vcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaGFuZGxlIEpTT05QIHJlcXVlc3RzXG5cbiAgfSwge1xuICAgIGtleTogJ2pzb25wJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24ganNvbnAoY291bnREYXRhLCBjYikge1xuICAgICAgdmFyIF90aGlzNSA9IHRoaXM7XG5cbiAgICAgIC8vIGRlZmluZSByYW5kb20gY2FsbGJhY2sgYW5kIGFzc2lnbiB0cmFuc2Zvcm0gZnVuY3Rpb25cbiAgICAgIHZhciBjYWxsYmFjayA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZyg3KS5yZXBsYWNlKC9bXmEtekEtWl0vZywgJycpO1xuICAgICAgd2luZG93W2NhbGxiYWNrXSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHZhciBjb3VudCA9IGNvdW50RGF0YS50cmFuc2Zvcm0uYXBwbHkoX3RoaXM1LCBbZGF0YV0pIHx8IDA7XG5cbiAgICAgICAgaWYgKGNiICYmIHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNiKGNvdW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoX3RoaXM1LmFwcGVuZFRvICYmIHR5cGVvZiBfdGhpczUuYXBwZW5kVG8gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIF90aGlzNS5hcHBlbmRUby5hcHBlbmRDaGlsZChfdGhpczUub3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb3VudFJlZHVjZShfdGhpczUub3MsIGNvdW50LCBfdGhpczUuY2IpO1xuICAgICAgICB9XG5cbiAgICAgICAgRXZlbnRzLnRyaWdnZXIoX3RoaXM1Lm9zLCAnY291bnRlZC0nICsgX3RoaXM1LnVybCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBhcHBlbmQgSlNPTlAgc2NyaXB0IHRhZyB0byBwYWdlXG4gICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICBzY3JpcHQuc3JjID0gY291bnREYXRhLnVybC5yZXBsYWNlKCdjYWxsYmFjaz0/JywgJ2NhbGxiYWNrPScgKyBjYWxsYmFjayk7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBoYW5kbGUgQUpBWCBHRVQgcmVxdWVzdFxuXG4gIH0sIHtcbiAgICBrZXk6ICdnZXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXQoY291bnREYXRhLCBjYikge1xuICAgICAgdmFyIF90aGlzNiA9IHRoaXM7XG5cbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgLy8gb24gc3VjY2VzcyBwYXNzIHJlc3BvbnNlIHRvIHRyYW5zZm9ybSBmdW5jdGlvblxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgdmFyIGNvdW50ID0gY291bnREYXRhLnRyYW5zZm9ybS5hcHBseShfdGhpczYsIFt4aHIsIEV2ZW50c10pIHx8IDA7XG5cbiAgICAgICAgICAgIGlmIChjYiAmJiB0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgY2IoY291bnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKF90aGlzNi5hcHBlbmRUbyAmJiB0eXBlb2YgX3RoaXM2LmFwcGVuZFRvICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgX3RoaXM2LmFwcGVuZFRvLmFwcGVuZENoaWxkKF90aGlzNi5vcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY291bnRSZWR1Y2UoX3RoaXM2Lm9zLCBjb3VudCwgX3RoaXM2LmNiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgRXZlbnRzLnRyaWdnZXIoX3RoaXM2Lm9zLCAnY291bnRlZC0nICsgX3RoaXM2LnVybCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIGlmIChjb3VudERhdGEudXJsLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignaHR0cHM6Ly9hcGkub3BlbnNoYXJlLnNvY2lhbC9qb2I/JykgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignUGxlYXNlIHNpZ24gdXAgZm9yIFR3aXR0ZXIgY291bnRzIGF0IGh0dHBzOi8vb3BlbnNoYXJlLnNvY2lhbC90d2l0dGVyL2F1dGgnKTtcbiAgICAgICAgICAgIHZhciBfY291bnQgPSAwO1xuXG4gICAgICAgICAgICBpZiAoY2IgJiYgdHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIGNiKF9jb3VudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoX3RoaXM2LmFwcGVuZFRvICYmIHR5cGVvZiBfdGhpczYuYXBwZW5kVG8gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBfdGhpczYuYXBwZW5kVG8uYXBwZW5kQ2hpbGQoX3RoaXM2Lm9zKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb3VudFJlZHVjZShfdGhpczYub3MsIF9jb3VudCwgX3RoaXM2LmNiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgRXZlbnRzLnRyaWdnZXIoX3RoaXM2Lm9zLCAnY291bnRlZC0nICsgX3RoaXM2LnVybCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIGdldCBBUEkgZGF0YSBmcm9tJywgY291bnREYXRhLnVybCwgJy4gUGxlYXNlIHVzZSB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgT3BlblNoYXJlLicpO1xuICAgICAgICAgICAgdmFyIF9jb3VudDIgPSAwO1xuXG4gICAgICAgICAgICBpZiAoY2IgJiYgdHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIGNiKF9jb3VudDIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKF90aGlzNi5hcHBlbmRUbyAmJiB0eXBlb2YgX3RoaXM2LmFwcGVuZFRvICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgX3RoaXM2LmFwcGVuZFRvLmFwcGVuZENoaWxkKF90aGlzNi5vcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY291bnRSZWR1Y2UoX3RoaXM2Lm9zLCBfY291bnQyLCBfdGhpczYuY2IpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBFdmVudHMudHJpZ2dlcihfdGhpczYub3MsICdjb3VudGVkLScgKyBfdGhpczYudXJsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvdW50RGF0YS51cmwgPSBjb3VudERhdGEudXJsLnN0YXJ0c1dpdGgoJ2h0dHBzOi8vYXBpLm9wZW5zaGFyZS5zb2NpYWwvam9iPycpICYmIHRoaXMua2V5ID8gY291bnREYXRhLnVybCArIHRoaXMua2V5IDogY291bnREYXRhLnVybDtcblxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIGNvdW50RGF0YS51cmwpO1xuICAgICAgeGhyLnNlbmQoKTtcbiAgICB9XG5cbiAgICAvLyBoYW5kbGUgQUpBWCBQT1NUIHJlcXVlc3RcblxuICB9LCB7XG4gICAga2V5OiAncG9zdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBvc3QoY291bnREYXRhLCBjYikge1xuICAgICAgdmFyIF90aGlzNyA9IHRoaXM7XG5cbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgLy8gb24gc3VjY2VzcyBwYXNzIHJlc3BvbnNlIHRvIHRyYW5zZm9ybSBmdW5jdGlvblxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlICE9PSBYTUxIdHRwUmVxdWVzdC5ET05FIHx8IHhoci5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjb3VudCA9IGNvdW50RGF0YS50cmFuc2Zvcm0uYXBwbHkoX3RoaXM3LCBbeGhyXSkgfHwgMDtcblxuICAgICAgICBpZiAoY2IgJiYgdHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY2IoY291bnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChfdGhpczcuYXBwZW5kVG8gJiYgdHlwZW9mIF90aGlzNy5hcHBlbmRUbyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgX3RoaXM3LmFwcGVuZFRvLmFwcGVuZENoaWxkKF90aGlzNy5vcyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvdW50UmVkdWNlKF90aGlzNy5vcywgY291bnQsIF90aGlzNy5jYik7XG4gICAgICAgIH1cbiAgICAgICAgRXZlbnRzLnRyaWdnZXIoX3RoaXM3Lm9zLCAnY291bnRlZC0nICsgX3RoaXM3LnVybCk7XG4gICAgICB9O1xuXG4gICAgICB4aHIub3BlbignUE9TVCcsIGNvdW50RGF0YS51cmwpO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnKTtcbiAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGNvdW50RGF0YS5kYXRhKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc3RvcmVTZXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9yZVNldCh0eXBlKSB7XG4gICAgICB2YXIgY291bnQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAwIDogYXJndW1lbnRzWzFdO1xuICAgICAgLy9lc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICBpZiAoIXdpbmRvdy5sb2NhbFN0b3JhZ2UgfHwgIXR5cGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnT3BlblNoYXJlLScgKyB0eXBlLCBjb3VudCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc3RvcmVHZXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9yZUdldCh0eXBlKSB7XG4gICAgICAvL2VzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgIGlmICghd2luZG93LmxvY2FsU3RvcmFnZSB8fCAhdHlwZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnT3BlblNoYXJlLScgKyB0eXBlKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ291bnQ7XG59KCk7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVDb3VudE5vZGUob3MpIHtcbiAgLy8gaW5pdGlhbGl6ZSBvcGVuIHNoYXJlIG9iamVjdCB3aXRoIHR5cGUgYXR0cmlidXRlXG4gIHZhciB0eXBlID0gb3MuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtY291bnQnKTtcbiAgdmFyIHVybCA9IG9zLmdldEF0dHJpYnV0ZSgnZGF0YS1vcGVuLXNoYXJlLWNvdW50LXJlcG8nKSB8fCBvcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtb3Blbi1zaGFyZS1jb3VudC1zaG90JykgfHwgb3MuZ2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtY291bnQtdXJsJyk7XG4gIHZhciBjb3VudCA9IG5ldyBDb3VudCh0eXBlLCB1cmwpO1xuXG4gIGNvdW50LmNvdW50KG9zKTtcbiAgb3Muc2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtbm9kZScsIHR5cGUpO1xufVxuXG5mdW5jdGlvbiBpbml0KCkge1xuICBpbml0JDEoe1xuICAgIHNlbGVjdG9yOiB7XG4gICAgICBzaGFyZTogJ1tkYXRhLW9wZW4tc2hhcmVdOm5vdChbZGF0YS1vcGVuLXNoYXJlLW5vZGVdKScsXG4gICAgICBjb3VudDogJ1tkYXRhLW9wZW4tc2hhcmUtY291bnRdOm5vdChbZGF0YS1vcGVuLXNoYXJlLW5vZGVdKSdcbiAgICB9LFxuICAgIGNiOiB7XG4gICAgICBzaGFyZTogaW5pdGlhbGl6ZVNoYXJlTm9kZSxcbiAgICAgIGNvdW50OiBpbml0aWFsaXplQ291bnROb2RlXG4gICAgfVxuICB9KSgpO1xufVxudmFyIERhdGFBdHRyID0gZnVuY3Rpb24gRGF0YUF0dHIoKSB7XG4gIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgcmV0dXJuIGluaXQoKTtcbiAgfVxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICBpbml0KCk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG59O1xuXG4vKipcbiAqIEdsb2JhbCBPcGVuU2hhcmUgQVBJIHRvIGdlbmVyYXRlIGluc3RhbmNlcyBwcm9ncmFtbWF0aWNhbGx5XG4gKi9cbnZhciBTaGFyZUFQSSA9IGZ1bmN0aW9uIFNoYXJlQVBJKCkge1xuICAvLyBnbG9iYWwgT3BlblNoYXJlIHJlZmVyZW5jaW5nIGludGVybmFsIGNsYXNzIGZvciBpbnN0YW5jZSBnZW5lcmF0aW9uXG4gIHZhciBPcGVuU2hhcmUkJDEgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gT3BlblNoYXJlJCQxKGRhdGEsIGVsZW1lbnQpIHtcbiAgICAgIHZhciBfdGhpczggPSB0aGlzO1xuXG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgT3BlblNoYXJlJCQxKTtcblxuICAgICAgaWYgKCFkYXRhLmJpbmRDbGljaykgZGF0YS5iaW5kQ2xpY2sgPSB0cnVlO1xuXG4gICAgICB2YXIgZGFzaCA9IGRhdGEudHlwZS5pbmRleE9mKCctJyk7XG5cbiAgICAgIGlmIChkYXNoID4gLTEpIHtcbiAgICAgICAgZGF0YS50eXBlID0gZGFzaFRvQ2FtZWwoZGFzaCwgZGF0YS50eXBlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIG5vZGUgPSB2b2lkIDA7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgdGhpcy5kYXRhID0gZGF0YTtcblxuICAgICAgdGhpcy5vcyA9IG5ldyBPcGVuU2hhcmUoZGF0YS50eXBlLCBTaGFyZVRyYW5zZm9ybXNbZGF0YS50eXBlXSk7XG4gICAgICB0aGlzLm9zLnNldERhdGEoZGF0YSk7XG5cbiAgICAgIGlmICghZWxlbWVudCB8fCBkYXRhLmVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudCA9IGRhdGEuZWxlbWVudDtcbiAgICAgICAgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudCB8fCAnYScpO1xuICAgICAgICBpZiAoZGF0YS50eXBlKSB7XG4gICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKCdvcGVuLXNoYXJlLWxpbmsnLCBkYXRhLnR5cGUpO1xuICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUnLCBkYXRhLnR5cGUpO1xuICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtbm9kZScsIGRhdGEudHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuaW5uZXJIVE1MKSBub2RlLmlubmVySFRNTCA9IGRhdGEuaW5uZXJIVE1MO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUpIGVsZW1lbnQgPSBub2RlO1xuXG4gICAgICBpZiAoZGF0YS5iaW5kQ2xpY2spIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfdGhpczguc2hhcmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhLmFwcGVuZFRvKSB7XG4gICAgICAgIGRhdGEuYXBwZW5kVG8uYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhLmNsYXNzZXMgJiYgQXJyYXkuaXNBcnJheShkYXRhLmNsYXNzZXMpKSB7XG4gICAgICAgIGRhdGEuY2xhc3Nlcy5mb3JFYWNoKGZ1bmN0aW9uIChjc3NDbGFzcykge1xuICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjc3NDbGFzcyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGF0YS50eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdwYXlwYWwnKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBkYXRhLnNhbmRib3ggPyAnaHR0cHM6Ly93d3cuc2FuZGJveC5wYXlwYWwuY29tL2NnaS1iaW4vd2Vic2NyJyA6ICdodHRwczovL3d3dy5wYXlwYWwuY29tL2NnaS1iaW4vd2Vic2NyJztcblxuICAgICAgICB2YXIgYnV5R0lGID0gZGF0YS5zYW5kYm94ID8gJ2h0dHBzOi8vd3d3LnNhbmRib3gucGF5cGFsLmNvbS9lbl9VUy9pL2J0bi9idG5fYnV5bm93X0xHLmdpZicgOiAnaHR0cHM6Ly93d3cucGF5cGFsb2JqZWN0cy5jb20vZW5fVVMvaS9idG4vYnRuX2J1eW5vd19MRy5naWYnO1xuXG4gICAgICAgIHZhciBwaXhlbEdJRiA9IGRhdGEuc2FuZGJveCA/ICdodHRwczovL3d3dy5zYW5kYm94LnBheXBhbC5jb20vZW5fVVMvaS9zY3IvcGl4ZWwuZ2lmJyA6ICdodHRwczovL3d3dy5wYXlwYWxvYmplY3RzLmNvbS9lbl9VUy9pL3Njci9waXhlbC5naWYnO1xuXG4gICAgICAgIHZhciBwYXlwYWxCdXR0b24gPSAnPGZvcm0gYWN0aW9uPScgKyBhY3Rpb24gKyAnIG1ldGhvZD1cInBvc3RcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cXG5cXG4gICAgICAgIDwhLS0gU2F2ZWQgYnV0dG9ucyB1c2UgdGhlIFwic2VjdXJlIGNsaWNrXCIgY29tbWFuZCAtLT5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImNtZFwiIHZhbHVlPVwiX3MteGNsaWNrXCI+XFxuXFxuICAgICAgICA8IS0tIFNhdmVkIGJ1dHRvbnMgYXJlIGlkZW50aWZpZWQgYnkgdGhlaXIgYnV0dG9uIElEcyAtLT5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImhvc3RlZF9idXR0b25faWRcIiB2YWx1ZT1cIicgKyBkYXRhLmJ1dHRvbklkICsgJ1wiPlxcblxcbiAgICAgICAgPCEtLSBTYXZlZCBidXR0b25zIGRpc3BsYXkgYW4gYXBwcm9wcmlhdGUgYnV0dG9uIGltYWdlLiAtLT5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVwiaW1hZ2VcIiBuYW1lPVwic3VibWl0XCJcXG4gICAgICAgIHNyYz0nICsgYnV5R0lGICsgJ1xcbiAgICAgICAgYWx0PVwiUGF5UGFsIC0gVGhlIHNhZmVyLCBlYXNpZXIgd2F5IHRvIHBheSBvbmxpbmVcIj5cXG4gICAgICAgIDxpbWcgYWx0PVwiXCIgd2lkdGg9XCIxXCIgaGVpZ2h0PVwiMVwiXFxuICAgICAgICBzcmM9JyArIHBpeGVsR0lGICsgJyA+XFxuXFxuICAgICAgICA8L2Zvcm0+JztcblxuICAgICAgICB2YXIgaGlkZGVuRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhpZGRlbkRpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBoaWRkZW5EaXYuaW5uZXJIVE1MID0gcGF5cGFsQnV0dG9uO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGhpZGRlbkRpdik7XG5cbiAgICAgICAgdGhpcy5wYXlwYWwgPSBoaWRkZW5EaXYucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8gcHVibGljIHNoYXJlIG1ldGhvZCB0byB0cmlnZ2VyIHNoYXJlIHByb2dyYW1tYXRpY2FsbHlcblxuXG4gICAgX2NyZWF0ZUNsYXNzKE9wZW5TaGFyZSQkMSwgW3tcbiAgICAgIGtleTogJ3NoYXJlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzaGFyZShlKSB7XG4gICAgICAgIC8vIGlmIGR5bmFtaWMgaW5zdGFuY2UgdGhlbiBmZXRjaCBhdHRyaWJ1dGVzIGFnYWluIGluIGNhc2Ugb2YgdXBkYXRlc1xuICAgICAgICBpZiAodGhpcy5kYXRhLmR5bmFtaWMpIHtcbiAgICAgICAgICAvL2VzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgICAgIHRoaXMub3Muc2V0RGF0YShkYXRhKTsgLy8gZGF0YSBpcyBub3QgZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGF0YS50eXBlLnRvTG93ZXJDYXNlKCkgPT09ICdwYXlwYWwnKSB7XG4gICAgICAgICAgdGhpcy5wYXlwYWwuc3VibWl0KCk7XG4gICAgICAgIH0gZWxzZSB0aGlzLm9zLnNoYXJlKGUpO1xuXG4gICAgICAgIEV2ZW50cy50cmlnZ2VyKHRoaXMuZWxlbWVudCwgJ3NoYXJlZCcpO1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBPcGVuU2hhcmUkJDE7XG4gIH0oKTtcblxuICByZXR1cm4gT3BlblNoYXJlJCQxO1xufTtcblxuLyoqXG4gKiBjb3VudCBBUElcbiAqL1xuXG52YXIgQ291bnRBUEkgPSBmdW5jdGlvbiBDb3VudEFQSSgpIHtcbiAgLy9lc2xpbnQtZGlzYWJsZS1saW5lXG4gIC8vIGdsb2JhbCBPcGVuU2hhcmUgcmVmZXJlbmNpbmcgaW50ZXJuYWwgY2xhc3MgZm9yIGluc3RhbmNlIGdlbmVyYXRpb25cbiAgdmFyIENvdW50JCQxID0gZnVuY3Rpb24gQ291bnQkJDEoX3JlZiwgY2IpIHtcbiAgICB2YXIgdHlwZSA9IF9yZWYudHlwZTtcbiAgICB2YXIgdXJsID0gX3JlZi51cmw7XG4gICAgdmFyIF9yZWYkYXBwZW5kVG8gPSBfcmVmLmFwcGVuZFRvO1xuICAgIHZhciBhcHBlbmRUbyA9IF9yZWYkYXBwZW5kVG8gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogX3JlZiRhcHBlbmRUbztcbiAgICB2YXIgZWxlbWVudCA9IF9yZWYuZWxlbWVudDtcbiAgICB2YXIgY2xhc3NlcyA9IF9yZWYuY2xhc3NlcztcbiAgICB2YXIgX3JlZiRrZXkgPSBfcmVmLmtleTtcbiAgICB2YXIga2V5ID0gX3JlZiRrZXkgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBfcmVmJGtleTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDb3VudCQkMSk7XG5cbiAgICB2YXIgY291bnROb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50IHx8ICdzcGFuJyk7XG5cbiAgICBjb3VudE5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtY291bnQnLCB0eXBlKTtcbiAgICBjb3VudE5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUtY291bnQtdXJsJywgdXJsKTtcbiAgICBpZiAoa2V5KSBjb3VudE5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLW9wZW4tc2hhcmUta2V5Jywga2V5KTtcblxuICAgIGNvdW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdvcGVuLXNoYXJlLWNvdW50Jyk7XG5cbiAgICBpZiAoY2xhc3NlcyAmJiBBcnJheS5pc0FycmF5KGNsYXNzZXMpKSB7XG4gICAgICBjbGFzc2VzLmZvckVhY2goZnVuY3Rpb24gKGNzc0NMYXNzKSB7XG4gICAgICAgIGNvdW50Tm9kZS5jbGFzc0xpc3QuYWRkKGNzc0NMYXNzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhcHBlbmRUbykge1xuICAgICAgcmV0dXJuIG5ldyBDb3VudCh0eXBlLCB1cmwpLmNvdW50KGNvdW50Tm9kZSwgY2IsIGFwcGVuZFRvKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IENvdW50KHR5cGUsIHVybCkuY291bnQoY291bnROb2RlLCBjYik7XG4gIH07XG5cbiAgcmV0dXJuIENvdW50JCQxO1xufTtcblxudmFyIGJyb3dzZXIgPSBmdW5jdGlvbiBicm93c2VyKCkge1xuICBEYXRhQXR0cihPcGVuU2hhcmUsIENvdW50LCBTaGFyZVRyYW5zZm9ybXMsIEV2ZW50cyk7XG4gIHdpbmRvdy5PcGVuU2hhcmUgPSB7XG4gICAgc2hhcmU6IFNoYXJlQVBJKE9wZW5TaGFyZSwgU2hhcmVUcmFuc2Zvcm1zLCBFdmVudHMpLFxuICAgIGNvdW50OiBDb3VudEFQSSgpLFxuICAgIGFuYWx5dGljczogYW5hbHl0aWNzXG4gIH07XG59O1xudmFyIGJyb3dzZXJfanMgPSBicm93c2VyKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYnJvd3Nlcl9qcztcblxufSx7fV19LHt9LFsxXSk7XG4iLCJ2YXIgdHJpbSA9IHJlcXVpcmUoJ3RyaW0nKVxuICAsIGZvckVhY2ggPSByZXF1aXJlKCdmb3ItZWFjaCcpXG4gICwgaXNBcnJheSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaGVhZGVycykge1xuICBpZiAoIWhlYWRlcnMpXG4gICAgcmV0dXJuIHt9XG5cbiAgdmFyIHJlc3VsdCA9IHt9XG5cbiAgZm9yRWFjaChcbiAgICAgIHRyaW0oaGVhZGVycykuc3BsaXQoJ1xcbicpXG4gICAgLCBmdW5jdGlvbiAocm93KSB7XG4gICAgICAgIHZhciBpbmRleCA9IHJvdy5pbmRleE9mKCc6JylcbiAgICAgICAgICAsIGtleSA9IHRyaW0ocm93LnNsaWNlKDAsIGluZGV4KSkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICwgdmFsdWUgPSB0cmltKHJvdy5zbGljZShpbmRleCArIDEpKVxuXG4gICAgICAgIGlmICh0eXBlb2YocmVzdWx0W2tleV0pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWVcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHJlc3VsdFtrZXldKSkge1xuICAgICAgICAgIHJlc3VsdFtrZXldLnB1c2godmFsdWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBbIHJlc3VsdFtrZXldLCB2YWx1ZSBdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgKVxuXG4gIHJldHVybiByZXN1bHRcbn0iLCJcbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHRyaW07XG5cbmZ1bmN0aW9uIHRyaW0oc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzKnxcXHMqJC9nLCAnJyk7XG59XG5cbmV4cG9ydHMubGVmdCA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyovLCAnJyk7XG59O1xuXG5leHBvcnRzLnJpZ2h0ID0gZnVuY3Rpb24oc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciB3aW5kb3cgPSByZXF1aXJlKFwiZ2xvYmFsL3dpbmRvd1wiKVxudmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKFwiaXMtZnVuY3Rpb25cIilcbnZhciBwYXJzZUhlYWRlcnMgPSByZXF1aXJlKFwicGFyc2UtaGVhZGVyc1wiKVxudmFyIHh0ZW5kID0gcmVxdWlyZShcInh0ZW5kXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlWEhSXG5jcmVhdGVYSFIuWE1MSHR0cFJlcXVlc3QgPSB3aW5kb3cuWE1MSHR0cFJlcXVlc3QgfHwgbm9vcFxuY3JlYXRlWEhSLlhEb21haW5SZXF1ZXN0ID0gXCJ3aXRoQ3JlZGVudGlhbHNcIiBpbiAobmV3IGNyZWF0ZVhIUi5YTUxIdHRwUmVxdWVzdCgpKSA/IGNyZWF0ZVhIUi5YTUxIdHRwUmVxdWVzdCA6IHdpbmRvdy5YRG9tYWluUmVxdWVzdFxuXG5mb3JFYWNoQXJyYXkoW1wiZ2V0XCIsIFwicHV0XCIsIFwicG9zdFwiLCBcInBhdGNoXCIsIFwiaGVhZFwiLCBcImRlbGV0ZVwiXSwgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgY3JlYXRlWEhSW21ldGhvZCA9PT0gXCJkZWxldGVcIiA/IFwiZGVsXCIgOiBtZXRob2RdID0gZnVuY3Rpb24odXJpLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgICAgICBvcHRpb25zID0gaW5pdFBhcmFtcyh1cmksIG9wdGlvbnMsIGNhbGxiYWNrKVxuICAgICAgICBvcHRpb25zLm1ldGhvZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gICAgICAgIHJldHVybiBfY3JlYXRlWEhSKG9wdGlvbnMpXG4gICAgfVxufSlcblxuZnVuY3Rpb24gZm9yRWFjaEFycmF5KGFycmF5LCBpdGVyYXRvcikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0b3IoYXJyYXlbaV0pXG4gICAgfVxufVxuXG5mdW5jdGlvbiBpc0VtcHR5KG9iail7XG4gICAgZm9yKHZhciBpIGluIG9iail7XG4gICAgICAgIGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSkgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGluaXRQYXJhbXModXJpLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIHZhciBwYXJhbXMgPSB1cmlcblxuICAgIGlmIChpc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgICAgIGNhbGxiYWNrID0gb3B0aW9uc1xuICAgICAgICBpZiAodHlwZW9mIHVyaSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcGFyYW1zID0ge3VyaTp1cml9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBwYXJhbXMgPSB4dGVuZChvcHRpb25zLCB7dXJpOiB1cml9KVxuICAgIH1cblxuICAgIHBhcmFtcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gICAgcmV0dXJuIHBhcmFtc1xufVxuXG5mdW5jdGlvbiBjcmVhdGVYSFIodXJpLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIG9wdGlvbnMgPSBpbml0UGFyYW1zKHVyaSwgb3B0aW9ucywgY2FsbGJhY2spXG4gICAgcmV0dXJuIF9jcmVhdGVYSFIob3B0aW9ucylcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZVhIUihvcHRpb25zKSB7XG4gICAgaWYodHlwZW9mIG9wdGlvbnMuY2FsbGJhY2sgPT09IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjYWxsYmFjayBhcmd1bWVudCBtaXNzaW5nXCIpXG4gICAgfVxuXG4gICAgdmFyIGNhbGxlZCA9IGZhbHNlXG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gY2JPbmNlKGVyciwgcmVzcG9uc2UsIGJvZHkpe1xuICAgICAgICBpZighY2FsbGVkKXtcbiAgICAgICAgICAgIGNhbGxlZCA9IHRydWVcbiAgICAgICAgICAgIG9wdGlvbnMuY2FsbGJhY2soZXJyLCByZXNwb25zZSwgYm9keSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlYWR5c3RhdGVjaGFuZ2UoKSB7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgc2V0VGltZW91dChsb2FkRnVuYywgMClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEJvZHkoKSB7XG4gICAgICAgIC8vIENocm9tZSB3aXRoIHJlcXVlc3RUeXBlPWJsb2IgdGhyb3dzIGVycm9ycyBhcnJvdW5kIHdoZW4gZXZlbiB0ZXN0aW5nIGFjY2VzcyB0byByZXNwb25zZVRleHRcbiAgICAgICAgdmFyIGJvZHkgPSB1bmRlZmluZWRcblxuICAgICAgICBpZiAoeGhyLnJlc3BvbnNlKSB7XG4gICAgICAgICAgICBib2R5ID0geGhyLnJlc3BvbnNlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBib2R5ID0geGhyLnJlc3BvbnNlVGV4dCB8fCBnZXRYbWwoeGhyKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzSnNvbikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBib2R5ID0gSlNPTi5wYXJzZShib2R5KVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBib2R5XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3JGdW5jKGV2dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFRpbWVyKVxuICAgICAgICBpZighKGV2dCBpbnN0YW5jZW9mIEVycm9yKSl7XG4gICAgICAgICAgICBldnQgPSBuZXcgRXJyb3IoXCJcIiArIChldnQgfHwgXCJVbmtub3duIFhNTEh0dHBSZXF1ZXN0IEVycm9yXCIpIClcbiAgICAgICAgfVxuICAgICAgICBldnQuc3RhdHVzQ29kZSA9IDBcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGV2dCwgZmFpbHVyZVJlc3BvbnNlKVxuICAgIH1cblxuICAgIC8vIHdpbGwgbG9hZCB0aGUgZGF0YSAmIHByb2Nlc3MgdGhlIHJlc3BvbnNlIGluIGEgc3BlY2lhbCByZXNwb25zZSBvYmplY3RcbiAgICBmdW5jdGlvbiBsb2FkRnVuYygpIHtcbiAgICAgICAgaWYgKGFib3J0ZWQpIHJldHVyblxuICAgICAgICB2YXIgc3RhdHVzXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0VGltZXIpXG4gICAgICAgIGlmKG9wdGlvbnMudXNlWERSICYmIHhoci5zdGF0dXM9PT11bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vSUU4IENPUlMgR0VUIHN1Y2Nlc3NmdWwgcmVzcG9uc2UgZG9lc24ndCBoYXZlIGEgc3RhdHVzIGZpZWxkLCBidXQgYm9keSBpcyBmaW5lXG4gICAgICAgICAgICBzdGF0dXMgPSAyMDBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXR1cyA9ICh4aHIuc3RhdHVzID09PSAxMjIzID8gMjA0IDogeGhyLnN0YXR1cylcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVzcG9uc2UgPSBmYWlsdXJlUmVzcG9uc2VcbiAgICAgICAgdmFyIGVyciA9IG51bGxcblxuICAgICAgICBpZiAoc3RhdHVzICE9PSAwKXtcbiAgICAgICAgICAgIHJlc3BvbnNlID0ge1xuICAgICAgICAgICAgICAgIGJvZHk6IGdldEJvZHkoKSxcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiBzdGF0dXMsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgICAgICAgICAgdXJsOiB1cmksXG4gICAgICAgICAgICAgICAgcmF3UmVxdWVzdDogeGhyXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKXsgLy9yZW1lbWJlciB4aHIgY2FuIGluIGZhY3QgYmUgWERSIGZvciBDT1JTIGluIElFXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuaGVhZGVycyA9IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnIgPSBuZXcgRXJyb3IoXCJJbnRlcm5hbCBYTUxIdHRwUmVxdWVzdCBFcnJvclwiKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIHJlc3BvbnNlLCByZXNwb25zZS5ib2R5KVxuICAgIH1cblxuICAgIHZhciB4aHIgPSBvcHRpb25zLnhociB8fCBudWxsXG5cbiAgICBpZiAoIXhocikge1xuICAgICAgICBpZiAob3B0aW9ucy5jb3JzIHx8IG9wdGlvbnMudXNlWERSKSB7XG4gICAgICAgICAgICB4aHIgPSBuZXcgY3JlYXRlWEhSLlhEb21haW5SZXF1ZXN0KClcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB4aHIgPSBuZXcgY3JlYXRlWEhSLlhNTEh0dHBSZXF1ZXN0KClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBrZXlcbiAgICB2YXIgYWJvcnRlZFxuICAgIHZhciB1cmkgPSB4aHIudXJsID0gb3B0aW9ucy51cmkgfHwgb3B0aW9ucy51cmxcbiAgICB2YXIgbWV0aG9kID0geGhyLm1ldGhvZCA9IG9wdGlvbnMubWV0aG9kIHx8IFwiR0VUXCJcbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keSB8fCBvcHRpb25zLmRhdGFcbiAgICB2YXIgaGVhZGVycyA9IHhoci5oZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIHx8IHt9XG4gICAgdmFyIHN5bmMgPSAhIW9wdGlvbnMuc3luY1xuICAgIHZhciBpc0pzb24gPSBmYWxzZVxuICAgIHZhciB0aW1lb3V0VGltZXJcbiAgICB2YXIgZmFpbHVyZVJlc3BvbnNlID0ge1xuICAgICAgICBib2R5OiB1bmRlZmluZWQsXG4gICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICBzdGF0dXNDb2RlOiAwLFxuICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgdXJsOiB1cmksXG4gICAgICAgIHJhd1JlcXVlc3Q6IHhoclxuICAgIH1cblxuICAgIGlmIChcImpzb25cIiBpbiBvcHRpb25zICYmIG9wdGlvbnMuanNvbiAhPT0gZmFsc2UpIHtcbiAgICAgICAgaXNKc29uID0gdHJ1ZVxuICAgICAgICBoZWFkZXJzW1wiYWNjZXB0XCJdIHx8IGhlYWRlcnNbXCJBY2NlcHRcIl0gfHwgKGhlYWRlcnNbXCJBY2NlcHRcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIikgLy9Eb24ndCBvdmVycmlkZSBleGlzdGluZyBhY2NlcHQgaGVhZGVyIGRlY2xhcmVkIGJ5IHVzZXJcbiAgICAgICAgaWYgKG1ldGhvZCAhPT0gXCJHRVRcIiAmJiBtZXRob2QgIT09IFwiSEVBRFwiKSB7XG4gICAgICAgICAgICBoZWFkZXJzW1wiY29udGVudC10eXBlXCJdIHx8IGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gfHwgKGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIikgLy9Eb24ndCBvdmVycmlkZSBleGlzdGluZyBhY2NlcHQgaGVhZGVyIGRlY2xhcmVkIGJ5IHVzZXJcbiAgICAgICAgICAgIGJvZHkgPSBKU09OLnN0cmluZ2lmeShvcHRpb25zLmpzb24gPT09IHRydWUgPyBib2R5IDogb3B0aW9ucy5qc29uKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IHJlYWR5c3RhdGVjaGFuZ2VcbiAgICB4aHIub25sb2FkID0gbG9hZEZ1bmNcbiAgICB4aHIub25lcnJvciA9IGVycm9yRnVuY1xuICAgIC8vIElFOSBtdXN0IGhhdmUgb25wcm9ncmVzcyBiZSBzZXQgdG8gYSB1bmlxdWUgZnVuY3Rpb24uXG4gICAgeGhyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIElFIG11c3QgZGllXG4gICAgfVxuICAgIHhoci5vbmFib3J0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgYWJvcnRlZCA9IHRydWU7XG4gICAgfVxuICAgIHhoci5vbnRpbWVvdXQgPSBlcnJvckZ1bmNcbiAgICB4aHIub3BlbihtZXRob2QsIHVyaSwgIXN5bmMsIG9wdGlvbnMudXNlcm5hbWUsIG9wdGlvbnMucGFzc3dvcmQpXG4gICAgLy9oYXMgdG8gYmUgYWZ0ZXIgb3BlblxuICAgIGlmKCFzeW5jKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSAhIW9wdGlvbnMud2l0aENyZWRlbnRpYWxzXG4gICAgfVxuICAgIC8vIENhbm5vdCBzZXQgdGltZW91dCB3aXRoIHN5bmMgcmVxdWVzdFxuICAgIC8vIG5vdCBzZXR0aW5nIHRpbWVvdXQgb24gdGhlIHhociBvYmplY3QsIGJlY2F1c2Ugb2Ygb2xkIHdlYmtpdHMgZXRjLiBub3QgaGFuZGxpbmcgdGhhdCBjb3JyZWN0bHlcbiAgICAvLyBib3RoIG5wbSdzIHJlcXVlc3QgYW5kIGpxdWVyeSAxLnggdXNlIHRoaXMga2luZCBvZiB0aW1lb3V0LCBzbyB0aGlzIGlzIGJlaW5nIGNvbnNpc3RlbnRcbiAgICBpZiAoIXN5bmMgJiYgb3B0aW9ucy50aW1lb3V0ID4gMCApIHtcbiAgICAgICAgdGltZW91dFRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKGFib3J0ZWQpIHJldHVyblxuICAgICAgICAgICAgYWJvcnRlZCA9IHRydWUvL0lFOSBtYXkgc3RpbGwgY2FsbCByZWFkeXN0YXRlY2hhbmdlXG4gICAgICAgICAgICB4aHIuYWJvcnQoXCJ0aW1lb3V0XCIpXG4gICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihcIlhNTEh0dHBSZXF1ZXN0IHRpbWVvdXRcIilcbiAgICAgICAgICAgIGUuY29kZSA9IFwiRVRJTUVET1VUXCJcbiAgICAgICAgICAgIGVycm9yRnVuYyhlKVxuICAgICAgICB9LCBvcHRpb25zLnRpbWVvdXQgKVxuICAgIH1cblxuICAgIGlmICh4aHIuc2V0UmVxdWVzdEhlYWRlcikge1xuICAgICAgICBmb3Ioa2V5IGluIGhlYWRlcnMpe1xuICAgICAgICAgICAgaWYoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKXtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIGhlYWRlcnNba2V5XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5oZWFkZXJzICYmICFpc0VtcHR5KG9wdGlvbnMuaGVhZGVycykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSGVhZGVycyBjYW5ub3QgYmUgc2V0IG9uIGFuIFhEb21haW5SZXF1ZXN0IG9iamVjdFwiKVxuICAgIH1cblxuICAgIGlmIChcInJlc3BvbnNlVHlwZVwiIGluIG9wdGlvbnMpIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IG9wdGlvbnMucmVzcG9uc2VUeXBlXG4gICAgfVxuXG4gICAgaWYgKFwiYmVmb3JlU2VuZFwiIGluIG9wdGlvbnMgJiZcbiAgICAgICAgdHlwZW9mIG9wdGlvbnMuYmVmb3JlU2VuZCA9PT0gXCJmdW5jdGlvblwiXG4gICAgKSB7XG4gICAgICAgIG9wdGlvbnMuYmVmb3JlU2VuZCh4aHIpXG4gICAgfVxuXG4gICAgLy8gTWljcm9zb2Z0IEVkZ2UgYnJvd3NlciBzZW5kcyBcInVuZGVmaW5lZFwiIHdoZW4gc2VuZCBpcyBjYWxsZWQgd2l0aCB1bmRlZmluZWQgdmFsdWUuXG4gICAgLy8gWE1MSHR0cFJlcXVlc3Qgc3BlYyBzYXlzIHRvIHBhc3MgbnVsbCBhcyBib2R5IHRvIGluZGljYXRlIG5vIGJvZHlcbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL25hdWd0dXIveGhyL2lzc3Vlcy8xMDAuXG4gICAgeGhyLnNlbmQoYm9keSB8fCBudWxsKVxuXG4gICAgcmV0dXJuIHhoclxuXG5cbn1cblxuZnVuY3Rpb24gZ2V0WG1sKHhocikge1xuICAgIC8vIHhoci5yZXNwb25zZVhNTCB3aWxsIHRocm93IEV4Y2VwdGlvbiBcIkludmFsaWRTdGF0ZUVycm9yXCIgb3IgXCJET01FeGNlcHRpb25cIlxuICAgIC8vIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvWE1MSHR0cFJlcXVlc3QvcmVzcG9uc2VYTUwuXG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHhoci5yZXNwb25zZVR5cGUgPT09IFwiZG9jdW1lbnRcIikge1xuICAgICAgICAgICAgcmV0dXJuIHhoci5yZXNwb25zZVhNTFxuICAgICAgICB9XG4gICAgICAgIHZhciBmaXJlZm94QnVnVGFrZW5FZmZlY3QgPSB4aHIucmVzcG9uc2VYTUwgJiYgeGhyLnJlc3BvbnNlWE1MLmRvY3VtZW50RWxlbWVudC5ub2RlTmFtZSA9PT0gXCJwYXJzZXJlcnJvclwiXG4gICAgICAgIGlmICh4aHIucmVzcG9uc2VUeXBlID09PSBcIlwiICYmICFmaXJlZm94QnVnVGFrZW5FZmZlY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VYTUxcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICByZXR1cm4gbnVsbFxufVxuXG5mdW5jdGlvbiBub29wKCkge31cbiIsIm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kXG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgICB2YXIgdGFyZ2V0ID0ge31cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV1cblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0XG59XG4iXX0=
