const { renderDOM } = require("./helpers");
require("jest-fetch-mock").enableMocks(); 

global.fetch = require("jest-fetch-mock");

let dom;
let document;

beforeEach(() => {
  fetch.resetMocks();
});

describe("GreenSync Dashboard", () => {
  beforeEach(async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        chargingRecommendations: "Best days to charge your car to the MAX",
        savingsInfo: "Cost Savings",
      })
    );

    dom = await renderDOM("dashboard.html");
    document = dom.window.document;
  });

  it("has a navbar with GreenSync branding", () => {
    const navbar = document.querySelector(".navbar");
    expect(navbar).toBeTruthy();

    const brand = navbar.querySelector(".navbar-brand");
    expect(brand).toBeTruthy();
    expect(brand.innerHTML).toContain("GreenSync");
  });

  it("has a 7-day forecast sidebar", () => {
    const sidebar = document.querySelector("aside");
    expect(sidebar).toBeTruthy();
    expect(sidebar.querySelector(".card-header").innerHTML).toContain("7-Day Forecast");
  });

  it("has a main dashboard section", () => {
    const mainDashboard = document.querySelector("main");
    expect(mainDashboard).toBeTruthy();
    expect(mainDashboard.querySelector(".card-header").innerHTML).toContain("Charging Patterns");
  });

  it("has an energy usage chart", () => {
    const chart = document.querySelector("#weatherChart");
    expect(chart).toBeTruthy();
  });

  it("has a footer with copyright text", () => {
    const footer = document.querySelector("footer");
    expect(footer).toBeTruthy();
    expect(footer.innerHTML).toContain("© 2025 GreenSync");
  });
});