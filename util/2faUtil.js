import axios from "axios";
import e from "express";

const get2faFromSecret = async (secret) => {
    try {
        const response = await axios.get(`https://2fa.live/tok/${secret}`);
        const { token } = response.data;
        if (!token) throw new Error("token not found");
        return token;
    } catch (error) {
        throw new Error(error.message);
    }

}

export {
    get2faFromSecret
}