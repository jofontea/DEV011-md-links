const path = require("path");

// verificar si la ruta es absoluta
const checkingPath = (route) => {
  // convertir la ruta a absoluta
  const result = path.isAbsolute(route) ? route : path.resolve(route);
  return result;
};


module.exports = { checkingPath };

// idea para ver si hay un archivo

// if(fs.existsSync("./fake-README")){
//   console.log("El archivo EXISTE!");
//   }else{
//   console.log("El archivo NO EXISTE!");
//   }

//console.log(changingPath("DEV011-md-links/fake-README.md"));
// probar si esa ruta absoluta es de un archivo o directorio
// const directoryOrArchive = fileExists(path)
// return fs.statSync(path).isFile();

// 'C:/md-links/DEV011-md-links/DEV011-md-links/fake-README.md'
