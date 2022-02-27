function drawQuad(gl, points, colorUniformLocation, color){
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    gl.uniform4f(colorUniformLocation, color[0], color[1], color[2], color[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function editSquare(id, length) {
    length = parseInt(length)
    tmp.forEach(item=> {
        if (item.id==id) {
            item.length = length
            item.points = [
                item.source[0]-length,item.source[1]-length,
                item.source[0]+length,item.source[1]-length,
                item.source[0]-length,item.source[1]+length,
                item.source[0]-length,item.source[1]+length,
                item.source[0]+length,item.source[1]-length,
                item.source[0]+length,item.source[1]+length
            ]
        }
    })

    editRender()
}