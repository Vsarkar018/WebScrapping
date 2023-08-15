const mongoose = require("mongoose");
const scrappingDataSchema = new mongoose.Schema(
  {
    userId: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
    url: { type: String, required: true },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    numberOfRatings: {
      type: String,
      required: true,
    },
    numberOfReviews: {
      type: String,
      required: true,
    },
    ratings: {
      type: String,
      required: true,
    },
    dispalyBodyImages: {
      type: Number,
      required: true,
    },
    description: [
      {
        feature: String,
        featureDesc: String,
        imageUrl: String,
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("scrappingdata", scrappingDataSchema);
