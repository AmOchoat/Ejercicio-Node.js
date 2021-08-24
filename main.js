//Módulos
const fs = require("fs");
const http = require("http");
const axios = require("axios").default;

//Constantes
const host = 'localhost';
const port = 8081;

const requestListener = function (req, res) {
    let plantilla = "";
    res.setHeader("Content-Type", "text/html");
    switch (req.url) {
        case "/api/proveedores":
            proveedores((proveedoresJson)=> {

                proveedoresJson.forEach(proveedor=>{
                    plantilla += '<tr><td>'+proveedor.idproveedor+'</td> \
                    <td>'+proveedor.nombrecompania+'</td> \
                    <td>'+proveedor.nombrecontacto+'</td></tr>';
                });
                
                fs.readFile(__dirname + "/index.html", (err, data)=>{
                    if(err){
                        console.log("Error con el archivo HTML")
                    }

                    data = data.toString();
                    data = data.replace("nombreRole", "proveedores");
                    data = data.replace("lista", plantilla);
                    res.writeHead(200);
                    res.write(data);                    
                    res.end();
                });                                
            });
            break

        case "/api/clientes":

            clientes((clienteJson)=> {

                clienteJson.forEach(cliente=>{
                    plantilla += '<tr><td>'+cliente.idCliente+'</td> \
                    <td>'+cliente.NombreCompania+'</td> \
                    <td>'+cliente.NombreContacto+'</td></tr>';
                });

                fs.readFile(__dirname + "/index.html", (err, data)=>{
                    if(err){
                        console.log("Error con el archivo HTML")
                    }                    
                    data = data.toString();
                    data = data.replace("nombreRole", "clientes");
                    data = data.replace("lista", plantilla);
                    res.writeHead(200);
                    res.write(data);                    
                    res.end();
                });
            });                    
            break
        default:
            res.writeHead(404);
            res.end("Error en la URL");

    }
};

fs.readFile(__dirname + "/index.html", (err, data)=>{  
    if(err) {
        console.log("No se pudo leer el archivo HTML.")
        process.exit(1);
    } else {
        indexFile = data;
        server.listen(port, host, ()=> {
            console.log(`Server is running on http://${host}:${port}`)
        })
    }
});

const server = http.createServer(requestListener);

function proveedores(prov){
    axios.get('https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json')
    .then((result)=>{
        prov(result.data);
    });
}

function clientes(cliente){
    axios.get('https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json')
    .then((result)=>{
        cliente(result.data);
    });
}