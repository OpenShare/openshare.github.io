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
	accountInner: document.querySelector('.account__inner'),
	moreUrlsLink: document.querySelector('.account__more-info'),
	moreUrls: document.querySelector('.more-urls'),
};

document.addEventListener('DOMContentLoaded', () => {
	const interval = new RecurringTimer(animationLoop, 6000);

	[].forEach.call(ui.openShareNodes, (node) => {
		node.addEventListener('mouseenter', () => {
			interval.pause();
		});
		node.addEventListener('mouseleave', () => {
			interval.resume();
		});
	});

	ui.burger.addEventListener('click', () => {
		ui.burger.classList.toggle('active');
		ui.nav.classList.toggle('active');
	});

	if (isInPage(ui.submit)) {
		ui.submit.addEventListener('click', () => {
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
					ui.accountInner.innerHTML = body;
				}
			});
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
