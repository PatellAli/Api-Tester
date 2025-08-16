import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequestLog",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Folder = mongoose.model("Folder", FolderSchema);
export default Folder;
