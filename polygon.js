// memasukkan banyak dan panjang ke dalam array 
function setupVert(side, length, points) {
    positions = []
    console.log('point 0:' , points[0]);
    positions.push(points[0]);
    positions.push(points[1]);

    var oldX = points[0];
    var oldY = points[1];

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
    return positions
}

function drawPolygon(gl, points, colorUniformLocation, color){
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    gl.uniform4f(colorUniformLocation, color[0], color[1], color[2], color[3]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0,  points.length/2);
}