import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountStartDate: { type: Date, required: false },
    discountEndDate: { type: Date, required: false },
    image: {
      type: [String],
      default:
        "https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    pet: {
      type: String,
      default: "uncategorized",
    },
    brand: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
