import express from "express";
import connectDB from "./db/index.js";
import authRouter from "./routes/auth.js";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import  {User} from "./models/user.modal.js";
import questionRouter from "./routes/question.js";
import solutionRouter from "./routes/solution.route.js";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// const PORT = process.env.PORT || 3000;
// app.use(cookieParser());

// app.get('/', function (req, res) {
//   console.log(req.cookies?.userId);  
// })
 

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
    return res.status(400).json({success:false,message: "user already exist"})
  }
 
  const user = new User({
    email:req.body.email,
    password:req.body.password,
  })
  await user.save();
  // const data = {
  //   user:{
  //     id:user.id
  //   }
  // }

   const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        // { expiresIn: "1h" }
      );

  // const token = jwt.sign(data,'sercet_ecom');

  const cookieOptions = {
      httpOnly: true,
      secure: true,        
      sameSite: "none",  
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("userId", user._id.toString(), cookieOptions);

  return res.json({
      message: "Signup successful",
      token,
      user: { id: user._id, email: user.email, admin:user.admin },
    });
})

app.get("/logout",async(req,res)=>{
  res.clearCookie("userId", {
    httpOnly: true,
    secure: true,       
    sameSite: "none",   
    path: "/",
  });
  res.json({message: " Logout clearly"})
})

app.use("/api/auth", authRouter);
app.use("/api/question", questionRouter);
app.use("/api/solution", solutionRouter);




export default app;
