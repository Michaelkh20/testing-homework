const { assert } = require('chai');

async function addItemToCart(page) {
  page.setDefaultTimeout(3000);
  await page.goto('http://localhost:3000/hw/store/catalog/0');

  const addToCartButton = await page.waitForSelector(
    '#root > div > div > div > div > div.col-12.col-sm-7.col-lg-6 > p:nth-child(4) > button'
  );
  await addToCartButton.click();
  page.setDefaultTimeout(30000);
}

async function placeOrder(page) {
  page.setDefaultTimeout(3000);
  const cartLink = await page.waitForSelector('#cartLink');
  await cartLink.click();

  const nameInput = await page.waitForSelector('#f-name');
  const phoneInput = await page.waitForSelector('#f-phone');
  const addresInput = await page.waitForSelector('#f-address');
  const submitButton = await page.waitForSelector(
    '#root > div > div > div > div:nth-child(3) > div > div > button'
  );

  await nameInput.type('Someone');
  await phoneInput.type('89158888888');
  await addresInput.type('Somewhere');
  await submitButton.click();
  page.setDefaultTimeout(30000);
}

describe('Integration tests', async function () {
  it('Menu test', async function ({ browser }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await page.setViewport({
      width: 550,
      height: 700,
      deviceScaleFactor: 1,
    });

    await page.goto('http://localhost:3000/hw/store');

    const menuToggler = await page.waitForSelector('#navbarToggler');
    await menuToggler.click();
    const deliveryLink = await page.waitForSelector('#delivery');
    await deliveryLink.click();

    await this.browser.assertView('navbar', '.navbar');
  });

  it('Add to Cart button', async function ({ browser }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await page.goto('http://localhost:3000/hw/store/catalog/0');

    await this.browser.assertView(
      'addToCartButton',
      '.ProductDetails-AddToCart'
    );
  });

  it('Product adds to cart', async function ({ browser }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await addItemToCart(page);
    const cartText = await page.$eval('#cartLink', (element) => {
      return element.innerHTML;
    });

    assert.equal(cartText, 'Cart (1)');
  });

  it('Test phone validation', async function ({ browser }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await addItemToCart(page);

    await placeOrder(page);
    await browser.pause(1000);

    const phone = await page.$('#f-phone');
    if (phone !== null) {
      assert.fail('Falthy invalid input');
    }
  });

  it('Test order placing', async function ({ browser }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await addItemToCart(page);

    await placeOrder(page);

    const successMessage = await page.waitForSelector('.Cart-SuccessMessage', {
      timeout: 5000,
    });
  });

  it('Test success order placing message', async function ({ browser }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await addItemToCart(page);

    await placeOrder(page);

    await this.browser.assertView('SuccessMessage', '.Cart-SuccessMessage', {
      ignoreElements: ['.Cart-Number'],
    });
  });

  it('Test cart saves in local storage', async function ({ browser }) {
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await addItemToCart(page);

    page.close();

    const newPage = await puppeteer.newPage();
    await newPage.goto('http://localhost:3000/hw/store/cart');

    const successMessage = await newPage.waitForSelector('.Cart-Table', {
      timeout: 5000,
    });
  });
});
