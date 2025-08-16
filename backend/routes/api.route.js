import express from "express";
import {
  getReq,
  createReq,
  createFolder,
  getFoldersWithRequest,
  createReqName,
  updateReq,
} from "../controllers/api.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getReq);

router.post("/", authenticateToken, createReq);

router.post("/createFolder", authenticateToken, createFolder);

router.get("/getFolders", authenticateToken, getFoldersWithRequest);

router.post("/createReq", authenticateToken, createReqName);

router.patch("/updateReq/:requestId", authenticateToken, updateReq);

export default router;
