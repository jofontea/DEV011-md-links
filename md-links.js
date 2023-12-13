const fs = require("fs");
const path = require("path");
const { checkingPath, checkingFile, findLinks } = require("./functions.js");

const mdLinks = (examplePath, options) => {
  return new Promise((resolve, reject) => {
    const absolutePath = checkingPath(examplePath);
    const cleanPath = absolutePath.replace(/\\/g, "/");


    // verificar si la ruta existe
    if (fs.existsSync(cleanPath)) {
      checkingFile(cleanPath)
        .then((result) => {
          if (result.isValid) {
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
