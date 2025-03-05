const { renderDOM } = require("./helpers");

let dom;
let document;

beforeEach(async () => {
    dom = await renderDOM("login.html");
    document = dom.window.document;
});

describe("GreenSync Login Page", () => {
    it("has a login form", () => {
        const form = document.querySelector("#login-form");
        expect(form).toBeTruthy();
    });

    it("has a username input field", () => {
        const usernameInput = document.querySelector("#floatingUsername");
        expect(usernameInput).toBeTruthy();
        expect(usernameInput.getAttribute("type")).toBe("text");
        expect(usernameInput.hasAttribute("required")).toBe(true);
    });

    it("has a password input field", () => {
        const passwordInput = document.querySelector("#floatingPassword");
        expect(passwordInput).toBeTruthy();
        expect(passwordInput.getAttribute("type")).toBe("password");
        expect(passwordInput.hasAttribute("required")).toBe(true);
    });

    it("has a login button", () => {
        const loginButton = document.querySelector("button[type='submit']");
        expect(loginButton).toBeTruthy();
        expect(loginButton.innerHTML).toContain("Login");
    });

    it("has a sign-up link", () => {
        const signUpLink = document.querySelector("a[href='sign_up.html']");
        expect(signUpLink).toBeTruthy();
        expect(signUpLink.innerHTML).toContain("Sign up");
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
