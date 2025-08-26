import express from "express";
import {
  getReq,
  createFolder,
  getFoldersWithRequest,
  createReqName,
  updateReq,
  deleteReq,
  deleteFolder,
} from "../controllers/api.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getReq);

router.post("/createFolder", authenticateToken, createFolder);

router.get("/getFolders", authenticateToken, getFoldersWithRequest);

router.post("/createReq", authenticateToken, createReqName);

router.patch("/updateReq/:requestId", authenticateToken, updateReq);

router.delete("/deleteReq/:id", authenticateToken, deleteReq);

router.delete("/deleteFolder/:id", authenticateToken, deleteFolder);

export default router;
