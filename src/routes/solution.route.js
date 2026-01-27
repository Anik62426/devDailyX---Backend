import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {solutionContoller,userAlreadyUploaded,getSolutionsByQuestionID,updateUpvote} from "../controllers/solution.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/upload").post(
    verifyJWT,
    upload.single("solutionImage"), 
    solutionContoller
);

router.route("/check/:questionID").get(
    verifyJWT,
    userAlreadyUploaded
);

router.route("/:questionID").get(getSolutionsByQuestionID)

router.route("/updateUpvote/:questionID").put(
    verifyJWT,
    updateUpvote
);

export default router;