const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    refreshTokenHash: {
      type: String,
      required:[true,"Refresh token hash is required"],
    },

    isRevoked: {
      type: Boolean,
      default: false,
    },
    ipAddress: { type: String, required: [true, "IP address is required"] },
    userAgent: {
      type: String,
      required: [true, "User agent is required"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("session", sessionSchema);
