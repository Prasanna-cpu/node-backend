
import {Router} from "express";
import AuthController from "../controller/AuthController.js";
import {authMiddleware} from "../middleware/Authenticate.js";
import ProfileController from "../controller/ProfileController.js";
import NewsController from "../controller/NewsController.js";

const router = Router();



router.post("/register/",AuthController.register)
router.post("/login/",AuthController.login)


router.get("/profile",authMiddleware,ProfileController.index)
router.put("/profile/:id",ProfileController.update)


router.get("/news",NewsController.index)
router.post("/news",authMiddleware,NewsController.store)
router.get("/news/:id",NewsController.show)
router.put("/news/:id",NewsController.update)
router.delete("/news/:id",NewsController.delete)

export default router