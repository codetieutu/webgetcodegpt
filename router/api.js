import express from 'express';
import { checkMail } from '../services/mailService.js';
import { getCodeFromEmail } from '../controller/webmailController.js';
import { checkPass, createMail, createPassword, get2Fa } from '../controller/controller.js';
const router = express.Router();

// router.post("/check-email", checkMail);//adobe mail check
router.post("/check-email", checkMail);//chatgpt mail check
router.post("/verify-email", getCodeFromEmail);//adobe mail get code
router.post("/verify-password", checkPass)
router.post("/2fa", get2Fa);//gpt 2fa secret
router.post("/admin/verify", (req, res) => {
    const { password } = req.body;
    if (password === "codetieutu") {
        res.status(200).json({ login: true });
    } else {
        res.status(401).json({ login: false });
    }
});
router.post("/admin/password", createPassword)
router.post("/admin/mail", createMail)

export default router;