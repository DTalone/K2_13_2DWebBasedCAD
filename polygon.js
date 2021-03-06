// memasukkan banyak dan panjang ke dalam array 
function setupVert(side, length, points) {
    positions = []
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

function addEditPolygonBar(item, children) {
    var label = document.createElement("label");
    label.htmlFor = item.id;
    label.innerHTML=item.id;

    var newInput = document.createElement("input");
    newInput.id = item.id
    newInput.name = item.id
    newInput.type = "color"
    newInput.value = rgbToHex(item.color[0], item.color[1], item.color[2])

    children.appendChild(label)
    children.appendChild(newInput)
    children.appendChild(document.createElement("br"))
    newInput.setAttribute("oninput", `{
      this.nextElementSibling.value = this.value;
      editPolygon(this.id, this.value);
      }`
    )
}

function editPolygon(id, color) {
    tmp.forEach(item=> {
        if (item.id==id) {
            item.color = getColor(item.id)
        }
    })

    editRender()    
}