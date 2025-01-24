import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const date = new Date();
    const formattedDate = `${
      date.getMonth() + 1
    }-${date.getDate()}-${date.getFullYear()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${
      file.originalname
    }`;
    cb(null, `${formattedDate}`);
  },
});

export const upload = multer({ storage });
