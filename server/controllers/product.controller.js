import Product from "../models/product.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Bạn không được phép tạo bài viết"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Vui lòng nhập đầy đủ các ô"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const images = req.body.image || [
    "https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png",
  ];

  const newProduct = new Product({
    ...req.body,
    slug,
    userId: req.user.userId,
    image: images,
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

export const getproducts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit);
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const priceSortDirection = req.query.priceSort === "asc" ? 1 : -1;
    const products = await Product.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.pet && { pet: req.query.pet }),
      ...(req.query.brand && { brand: req.query.brand }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.productId && { _id: req.query.productId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({
        ...(req.query.priceSort && { price: priceSortDirection }),
        updatedAt: sortDirection,
      })
      .skip(startIndex)
      .limit(limit);

    const totalProducts = await Product.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthProducts = await Product.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      products,
      totalProducts,
      lastMonthProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteproduct = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.userId !== req.params.userId) {
    return next(errorHandler(403, "Bạn không thể xóa sản phẩm này"));
  }
  try {
    await Product.findByIdAndDelete(req.params.productId);
    res.status(200).json("Bài viết đã được xóa");
  } catch (error) {
    next(error);
  }
};

export const updateproduct = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.userId !== req.params.userId) {
    return next(errorHandler(403, "Bạn không thể sửa sản phẩm này"));
  }

  // Nếu không có hình ảnh mới, giữ nguyên mảng hình ảnh cũ
  const images = req.body.image || undefined;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          pet: req.body.pet,
          brand: req.body.brand,
          image: images,
          price: req.body.price,
          discount: req.body.discount,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const adjustDiscount = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Bạn không có quyền thay đổi giảm giá"));
  }

  const { discount, category, brand, pet, startDate, endDate } = req.body;

  // Kiểm tra ngày bắt đầu và ngày kết thúc hợp lệ
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start >= end) {
    return next(errorHandler(400, "Ngày bắt đầu phải nhỏ hơn ngày kết thúc"));
  }

  // Kiểm tra nếu giảm giá không hợp lệ
  if (discount < 0 || discount > 100) {
    return next(errorHandler(400, "Giảm giá phải từ 0 đến 100"));
  }

  try {
    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (brand) {
      filter.brand = brand;
    }
    if (pet) {
      filter.pet = pet;
    }

    const updatedProducts = await Product.updateMany(
      filter,
      { $set: { discount } },
      {
        $set: {
          discount,
          discountStartDate: start,
          discountEndDate: end,
        },
      },
      { new: true }
    );

    if (updatedProducts.modifiedCount === 0) {
      return next(
        errorHandler(404, "Không tìm thấy sản phẩm để áp dụng giảm giá")
      );
    }

    res.status(200).json({
      message: `Giảm giá ${discount}% đã được áp dụng thành công`,
      updatedCount: updatedProducts.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};
