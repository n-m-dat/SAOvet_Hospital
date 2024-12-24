import Service from "../models/service.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Bạn không được phép tạo dịch vụ"));
  }
  if (!req.body.serviceName || !req.body.description) {
    return next(errorHandler(400, "Vui lòng nhập đầy đủ các ô"));
  }
  const slug = req.body.serviceName
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newService = new Service({
    ...req.body,
    slug,
    userId: req.user.userId,
  });
  try {
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    next(error);
  }
};

export const getservices = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const services = await Service.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.serviceId && { _id: req.query.serviceId }),
      ...(req.query.searchTerm && {
        $or: [
          { serviceName: { $regex: req.query.searchTerm, $options: "i" } },
          { description: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalServices = await Service.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthServices = await Service.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      services,
      totalServices,
      lastMonthServices,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteservice = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.userId !== req.params.userId) {
    return next(errorHandler(403, "Bạn không thể xóa dịch vụ này"));
  }
  try {
    await Service.findByIdAndDelete(req.params.serviceId);
    res.status(200).json("Dịch vụ đã được xóa");
  } catch (error) {
    next(error);
  }
};

export const updateservice = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.userId !== req.params.userId) {
    return next(errorHandler(403, "Bạn không thể sửa dịch vụ này"));
  }
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.serviceId,
      {
        $set: {
          serviceName: req.body.serviceName,
          shortDesc: req.body.shortDesc,
          description: req.body.description,
          fee: req.body.fee,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedService);
  } catch (error) {
    next(error);
  }
};
