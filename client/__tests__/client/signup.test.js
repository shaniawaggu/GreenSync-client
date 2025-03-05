const { renderDOM } = require("./helpers");
const { waitFor } = require("@testing-library/dom");

let dom;
let document;

beforeEach(async () => {
    dom = await renderDOM("sign_up.html");
    document = dom.window.document;
});

describe("GreenSync Sign-Up Page", () => {
    it("has a sign-up form", () => {
        const form = document.querySelector("#sign-up-form");
        expect(form).toBeTruthy();
    });

    it("has a username input field", () => {
        const usernameInput = document.querySelector("#floatingUsername");
        expect(usernameInput).toBeTruthy();
        expect(usernameInput.getAttribute("type")).toBe("text");
        expect(usernameInput.hasAttribute("required")).toBe(true);
    });

    it("has an email input field", () => {
        const emailInput = document.querySelector("#floatingEmail");
        expect(emailInput).toBeTruthy();
        expect(emailInput.getAttribute("type")).toBe("email");
        expect(emailInput.hasAttribute("required")).toBe(true);
    });

    it("has a password input field", () => {
        const passwordInput = document.querySelector("#floatingPassword");
        expect(passwordInput).toBeTruthy();
        expect(passwordInput.getAttribute("type")).toBe("password");
        expect(passwordInput.hasAttribute("required")).toBe(true);
    });

    it("has a postcode input field", () => {
        const postcodeInput = document.querySelector("#floatingPostcode");
        expect(postcodeInput).toBeTruthy();
        expect(postcodeInput.getAttribute("type")).toBe("text");
        expect(postcodeInput.hasAttribute("required")).toBe(true);
    });

    it("has a sign-up button", () => {
        const signUpButton = document.querySelector("button[type='submit']");
        expect(signUpButton).toBeTruthy();
        expect(signUpButton.innerHTML).toContain("Sign Up");
    });

    it("has a back-to-homepage link", () => {
        const homeLink = document.querySelector("a[href='index.html']");
        expect(homeLink).toBeTruthy();
        expect(homeLink.innerHTML).toContain("Back to Homepage");
    });

    it("displays the correct footer", () => {
        const footer = document.querySelector("p.text-muted");
        expect(footer).toBeTruthy();
        expect(footer.innerHTML).toContain("© GreenSync | 2025");
    });
});
