import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true, 
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        admin: {
            type: Boolean,
            default: false,
        },
     },
      {
        timestamps: true
    }
);

export const User = mongoose.model("User", userSchema)