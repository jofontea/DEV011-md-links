const fs = require("fs");
const {
  checkingPath,
  checkingFile,
  findLinks,
  validateLinks,
  getStats,
  combineStatsAndValidate,
} = require("./functions.js");

// mdLinks toma como parámetros la ruta al archivo y el objeto options (que puede ser validate/stats)
const mdLinks = (path, options = {}) => {
  // retorna una nueva promesa que maneja las operaciones asíncronas dentro de la función
  return new Promise((resolve, reject) => {
    // llamo a checkingPath para obtener la ruta absoluta del archivo
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
            // llamo a findLinks para extraer los enlaces del contenido del archivo md
            const links = findLinks(result.content, cleanPath);

            // si las opciones incluyen validate y stats
            if (options.validate && options.stats) {
              // llamo a combineStatsAndValidate para tener ambas
              combineStatsAndValidate(links, options)
                // cuando la promesa se resuelve exitosamente, se ejecuta este bloque (then)
                .then((statsAndValidation) => resolve(statsAndValidation))
                .catch((error) => reject(error));
              // si solo validate está presente en las opciones
            } else if (options.validate) {
              // llamo a validateLinks
              validateLinks(links)
                .then((validatedLinks) => resolve(validatedLinks))
                .catch((error) => reject(error));
              // si solo stats está presente en las opciones
            } else if (options.stats) {
              // llamo a getStats
              const stats = getStats(links);
              resolve(stats);
            } else {
              resolve(links);
            }
            // la promesa se rechaza si no hay una extensión válida
          } else {
            reject({ message: result.errorMessage, path: cleanPath });
          }
        })
        // manejo de errores generales
        .catch((error) => {
          reject(error);
        });
      // la promesa se rechaza si la ruta no existe
    } else {
      reject({ message: "La ruta no existe", path: cleanPath });
    }
  });
};
module.exports = mdLinks;
