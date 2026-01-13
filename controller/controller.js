import { addMail, getSecret } from "../services/mailService.js"
import { addPassword, decreaseTimes, getTimes } from "../services/passSercive.js"
import { get2faFromSecret } from "../util/2faUtil.js"

const checkPass = async (req, res) => {
    const { password } = req.body
    try {
        const times = await getTimes(password)
        res.status(200).json({ times: times })
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}
const get2Fa = async (req, res) => {
    const { email, password } = req.body
    if (!password || !email) return res.status(401).json({ message: "missing params" })
    try {
        const times = await getTimes(password)
        if (times.length <= 0) return res.status(401).json({ message: "not found" })
        const secret = getSecret(email)
        const token = await get2faFromSecret(secret)
        decreaseTimes(password)
        res.status(200).json({ token: token, times: times - 1 })

    } catch (error) {
        console.log(error);

        res.status(401).json({ message: error.message })
    }
}

const createPassword = async (req, res) => {
    const { password, times } = req.body
    try {
        await addPassword(password, times)
        res.status(200).json({ message: "success" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createMail = async (req, res) => {
    const { email, token, client_id, secret } = req.body
    try {
        await addMail(email, token, client_id, secret)
        res.status(200).json({ message: "success" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export { checkPass, get2Fa, createPassword, createMail };