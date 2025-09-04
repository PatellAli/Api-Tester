import mongoose from "mongoose";
import { ReqLog } from "../models/ReqLog.model.js";
import Folder from "../models/FolderSchema.model.js";

export const getReq = async (req, res) => {
  const userid = req.userId;
  //console.log(userid);

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

export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    //console.log("Folder", userId);

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
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId); // make consistent

    const folders = await Folder.find({ userId }).lean();
    if (!folders.length) {
      return res.status(200).json([]);
    }

    const folderIds = folders.map((f) => f._id);

    const requests = await ReqLog.find({
      folder: { $in: folderIds },
    }).lean();

    const foldersWithRequests = folders.map((folder) => ({
      ...folder,
      requests: requests.filter(
        (r) => r.folder?.toString() === folder._id.toString()
      ),
    }));

    res.status(200).json(foldersWithRequests);
  } catch (error) {
    console.error("ERROR getting folder with request:", error);
    res
      .status(500)
      .json({ success: false, message: "ERROR in getting folders" });
  }
};

export const createReqName = async (req, res) => {
  const { name, folderId } = req.body;
  console.log(folderId);

  try {
    const newLog = new ReqLog({
      name,
      method: "GET",
      url: "",
      headers: {},
      body: {},
      response: {},
      folder: folderId ? new mongoose.Types.ObjectId(folderId) : null,
      createdBy: req.user.userId, // Save folder if given, else null
    });

    const savedLog = await newLog.save();

    //  If folder is provided, add request ID to that folder's requests[]
    if (folderId) {
      await Folder.findByIdAndUpdate(folderId, {
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

export const deleteReq = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReq = await ReqLog.findByIdAndDelete(id);
    console.log("in controller");

    if (!deletedReq) {
      return res
        .status(404)
        .json({ success: false, messsage: "Request not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Request Deleted Successfully" });
  } catch (error) {
    console.error("req delete error: ", error);
    res.status(500).json({ success: false, message: "SERVER ERROR " });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;

    // delete all requests inside this folder first
    await ReqLog.deleteMany({ folderId: id });

    // delete the folder
    const deletedFolder = await Folder.findByIdAndDelete(id);

    if (!deletedFolder) {
      return res
        .status(404)
        .json({ success: false, message: "Folder not found" });
    }

    res.status(200).json({
      success: true,
      message: "Folder and its requests deleted successfully",
    });
  } catch (error) {
    console.error("Folder delete error: ", error);
    res.status(500).json({ success: false, message: "SERVER ERROR" });
  }
};

export const updatedFolderName = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { name } = req.body;
    console.log(folderId, name);

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }
    const updatedFolder = await Folder.findByIdAndUpdate(
      folderId,
      { $set: { name } },
      { new: true }
    );
    if (!updatedFolder) {
      return res
        .status(404)
        .json({ success: false, message: "Folder not found" });
    }
    res.status(200).json({
      success: true,
      message: "Name updated successfully",
      folder: updatedFolder,
    });
  } catch (error) {
    console.error("Update name error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error updating name" });
  }
};
export const updatedRequestName = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { name } = req.body;
    console.log(requestId, name);
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }
    const updatedRequest = await ReqLog.findByIdAndUpdate(
      requestId,
      { name },
      { new: true }
    );

    if (!updatedRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Request name updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Update name error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error updating name" });
  }
};
