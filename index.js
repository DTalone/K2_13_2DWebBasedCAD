// Konstanta
const garis = 1;
const persegi = 2;
const persegipanjang = 3;
const poligon = 4;

// Inisialisasi canvas
var canvas = document.querySelector("#glcanvas");
var gl = canvas.getContext("webgl");
if (!gl) {
  console.log("ERROR");
}

// Variabel global
var elements = []
var tmp = []
var points = []
var editElements = []
var panjang = document.getElementById("panjangContainer");panjang.style.display = "none";
var titik = document.getElementById("titik");titik.style.display = "none";
var warna = document.getElementById("warna");warna.style.display = "none";
var isEdit = false;
var isClicking = false;

// Fungsi umum
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

function render(arrObjects = null) {
  console.log("Clicked!")

  if (arrObjects) {
    elements = arrObjects;
  }
  // draw
  elements.forEach(item => {
    const type = item.type
    const points = item.points
    const color = item.color
    if (type==persegi || type==persegipanjang){
      drawQuad(gl, points, colorUniformLocation, color)
    }
    else if (type==garis){
      drawLine(gl, points, colorUniformLocation, color)
    }
  });

  // requestAnimationFrame(render);

}

function hexToRGB(hex) {
  return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))
}

function getColor() {
  const hex = document.getElementById("warna").value
  const warna = hexToRGB(hex)
  return [warna[0]/255,warna[1]/255,warna[2]/255,1]
}

function unduh() {
  exportFile(elements);
}

function lanjutkan() {
  elements = importFile(document.getElementById("lanjutkanFile").files[0])
  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function select(){
  const metode = document.getElementById('metode').value

  if (metode==persegi) {
    panjang.style.display = "block";
    titik.style.display = "none";
    warna.style.display = "block";
  }
  else if (metode==persegipanjang || metode==garis) {
    panjang.style.display = "none";
    titik.style.display = "none";
    warna.style.display = "block";
  }
  else if (metode==poligon) {
    panjang.style.display = "none";
    titik.style.display = "block";
    warna.style.display = "block";
  }
  else {
    resetButtonMenubar()
  }
}

function resetButtonMenubar(){
  document.getElementById("metode").value="0"
  panjang.style.display = "none";
  titik.style.display = "none";
  warna.style.display = "none";
}

function edit() {
  var button = document.getElementById("editBtn");
  isEdit = !isEdit;
  if (isEdit) {
    var el = document.createElement("button")
    var te = document.createTextNode("Simpan")
    el.setAttribute("id", "simpan")
    el.appendChild(te);
    el.addEventListener("click", ()=> {
      // Fungsi save
      el.remove()
      button.innerHTML = "Ubah"
      isEdit = !isEdit
      elements = tmp
    })
    button.innerHTML = "Gagalkan Perubahan"
    button.parentNode.insertBefore(el, button.nextSibling);
  }
  else {
    document.getElementById("editBtn").innerHTML = "Ubah"
    console.log("TES")
    console.log(elements)
    render()
    document.getElementById("simpan")?.remove()
  }
}

function editRender(edEl, cuPo) {
  tmp = JSON.parse(JSON.stringify(elements));
  
  edEl.forEach(item=> {
    tmp[item.idxEl].points[item.idxPo]=cuPo[0]
    tmp[item.idxEl].points[item.idxPo+1]=cuPo[1]
  })

  tmp.forEach(item => {
    const type = item.type
    const points = item.points
    const color = item.color
    if (type==persegi || type==persegipanjang){
      drawQuad(gl, points, colorUniformLocation, color)
    }
    else if (type==garis){
      drawLine(gl, points, colorUniformLocation, color)
    }
  });
}

// Program Utama
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




canvas.addEventListener("click", function(event){
  if (!isEdit) {
    points.push(event.layerX);
    points.push(event.layerY);
    if (document.getElementById("metode").value==persegipanjang && points.length==4) {
      elements.push({
        type : persegipanjang,
        points : [
          points[0],points[1],
          points[2],points[1],
          points[0],points[3],
          points[0],points[3],
          points[2],points[1],
          points[2],points[3]
        ],
        color : getColor()
      })
      render()
      points = []
      resetButtonMenubar()
    }
    else if (document.getElementById("metode").value==persegi && points.length==2){
      const length=parseInt(document.getElementById("panjang").value)
      elements.push({
        type : persegi,
        source : points,
        length : length,
        points : [
          points[0]-length,points[1]-length,
          points[0]+length,points[1]-length,
          points[0]-length,points[1]+length,
          points[0]-length,points[1]+length,
          points[0]+length,points[1]-length,
          points[0]+length,points[1]+length
        ],
        color : getColor()
      })
      render()
      points = []
      resetButtonMenubar()
    }
    else if (document.getElementById("metode").value==garis && points.length==4) {
      elements.push({
        type : garis,
        source : points,
        length : length,
        points : [
          points[0],points[1],
          points[2],points[3],
        ],
        color : getColor()
      })
      render()
      points = []
      document.getElementById("metode").value="0"
    }
    else if (document.getElementById("metode").value=="0"){
      points = []
    }
  
    if (elements.length>0) {
      render();
    }
  }
});

canvas.addEventListener("mousedown", function(event){
  isClicking=true;
  editElements=[]
  if (isEdit && isClicking) {
    elements.forEach((item,index1) => {
      item.points.forEach((_, index2) => {
        if (index2%2!==1) {
          var distance = euclideanDistance(event.layerX, event.layerY, item.points[index2], item.points[index2+1])
          if (distance<=5.0) {
            editElements.push({
                idxEl : index1,
                idxPo : index2
              }
            )
          }
        }
      })
    })
  }
});

canvas.addEventListener("mousemove", function(event){
  if (isEdit && isClicking) {
    editRender(editElements, [event.layerX,event.layerY])
  }
});

canvas.addEventListener("mouseup", function(event){
  isClicking=false;
});
