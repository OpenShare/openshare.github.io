require('open-share');
const xhr = require('xhr');
const animationMods = ['square', 'diamond', 'rectangle', 'rectangle-vert'];

const ui = {
	openShareNodes: document.querySelectorAll('.open-share-examples [data-open-share]'),
	burger: document.querySelector('.burger-icon'),
	nav: document.querySelector('.header__nav'),
	appKey: document.getElementById('app-key'),
	secretKey: document.getElementById('secret-key'),
	urls: document.querySelectorAll('.url-list__input'),
	submit: document.getElementById('account-submit'),
	accountSetup: document.querySelector('[data-account-setup]'),
	moreUrlsLinks: document.querySelectorAll('[data-more-urls-link]'),
	moreUrls: document.querySelector('[data-more-urls-form]'),
	tokenExampleLink: document.querySelector('[data-token-example-link]'),
	tokenExample: document.querySelector('[data-token-example]'),
};

ui.requiredFields = [
	{ input: ui.appKey },
	{ input: ui.secretKey },
	{
		input: ui.urls[0],
		validate: value => value.includes('http'),
	},
];

document.addEventListener('DOMContentLoaded', () => {
	const interval = new RecurringTimer(animationLoop, 6000);

	[].forEach.call(ui.openShareNodes, (node) => {
		if (!isInPage(node)) {
			return;
		}

		node.addEventListener('mouseenter', () => {
			interval.pause();
		});
		node.addEventListener('mouseleave', () => {
			interval.resume();
		});
	});

	if (isInPage(ui.burger)) {
		ui.burger.addEventListener('click', () => {
			ui.burger.classList.toggle('active');
			ui.nav.classList.toggle('active');
		});
	}

	if (isInPage(ui.submit)) {
		ui.requiredFields.forEach(field => {
			field.input.addEventListener('blur', function validate(i) {
				if ((i.validate && i.validate(i.input.value)) || i.input.value) {
					i.input.classList.remove('account-form__input--error');
				} else {
					i.input.classList.add('account-form__input--error');
				}
			}.bind(this, field));
		});

		ui.submit.addEventListener('click', () => {
			let validationFailed = false,
				firstFail = null;

			ui.requiredFields.forEach(i => {
				if ((i.validate && !i.validate(i.input.value)) || !i.input.value) {
					validationFailed = true;

					if (!firstFail) {
						firstFail = i.input;
					}

					i.input.classList.add('account-form__input--error');
				}
			});

			if (validationFailed) {
				document.body.scrollTop = (firstFail.offsetTop -
											firstFail.scrollTop +
											firstFail.clientTop) - 10;
				return false;
			}

			const payload = {
				appKey: ui.appKey.value,
				secretKey: ui.secretKey.value,
				urls: [].map.call(ui.urls, url => url.value),
			};

			xhr({
				body: JSON.stringify(payload),
				url: '/register',
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
			}, (err, resp, body) => {
				if (err) console.error(err);

				document.body.scrollTop = 0;

				if (body) {
					ui.accountSetup.innerHTML = body;
				}
			});
		});
	}

	ui.moreUrlsLinks.forEach(moreUrlsLink => {
		if (!isInPage(moreUrlsLink)) {
			return;
		}

		moreUrlsLink.addEventListener('click', e => {
			e.preventDefault();
			ui.moreUrls.classList.add('more-urls--display');

			setTimeout(() => {
				ui.moreUrls.classList.add('more-urls--show');
			}, 200);
		});
	});

	if (isInPage(ui.tokenExampleLink)) {
		ui.tokenExampleLink.addEventListener('click', e => {
			e.preventDefault();
			ui.tokenExample.classList.add('account__token-example--display');

			setTimeout(() => {
				ui.tokenExample.classList.add('account__token-example--show');
			}, 200);
		});
	}

	setTimeout(() => {
		animationLoop();
	}, 1000);
});

function Timer(callback, delay) {
	let timerId,
		start,
		remaining = delay;

	this.pause = () => {
		window.clearTimeout(timerId);
		remaining -= new Date() - start;
	};

	this.resume = () => {
		start = new Date();
		window.clearTimeout(timerId);
		timerId = window.setTimeout(callback, remaining);
	};

	this.resume();
}


function RecurringTimer(callback, delay) {
	let timerId,
		start,
		remaining = delay;

	this.pause = () => {
		window.clearTimeout(timerId);
		remaining -= new Date() - start;
	};

	const resume = () => {
		start = new Date();
		timerId = window.setTimeout(() => {
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
	animationMods.forEach((mod, i) => {
		// wait a second in between each animation segment
		const timer = new Timer(() => {
			// loop through open share nodes
			[].forEach.call(ui.openShareNodes, (node, j) => {
				// delay by index * 100ms
				new Timer(function timerCallback() {
					// out of mods so reset
					if (!mod) {
						this.setAttribute('class', 'open-share-example');

					// apply mod
					} else {
						this.setAttribute('class', `open-share-example--${mod}`);
					}

				// bind node to setTimeout so reference doesn't change on each loop
				}.bind(node), j * 100);
			});
		}, i * 1000);

		[].forEach.call(ui.openShareNodes, (node) => {
			node.addEventListener('mouseenter', () => {
				timer.pause();
			});

			node.addEventListener('mouseleave', () => {
				timer.resume();
			});
		});
	});
}

function isInPage(node) {
	return (node === document.body) ? false : document.body.contains(node);
}
