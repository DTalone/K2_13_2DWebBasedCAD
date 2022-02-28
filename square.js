function drawQuad(gl, points, colorUniformLocation, color){
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    gl.uniform4f(colorUniformLocation, color[0], color[1], color[2], color[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function addEditSquareBar(item, children) {
    var label = document.createElement("label");
    label.htmlFor = item.id;
    label.innerHTML=item.id;

    var newInput = document.createElement("input");
    newInput.id = item.id
    newInput.name = item.id
    newInput.type = "range"
    var length = item.length
    newInput.setAttribute("min", 1)
    newInput.setAttribute("max", 800)
    newInput.setAttribute("value", length)
    newInput.setAttribute("oninput", `{
      this.nextElementSibling.value = this.value;
      editSquare(this.id, this.value);
      }`
    )
    var newOutput = document.createElement("output");
    newOutput.innerHTML = length

    children.appendChild(label)
    children.appendChild(newInput)
    children.appendChild(newOutput)
    children.appendChild(document.createElement("br"))
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