const fs = require("fs");
const {
  checkingPath,
  checkingFile,
  findLinks,
  validateLinks,
} = require("./functions.js");

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
          // si la extensión es valida
          if (result.isValid) {
            //llamo a findLinks pa extraer los links
            const links = findLinks(result.content, cleanPath);
            // si se especifica la validación
            if (validate) {
              // llamo a validateLinks para validar los links
              validateLinks(links)
                // la promesa se resuelve con el array de links validados
                .then((validatedLinks) => resolve(validatedLinks))
                //  si hay algun error con la validación, la promesa se rechaza
                .catch((error) => reject(error));
            } else {
              // si no se especifica la validación, resuelve con los links
              resolve(links);
            }
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
