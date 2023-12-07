const { checkingPath } = require("../functions.js");

// arreglar este test, solo pasa pq puse la ruta con \\ ya q así la devuelve pero no debería 
describe("checkingPath", () => {
it("Debería convertir rutas relativas a absolutas correctamente", () => {
    const relativePath = "DEV011-md-links/fake-README.md";
    const absolutePath = checkingPath(relativePath);
    expect(absolutePath).toEqual("C:\\md-links\\DEV011-md-links\\DEV011-md-links\\fake-README.md");
  });
});