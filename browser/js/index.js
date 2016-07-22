require('open-share');

const openShareNodes = document.querySelectorAll('.open-share-examples [data-open-share]');
const animationMods = ['square', 'diamond', 'rectangle', 'rectangle-vert'];
const burger = document.querySelector('.burger-icon');
const nav = document.querySelector('.header__nav');

burger.addEventListener('click', () => {
	burger.classList.toggle('active');
	nav.classList.toggle('active');
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
			[].forEach.call(openShareNodes, (node, j) => {
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

		[].forEach.call(openShareNodes, (node) => {
			node.addEventListener('mouseenter', () => {
				timer.pause();
			});

			node.addEventListener('mouseleave', () => {
				timer.resume();
			});
		});
	});
}

document.addEventListener('DOMContentLoaded', () => {
	const interval = new RecurringTimer(animationLoop, 6000);

	[].forEach.call(openShareNodes, (node) => {
		node.addEventListener('mouseenter', () => {
			interval.pause();
		});
		node.addEventListener('mouseleave', () => {
			interval.resume();
		});
	});

	setTimeout(() => {
		animationLoop();
	}, 1000);
});
