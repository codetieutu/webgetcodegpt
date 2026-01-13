import connection from "./connection.js";

const checkMail = async (req, res) => {
    const { mail } = req.body;
    try {
        const query = "SELECT count (*) as count FROM Mail WHERE email = ?";
        const [rows] = await connection.query(query, [mail]);

        if (rows[0].count === 0) {
            res.status(200).json({ exists: false });
        } else {
            res.status(200).json({ exists: true });
        }
    } catch (error) {
        res.status(500).json({ error: "Database Query Error: " + error.message });
    }
}
const getSecret = async (mail) => {
    try {
        const query = "SELECT secret FROM Mail WHERE email = ?";
        const [rows] = await connection.query(query, [mail]);
        if (rows.length === 0) throw new Error("not found");
        return rows[0].secret;
    }
    catch (error) {
        throw new Error("Database Query Error: " + error.message);
    }
}

const addMail = async (mail, token, client_id, secret) => {
    try {
        const query = "INSERT IGNORE INTO Mail (email, token, client_id, secret, time) values (?,?,?,?, Now());";
        const [result] = await connection.query(query, [mail, token, client_id, secret]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error("Database Query Error: " + error.message);
    }
}
// const getMail = async (mail) => {
//     try {
//         const query = "SELECT * FROM Mail WHERE email = ?";
//         const results = await connection.query(query, [mail]);

//         if (rows.length === 0) {
//             throw new Error("No data found for the provided email");
//         }

//         return results;
//         // {
//         //     mail: rows[0].mail,
//         //     token: rows[0].token,
//         //     client_id: rows[0].client_id
//         // };

//     } catch (error) {
//         console.error("Database Query Error:", error);
//         return null;
//     }
// }


// const addMail = async (mail, token, client_id) => {
//     try {
//         const query = "INSERT IGNORE INTO Mail (mail, token, client_id) values (?,?,?);";
//         const [result] = await connection.query(query, [mail, token, client_id]);
//         return result.affectedRows > 0;

//     } catch (error) {
//         console.error("Database Query Error:", error.message);
//         return false;
//     }
// }

//

export { checkMail, getSecret, addMail };