import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const jwtToken = jwt.sign(
      {
        googleId: payload.sub,
        email: payload.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ jwtToken });
  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

export default router;