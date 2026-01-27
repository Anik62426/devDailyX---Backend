import { Question } from "../models/question.modal.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v4 as uuidv4 } from "uuid";

export const questionController = async (req, res) => {
    try {
        const { Name, toughness, day } = req.body;



        const usersID = req.cookies.userId;


        if (!req.files.questionImage[0] || !req.files.uploadImage[0]) {
            return res.status(400).json({ message: "Both image files must be provided" });
        }

        const questionImage = req.files?.questionImage[0]?.path;
        const uploadImage = req.files?.uploadImage[0]?.path;




        const questionImageUrl = await uploadOnCloudinary(questionImage);
        const uploadImageUrl = await uploadOnCloudinary(uploadImage);



        const question = await Question.create({
            id: 1 + Math.floor(Math.random() * 1000),
            Name: Name,
            toughness: toughness,
            questionImage: questionImageUrl.url,
            uploadImage: uploadImageUrl.url,
            postedBy: usersID,
            day: day,
        });

        return res.status(200).json({ message: "Question uploaded successfully", question });

    } catch (error) {
        console.error("Error in questionController:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message || "Unknown error"
        });
    }
}

export const getQuestionByID = async (req, res) => {
    try {
        const { questionID } = req.params;

        const question = await Question.findOne({ id: questionID });

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {  
        console.error("Error in getAllQuestions:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message || "Unknown error"
        });


    }
}

