const { renderDOM } = require("./helpers");

let dom;
let document;

describe("GreenSync Homepage", () => {
  beforeEach(async () => {
    dom = await renderDOM("index.html"); // Load the GreenSync homepage
    document = await dom.window.document;
  });

  it("has a navbar with GreenSync branding", () => {
    const navbar = document.querySelector(".navbar");
    expect(navbar).toBeTruthy();

    const brand = navbar.querySelector(".navbar-brand");
    expect(brand).toBeTruthy();
    expect(brand.innerHTML).toContain("GreenSync");
  });

  it("has a hero section with correct text", () => {
    const hero = document.querySelector(".hero-section");
    expect(hero).toBeTruthy();

    const title = hero.querySelector("h1");
    expect(title.innerHTML).toContain(
      "Smarter EV Charging for a Greener Future"
    );
  });

  it('has a "Get Started" button that links to the signup page', () => {
    const getStartedBtn = document.querySelector(".btn-success");
    expect(getStartedBtn).toBeTruthy();
    expect(getStartedBtn.innerHTML).toContain("Get Started");
    expect(getStartedBtn.getAttribute("href")).toBe("sign_up.html");
  });

  it("has a features section with at least 3 cards", () => {
    const features = document.querySelector("#features");
    expect(features).toBeTruthy();

    const featureCards = features.querySelectorAll(".card");
    expect(featureCards.length).toBeGreaterThanOrEqual(3);
  });

  it("has a footer with copyright text", () => {
    const footer = document.querySelector("footer");
    expect(footer).toBeTruthy();
    expect(footer.innerHTML).toContain("&copy; 2025 GreenSync");
  });
});
