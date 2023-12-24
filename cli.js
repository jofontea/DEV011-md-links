const mdLinks = require("./md-links.js");

const examplePath = process.argv[2];
const options = {
  validate: process.argv.includes("--validate"),
  stats: process.argv.includes("--stats"),
};

// true representa un valor para el parámetro validate, y significa que se está solicitando
// que se realice la validación de los enlaces
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
