canvcreate("", 500, 500);
canv.width = window.innerWidth;
canv.height = window.innerHeight;
window.onresize = function () {
	canv.width = window.innerWidth;
	canv.height = window.innerHeight;
}

var startTime = new Date();
var deltaTime = 0;
var frame = 0;
var rFps = 0;

var frameCountForSample = 5;
var fps = 0;

var lightSpeed = 299792458;

var K = 1;

var a = 0.9;
let v = 0;
var powerDecrease = 1;
var isPaused = false;

var colorIntensity = 1;
var colorIntensitySlider = new Slider({ x: 10, y: 10 }, "Color intensity", (v) => { colorIntensity = v; }, 1, 200, colorIntensity, 0, 10);

var dots = [];
var walls = [];
var size = 110;
for (let i = 0; i < size; i++) {
	dots[i] = [];
	walls[i] = [];
	for (let j = 0; j < size; j++) {
		dots[i][j] = math.FBM([i / size * 5, j / size * 5], 4) * 0;
		// dots[i][j] = Math.sin(i) * 0.1;
		// dots[i][j] = Math.cos(i/size*2*Math.PI*0.5)*Math.cos(j/size*2*Math.PI*0.5)*0.01;
		walls[i][j] = 0;
	}
}

for (let i = 0; i < size && false; i++) {
	walls[i][size / 2] = 1;
	if (i > size / 2 - 3 + 12 && i < size / 2 + 3 + 12)
		walls[i][size / 2] = 0;

	if (i > size / 2 - 3 - 12 && i < size / 2 + 3 - 12)
		walls[i][size / 2] = 0;
}

var pastDots = [];
for (let i = 0; i < size; i++) {
	pastDots[i] = [];
	for (let j = 0; j < size; j++) {
		// pastDots[i][j] = math.SimplexNoise([i/size*3,j/size*3])*1;
		pastDots[i][j] = 0;
	}
}

/*function getDot1d(i) {
	// if (i > dots.length - 1 || i < 0) return 0;
	// return dots[i];
	return dots[Math.abs(i) % dots.length];
}
function drawDots1d() {
	ctx.strokeStyle = "white";
	ctx.beginPath();
	ctx.moveTo(0, canv.height - dots[0] * canv.height / 2);
	for (let i = 1; i < dots.length; i++) {
		ctx.lineTo(i / dots.length * canv.width, canv.height - dots[i] * canv.height / 2);
	}
	ctx.stroke();
}
function updateDots1d() {
	let nextDots = [];
	for (let i = 0; i < dots.length; i++) {
		// nextDots.push(a * a * (getDot(i + 1) - getDot(i)) + getDot(i));
		// nextDots.push(-a * a * ((getDot(i) - getDot(i - 1)) - (getDot(i + 1) - getDot(i))) + getDot(i));
		nextDots.push(a * a * (-(getDot(i+1)+getDot(i-1)))+getDot(i));
	}
	for (let i = 0; i < dots.length; i++) {
		dots[i] = nextDots[i];
	}
}*/


