import User from "../models/user.model.js";
import Service from "../models/service.model.js";
import Appointment from "../models/appointment.model.js";

export const bookAppointment = async (req, res, next) => {
  try {
    const { userId, serviceId, slotDate, slotTime } = req.body;

    const serviceData = await Service.findById(serviceId).select("-password");

    let slots_booked = serviceData.slots_booked;

    // Checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await User.findById(userId).select("-password");

    delete serviceData.slots_booked;

    const appointmentData = {
      userId,
      serviceId,
      userData,
      serviceData,
      amount: serviceData.fee,
      slotDate,
      slotTime,
      date: Date.now(),
    };

    const newAppointment = new Appointment(appointmentData);
    await newAppointment.save();

    // Save new slots data in serviceData
    await Service.findByIdAndUpdate(serviceId, { slots_booked });

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const appointments = await Appointment.find({ userId });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { appointmentId } = req.body;

    const appointmentData = await Appointment.findById(appointmentId);

    // xác thực người dùng để hủy
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized Action" });
    }

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

export const deleteAppointment = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { appointmentId } = req.body;

    const appointmentData = await Appointment.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Cuộc hẹn không tồn tại" });
    }

    // Xác thực người dùng để xóa
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized Action" });
    }

    // Lưu ID dịch vụ để cập nhật lại slot nếu cần
    const { serviceId, slotDate, slotTime } = appointmentData;

    // Xóa cuộc hẹn
    await Appointment.findByIdAndDelete(appointmentId);

    // Cập nhật lại slot cho dịch vụ
    const serviceData = await Service.findById(serviceId);
    if (serviceData) {
      let slots_booked = serviceData.slots_booked;

      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(
          (e) => e !== slotTime
        );
      }

      await Service.findByIdAndUpdate(serviceId, { slots_booked });
    }

    res.status(200).json({ success: true, message: "Cuộc hẹn đã được xóa" });
  } catch (error) {
    next(error);
  }
};
