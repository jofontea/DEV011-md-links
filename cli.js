const mdLinks = require("./md-links.js");

const examplePath = process.argv[2];

mdLinks(examplePath)
  .then((result) => {
    console.log("resultado", result);
  })

  .catch((error) => {
    console.log(error.message);
    console.error("error completo", error.path);
  });
