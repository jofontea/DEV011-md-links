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
      //condición que verifica si existe alguna coincidencia extensión válida
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
              message: "La ruta existe y el archivo es válido",
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

const findLinks = (content, filePath) => {
  const regex = /\[([^\]]+)]\(([^)]+)\)/g;
  //array vacio pa guardar el objeto que tiene las propiedades text--href--file
  const links = [];

  // si hay coincidencias en el contenido se ejecuta el bucle
  for (
    let match = regex.exec(content);
    match !== null;
    match = regex.exec(content)
  ) {
    // se extraen el 2do y 3er elemento del array y se asignan a text y href
    const [, text, href] = match;
    links.push({
      href,
      text,
      file: filePath,
    });
  }

  return links;
};

module.exports = { checkingPath, checkingFile, findLinks };
