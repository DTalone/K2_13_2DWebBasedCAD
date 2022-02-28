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
var idxPP = 0
var idxPe = 0
var idxG = 0
var idxPo= 0
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
    else if (type==poligon){
      drawPolygon(gl, points, colorUniformLocation, color)
    }
  });
}

function hexToRGB(hex) {
  return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r*255) + componentToHex(g*255) + componentToHex(b*255);
}

function getColor(id="warna") {
  const hex = document.getElementById(id).value
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
    panjang.style.display = "block";
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
  var menuBar = document.getElementById("menubar")
  isEdit = !isEdit;
  if (isEdit) {
    // buat tombol simpan
    var el = document.createElement("button")
    var te = document.createTextNode("Simpan")
    el.setAttribute("id", "simpan")
    el.appendChild(te);
    tmp = JSON.parse(JSON.stringify(elements));
    el.addEventListener("click", ()=> {
      // Fungsi save
      el.remove()
      button.innerHTML = "Ubah"
      isEdit = !isEdit
      elements = JSON.parse(JSON.stringify(tmp));
      document.getElementById("editbar").remove()
    })
    button.innerHTML = "Gagalkan Perubahan"
    button.parentNode.insertBefore(el, button.nextSibling);

    // buat tombol tiap bangun
    // 1. Persegi input:range sisi
    // 2. Garis input:range garis
    // 3, Poligon input:color 
    var children =document.createElement("div")
    children.setAttribute("id", "editbar")
    menuBar.parentNode.insertBefore(children, menuBar.nextSibling);
    elements.forEach((item,index)=> {
      if (item.type==garis) {
        addEditLineBar(item, children)
      }
      else if (item.type==persegi) {
        addEditSquareBar(item, children)
      }
      else if (item.type==poligon) {
        addEditPolygonBar(item, children)
      }
    })
  }
  else {
    document.getElementById("editBtn").innerHTML = "Ubah"
    render()
    document.getElementById("simpan")?.remove()
    document.getElementById("editbar").remove()
  }
}

function editRender(edEl=null, cuPo=null) { 
  if (edEl==null) {
    // do nothing
  }
  else {
    edEl.forEach(item=> {
      tmp[item.idxEl].points[item.idxPo]=cuPo[0]
      tmp[item.idxEl].points[item.idxPo+1]=cuPo[1]
    })
  }

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
    else if (type==poligon){
      drawPolygon(gl, points, colorUniformLocation, color)
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
      idxPP+=1
      elements.push({
        id : "persegipanjang_"+idxPP,
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
      idxPe +=1
      elements.push({
        id : "persegi_"+idxPe,
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
    else if (document.getElementById("metode").value==poligon && points.length==2){
      const titik=parseInt(document.getElementById("titik").value)
      const length=parseInt(document.getElementById("panjang").value)
      idxPo +=1
      elements.push({
        id : "poligon_"+idxPo,
        type : poligon,
        source : points,
        length : length,
        points : setupVert(titik,length,points),
        color : getColor()
      })
      render()
      points = []
      resetButtonMenubar()
    }
    
    else if (document.getElementById("metode").value==garis && points.length==4) {
      idxG +=1
      elements.push({
        id : "garis_"+idxG,
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
      resetButtonMenubar()
    }
    else if (document.getElementById("metode").value=="0"){
      points = []
      resetButtonMenubar()
    }
  
    if (elements.length>0) {
      render();
    }
  }
});

canvas.addEventListener("mousedown", function(event){
  isClicking=true;
  editElements=[];
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
