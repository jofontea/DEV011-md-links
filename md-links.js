const fs = require("fs");
const path = require("path");
const { checkingPath, checkingFile, findLinks } = require("./functions.js");

const mdLinks = (path, validate) => {
  return new Promise((resolve, reject) => {
    const absolutePath = checkingPath(path);
    const cleanPath = absolutePath.replace(/\\/g, "/");

    // verificar si la ruta existe
    if (fs.existsSync(cleanPath)) {
      // llamo a checkingFile para las comprobaciones de extensión
      checkingFile(cleanPath)
        // si todo ok
        .then((result) => {
          // si true
          if (result.isValid) {
            //llamo a findLinks pa extraer los links
            const links = findLinks(result.content, cleanPath);
            resolve(links);
          } else {
            reject({ message: result.errorMessage, path: cleanPath });
          }
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject({ message: "La ruta no existe", path: cleanPath });
    }
  });
};

module.exports = mdLinks;
