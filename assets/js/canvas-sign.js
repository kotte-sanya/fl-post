var getMousePos = (canvas, evt) => {
	let width = canvas.width;
	let height = canvas.height;
	let rect = canvas.getBoundingClientRect();
	let wRatio = width / rect.width;
	let hRatio = height / rect.height;

	return {
		x: (evt.clientX - rect.left) * wRatio,
		y: (evt.clientY - rect.top) * hRatio,
	};
};

var clearCanvas = (canvasId, backgroundImageUrl) => {
	var can = document.getElementById(canvasId);
	var ctx = can.getContext('2d');
	var img = new Image();
	img.src = backgroundImageUrl;

	ctx.fillRect(0, 0, img.width, img.height); // something in the background

	img.onload = function () {
		ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, can.width, can.height);
	};
};

var saveCanvasImage = (canvasId, filename) => {
	var canvas = document.getElementById(canvasId);

	var link = document.createElement('a');
	link.setAttribute('download', filename);
	link.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
	link.click();
};

var drawSignature = function (canvasId, ratio) {
	const canvas = document.getElementById(canvasId);
	const context = canvas.getContext('2d');
	// let ratio = 10;
	let lineWidth = 0;
	let isMousedown = false;
	let points = [];

	for (const ev of ['touchstart', 'mousedown']) {
		canvas.addEventListener(ev, function (e) {
			let pressure = 0.1;
			let x, y, pos;
			if (e.touches && e.touches[0] && typeof e.touches[0]['force'] !== 'undefined') {
				if (e.touches[0]['force'] > 0) {
					pressure = e.touches[0]['force'];
				}
				pos = getMousePos(canvas, e.touches[0]);
			} else {
				pressure = 1.0;
				pos = getMousePos(canvas, e);
			}

			x = pos.x;
			y = pos.y;

			isMousedown = true;

			lineWidth = Math.log(pressure + 1) * ratio;
			context.lineWidth = lineWidth; // pressure * 50;
			context.strokeStyle = 'black';
			context.lineCap = 'round';
			context.lineJoin = 'round';
			context.beginPath();
			context.moveTo(x, y);

			points.push({
				x,
				y,
				lineWidth,
			});
		});
	}

	for (const ev of ['touchmove', 'mousemove']) {
		canvas.addEventListener(ev, function (e) {
			if (!isMousedown) return;
			e.preventDefault();

			let pressure = 0.1;
			let x, y, pos;
			if (e.touches && e.touches[0] && typeof e.touches[0]['force'] !== 'undefined') {
				if (e.touches[0]['force'] > 0) {
					pressure = e.touches[0]['force'];
				}
				pos = getMousePos(canvas, e.touches[0]);
			} else {
				pressure = 1.0;
				pos = getMousePos(canvas, e);
			}
			x = pos.x;
			y = pos.y;

			// smoothen line width
			lineWidth = Math.log(pressure + 1) * ratio * 0.2 + lineWidth * 0.8;
			points.push({
				x,
				y,
				lineWidth,
			});

			context.strokeStyle = 'black';
			context.lineCap = 'round';
			context.lineJoin = 'round';

			context.lineWidth = lineWidth; // pressure * 50;
			// context.lineTo(x, y);
			// context.moveTo(x, y);
			// context.stroke();

			if (points.length >= 3) {
				const l = points.length - 1;
				const xc = (points[l].x + points[l - 1].x) / 2;
				const yc = (points[l].y + points[l - 1].y) / 2;
				context.lineWidth = points[l - 1].lineWidth;
				context.quadraticCurveTo(points[l - 1].x, points[l - 1].y, xc, yc);
				context.stroke();
				context.beginPath();
				context.moveTo(xc, yc);
			}
		});
	}

	for (const ev of ['touchend', 'touchleave', 'mouseup']) {
		canvas.addEventListener(ev, function (e) {
			let pressure = 0.1;
			let x, y, pos;

			if (e.touches && e.touches[0] && typeof e.touches[0]['force'] !== 'undefined') {
				if (e.touches[0]['force'] > 0) {
					pressure = e.touches[0]['force'];
				}
				pos = getMousePos(canvas, e.touches[0]);
			} else {
				pressure = 1.0;
				pos = getMousePos(canvas, e);
				x = pos.x;
				y = pos.y;
			}

			isMousedown = false;

			context.strokeStyle = 'black';
			context.lineCap = 'round';
			context.lineJoin = 'round';

			if (points.length >= 3) {
				const l = points.length - 1;
				context.quadraticCurveTo(points[l].x, points[l].y, x, y);
				context.stroke();
			}

			points = [];
			lineWidth = 0;
		});
	}
};

drawSignature('canvasId', 10);
drawSignature('canvasId2', 4);
drawSignature('canvasId3', 5);

document.getElementById('clear1').onclick = () => {
	clearCanvas('canvasId', 'assets/img/draw01.png');
};

document.getElementById('save1').onclick = () => {
	saveCanvasImage('canvasId', "MySignature1.png");
};

document.getElementById('clear2').onclick = () => {
	clearCanvas('canvasId2', 'assets/img/signature.png');
};

document.getElementById('save2').onclick = () => {
	saveCanvasImage('canvasId2', "MySignature2.png");
};

document.getElementById('clear3').onclick = () => {
	clearCanvas('canvasId3', 'assets/img/signature2.png');
};

document.getElementById('save3').onclick = () => {
	saveCanvasImage('canvasId3', "MySignature3.png");
};
clearCanvas('canvasId', 'assets/img/draw01.png');
clearCanvas('canvasId2', 'assets/img/signature.png');
clearCanvas('canvasId3', 'assets/img/signature2.png');