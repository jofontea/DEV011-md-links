const {
  checkingPath,
  checkingFile,
  findLinks,
  getHttpStatus,
  validateLinks,
  getStats,
} = require("../functions.js");
const axios = require("axios");


jest.mock("axios");
jest.mock("../md-links.js");

describe("getHttpStatus", () => {
  it("Debería devolver status 200 para una solicitud exitosa", async () => {
    axios.head.mockResolvedValue({ status: 200 });

    const status = await getHttpStatus(
      "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_expressions"
    );

    expect(status).toBe(200);
  });

  it("Debería devolver status 404 para una solicitud no encontrada", async () => {
    axios.head.mockRejectedValue({ response: { status: 404 } });

    const status = await getHttpStatus("http://cualquiercosaaaa.com");

    expect(status).toBe(404);
  });
});

describe("validateLinks", () => {
  it("Debería añadir las propiedades ok y status al array", async () => {
    // configurar mocks para simular respuestas 
    axios.head
      .mockResolvedValueOnce({ status: 200 })
      .mockResolvedValueOnce({ status: 404 });

    // datos de ejemplo
    const links = [
      {
        href: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_expressions",
        text: "Patrones para coincidencia de caracteres con expresiones regulares - mozilla.org",
        file: "C:/md-links/DEV011-md-links/README.md",
      },
      {
        href: "./docs/03-milestone.md",
        text: "Hito 3",
        file: "C:/md-links/DEV011-md-links/README.md",
      },
    ];

    // ejecutar la función que se está probando
    const result = await validateLinks(links);
    // verificar que los resultados tengan las nuevas propiedades
    expect(result).toEqual([
      {
        href: "https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_expressions",
        text: "Patrones para coincidencia de caracteres con expresiones regulares - mozilla.org",
        file: "C:/md-links/DEV011-md-links/README.md",
        status: 200,
        ok: "ok",
      },
      {
        href: "./docs/03-milestone.md",
        text: "Hito 3",
        file: "C:/md-links/DEV011-md-links/README.md",
        status: 404,
        ok: "fail",
      },
    ]);
  });
});

describe("checkingPath", () => {
  it("Debería convertir rutas relativas a absolutas correctamente", () => {
    const relativePath = "DEV011-md-links/fake-README.md";
    const absolutePath = checkingPath(relativePath);
    expect(absolutePath).toEqual(
      "C:/md-links/DEV011-md-links/DEV011-md-links/fake-README.md"
    );
  });

  describe("checkingFile", () => {
    it("Debería resolver la promesa si hay un path y archivo válidos", async () => {
      const filePath = "C:/md-links/DEV011-md-links/fake-README.md";
      const result = await checkingFile(filePath);
      expect(result.isValid).toBe(true);
      expect(result.path).toBe(filePath);
    });

    it("Debería rechazar si el path no es válido", async () => {
      const filePath = "C:/md-links/jsjsjsj/fake-README.md";
      await expect(checkingFile(filePath)).rejects.toMatchObject({
        isValid: false,
        path: filePath,
        errorMessage: "El archivo no existe",
      });
    });
    it("Debería rechazar la promesa si no puede leer el archivo", async () => {
      const filePath = "C:/md-links/DEV011-md-links/broke-file.md";
      await expect(checkingFile(filePath)).rejects.toMatchObject({
        isValid: false,
        errorMessage: "El archivo no existe",
        path: filePath,
      });
    });

    it("Debería rechazar la promesa si el archivo no es válido", async () => {
      const filePath = "C:/md-links/DEV011-md-links/explaindev.json";
      await expect(checkingFile(filePath)).rejects.toMatchObject({
        isValid: false,
        path: filePath,
        errorMessage:
          "El archivo no tiene una extensión válida o la ruta no existe",
      });
    });
  });

  describe("findLinks", () => {
    test("Debería extraer los links del contenido", () => {
      const content = "[link](https://estoesunlink.com)";
      const filePath = "path/to/file.md";
      // llamada a la función findLinks con el contenido y la ruta del archivo
      const links = findLinks(content, filePath);
      
      expect(links).toHaveLength(1);
      expect(links[0].href).toBe("https://estoesunlink.com");
      expect(links[0].text).toBe("link");
      expect(links[0].file).toBe(filePath);
    });
  });
});
describe("getStats", () => {
  it("debería devolver estadísticas correctamente", () => {
    const links = [
      { href: "http://example.com", ok: "ok" },
      { href: "http://example2.com", ok: "ok" },
      { href: "http://example3.com", ok: "fail" },
    ];

    const result = getStats(links);

    expect(result).toEqual({
      total: 3,
      unique: 3,
    });
  });
  
  it("debería devolver estadísticas correctamente incluso si no hay enlaces", () => {
    const links = [];
    const result = getStats(links);
    expect(result).toEqual({
      total: 0,
      unique: 0,
    });
  });
});
