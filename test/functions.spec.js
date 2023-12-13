const { checkingPath, checkingFile, findLinks } = require("../functions.js");

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
      const links = findLinks(content, filePath);
      expect(links).toHaveLength(1);
      expect(links[0].href).toBe("https://estoesunlink.com");
      expect(links[0].text).toBe("link");
      expect(links[0].file).toBe(filePath);
    });
  });
});
