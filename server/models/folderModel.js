import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  }, // for nested folders
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // owner of the folder
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Folder", folderSchema);
