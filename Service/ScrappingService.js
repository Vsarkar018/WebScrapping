const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const ScrappingRepository = require("../Repository/ScrappingRepo");
const UserRepository = require("../Repository/UserRepo");

const repository = new ScrappingRepository();
const userRepo = new UserRepository();
module.exports = class ScrappingService {
  constructor() {}
  async getScrappingData(req, res) {
    try {
      const { url } = req.body;
      const { userId } = req.user;
      const urlData = await repository.findUrl(url);
      if (urlData) {
        if (!urlData.userId.includes(userId)) {
          const data = await repository.updateUrl(userId, urlData._id);
          console.log(data);
          if (!data) {
            throw new Error("Failed to update scrap data");
          }
          const user = await userRepo.updateUser(userId, data._id);
          if (!user) {
            throw new Error("Failed to update user");
          }
        }
        const {
          title,
          price,
          numberOfRatings,
          numberOfReviews,
          ratings,
          dispalyBodyImages,
          description,
        } = urlData;
        res.status(StatusCodes.OK).json({
          title,
          price,
          numberOfRatings,
          numberOfReviews,
          ratings,
          dispalyBodyImages,
          description,
        });
      } else {
        const html = (await axios.get(url)).data;
        const $ = cheerio.load(html);

        const title = $("span[class='B_NuCI']").text();
        const price = $("div[class='_30jeq3 _16Jk6d']").text();

        const ratingAndReviewContainer = $("span[class='_2_R_DZ'] >span");
        const ratingsText = ratingAndReviewContainer.find("span").eq(0).text();
        const reviewsText = ratingAndReviewContainer.find("span").eq(2).text();

        const ratingsMatch = ratingsText.match(/([\d,]+)/);
        const reviewsMatch = reviewsText.match(/([\d,]+)/);

        const numberOfRatings = ratingsMatch ? ratingsMatch[1] : "";
        const numberOfReviews = reviewsMatch ? reviewsMatch[1] : "";

        const ratings = $("div[ class='_3LWZlK']").text();

        const descContainer = $("div[class='K4SXrT funtru']");
        const description = [];

        if (descContainer.length > 0) {
          descContainer
            .map((index, element) => {
              const feature = $(element).find("div[class='_3qWObK']").text();
              const featureDesc = $(element)
                .find("div[class='_3zQntF'] > p")
                .text();
              const imageUrl = $(element).find("img").attr("src");
              description.push({ feature, featureDesc, imageUrl });
            })
            .get();
        } else {
        }
        let dispalyBodyImages;
        try {
          const browser = await puppeteer.launch({ headless: true });
          const page = await browser.newPage();
          await page.goto(url);
          dispalyBodyImages = await page.$$eval("div._2mLllQ ul li", (ele) => {
            return ele.length;
          });
          browser.close();
        } catch (error) {
          dispalyBodyImages = "failed to gather the data";
        }
        const data = await repository.insertScrapData({
          url,
          userId: userId,
          title,
          price,
          numberOfRatings,
          numberOfReviews,
          ratings,
          dispalyBodyImages,
          description,
        });
        if (!data) {
          throw new Error("failed to update Scrap data");
        }
        const user = await userRepo.updateUser(userId, data._id);
        if (!user) {
          throw new Error("Failed to update user");
        }
        res.status(StatusCodes.OK).json({
          title,
          price,
          numberOfRatings,
          numberOfReviews,
          ratings,
          dispalyBodyImages,
          description,
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Unable to scrap data");
    }
  }
};
