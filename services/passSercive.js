import connection from "./connection.js";

const addPassword = async (pass, times) => {
    const query = "INSERT INTO verify (pass, times) values (?,?);";
    try {
        const [result] = await connection.query(query, [pass, parseInt(times, 10)]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

const getTimes = async (pass) => {
    const query = "SELECT times FROM verify WHERE pass = ? limit 1";
    try {
        const [rows] = await connection.query(query, [pass]);

        if (rows.length === 0) throw new Error("Password not found");
        return rows[0].times;
    } catch (error) {
        throw error
    }
}

const decreaseTimes = async (pass) => {
    const query = "UPDATE verify SET times = times - 1 WHERE pass = ?";
    try {
        const [result] = await connection.query(query, [pass]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

export { getTimes, decreaseTimes, addPassword };