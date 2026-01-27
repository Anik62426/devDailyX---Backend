
import {Solution} from "../models/solution.modal.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const updateUpvote = async(req,res)=>{
  try {
    const { questionID } = req.params;
    const userId = req.cookies.userId; 
    const {SolutionUser} = req.body;       

    const solution = await Solution.findOne({questionID: questionID, userID: SolutionUser});
    if (!solution) return res.status(404).json({ message: "Solution not found" });

    const alreadyVoted = solution.voters.includes(userId);

    if (alreadyVoted) {
      solution.voters.pull(userId);
      solution.upVote -= 1;
    } else {
      solution.voters.push(userId);
      solution.upVote += 1;
    }

    await solution.save();

    res.status(200).json({
      message: alreadyVoted ? "Upvote removed" : "Upvoted",
      upVote: solution.upVote,
      voted: !alreadyVoted,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export const userAlreadyUploaded = async (req, res) => {
  try {
    const { questionID } = req.params;
    const usersID = req.cookies.userId;

    const userAlreadyUploaded = await Solution.findOne({userID: usersID, questionID: questionID});
    if(userAlreadyUploaded){
      return res.status(200).json({ message: "already" });
    }
      return res.status(200).json({ message: "not uploaded" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export const solutionContoller = async (req, res) => {
  try {
    const { questionID,solutionExplanation } = req.body;
    const usersID = req.cookies.userId;

    const userAlreadyUploaded = await Solution.findOne({userID: usersID, questionID: questionID});
    if(userAlreadyUploaded){
      return res.status(400).json({ message: "already" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file must be provided" });
    }

    const solutionImage = req.file.path;
    console.log("solutionImage:", solutionImage);

    const uploadImageUrl = await uploadOnCloudinary(solutionImage);

    const solution = new Solution({
      userID: usersID,
      questionID,
      solutionImage: uploadImageUrl.url,
      solutionExplanation,
      upVote: 0
    });

    await solution.save();

    return res.status(200).json({ message: "Uploaded Successfully", usersID });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSolutionsByQuestionID = async (req, res) => { 
  try {
    const { questionID } = req.params;  
    const solutions = await Solution.find({ questionID }).populate('userID','admin email');
    return res.status(200).json(solutions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }

}
