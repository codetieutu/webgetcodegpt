import connection from "./connection.js";

const checkAdobeMail = (req, res) => {
    const { email } = req.body;
    const query = 'SELECT * FROM adobe_users WHERE email = ?';
}