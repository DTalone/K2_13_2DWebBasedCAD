function drawLine(gl, points, colorUniformLocation, color){
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    gl.uniform4f(colorUniformLocation, color[0], color[1], color[2], color[3]);
    gl.drawArrays(gl.LINES, 0, 4);
}

function addEditLineBar(item, children) {
    var label = document.createElement("label");
    label.htmlFor = item.id;
    label.innerHTML=item.id;

    var newInput = document.createElement("input");
    newInput.id = item.id
    newInput.name = item.id
    newInput.type = "range"
    var distance = euclideanDistance(item.points[0],item.points[1], item.points[2], item.points[3])
    newInput.setAttribute("min", 1)
    newInput.setAttribute("max", 800)
    newInput.setAttribute("value", distance)
    newInput.setAttribute("oninput", `{
        this.nextElementSibling.value = this.value;
        editLine(this.id, this.value);
        }`
    )

    var newOutput = document.createElement("output");
    newOutput.innerHTML = distance

    children.appendChild(label)
    children.appendChild(newInput)
    children.appendChild(newOutput)
    children.appendChild(document.createElement("br"))
}



function editLine(id, val) {
    tmp.forEach(item=> {
        if (item.id==id) {
        var distance = euclideanDistance(item.points[0], item.points[1], item.points[2], item.points[3])
        if (item.points[0]>item.points[1]) {
            
        }
        }
    })
}