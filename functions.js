const path = require("path");
const fs = require("fs");
const axios = require("axios");

const checkingPath = (route) => {
  // verificar si la ruta es absoluta y convertirla si no lo es
  // se asigna la ruta a la variable result
  const result = path.isAbsolute(route) ? route : path.resolve(route);
  // se normaliza la ruta mediante barras normales "/"
  const normalizedPath = result.replace(/\\/g, "/");
  return normalizedPath;
};

//verificar la existencia de un archivo md
const checkingFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const validExtensions =
      /\.(md|mkd|mdwn|mdown|mdtxt|mdtext|markdown|text)$/i;

    // se utiliza fs.existsSync para comprobar si el archivo existe en la ruta
    if (fs.existsSync(filePath)) {
      // si el archivo existe, se obtiene su extensión con path.extname
      const extOfTheFile = path.extname(filePath);
      //condición que verifica si existe alguna coincidencia extensión válida
      if (validExtensions.test(extOfTheFile)) {
        // si coincide alguna extensión, se lee el contenido del archivo con fs.readFile
        // filePath: ruta | "utf-8": codificación del archivo, se específica que debe leerse como texto
        // err: objeto que indica si hubo un error | data: contenido del archivo
        fs.readFile(filePath, "utf-8", (err, data) => {
          // si hay algún error al leer el archivo, se rechaza la promesa
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
        // si no hay ruta o no hay archivo que coincida con la extensión
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

//findLinks toma como parametros el contenido del archivo md y la ruta de este
const findLinks = (content, filePath) => {
  //expresión regular que busca enlaces
  const regex = /\[([^\]]+)]\(([^)]+)\)/g;
  //array vacio para guardar el objeto que tiene las propiedades text--href--file
  const links = [];
  // se utliza un bucle for para encontrar coincidencias en el contenido
  for (
    // se inicializa el bucle con la variable match, se buscan coincidencias entre regex y el contenido
    let match = regex.exec(content);
    // se ejecutará el bucle siempre que hayan coincidencias
    match !== null;
    // se actualiza match con las coincidencias
    match = regex.exec(content)
  ) {
    // se extraen el 2do y 3er elemento del array de coincidencias (match) y se asignan a text y href
    const [, text, href] = match;
    // se crea un objeto con las propiedades href--text--file y se asignan al array links mediante .push
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
      // solicitud HEAD-- muestra info del encabezado de la respuesta sin descargar todo el contenido
      .head(url)
      // si todo ok con la solicitud, la función then se ejecuta y retorna el código de estado
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
  // método map (basado en links) para crear un nuevo arreglo
  const linkPromises = links.map((link) => {
    return (
      // para cada enlace se llama a getHttpStatus para obtener el código de estado de la URL
      getHttpStatus(link.href)
        .then((status) => {
          // si todo bien, el código de estado se asigna a la propiedad status del objeto link
          link.status = status;
          // para ok = se establece si el código de estado está en el rango 200-399 // si no = fail
          link.ok = status >= 200 && status < 400 ? "ok" : "fail";
          // el objeto link modificado se retorna como resultado de la promesa. Contiene status y ok
          return link;
        })
        // si hay algun error
        .catch(() => {
          // se asigna el código de estado 404 a status y ok se establece en "fail".
          link.status = 404;
          link.ok = "fail";
          return link;
        })
    );
  });
  return Promise.all(linkPromises);
};

const getStats = (validatedLinks) => {
  // se obtiene la longitud del array que contiene el total de enlaces validados
  const totalLinks = validatedLinks.length;

  // se utiliza .map para obtener las URLs validadas
  // se crea un conjunto con new Set que elimina URLs duplicadas y se queda con las únicas
  // se obtiene la cantidad de URLs únicas con size
  const uniqueLinks = new Set(validatedLinks.map((link) => link.href)).size;
  return {
    // se retorna la cantidad total de enlaces validados y la cantidad de enlaces únicos
    total: totalLinks,
    unique: uniqueLinks,
  };
};

// la función toma dos parámetros
// links: array de enlaces | options: objeto con opciones, incluyendo validate (booleano: true|false)
const combineStatsAndValidate = (links, options) => {
  // verificar si se debe realizar la validación
  if (options.validate) {
    // si options.validate es true, se llama a validateLinks para validar los enlaces
    // validateLinks devuelve un array de enlaces validados (validatedLinks)
    return validateLinks(links).then((validatedLinks) => {
      // se llama a la función getStats con el array de enlaces validados (validatedLinks)
      // getStats devuelve un objeto con las estadísticas totales y lo almacena en stats
      const stats = getStats(validatedLinks);
      // filtrar enlaces activos (ok === "ok") y contar su cantidad
      const activeLinks = validatedLinks.filter(
        (link) => link.ok === "ok"
      ).length;
      // filtrar enlaces rotos (ok === "fail") y contar su cantidad
      const brokenLinks = validatedLinks.filter(
        (link) => link.ok === "fail"
      ).length;
      // se crea un nuevo objeto que devuelve las estadisticas de stats + los enlaces activos y rotos
      return {
        ...stats,
        active: activeLinks,
        broken: brokenLinks,
      };
    });
    // si no se debe validar, obtener solo estadísticas generales.
  } else {
    const stats = getStats(links);
    return Promise.resolve(stats);
  }
};

module.exports = {
  checkingPath,
  checkingFile,
  findLinks,
  validateLinks,
  getHttpStatus,
  getStats,
  combineStatsAndValidate,
};
