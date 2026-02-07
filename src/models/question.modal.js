import mongoose, {Schema} from "mongoose";
import { v4 as uuidv4 } from "uuid";

const questionSchema = new Schema({
  day :{
    type: Number,
    required: true,           
  },
  id: {
    type: Number,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  toughness: {
    type: String,
    required: true,
    trim: true,
  },
  questionImage: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
},
 {
        timestamps: true
    }
);


export const Question = mongoose.model("Question", questionSchema);