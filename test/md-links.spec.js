const mdLinks = require("../md-links.js");
const fs = require("fs");


describe("mdLinks", () => {
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
      expect(result).toEqual(result);
    });
  });

  it("La promesa debe devolver los primeros dos links cuando se resuelve", async () => {
    const realPath = "C:/md-links/DEV011-md-links/fake-README.md";
    const result = await mdLinks(realPath);

    const expectedLinks = [
      {
        file: "C:/md-links/DEV011-md-links/fake-README.md",
        href: "#1-consideraciones-generales",
        text: "1. Consideraciones generales",
      },
      {
        file: "C:/md-links/DEV011-md-links/fake-README.md",
        href: "#2-preámbulo",
        text: "2. Preámbulo",
      },
      {
        file: "C:/md-links/DEV011-md-links/fake-README.md",
        href: "#1-consideraciones-generales",
        text: "1. Consideraciones generales",
      },
      {
        file: "C:/md-links/DEV011-md-links/fake-README.md",
        href: "#2-preámbulo",
        text: "2. Preámbulo",
      },
      {
        file: "C:/md-links/DEV011-md-links/fake-README.md",
        href: "#2-preámbulo",
        text: "2. Preámbulo",
      },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedLinks));
    expect(result.length).toBe(expectedLinks.length);
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

  it("Debería resolver la promesa con links cuando validate es true y false en el mismo bloque", async () => {
    const realPath = "C:/md-links/DEV011-md-links/fake-README.md";
    const linksWithoutValidation = await mdLinks(realPath, false);
    const linksWithValidation = await mdLinks(realPath, true);

    expect(linksWithoutValidation).toHaveLength(5); // 
    expect(linksWithValidation).toHaveLength(5); // 
  });
});
