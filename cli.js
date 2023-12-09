const mdLinks = require("./md-links.js");
const path = require("path");

const examplePath = process.argv[2];

mdLinks(examplePath)
  .then((result) => {
    console.log("resultado", result.message);
    console.log("ruta", result.path);
  })

  .catch((error) => {
    console.log(error.message);
    console.error("error completo", error);
  });
