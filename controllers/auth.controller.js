import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../mailtrap/emails.js";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    if (!firstname || !lastname || !email || !password) {
      throw new Error("All fields are required");
    }
    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    generateToken(res, user._id);

    // await sendVerificationEmail(user.email, verificationToken);
    await user.save();

    res.status(201).json({
      success: true,
      message: "user created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired verification code",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error verification email", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    generateToken(res, user._id);
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hours

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "password reset successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    console.log(error.message);
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("picture")
      .populate("PDF");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log(error.message);
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const {
    firstname,
    lastname,
    email,
    nationality,
    foreign_resident,
    residence_country,
    civility,
    birth_date,
    birth_place,
    level_education,
    diplome,
    quality,
    identity_type,
    address,
    ville,
    code_postal,
    tel,
    fax,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use by another account.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstname,
        lastname,
        email,

        nationality,
        foreign_resident,
        residence_country,
        civility,
        birth_date,
        birth_place,
        level_education,
        diplome,
        quality,
        identity_type,
        address,
        ville,
        code_postal,
        tel,
        fax,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log(error.message);
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "user not found" });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId)
      .select("-password")
      .populate("picture")
      .populate("PDF");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log(error.message);
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("picture")
      .populate("PDF");

    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log(error.message);
  }
};
