var canvas = document.querySelector("#glcanvas");
var gl = canvas.getContext("webgl");
var points = []
var element = []

if (!gl) {
 console.log("ERROR");
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function render() {
  console.log("Clidked!")
  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  points.forEach(shape => {
    var count = shape.length/2
    console.log(shape)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape), gl.STATIC_DRAW);
    gl.uniform4f(colorUniformLocation, 1, 0, 0.5, 1); // War
    gl.drawArrays(primitiveType, offset, count);
  });

  // requestAnimationFrame(render);

}

var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
 
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

var program = createProgram(gl, vertexShader, fragmentShader);
// look up where the vertex data needs to go.
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// look up uniform locations
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

var colorUniformLocation = gl.getUniformLocation(program, "u_color");

// Create a buffer to put three 2d clip space points in
var positionBuffer = gl.createBuffer();

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell WebGL how to convert from clip space to pixels
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell it to use our program (pair of shaders)
gl.useProgram(program);

// Turn on the attribute
gl.enableVertexAttribArray(positionAttributeLocation);

// Bind the position buffer.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

// set the resolution
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

gl.uniform4f(colorUniformLocation, 1, 1, 1, 1);

// draw
var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 6;
gl.uniform4f(colorUniformLocation, 1, 0, 0.5, 1);
gl.drawArrays(primitiveType, offset, count);




canvas.addEventListener("click", function(event){
  element.push(event.layerX);
  element.push(event.layerY);
  if (element.length==6) {
    points.push(element)
    element = []
  }
  if (points.length>0) {
    console.log("tis")
    render();
  }
});
