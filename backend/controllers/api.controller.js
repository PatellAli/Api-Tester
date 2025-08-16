import mongoose from "mongoose";
import { ReqLog } from "../models/ReqLog.model.js";
import Folder from "../models/FolderSchema.model.js";

export const getReq = async (req, res) => {
  const userid = req.userId;
  try {
    const log = await ReqLog.find({
      userid,
      $or: [{ folder: { $exists: false } }, { folder: null }],
    }).sort({ createdAt: -1 });
    res.json(log);
  } catch (error) {
    res.status(500).json({ success: false, message: "GET ERROR" });
    console.log("GET ERROR: ", error.message);
  }
};

export const createReq = async (req, res) => {
  try {
    const { method, url, headers, body, response, folder, name } = req.body;

    const newLog = new ReqLog({
      name,
      method,
      url,
      headers,
      body,
      response,
      folder: folder || null, // Save folder if given, else null
    });

    const savedLog = await newLog.save();

    //  If folder is provided, add request ID to that folder's requests[]
    if (folder) {
      await Folder.findByIdAndUpdate(folder, {
        $push: { requests: savedLog._id },
      });
    }

    res
      .status(201)
      .json({ success: true, message: "Saved successfully", log: savedLog });
  } catch (error) {
    console.log("POST ERROR:", error.message);
    res.status(500).json({ success: false, message: "POST ERROR" });
  }
};

export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Folder name is required" });
    }

    const folder = await Folder.create({
      name,
      userId,
      requests: [],
    });

    res.status(201).json({ success: true, messsage: "Folder created", folder });
  } catch (error) {
    console.error("Create Folder ERROR: ", error);
    res
      .status(500)
      .json({ success: false, messgae: "Internal server ERROR: " });
  }
};

export const getFoldersWithRequest = async (req, res) => {
  const userId = req.user.userId;

  try {
    const folders = await Folder.find({ userId }).lean();
    const folderIds = folders.map((f) => f._id);
    const requests = await ReqLog.find({ folder: { $in: folderIds } });

    const foldersWithRequests = folders.map((folder) => ({
      ...folder,
      requests: requests.filter(
        (r) => r.folder?.toString() === folder._id.toString()
      ),
    }));

    res.status(200).json(foldersWithRequests);
  } catch (error) {
    console.error("ERROR getting folder with request: ", error);
    res
      .status(500)
      .json({ success: false, message: "ERROR in getting folders" });
  }
};

export const createReqName = async (req, res) => {
  const { name, folderId } = req.body;
  try {
    const newLog = new ReqLog({
      name,
      method: "GET",
      url: "",
      headers: {},
      body: {},
      response: {},
      folder: folderId || null, // Save folder if given, else null
    });

    const savedLog = await newLog.save();

    //  If folder is provided, add request ID to that folder's requests[]
    if (folderId) {
      await Folder.findByIdAndUpdate(folder, {
        $push: { requests: savedLog._id },
      });
    }

    res
      .status(201)
      .json({ success: true, message: "Saved successfully", log: savedLog });
  } catch (error) {
    console.log("POST ERROR:", error.message);
    res.status(500).json({ success: false, message: "POST ERROR" });
  }
};

export const updateReq = async (req, res) => {
  try {
    const { requestId } = req.params;
    const updatedData = req.body; // { method, url, headers, body, etc. }

    const updatedRequest = await ReqLog.findByIdAndUpdate(
      requestId,
      { $set: updatedData },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update request" });
  }
};
