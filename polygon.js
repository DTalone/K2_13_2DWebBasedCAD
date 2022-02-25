var positions = [];

function createPolygon(shadeProgram){
    canvas = document.getElementById('glcanvas')
    gl = canvas.getContext('experimental-webgl')
    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.useProgram(shadeProgram)

    setupVert(side, length)
    console.log(positions)

    var positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
  
    var vertexPosition = gl.getAttribLocation(shadeProgram, 'aVertexPosition')
    console.log(vertexPosition);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vertexPosition)
  
    renderPolygon(gl.TRIANGLE_FAN, positions.length/2, gl, shadeProgram)
}

// memasukkan banyak dan panjang ke dalam array 
function setupVert(side, length) {
    positions = []
    positions.push(-0.3);
    positions.push(-0.8);

    var oldX = -0.3;
    var oldY = -0.8;

    for (var i = 0; i < side-1; i++){
        var theta = i * 2 * Math.PI / side;
        var y = length * Math.sin(theta);
        var x = length * Math.cos(theta);

        y += oldY;
        x += oldX;

        positions.push(x);
        positions.push(y);

        oldX = x;
        oldY = y;
    }
}




//Melakukan penggambaran
function renderPolygon(shape, length, gl, shadeProgram){
    const projectionMatrix = mat4.create();   
    const modelViewMatrix = mat4.create(); 
    gl.uniformMatrix4fv(
        gl.getUniformLocation(shadeProgram, 'uProjectionMatrix'),
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        gl.getUniformLocation(shadeProgram, 'uModelViewMatrix'),
        false,
        modelViewMatrix);
    gl.drawArrays(shape, 0, length);
}
