const fs = require("fs");
const path = require("path");
const { checkingPath } = require("./functions.js");

const mdLinks = (examplePath, options) => {
  return new Promise((resolve, reject) => {
    const absolutePath = checkingPath(examplePath);

    // verificar si la ruta existe
    if (fs.existsSync(absolutePath)) {
      resolve({ message: "La ruta existe", path: absolutePath });
    } else {
      // si la ruta no existe, se rechaza la promesa
      reject({ message: "La ruta no existe", path: absolutePath });
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
