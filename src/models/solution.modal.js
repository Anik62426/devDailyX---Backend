import mongoose, { Schema } from "mongoose";

const solutionSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    questionID: {
        type:Number,
        required: true,
    },
    solutionImage: {
        type: String,
        required: true,
      },
      solutionExplanation: {
        type: String,
    },
    upVote: {
        type: Number,
        default: 0
    },
    voters: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  ],
},
 {
        timestamps: true
    }
);

export const Solution = mongoose.model("Solution", solutionSchema);