import { sleep } from "../utils/sleep.js";

export class LinkedInLoginPage {
    constructor(page) {
        this.page = page;
    }

    async open() {
        await this.page.goto("https://www.linkedin.com", {
            waitUntil: "networkidle2",
        });
        console.log("LinkedIn opened successfully");
    }

    async acceptCookies() {
        const acceptButton = await this.page
            .waitForSelector('button[action-type="ACCEPT"]', {
                visible: true,
                timeout: 5000,
            })
            .catch(() => null);

        if (acceptButton) {
            await acceptButton.click();
            console.log("Accepted privacy terms");
        }
    }

    async clickSignIn() {
        await this.page.waitForSelector("a, button", {
            visible: true,
            timeout: 5000,
        });

        const clicked = await this.page.evaluate(() => {
            const elements = [...document.querySelectorAll("a, button")];
            const signInBtn = elements.find((el) =>
                el.textContent.toLowerCase().includes("sign in"),
            );
            if (signInBtn) {
                signInBtn.click();
                return true;
            }
            return false;
        });

        if (clicked) {
            console.log("Clicked 'Sign in' button");
        } else {
            console.log("Could not find 'Sign in' button");
        }
    }

    async login(email, password) {
        await this.page.waitForSelector("#username", {
            visible: true,
            timeout: 10000,
        });

        await this.page.type("#username", email);
        console.log("Entered email");

        await this.page.type("#password", password);
        console.log("Entered password");

        await this.page.click('button[type="submit"]');
        console.log("Clicked sign in submit button and login complete");

        await sleep(5000);
    }
}
