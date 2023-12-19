const mdLinks = require("./md-links.js");

const examplePath = process.argv[2];

// true representa un valor para el parámetro validate, y significa que se está solicitando 
// que se realice la validación de los enlaces 
mdLinks(examplePath, true)
  .then((result) => {
    console.log("resultado", result);
  })

  .catch((error) => {
    console.log(error.message);
    console.error("error completo", error.path);
  });
