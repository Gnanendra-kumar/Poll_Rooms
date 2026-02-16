import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import connectDB from "./db.js";
import pollRoutes from "./routes/pollRoutes.js";
import Poll from "./models/Poll.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/polls", pollRoutes);



app.use("/api/auth", authRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", socket => {
  socket.on("vote", async ({ pollId, optionIndex, token }) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const ip = socket.handshake.address;

      // 1️⃣ Check poll exists & not expired
      const poll = await Poll.findById(pollId);
      if (!poll) return;

      if (poll.expiresAt && new Date() > poll.expiresAt) return;

      // 2️⃣ Check duplicate vote (Google + IP)
      const alreadyVoted = poll.voters.some(
        v => v.googleId === decoded.googleId || v.ip === ip
      );
      if (alreadyVoted) return;

      // 3️⃣ ATOMIC UPDATE (NO RACE CONDITIONS)
      const updatedPoll = await Poll.findOneAndUpdate(
        {
          _id: pollId,
          "voters.googleId": { $ne: decoded.googleId },
          "voters.ip": { $ne: ip }
        },
        {
          $inc: { [`options.${optionIndex}.votes`]: 1 },
          $push: { voters: { googleId: decoded.googleId, ip } }
        },
        { new: true }
      );

      if (!updatedPoll) return;

      // 4️⃣ Broadcast updated poll
      io.emit(`poll-${pollId}`, updatedPoll);

    } catch (err) {
      console.error("VOTE ERROR:", err.message);
    }
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);