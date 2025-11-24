import jwt from "jsonwebtoken";
const SECRET = "_AQPsssHV56kF07ImQL9DPEj5UzCYuLG8BbSAmedv74gLPueV9abm51Ca18rIGJC";

export const verifyToken=async(token)=>{
    console.log("TOKEN", token);
    if(!token){
        return false;
    }

    try {
        jwt.verify(token,SECRET);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const decodeToken=(token)=>{
    if(!token){
        return null
    }
    try {
        const decode= jwt.verify(token,SECRET);
        return decode;
        
    } catch (error) {
        console.log(error);
        return null
    }
}