function getDot2d(i, j, vi = 0, vj = 0) {
	let i0 = i;
	let j0 = j;

	if (i0 > dots.length - 1) i0 = dots.length - 1 - (i % dots.length);
	if (i0 < 0) i0 = Math.abs(i0);

	if (isNaN(i)) console.log(i);
	if (j0 > dots[i0].length - 1) j0 = dots[i0].length - 1 - (j % dots.length);
	if (j0 < 0) j0 = Math.abs(j0);


	// if (walls[i0][j0] == 1) {
	// 	if (vi > 0) {
	// 		i0 -= 2;
	// 	}
	// 	if (vi < 0) {
	// 		i0 += 2;
	// 	}
	// 	if (vj > 0) {
	// 		j0 -= 2;
	// 	}
	// 	if (vj < 0) {
	// 		j0 += 2;
	// 	}
	// }

	// if (i0 > dots.length - 1) i0 = dots.length - 1 - (i % dots.length);
	// if (i0 < 0) i0 = Math.abs(i0);

	// if (j0 > dots[i0].length - 1) j0 = dots[i0].length - 1 - (j % dots.length);
	// if (j0 < 0) j0 = Math.abs(j0);



	return dots[i0][j0];
}
function getPastDot2d(i, j, vi = 0, vj = 0) {
	let i0 = i;
	if (i0 > pastDots.length - 1) i0 = pastDots.length - 1 - (i % pastDots.length);
	if (i0 < 0) i0 = Math.abs(i0);

	let j0 = j;
	if (j0 > pastDots[i0].length - 1) j0 = pastDots[i0].length - 1 - (j % pastDots.length);
	if (j0 < 0) j0 = Math.abs(j0);


	// if (walls[i0][j0] == 1) {
	// 	if (vi > 0) {
	// 		i0 -= 2;
	// 	}
	// 	if (vi < 0) {
	// 		i0 += 2;
	// 	}
	// 	if (vj > 0) {
	// 		j0 -= 2;
	// 	}
	// 	if (vj < 0) {
	// 		j0 += 2;
	// 	}
	// }

	// if (i0 > pastDots.length - 1) i0 = pastDots.length - 1 - (i % pastDots.length);
	// if (i0 < 0) i0 = Math.abs(i0);

	// if (j0 > pastDots[i0].length - 1) j0 = pastDots[i0].length - 1 - (j % pastDots.length);
	// if (j0 < 0) j0 = Math.abs(j0);

	return pastDots[i0][j0];
}
function updateDots2d() {
	let nextDots = [];
	for (let i = 0; i < dots.length; i++) {
		for (let j = 0; j < dots.length; j++) {
			if (walls[i][j] == 2) {
				dots[i][j] = Math.sin(frame*0.4)*0.1;
			} else if (walls[i][j] == 3) {
				dots[i][j] = -Math.sin(frame*0.4)*0.1;
			} 
		}
	}
	for (let i = 0; i < dots.length; i++) {
		nextDots[i] = [];
		for (let j = 0; j < dots[i].length; j++) {
			if (walls[i][j] == 1) {
				nextDots[i][j] = 0;
				dots[i][j] = 0;
				continue;
			}
			let ddx = (getDot2d(i + 1, j, 1) + getDot2d(i - 1, j, -1) + getDot2d(i, j + 1, 0, 1) + getDot2d(i, j - 1, 0, -1) - 4 * getDot2d(i, j));
			let ddx1d = (getDot2d(i+1,j,1) + getDot2d(i - 1, j, -1) - 2*getDot2d(i,j));
			nextDots[i][j] = a * a * (ddx) / 2 + 2 * getDot2d(i, j)/(2-K) - K*getPastDot2d(i, j);
			let a0 = 1.0545*(10**(-34));
			let m0 = 1.972621*(10**(-33));
			let v0 = -a0*a0/2/m0;
			let v1 = m0*(100**2)/2;
			// nextDots[i][j]=-(a0/2/m0)*(ddx)+getDot2d(i,j)*(1-0.211e-33/a0);
			// nextDots[i][j]=((v0*ddx)+(v1*(i**2+(j**2)))*getDot2d(i,j))/a0 + getDot2d(i,j);
			// nextDots[i][j] += v*v*(getDot2d(i + 1, j, 1) + getDot2d(i - 1, j, -1) + getDot2d(i, j + 1, 0, 1) + getDot2d(i, j - 1, 0, -1))+getDot2d(i,j)*(1-4*v*v);

			let frequency = 0.001;
			// nextDots[i][j] = -ddx*((lightSpeed**2)/2/frequency);
		}
	}
	for (let i = 0; i < dots.length; i++) {
		for (let j = 0; j < dots[i].length; j++) {
			pastDots[i][j] = dots[i][j];
		}
	}
	for (let i = 0; i < dots.length; i++) {
		for (let j = 0; j < dots[i].length; j++) {
			dots[i][j] = nextDots[i][j] * powerDecrease;
		}
	}
}
function drawDots2d() {
	if (colorIntensity == 0) return;
	let w = canv.width / dots[0].length;
	let h = canv.height / dots.length;
	for (let i = 0; i < dots.length; i++) {
		for (let j = 0; j < dots[i].length; j++) {
			if (Math.abs(dots[i][j]) < 0.001 / colorIntensity && walls[i][j] < 0.001 / colorIntensity) continue;
			let clr = inRgb(dots[i][j] * 255 * 20 * colorIntensity, 0, -dots[i][j] * 255 * 20 * colorIntensity);
			if (walls[i][j] == 0) {
				d.rect(j * w, i * h, w, h, clr, clr);
			} else if (walls[i][j] == 1) {
				d.rect(j * w, i * h, w, h, "White", "white");
			} else if (walls[i][j] == 2) {
				d.rect(j * w, i * h, w, h, "Yellow", "Yellow");
			} else if (walls[i][j] == 3) {
				d.rect(j * w, i * h, w, h, "rgb(211,208,0)", "rgb(211,208,0)");
			}
		}
	}
}
var camera = new Camera3d({ x: -1, y: 2, z: -5 });
var graph = new Graph3d(camera);
// graph.planeEquations[0] = {
// 	name: "",
// 	clr: "blue",
// 	func: (x,y) => {
// 		return 0;
// 	}
// };
graph.gridPlane[0] = {
	name: "",
	clr: inRgb(0, 175, 228, 0.4),
	grid: []
};
function drawDots2dAsGraph() {
	graph.DrawAxes();

	graph.gridPlane[0].grid = dots;
	graph.DrawPlaneEquation();
	graph.DrawPlaneGrid();
}

