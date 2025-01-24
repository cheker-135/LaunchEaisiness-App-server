import { Picture } from "../models/picture.model.js";
import { User } from "../models/user.model.js";
import { PDF } from "../models/pdf.model.js";

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Single file upload controller
export const uploadSingleFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message:
          "No file uploaded or file type not allowed. Please upload only JPEG, PNG, or GIF.",
      });
    }

    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const newPicture = new Picture({
      path: fileUrl,
      userId: req.userId,
    });

    await newPicture.save();

    await User.findByIdAndUpdate(req.userId, {
      picture: newPicture,
    });

    res.json({
      message: "File uploaded successfully",
      picture: newPicture,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const userId = req.userId;

    const uploadedFiles = await Promise.all(
      req.files.pdf.map(async (file) => {
        const newPDF = new PDF({
          path: `http://localhost:5000/uploads/${file.filename}`,
          userId: userId,
        });
        return await newPDF.save();
      })
    );

    res.status(200).json({
      message: "Files uploaded successfully!",
      files: uploadedFiles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading files", error });
  }
};
export const deletePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const pdf = await PDF.findByIdAndDelete(id);
    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Remove the PDF file from the file system
    const filePath = path.join(
      __dirname,
      "../uploads",
      path.basename(pdf.path)
    );

    try {
      await fs.unlink(filePath);
      console.log("File deleted successfully");
    } catch (err) {
      console.error("Failed to delete file:", err);
      return res
        .status(500)
        .json({ message: "Failed to delete file from server" });
    }

    // Remove the PDF reference from the user document
    await User.findByIdAndUpdate(req.userId, {
      $pull: { PDF: id },
    });

    res.json({ message: "PDF deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
