const { expect } = require("chai");
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const { Builder, By, Key, until, sleep } = require("selenium-webdriver");
const { delay } = require("../utils/delay");


Given("Test registration functionality", { timeout: 30000 }, async function () {
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get("http://localhost:3000/signin");

    await driver.findElement(By.id("getFormBtn")).click();
    await driver.sleep(delay);

    await driver.findElement(By.id("signUpLink")).click();
    await driver.sleep(delay);

    await driver.findElement(By.id("email")).sendKeys("anishkhadka1111@gmail.com");
    await driver.sleep(delay);

    await driver.findElement(By.id("fullName")).sendKeys("Anish Khadka");
    await driver.sleep(delay);

    await driver.findElement(By.id("continue")).click();
    await driver.sleep(delay);

    await driver.findElement(By.id("password")).sendKeys("12345678");
    await driver.sleep(delay);

    await driver.findElement(By.id("continue")).click();
    await driver.wait(until.elementLocated(By.id("home")), 30000);
    // await driver.quit();
});


Given("Test login functionality", { timeout: 30000 }, async function () {
    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get("http://localhost:3000/signin");

    await driver.findElement(By.id("getFormBtn")).click();
    await driver.sleep(delay);

    await driver.findElement(By.id("email")).sendKeys("anishkhadka1111@gmail.com");
    await driver.sleep(delay);

    await driver.findElement(By.id("continue")).click();
    await driver.sleep(delay);

    await driver.findElement(By.id("password")).sendKeys("12345678");
    await driver.sleep(delay);

    await driver.findElement(By.id("continue")).click();
    await driver.wait(until.elementLocated(By.id("home")), 30000);
    // await driver.quit();
});