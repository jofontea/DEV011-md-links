const path = require("path");
const fs = require("fs");
const axios = require("axios");

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

getHttpStatus = (url) => {
  return (
    axios
      // solicitud HEAD-- info del encabezado de la respuesta sin descargar todo
      .head(url)
      // si todo ok, la función then se ejecuta y retorna el código de estado
      .then((response) => response.status)
      // si algo falla
      .catch((error) => {
        // verificar si el objeto error tiene propiedad response (respuesta del servidor)
        if (error.response) {
          // si existe response, se pide status para tener el código de estado de esa respuesta de error
          return error.response.status;
        } else {
          // si la propiedad response no existe en error, se retorna status 404
          return 404;
        }
      })
  );
};

const validateLinks = (links) => {
  // método map en (links) para crear un nuevo arreglo
  const linkPromises = links.map((link) => {
    return getHttpStatus(link.href)
      .then((status) => {
        // si todo bien, el código de estado se asigna a la propiedad status del objeto link
        link.status = status;
        // ok = se establece si el código de estado está en el rango 200-399 // si no = fail
        link.ok = status >= 200 && status < 400 ? "ok" : "fail";
        // el objeto link modificado se retorna como resultado de la promesa
        return link;
      })
      // si hay algun error 
      .catch(() => {
        // se asigna el código de estado 404 a status y ok se establece en "fail".
        link.status = 404;
        link.ok = "fail";
        return link;
      });
  });
  return Promise.all(linkPromises);
};

module.exports = {
  checkingPath,
  checkingFile,
  findLinks,
  validateLinks,
  getHttpStatus,
};
