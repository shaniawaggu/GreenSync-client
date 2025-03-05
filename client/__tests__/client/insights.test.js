const { renderDOM } = require("./helpers");
require("jest-fetch-mock").enableMocks();

global.fetch = require("jest-fetch-mock");

let dom;
let document;

beforeEach(() => {
  fetch.resetMocks();
});

describe("GreenSync Insights Page", () => {
  beforeEach(async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        offPeakRates: "Off-peak rates help you save energy costs!",
        consumptionData: [
          { date: "2025-03-01", usage: "12 kWh" },
          { date: "2025-03-02", usage: "10 kWh" },
        ],
      })
    );

    dom = await renderDOM("insights.html");
    document = dom.window.document;
  });

  it("has a navbar with GreenSync branding", () => {
    const navbar = document.querySelector(".navbar");
    expect(navbar).toBeTruthy();

    const brand = navbar.querySelector(".navbar-brand");
    expect(brand).toBeTruthy();
    expect(brand.innerHTML).toContain("GreenSync");
  });
});