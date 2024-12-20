import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  deleteservice,
  getservices,
  updateservice,
} from "../controllers/service.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getservices", getservices);
router.delete("/deleteservice/:serviceId/:userId", verifyToken, deleteservice);
router.put("/updateservice/:serviceId/:userId", verifyToken, updateservice);

export default router;
