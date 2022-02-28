function exportFile (obj) {
    var filename = document.getElementById("namaFile").value
    if (!filename) {
        filename = 'data'
    }
    var data = JSON.stringify(obj);
    download(filename + ".json", data);
    alert("File sudah berhasil disimpan")
}

function importFile(file) {
    var reader = new FileReader();
    idxPP = 0
    idxPe = 0
    idxG = 0
    idxPo= 0

    reader.onload = function(e){
        arrObjects = JSON.parse(e.target.result);
        render(arrObjects)
        arrObjects.forEach(item => {
            if (item.type==persegi) {
                idxPe+=1
            }
            else if (item.type==persegipanjang) {
                idxPP +=1
            }
            else if (item.type==garis) {
                idxG +=1
            }
            else if (item.type==poligon) {
                idxPo +=1
            }
        });
        alert('File berhasil dilanjutkan')
    }
    
    reader.readAsText(file);
    if (!file) {
        alert('Blank file')
    }
}

var download = function(filename, text) {
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
}