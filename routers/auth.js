import express from "express";
import { checkEmail, checkPinCode, createUser, getUsers, login, recoverPassword } from "../controllers/user.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", createUser)
router.post("/check-email", checkEmail);
router.post("/check-pin", checkPinCode);
router.post("/recover-password", recoverPassword);

export default router;