function deformGrid(f) {
	for (let i = 0; i < dots.length; i++) {
		for (let j = 0; j < dots[i].length; j++) {
			let x = (j / dots[0].length - 0.5) * 2;
			let y = (i / dots.length - 0.5) * 2;
			dots[i][j] += f(i, j, y, x);
		}
	}
}

class Particle {
	constructor(StartPosition = [0, 0], StartVelocity = [0, 0]) {
		this.position = StartPosition;
		this.velocity = StartVelocity;

		this.isAbsorber = (Math.random()>0.5) ? true : false;
	}
	draw3d() {
		let p = this.getIndexPosition();

		let dst = camera.DistToCamera({ x: this.position[0], y: getDot2d(p[0], p[1]), z: this.position[1] });

		let v = getDot2d(p[0], p[1]);
		let clr = inRgb(255, 0, 0);
		if (this.isAbsorber)
			clr = inRgb(0, 0, 255);
		d3.circle(this.position[1], 0, this.position[0], 3 / dst, clr);
	}
	draw2d() {
		let p = this.getIndexPosition();
		let v = getDot2d(p[0], p[1]);
		let clr = inRgb(255, 0, 0);
		if (this.isAbsorber)
			clr = inRgb(0,0,255);
		// d.circle((this.position[1] + 1) / 2 * canv.width, (this.position[0] + 1) / 2 * canv.height, 3, clr, clr);
		d.rect((this.position[1] + 1) / 2 * canv.width, (this.position[0] + 1) / 2 * canv.height, 2, 2, clr);

	}
	getIndexPosition() {
		let i = Math.floor((this.position[0] + 1) / 2 * (dots[0].length - 1));
		let j = Math.floor((this.position[1] + 1) / 2 * (dots.length - 1));
		return [i, j];
	}
	update() {
		this.position[0] += this.velocity[0];
		this.position[1] += this.velocity[1];

		this.velocity[0] *= 0.95;
		this.velocity[1] *= 0.95;

		// if (this.velocity[0] != 0 && this.velocity[1] != 0) {
		// 	let nvel = math.normalize(this.velocity);
		// 	this.velocity[0] = nvel[0]*0.02;
		// 	this.velocity[1] = nvel[1]*0.02;
		// }

		if (this.position[0] < -1) {
			this.position[0] = -1;
			this.velocity[0] = -this.velocity[0];
		}
		if (this.position[0] > 1) {
			this.position[0] = 1;
			this.velocity[0] = -this.velocity[0];
		}
		if (this.position[1] < -1) {
			this.position[1] = -1;
			this.velocity[1] = -this.velocity[1];
		}
		if (this.position[1] > 1) {
			this.position[1] = 1;
			this.velocity[1] = -this.velocity[1];
		}

		if (!this.isAbsorber) {
			this.fieldEffect();
			let p = this.getIndexPosition();
			// dots[p[0]][p[1]] += -0.01;
			deformGrid((i, j, x, y) => {
				let p = this.getIndexPosition();
				let delta = [i - p[0], j - p[1]];
				let magn = math.magnitude(delta);
				// return 0;
				return -0.0001 / (1 + magn * magn);
			});
		} else {
			this.fieldEffect();
		}
	}
	fieldEffect() {
		let p = this.getIndexPosition();
		let i = p[0];
		let j = p[1];
		if (i > dots.length-1 || i < 1) return;
		if (j > dots[i].length-1 || j < 1) return;
		this.velocity[0] = -(getDot2d(i + 1, j, 1) - getDot2d(i - 1, j, -1)) / 2 * 1;
		this.velocity[1] = -(getDot2d(i, j + 1, 0, 1) - getDot2d(i, j - 1, 0, -1)) / 2 * 1;
	}
}
var particles = [];
for (let i = 0; i < 0; i++) {
	particles.push(new Particle([(-1 + Math.random() * 2), (-1 + Math.random() * 2)], [0, 0]));
}
// particles[1].isAbsorber = true;

