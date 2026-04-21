export const validateAuth = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password too short" });
  }

  next();
};
