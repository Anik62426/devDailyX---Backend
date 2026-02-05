import express from "express";
import connectDB from "./db/index.js";
import authRouter from "./routes/auth.js";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
// import bcrypt from "bcryptjs";
import  {User} from "./models/user.modal.js";
import questionRouter from "./routes/question.js";
import solutionRouter from "./routes/solution.route.js";
dotenv.config();

const app = express();
// const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));



app.use(express.json());
app.use(cookieParser());

connectDB()
.then(() => {
  app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
  })
})
.catch((err) => {
  console.log("MONGO db connection failed !!! ", err);
})



app.post("/Signup",async(req,res)=>{
  let check = await User.findOne({email:req.body.email})
  if(check){
    return res.status(400).json({success:false,msg: "user already exist"})
  }
 
  const user = new User({
    email:req.body.email,
    password:req.body.password,
  })
  await user.save();
  const data = {
    user:{
      id:user.id
    }
  }
  const token = jwt.sign(data,'sercet_ecom');
  res.json({success:true,token})
})
app.use("/api/auth", authRouter);
app.use("/api/question", questionRouter);
app.use("/api/solution", solutionRouter);




export default app;
