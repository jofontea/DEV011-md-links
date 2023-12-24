const fs = require("fs");
const {
  checkingPath,
  checkingFile,
  findLinks,
  validateLinks,
  getStats,
  combineStatsAndValidate,
} = require("./functions.js");

const mdLinks = (path, options = {}) => {
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

            if (options.validate && options.stats) {
              combineStatsAndValidate(links, options)
                .then((statsAndValidation) => resolve(statsAndValidation))
                .catch((error) => reject(error));
            } else if (options.validate) {
              validateLinks(links)
                .then((validatedLinks) => resolve(validatedLinks))
                .catch((error) => reject(error));
            } else if (options.validate) {
              validateLinks(links)
                .then((validatedLinks) => resolve(validatedLinks))
                .catch((error) => reject(error));
            } else if (options.stats) {
              const stats = getStats(links);
              resolve(stats);
            } else {
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
