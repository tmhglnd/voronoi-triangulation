// Study 1: Delaunay Triangulation
// calculate the delaunay triangulation based on an incoming
// matrix of points, output a matrix of vertices to draw with triangles
//
// written by Timo Hoogland (c), www.timohoogland.com, 2025
// code license MIT
// create output license CC BY-SA 4.0 
// NO-AI

autowatch = 1;

// require the delaunay package
// since we're not using Node, we need to specify the exact location
const { Delaunay } = require('./node_modules/d3-delaunay/dist/d3-delaunay.min.js');

let points = new Float32Array(0);

// function that processes an incoming matrix with points
function jit_matrix(mtx){
	// the input matrix
	let input = new JitterMatrix(mtx);
 
	// new faster way to work with matrix data by copying the content to 
	// a typed array like Float32Array, Uint8ClampedArray, etc.
	// this is a 1D array, so size is planecount * width * height
	points = new Float32Array(input.planecount * input.dim[0] * input.dim[1]);
	// copy input to the float32array
	input.copymatrixtoarray(points);

	// Now process by running function bang()
	bang();
}

// render next iteration with a bang
function bang(){
	// get the Delaunay triangulation for the given flat 
	// array [x0, y0, x1, y1, …] of points.
	// const delaunay = new Delaunay(points);
	const delaunay = new Delaunay(points);

	outputTriangulation(delaunay);
}

// output the Delaunay Triangulation from the calculated Delaunay object
// as a jitter matrix of lines, which can be rendered with 
// [jit.gl.mesh @drawmode triangles @poly_mode 1 1]
function outputTriangulation(delaunay){
	let { points, triangles } = delaunay;
	const triPoints = new Float32Array(triangles.length * 2);

	for (let i = 0; i < triangles.length/3; i++){
		let a = triangles[i * 3 + 0] * 2;
		let b = triangles[i * 3 + 1] * 2;
		let c = triangles[i * 3 + 2] * 2;

		triPoints[i * 6 + 0] = points[a];
		triPoints[i * 6 + 1] = points[a + 1];
		triPoints[i * 6 + 2] = points[b];
		triPoints[i * 6 + 3] = points[b + 1];
		triPoints[i * 6 + 4] = points[c]; 
		triPoints[i * 6 + 5] = points[c + 1];
	}
	outputMatrix('triangulation', triPoints);
}

// output a matrix from a typed float32 array
function outputMatrix(route, typedArray){
	// output matrix contains the 2 planes (XY), type float and dim
	// is amount of points of typedarray/planes
	let mtx = new JitterMatrix(2, 'float32', typedArray.length/2);
	mtx.copyarraytomatrix(typedArray);
	// copy the array to the matrix and output
	outlet(0, route, 'jit_matrix', mtx.name);
}
