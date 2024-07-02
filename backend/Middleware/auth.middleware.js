import { userModel } from "../models/user.model.js";
import  jwt  from "jsonwebtoken";


const verifyJwt =async (req,res,next)=>{
    try {

        const token=req.cookies?.refreshToken;
        console.log(token);
        if(!token)
        {
            return res.status(400).send({message : "Access denied",alert : false});
        }
        const check=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
        if(!check)
        {
            return res.status(400).send({message : "Invalid token",alert : false});
        }
        const user=await userModel.findById(check._id).select("-password -refreshToken");
        if(!user)
        {
            return res.status(400).send({message : "wrong token",alert : false});
        }
        req.user=user;
        next();
    } catch (error) {
        return res.status(400).send({message : `${error.message}`,alert : false});
    }
};

export {verifyJwt};