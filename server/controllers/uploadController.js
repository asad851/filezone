import { bucket } from "../firebase.js";

export const uploadFileController = async (req, res) => {
  try {
    const files = req.body;
    console.log(files);

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: "files[] array is required" });
    }

    const urls = await Promise.all(
      files.map(async ({ name, type }) => {
        const filePath = `uploads/${req.user.id}/${name}`;
        const file = bucket.file(filePath);

        const [uploadUrl] = await file.getSignedUrl({
          version: "v4",
          action: "write",
          expires: Date.now() + 15 * 60 * 1000,
          contentType: type,
        });

        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(filePath)}?alt=media`;

        return {
          name,
          uploadUrl,
          publicUrl,
        };
      })
    );

    res.json({ uploadUrls: urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate signed URLs" });
  }
};