var pastBuildingPoint = [0, 0];
var isMousePressed1 = false;
var wallType = 0;
function building() {
	if (isMousePressed1) {
		let startPoint = pastBuildingPoint;
		let point = [startPoint[0], startPoint[1]];
		let delta = [input.mouse.x - pastBuildingPoint[0], input.mouse.y - pastBuildingPoint[1]];
		let magn = math.magnitude(delta);
		if (magn > 0) {
			let direction = [delta[0] / magn, delta[1] / magn];
			while (true) {
				point[0] += direction[0];
				point[1] += direction[1];

				let i = Math.floor(point[1] / canv.height * (dots[0].length));
				let j = Math.floor(point[0] / canv.width * (dots.length));

				walls[i][j] = wallType;
				if (math.magnitude([point[0] - input.mouse.x, point[1] - input.mouse.y]) < 2) break;

			}
			pastBuildingPoint = [input.mouse.x, input.mouse.y];
		}
	}

	if (input.mouse.click == 3 && !colorIntensitySlider.isHoverOnSlider(input.mouse.position)) {
		let i = Math.floor(input.mouse.y / canv.height * (dots[0].length));
		let j = Math.floor(input.mouse.x / canv.width * (dots.length));

		walls[i][j] = 0;

		isMousePressed1 = true;
		pastBuildingPoint = [input.mouse.x, input.mouse.y];
		wallType = 0;
	}
	if (input.mouse.click == 1 && !colorIntensitySlider.isHoverOnSlider(input.mouse.position)) {
		let i = Math.floor(input.mouse.y / canv.height * (dots[0].length));
		let j = Math.floor(input.mouse.x / canv.width * (dots.length));

		walls[i][j] = 1;

		isMousePressed1 = true;
		pastBuildingPoint = [input.mouse.x, input.mouse.y];
		wallType = 1;
	}
	if (input.keyboard.char == "v") {
		let i = Math.floor(input.mouse.y / canv.height * (dots[0].length));
		let j = Math.floor(input.mouse.x / canv.width * (dots.length));

		walls[i][j] = 2;

		isMousePressed1 = true;
		pastBuildingPoint = [input.mouse.x, input.mouse.y];
		wallType = 2;
	}
	if (input.keyboard.char == "b") {
		let i = Math.floor(input.mouse.y / canv.height * (dots[0].length));
		let j = Math.floor(input.mouse.x / canv.width * (dots.length));

		walls[i][j] = 3;

		isMousePressed1 = true;
		pastBuildingPoint = [input.mouse.x, input.mouse.y];
		wallType = 3;
	}
	if (input.mouse.click == 0 && input.keyboard.char == "") isMousePressed1 = false;
}
document.addEventListener("keydown", (e) => {
	if (e.code == "Space") {
		isPaused = !isPaused;
	}
});
document.addEventListener("keypress", (e) => {
	if (e.code == "KeyF") {

		particles.push(new Particle([(input.mouse.y / canv.height - 0.5) * 2, (input.mouse.x / canv.width - 0.5) * 2], [0, 0]));
	}
});

