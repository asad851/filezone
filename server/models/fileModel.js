import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String }, // e.g. pdf, jpg, png, etc.
  size: { type: Number }, // in bytes
  url: { type: String, required: true }, // cloud storage URL (S3 / Cloudinary / etc.)
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  }, // null if in root
  shared: {
    isPublic: { type: Boolean, default: false },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // for private shares
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("File", fileSchema);
