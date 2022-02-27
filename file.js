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

    reader.onload = function(e){
        arrObjects = JSON.parse(e.target.result);
        render(arrObjects)
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