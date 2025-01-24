import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    httpOnly: true, //more secure
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: "strict", //CSRF
  });
  return token;
};
