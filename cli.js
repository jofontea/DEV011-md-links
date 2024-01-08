const mdLinks = require("./md-links.js");

// obtiene el 3er elemento de process.argv que corresponde a la ruta que proporciona el user
const examplePath = process.argv[2];
// se crea el objeto options que tiene --validate y --stats
const options = {
  validate: process.argv.includes("--validate"),
  stats: process.argv.includes("--stats"),
};
// toma como parámetros la ruta pasada por el usuario y el objeto options
mdLinks(examplePath, options)
  .then((result) => {
    if (options.validate && options.stats) {
      console.log("Resultado de validación y estadísticas", result);
    } else if (options.validate) {
      console.log("Resultado de validación", result);
    } else if (options.stats) {
      console.log("Estadísticas", result);
    } else {
      console.log("Resultado links", result);
    }
  })
  .catch((error) => {
    console.log(error.message);
    console.error("Error completo", error.path);
  });
