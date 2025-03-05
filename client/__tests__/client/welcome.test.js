const { renderDOM } = require("./helpers");
require("jest-fetch-mock").enableMocks();

global.fetch = require("jest-fetch-mock");

let dom;
let document;

beforeEach(() => {
  fetch.resetMocks();
});

describe("GreenSync Welcome Page", () => {
  beforeEach(async () => {
    dom = await renderDOM("welcome.html");
    document = dom.window.document;
  });

  it("has a navbar with GreenSync branding", () => {
    const navbar = document.querySelector(".navbar");
    expect(navbar).toBeTruthy();

    const brand = navbar.querySelector(".navbar-brand");
    expect(brand).toBeTruthy();
    expect(brand.innerHTML).toContain("GreenSync");
  });

  it("displays the welcome message with a username", () => {
    const welcomeHeader = document.querySelector("h1");
    expect(welcomeHeader).toBeTruthy();
    expect(welcomeHeader.innerHTML).toContain("Welcome");
  });

  it("has navigation links to dashboard, charging stations, and insights", () => {
    const dashboardLink = document.querySelector("a[href='dashboard.html']");
    const chargingStationsLink = document.querySelector("a[href='charging_stations.html']");
    const insightsLink = document.querySelector("a[href='insights.html']");

    expect(dashboardLink).toBeTruthy();
    expect(chargingStationsLink).toBeTruthy();
    expect(insightsLink).toBeTruthy();
  });
});
