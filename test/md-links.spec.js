const mdLinks = require("../md-links.js");

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

  it("La promesa debe devolver todos los enlaces cuando se resuelve", async () => {
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

  it("Debería resolver la promesa con links cuando validate es true", async () => {
    const realPath = "C:/md-links/DEV011-md-links/fake-README.md";
    const linksWithValidation = await mdLinks(realPath,  { validate: true });
    expect(linksWithValidation).toHaveLength(5); 
  });

  it("Debería resolver la promesa con links cuando validate es false", async () => {
    const realPath = "C:/md-links/DEV011-md-links/fake-README.md";
    const linksWithoutValidation = await mdLinks(realPath,  { validate: false });
    expect(linksWithoutValidation).toHaveLength(5); 
  });

  it("Debería resolver la promesa con estadísticas cuando la opción stats es true", async () => {
    const realPath = "C:/md-links/DEV011-md-links/fake-README.md";
    const statsResult = await mdLinks(realPath, { stats: true });

    const expectedStats = {
      total: 5,
      unique: 5,
    };
    expect(statsResult).toEqual(expectedStats);
  });

  it("Debería resolver la promesa con estadísticas y validación cuando las opciones son combinadas", async () => {
    const realPath = "C:/md-links/DEV011-md-links/fake-README.md";
    const result = await mdLinks(realPath, { validate: true, stats: true });
  
    const expectedOutput = {
      total: expect.any(Number),
      unique: expect.any(Number),
      active: expect.any(Number),
      broken: expect.any(Number),
    };
  
    expect(result).toEqual(expectedOutput);
  });
  
});
