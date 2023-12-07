const mdLinks = require("./md-links.js");
const path = require("path");

// verifica si la promesa se resuelve (la ruta existe o no)

mdLinks('C:/md-links/DEV011-md-links/fake-README.md')
  .then((result) => {
    console.log("resultado", result.message);
    console.log("ruta", result.path);
  })

  .catch((error) => {
    console.log(error.message);
    console.error("error completo", error);
  });

// verifica si la ruta es absoluta (o no)
// mdLinks("DEV011-md-links/fake-README.md")
// .then((res) => console.log("Respuesta", res))
// .catch((res) => console.log("Error", res));

// const convertAbsolute = changingPath
//   resolve(convertAbsolute);


//C:/md-links/DEV011-md-links/fake-README.md