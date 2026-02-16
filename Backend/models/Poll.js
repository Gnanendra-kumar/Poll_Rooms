import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  question: String,

  options: [
    { text: String, votes: { type: Number, default: 0 } }
  ],

  voters: [
    {
      googleId: String,
      ip: String
    }
  ],

  expiresAt: Date
});

export default mongoose.model("Poll", pollSchema);