const puppeteer = require("puppeteer");

const mongoose = require("mongoose");
mongoose
  .connect("**", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {})
  .catch((error) => {
    console.log(error);
  });

const Movie = mongoose.model("Movie", {
  name: String,
  image: String,
  linkitself: String,
  linktovideo: String,
});

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://sinefy.com", {
    waitUntil: "networkidle2",
  });

  data = await page.evaluate(async () => {
    let myarray = [];

    let dizisname = document.getElementsByClassName(
      "segment-poster segment-poster"
    );
    let count = 0;
    for (const iterator of dizisname) {
      count++;
      if (count > 20) {
        break;
      }
      myarray.push({
        link: iterator
          .getElementsByClassName("poster poster-md")
          .item(0)
          .querySelector("a").href,
        name: iterator
          .getElementsByClassName("poster poster-md")
          .item(0)
          .querySelector("a").title,
        image:
          "https://sinefy.com" +
          iterator
            .getElementsByClassName("poster poster-md")
            .item(0)
            .getElementsByClassName("poster-media")
            .item(0)
            .querySelector("a")
            .querySelector("img")
            .getAttribute("data-src"),
      });
    }
    return myarray;
  });
  let newdata = [];
  for (const key in data) {
    await page.goto(data[key].link, {
      waitUntil: "networkidle2",
      slowMo: 250,
    });
    individual = await page.evaluate(async () => {
      lusy = document.querySelector(
        "#router-view > div > div.player-wrapper.mb-lg > div > iframe"
      ).src;
      return lusy;
    });
    newdata.push(individual);
  }
  data.map((value, index) => {
    value.newlink = newdata[index];
  });
  data.forEach((element) => {
    const movies = new Movie({
      name: element.name,
      image: element.image,
      linkitself: element.link,
      linktovideo: element.newlink,
    });
    movies.save().then(() => console.log("meow"));
  });
})();
