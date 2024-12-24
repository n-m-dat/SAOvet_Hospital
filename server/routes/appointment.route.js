import express from "express";
import {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  deleteAppointment,
} from "../controllers/appointment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/book-appointment", bookAppointment);
router.get("/get-appointments", verifyToken, getAppointments);
router.post("/cancel-appointment", verifyToken, cancelAppointment);
router.delete("/delete-appointment", verifyToken, deleteAppointment);

export default router;
