
import {Router} from "express";
import AuthController from "../controller/AuthController.js";
import {authMiddleware} from "../middleware/Authenticate.js";
import ProfileController from "../controller/ProfileController.js";

const router = Router();



router.post("/register/",AuthController.register)
router.post("/login/",AuthController.login)


router.get("/profile",authMiddleware,ProfileController.index)
router.put("/profile/:id",ProfileController.update)

export default router