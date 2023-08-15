const scrapModel = require("../Models/DataModel");

module.exports = class ScrappingRepository {
  constructor() {}
  async findUrl(url) {
    const urlData = await scrapModel.findOne({ url: url });
    return urlData ? urlData : false;
  }

  async updateUrl(userId, urlId) {
    const data = await scrapModel.findByIdAndUpdate(urlId, {
      $push: { userId: userId },
    });
    return data ? data : false;
  }
  async insertScrapData({
    url,
    userId,
    title,
    price,
    numberOfRatings,
    numberOfReviews,
    ratings,
    dispalyBodyImages,
    description,
  }) {
    const data = await scrapModel.create({
      url,
      userId: [userId],
      title,
      price,
      numberOfRatings,
      numberOfReviews,
      ratings,
      dispalyBodyImages,
      description,
    });
    return data ? data : false;
  }
};
