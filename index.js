const puppeteer = require('puppeteer');
const fs = require('fs');
let items = [];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp"
  });
  const page = await browser.newPage();
  await page.goto('https://vodochet.ru/');
  const mapsHandles = await page.$$('body > div.siteContent > div.mainRating > div > table > tbody > tr');

  let i = 0;

  let titleLink = "tr > td.tbName > a";

    for(const mapshandle of mapsHandles) {
        let title = "Null";
        let rating = "Null";
        let img = "Null";
        let good = "Null";
        let fast = "Null";
        let count = "Null";
        let oficialPrice = "Null";
        let peoplePrice = "Null";
        let ratingPrice = "Null";
        let attestat = "Null";
        let dateSend = "Null";

        try {
            img = await page.evaluate(
                (el) => el.querySelector("tr > td.tbLogo > a > img").getAttribute("src"), mapshandle
            );
        } catch (error) {}
        try {
            title = await page.evaluate(
                (el) => el.querySelector("tr > td.tbName > a").textContent, mapshandle
            );
        } catch (error) {}
        try {
            rating = await page.evaluate(
                (el) => el.querySelector("tr > td.tbRate1 > span").textContent, mapshandle
            );
        } catch (error) {}
        try {
            good = await page.evaluate(
                (el) => el.querySelector("tr > td.tbRate2").textContent, mapshandle
            );
        } catch (error) {}
        try {
            fast = await page.evaluate(
                (el) => el.querySelector("tr > td.tbRate3").textContent, mapshandle
            );
        } catch (error) {}
        try {
            count = await page.evaluate(
                (el) => el.querySelector("tr > td.tbRate4").textContent, mapshandle
            );
        } catch (error) {}
        try {
            oficialPrice = await page.evaluate(
                (el) => el.querySelector("tr > td.tbPrice1").textContent, mapshandle
            );
        } catch (error) {}
        try {
            peoplePrice = await page.evaluate(
                (el) => el.querySelector("tr > td.tbPrice2").textContent, mapshandle
            );
        } catch (error) {}
        try {
            ratingPrice = await page.evaluate(
                (el) => el.querySelector("tr > td.tbPrice3").textContent, mapshandle
            );
        } catch (error) {}
        try {
            attestat = await page.evaluate(
                (el) => el.querySelector("tr > td.tbAttest").textContent, mapshandle
            );
        } catch (error) {}
        try {
            dateSend = await page.evaluate(
                (el) => el.querySelector("tr > td.tbDate").textContent, mapshandle
            );
        } catch (error) {}

        items.push({img, title, rating, good, fast, count, oficialPrice, peoplePrice, ratingPrice, attestat, dateSend});
    }
    console.log(items)

        await page.waitForSelector(titleLink, { timeout: 0 });
    const postUrls = await page.$$eval(
        titleLink, postLinks => postLinks.map(link => link.href)
    );

    for (let postUrl of postUrls) {
        try {
            await page.goto(postUrl);
            console.log('Открываю страницу: ', postUrl);
        } catch (error) {
            console.log(error);
            console.log('Не удалось открыть страницу: ', postUrl);
        }

        const mailSelector = await page.$('div.aboutCompanyData > div:nth-child(7) > p > a')
        const mailSelectorSix = await page.$('div.aboutCompanyData > div:nth-child(6) > p > a')

        if (mailSelector !== null) {
            // Если элемент существует, выполняем парсинг или другие действия
            const text = await page.evaluate(mailSelector => mailSelector.textContent, mailSelector);
            console.log('Текст элемента:', text);
          } else if (mailSelectorSix !== null) {
            const textSix = await page.evaluate(mailSelectorSix => mailSelectorSix.textContent, mailSelectorSix);
            console.log('Текст элемента ЗАПАСНОЙ:', textSix);
            // // Если элемент не существует, выводим сообщение об этом
            // console.log('Элемент не найден на странице.');
          } else {
            console.log('NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOONE');
          }
    }

    fs.writeFile("output.js", JSON.stringify(items), (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("File saved successfully");
        }
    });
  await browser.close();
})();



