import express from "express";
import {
  logout,
  updateUser,
  getUsers,
  deleteUser,
  blockUser,
  appointmentsAdmin,
  cancelAppointmentAdmin,
  appointmentComplete,
  getRevenue,
  getQuarterlyRevenue,
  adminDashboard,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/logout", logout);
//----- USERS MANAGEMENT -----//
router.get("/getusers", verifyToken, getUsers);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.put("/block/:userId", verifyToken, blockUser);
//----- APPOINTMENTS MANAGEMENT -----//
router.get("/appointments-admin", verifyToken, appointmentsAdmin);
router.post("/cancel-appointment-admin", verifyToken, cancelAppointmentAdmin);
router.post("/complete-appointment", verifyToken, appointmentComplete);
router.get("/revenue", verifyToken, getRevenue);
router.get('/quarterly-revenue', verifyToken, getQuarterlyRevenue);
//----- DASHBOARD -----//
router.get("/dashboard", verifyToken, adminDashboard);

export default router;