var dst = 100;
var spd = 6;
var r = 0;

var wavingSpeed = 0.05;
var wavingFrequency = 40;
var wavingIntensity = 0;
var wavingOctavesCount = 6;

var rotaryIntensity = 0.02;

function render() {
	deltaTime = (new Date() - startTime);
	startTime = new Date();
	fps += 1000 / deltaTime;
	if (frame % frameCountForSample == 0) {
		rFps = fps / frameCountForSample;
		fps = 0;
	}

	d.clear("black");

		deformGrid((i, j) => {
			if (input.mouse.click != 2)
				return 0;
			let x = j * canv.width / dots[0].length;
			let y = i * canv.height / dots.length;



			let p = [input.mouse.x, input.mouse.y];
			let delta = [p[0] - x, p[1] - y];
			let magn = math.magnitude(delta);

			return 1 / (1 + (magn**2));
		});
	if (!isPaused) {
		// deformGrid((i, j) => {
		// 	let x = j * canv.width / dots[0].length;
		// 	let y = i * canv.height / dots.length;

		// 	let p = [canv.width / 2 + Math.cos(r) * dst, canv.height / 2 + Math.sin(r) * dst];
		// 	let delta = [p[0] - x, p[1] - y];
		// 	let magn = math.magnitude(delta);

		// 	// if (input.mouse.click != 2)
		// 	// 	return 0;
		// 	return rotaryIntensity / (1 + magn);
		// });
		// deformGrid((i, j) => {
		// 	let x = j * canv.width / dots[0].length;
		// 	let y = i * canv.height / dots.length;

		// 	let p = [canv.width / 2 + Math.cos((r + Math.PI)) * dst, canv.height / 2 + Math.sin((r + Math.PI)) * dst];
		// 	let delta = [p[0] - x, p[1] - y];
		// 	let magn = math.magnitude(delta);

		// 	// if (input.mouse.click != 2)
		// 	// 	return 0;
		// 	return -rotaryIntensity / (1 + magn);
		// });
		// deformGrid((i, j) => {
		// 	// return 0;
		// 	if (i == 0) {
		// 		return math.FBM([0, j / dots[0].length * wavingFrequency, frame * wavingSpeed], wavingOctavesCount) * wavingIntensity;
		// 	}
		// 	if (j == 0) {
		// 		return math.FBM([i / dots.length * wavingFrequency, 0, frame * wavingSpeed], wavingOctavesCount) * wavingIntensity;
		// 	}
		// 	if (i == dots.length - 1) {
		// 		return math.FBM([dots.length - 1, j / dots[0].length * wavingFrequency, frame * wavingSpeed], wavingOctavesCount) * wavingIntensity;
		// 	}
		// 	if (j == dots[0].length - 1) {
		// 		return math.FBM([i / dots.length * wavingFrequency, dots[0].length - 1, frame * wavingSpeed], wavingOctavesCount) * wavingIntensity;
		// 	}
		// 	return 0;
		// });

		r += spd / dst;


		for (let i = 0; i < 1; i++) {
			updateDots2d();
		}
	}
	building();
	camera.KeyboardControl(0.005 * deltaTime);
	// drawDots2dAsGraph();
	drawDots2d();

	for (let i = 0; i < particles.length; i++) {
		particles[i].update();
		particles[i].draw2d();
	}
	colorIntensitySlider.draw();
	colorIntensitySlider.control();

	// d3.circle(Math.sin(r)*(dst/canv.width),0,Math.cos(r)*(dst/canv.height),5,"red");
	// d3.circle(Math.sin((r+Math.PI))*(dst/canv.width),0,Math.cos((r+Math.PI))*(dst/canv.height),5,"blue");
	d.txt(Math.round(rFps), 1, 16, "", "white");
	frame++;
	requestAnimationFrame(render);
};
requestAnimationFrame(render);