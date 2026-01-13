import { getVerificationCode } from "../util/webMailUtil.js";

const getCodeFromEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const code = await getVerificationCode(email);
        res.json({ code });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { getCodeFromEmail };