const mongoose = require("mongoose");

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Optional, for multi-user apps
    ref: "User"
  },
  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequestLog"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Folder", FolderSchema)