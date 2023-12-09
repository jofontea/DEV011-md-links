const fs = require("fs");
const path = require("path");
const { checkingPath, checkingFile } = require("./functions.js");

const mdLinks = (examplePath, options) => {
  return new Promise((resolve, reject) => {
    const absolutePath = checkingPath(examplePath);
    const cleanPath = absolutePath.replace(/\\/g, "/");
    //path.normalize(absolutePath);
    // verificar si la ruta existe
    if (fs.existsSync(cleanPath)) {
      checkingFile(cleanPath)
        .then((result) => {
          console.log(result.message);
          console.log(result.content);
          resolve({
            message: "La ruta y el archivo son válidos",
            path: cleanPath,
          });
        })
        .catch((error) => {
          console.error(error.errorMessage);
          reject({ message: error.errorMessage, path: cleanPath });
        });
    } else {
      // si la ruta no existe, ejecutar el callback con el error
      reject({ message: "La ruta no existe", path: cleanPath });
    }
  });
};

module.exports = mdLinks;

// manejo de la ruta relativa convertida a absoluta
//const convertedRoute = changingPath;
//resolve(convertedRoute);
//----
// const convertedRoute = changingPath;
//       resolve(convertedRoute);
//----
// probar si esa ruta absoluta es de un archivo o directorio
// si es un directorio, filtrar los archivos md
