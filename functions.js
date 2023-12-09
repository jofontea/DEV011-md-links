const path = require("path");
const fs = require("fs");
// verificar si la ruta es absoluta
const checkingPath = (route) => {
  // convertir la ruta a absoluta
  const result = path.isAbsolute(route) ? route : path.resolve(route);
  const normalizedPath = result.replace(/\\/g, "/");
  return normalizedPath;
};

//verificar la existencia de un archivo md
const checkingFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const validExtensions =
      /\.(md|mkd|mdwn|mdown|mdtxt|mdtext|markdown|text)$/i;

    if (fs.existsSync(filePath)) {
      const extOfTheFile = path.extname(filePath);
      //condición que verifica: a. si existe el archivo b: si existe alguna extensión válida
      if (validExtensions.test(extOfTheFile)) {
        fs.readFile(filePath, "utf-8", (err, data) => {
          if (err) {
            reject({
              isValid: false,
              errorMessage: "Error al leer el archivo",
              path: filePath,
            });
          } else {
            resolve({
              isValid: true,
              message: "La ruta y el archivo son válidos",
              path: filePath,
              content: data,
            });
          }
        });
      } else {
        // si no hay ruta o no hay archivo
        reject({
          isValid: false,
          errorMessage:
            "El archivo no tiene una extensión válida o la ruta no existe",
          path: filePath,
        });
      }
    } else {
      reject({
        isValid: false,
        errorMessage: "El archivo no existe",
        path: filePath,
     
      });
    }
  });
};

module.exports = { checkingPath, checkingFile };



