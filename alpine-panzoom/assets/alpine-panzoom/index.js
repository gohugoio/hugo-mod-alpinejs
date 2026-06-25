import panzoom from '/panzoom';

export default function createPanzoom(Alpine) {
	// Register the custom directive 'x-panzoom'
	// See https://github.com/anvaka/panzoom for more options and usage
	Alpine.directive('panzoom', (el, { expression }, { evaluate, cleanup }) => {
		let defaultOptions = {
			zoomSpeed: 0.065, // 6.5% per mouse wheel event
			pinchSpeed: 2, // zoom two times faster than the distance between fingers
			transformOrigin: { x: 0.3, y: 0.5 },
			maxZoom: 1.5,
			minZoom: 0.5,
			initialZoom: 1,
			bounds: true,
			boundsPadding: 0.3,
		};

		let options = {};
		if (expression) {
			// Evaluate the expression to get the options object
			options = evaluate(expression);
		}

		const finalOptions = { ...defaultOptions, ...options };

		let instance = panzoom(el, finalOptions);

		cleanup(() => {
			instance.dispose();
		});
	});
}
