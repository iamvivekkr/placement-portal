const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");

const pipeline = promisify(require("stream").pipeline);

const router = express.Router();

const upload = multer();

const path = require("path");

// Resolve the absolute path to the public folder
const publicPath = path.join(__dirname, "..", "public");
console.log("publicPath:", publicPath);

router.post("/resume", upload.single("file"), (req, res) => {
  const { file } = req;
  if (file.detectedFileExtension !== ".pdf") {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${uuidv4()}${file.detectedFileExtension}`;
    const filePath = path.join(publicPath, "resume", filename);
    console.log("filePath:", filePath);

    pipeline(file.stream, fs.createWriteStream(filePath))
      .then(() => {
        res.send({
          message: "File uploaded successfully",
          url: `/host/resume/${filename}`,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          message: "Error while uploading",
        });
      });
  }
});

router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (
    file.detectedFileExtension !== ".jpg" &&
    file.detectedFileExtension !== ".png"
  ) {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${uuidv4()}${file.detectedFileExtension}`;
    const filePath = path.join(publicPath, "profile", filename);
    console.log("filePath:", filePath);

    pipeline(file.stream, fs.createWriteStream(filePath))
      .then(() => {
        res.send({
          message: "Profile image uploaded successfully",
          url: `/host/profile/${filename}`,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          message: "Error while uploading",
        });
      });
  }
});

module.exports = router;


