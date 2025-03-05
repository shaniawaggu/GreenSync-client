const { renderDOM } = require("./helpers");

let dom;
let document;

beforeEach(async () => {
    dom = await renderDOM("charging_stations.html");
    document = dom.window.document;
});

describe("Charging Stations Page", () => {
    it("has a navbar with GreenSync branding", () => {
        const navbar = document.querySelector(".navbar");
        expect(navbar).toBeTruthy();
        expect(navbar.innerHTML).toContain("GreenSync");
    });

    it("has a map container", () => {
        const mapContainer = document.querySelector("#map");
        expect(mapContainer).toBeTruthy();
    });

    it("has a charging stations card", () => {
        const card = document.querySelector(".card");
        expect(card).toBeTruthy();
        expect(card.innerHTML).toContain("Find Charging Stations");
    });

    it("has a footer with copyright text", () => {
        const footer = document.querySelector("footer");
        expect(footer).toBeTruthy();
        expect(footer.innerHTML).toContain("© 2025 GreenSync");
    });
});
