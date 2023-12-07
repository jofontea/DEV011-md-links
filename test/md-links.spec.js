const mdLinks = require("../md-links.js");
const fs = require("fs");

describe("mdLinks", () => {
  it("should...", () => {
    console.log("FIX ME!");
  });

  it("La función mdLinks debería devolver una promesa", () => {
    const result = mdLinks("C:/md-links/DEV011-md-links/fake-README.md");
    expect(result).toBeInstanceOf(Promise);
  });
  
  it("La promesa debe rechazarse si no existe una ruta", () => {
    const fakePath = "/this/path/is/fake.md";
    return mdLinks(fakePath).catch((error) => {
      expect(error).toEqual({ message: "La ruta no existe", path: fakePath });
    });
  });

  it("La promesa debe resolverse si existe una ruta", () => {
    const realPath = "C:/md-links/DEV011-md-links/fake-README.md";
    return mdLinks(realPath).then((result) => {
      expect(result).toEqual({ message: "La ruta existe", path: realPath });
    });
  });

  it("El método fs.existsSync devuelve true cuando la ruta existe", async () => {
    const existingPath = "C:/md-links/DEV011-md-links/fake-README.md";
    const result = await fs.existsSync(existingPath);
    expect(result).toBe(true);
  });
  
  it("El método fs.existsSync devuelve false cuando la ruta no existe", async () => {
    const fakePath = "this/path/is/fake.md";
    const result = await fs.existsSync(fakePath);
    expect(result).toBe(false);
  });
  
});
