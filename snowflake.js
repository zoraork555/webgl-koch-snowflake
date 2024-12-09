// This project uses a recursive function to generate a Koch snowflake fractal
// The depth of the snowflake is defined under global variable "Iterations"
// The initial triangle's points are defined by "Vertices" 0, 1, and 2
// WebGL is used in the generation, and the parent file is snowflake.html
// A snowflake with 0 Iterations will generate a triangle, one with 1 Iteration will generate a star of David, etc.
//             . P3
//            / \
//  P1    P2 /   \ P4    P5         Koch Segment to show naming scheme of variables
//    .____./     \.____.

// Global variable definitions
var Canvas;
var gl;
var Points = [];
var Vertices = [
    vec2(-0.75, -0.5), 
    vec2(0, 0.75), 
    vec2(0.75, -0.5)
];

var Iterations = 10;
const urlParams = new URLSearchParams(window.location.search);
const word = urlParams.get('num');
if(word) Iterations = word;
else Iterations = 10;
var Angle = 60;
console.log(Iterations);

// main function
window.onload = function init() {
    Canvas = document.getElementById("gl-canvas");
    
    // Set up canvas and error check
    gl = WebGLUtils.setupWebGL(Canvas);
    if (!gl) alert("WebGL isn't available");

    // Generate the snowflake's Points
    snowflake(Vertices[0], Vertices[1], Vertices[2], Iterations);

    // Configure WebGL
    gl.viewport(0, 0, Canvas.width, Canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(Points), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Render the points
    render();
};

// Starts the snowflake by determining if it's 0 iterations or to begin the snowflake process
function snowflake(p1, p2, p3, iterations) {
    console.log("iterations = ", iterations);
    // Draws a triangle
    if (iterations==0) {
        console.log("first");
        Points.push(p1, p2, p3);
    }
    // Starts the snowflake process on each side of the triangle
    else {
        console.log("second");
        recurse(p1, p2, iterations);
        recurse(p2, p3, iterations);
        recurse(p3, p1, iterations);
    }
}

// Recursive function that divides the given line into four sections to apply a Koch segment to
// Once iterations reaches 1, the calculated points of the Koch segment are pushed to the points variable
function recurse(p1, p5, iterations) {
    // Exit case where the points are pushed to Points variable
    if(iterations==1){
        // second and fourth point in the Koch segment, respectively
        var p2 = mix(p1, p5, 1/3);
        var p4 = mix(p1, p5, 2/3);
        // third point in Koch segment
        var p3 = third(p2, p4);
        // push points to Points for storage
        Points.push(p1, p2, p3, p4, p5);
    }
    // Have not reached the unit line yet, recurse again
    else {
        // key points that track the end of each of four line segments for recursion
        var p2 = mix (p1, p5, 1/3);
        var p4 = mix (p1, p5, 2/3);
        var p3 = third(p2, p4);
        // decremental counter to track when recursion is done
        iterations--;
        // recurse in the order of orientation of calculation
        recurse(p1, p2, iterations);
        recurse(p2, p3, iterations);
        recurse(p3, p4, iterations);
        recurse(p4, p5, iterations);
    }
    return p3;
}

// This function takes in two points and uses trig to determine the third point of the equilateral triangle
function third(p1, p2) {
    var cosine = Math.cos((Angle * Math.PI) / 180);
    var sine   = Math.sin((Angle * Math.PI) / 180);
    // these equations determine the location of the third point in the Koch segment
    return vec2((cosine * (p2[0] - p1[0])) - (sine   * (p2[1] - p1[1])) + p1[0], 
                (sine   * (p2[0] - p1[0])) + (cosine * (p2[1] - p1[1])) + p1[1]);
}

// This function clears the canvas before drawing the dots that were calculated above
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINE_LOOP, 0, Points.length);
}

