import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import Service from "../models/service.model.js";
import Appointment from "../models/appointment.model.js";
import Product from "../models/product.model.js";

export const logout = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("Người dùng đã đăng xuất");
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.userId !== req.params.userId) {
    return next(errorHandler(403, "Bạn không thể cập nhật người dùng này."));
  }
  if (req.body.password) {
    if (req.body.password.length < 8) {
      return next(errorHandler(400, "Mật khẩu phải ít nhất 8 ký tự"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(errorHandler(400, "Tên người dùng phải từ 7 đến 20 ký tự"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9\s]+$/)) {
      return next(
        errorHandler(400, "Tên người dùng chỉ bao gồm chữ cái và số")
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
          address: req.body.address,
          phonenumber: req.body.phonenumber,
          gender: req.body.gender,
          pet: req.body.pet,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Bạn không thể xóa người dùng này"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("Người dùng đã được xóa");
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Bạn không có quyền thực hiện thao tác này"));
  }

  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "Không tìm thấy người dùng"));
    }

    user.isBlocked = !user.isBlocked; // Thay đổi trạng thái block
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked
        ? "Người dùng đã bị khóa"
        : "Người dùng đã được mở khóa",
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Bạn không thể xem tất cả người dùng"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "Không tìm thấy người dùng"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const appointmentsAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Bạn không thể xem tất cả lịch hẹn!"));
  }
  try {
    const appointments = await Appointment.find({});
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointmentAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Bạn không có quyền hủy lịch hẹn này!"));
  }
  try {
    const { appointmentId } = req.body;

    const appointmentData = await Appointment.findById(appointmentId);

    await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true });

    // trả lại các slot
    const { serviceId, slotDate, slotTime } = appointmentData;
    const serviceData = await Service.findById(serviceId);

    let slots_booked = serviceData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await Service.findByIdAndUpdate(serviceId, { slots_booked });

    res.json({ success: true, message: "Đã hủy lịch hẹn" });
  } catch (error) {
    next(error);
  }
};

export const appointmentComplete = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Bạn không có quyền truy cập!"));
  }
  try {
    const { appointmentId } = req.body;

    const appointmentData = await Appointment.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Không tìm thấy cuộc hẹn!" });
    }

    if (appointmentData.isCompleted) {
      return res.json({
        success: false,
        message: "Hoàn thành cuộc hẹn!",
      });
    }

    await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true });

    return res.json({ success: true, message: "Hoàn thành cuộc hẹn!" });
  } catch (error) {
    next(error);
  }
};

export const adminDashboard = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Bạn không có quyền truy cập!"));
  }
  try {
    const services = await Service.find({});
    const users = await User.find({});
    const appointments = await Appointment.find({});
    const products = await Product.find({});

    const dashData = {
      services: services.length,
      users: users.length,
      appointments: appointments.length,
      products: products.length,
    };

    res.status(200).json({ success: true, dashData });
  } catch (error) {
    next(error);
  }
};

export const getRevenue = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ isCompleted: true });

    // Tính tổng doanh thu từ các cuộc hẹn
    const revenue = appointments.reduce(
      (total, appointment) => total + appointment.amount,
      0
    );

    res.status(200).json({ success: true, revenue });
  } catch (error) {
    next(error);
  }
};

export const getQuarterlyRevenue = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // Ngày đầu năm
    const endOfYear = new Date(currentYear, 11, 31); // Ngày cuối năm

    const appointments = await Appointment.find({
      date: { $gte: startOfYear, $lte: endOfYear },
      isCompleted: true, // Lọc chỉ các cuộc hẹn đã hoàn thành
    });

    // Khởi tạo một mảng doanh thu cho mỗi quý (quý 1 đến quý 4)
    const quarterlyRevenue = new Array(4).fill(0);

    // Tính toán doanh thu theo từng quý
    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const month = appointmentDate.getMonth(); // Lấy tháng của cuộc hẹn (0-11)

      // Xác định quý dựa trên tháng của cuộc hẹn
      let quarter = Math.floor(month / 3); // 0 -> Quý 1, 1 -> Quý 2, 2 -> Quý 3, 3 -> Quý 4
      quarterlyRevenue[quarter] += appointment.amount; // Cộng dồn doanh thu cho quý tương ứng
    });

    res.status(200).json({
      success: true,
      quarterlyRevenue,
    });
  } catch (error) {
    next(error);
  }
};
