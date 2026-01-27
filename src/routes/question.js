import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {questionController,getQuestionByID , getAllQuestions} from "../controllers/question.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/upload").post(
    verifyJWT,
    upload.fields([             
        { name: "questionImage" ,
             maxCount: 1
        },
        { name: "uploadImage" ,
            maxCount: 1
        }
    ]),
    questionController
);


router.route("/:questionID").get(getQuestionByID);

router.route("/v2/all").get(getAllQuestions);      
  

export default router;