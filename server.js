import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import uploadRoutes from "./routes/upload.route.js";
import authRoutes from "./routes/auth.route.js";
import serviceRoutes from "./routes/service.route.js";
import orderRoutes from "./routes/order.route.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import cors from "cors";
import bcrypt from "bcryptjs";
import { User } from "./models/user.model.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cookieParser());

// Allow specific origins and methods
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed methods
    credentials: true, // Allow cookies or auth headers
  })
);

// Use routes
app.use("/upload", uploadRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/order", orderRoutes);

// Route to serve PDF files with correct Content-Type .
app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "File not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.sendFile(filePath);
  });
});

const createAdminUser = async () => {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin123";

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const adminUser = new User({
        firstname: "Admin",
        lastname: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true,
        PDF: undefined,
      });
      await adminUser.save();
      console.log("Admin user created");
    } else {
      console.log("Admin user already exist");
    }
  } catch (error) {
    console.error("Error creating admin user :", error);
  }
};

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
  createAdminUser();
});
