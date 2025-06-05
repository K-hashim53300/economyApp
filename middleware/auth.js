import jwt from 'jsonwebtoken';
import {userModel} from '../DB/models/user.model.js';
export const authMiddleware = ()=>{
    return async(req,res,next)=>{
        try {
            const {authorization} = req.headers;
            if (!authorization) {
                res.status(404).json({status:"fail",message:"no token exist"});
            } else {
                  const token = authorization.split(" ")[1];
           if (authorization.startsWith("Bearer")) {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            if (decoded) {
                const user = await userModel.findById(decoded.id);
                if (user) {
                    req.user=user
                    next();
                } else {
                    res.json({message:"user not found"})
                }
            } else {
                res.json({message:"Invalid token"})
            }
           } else {
            res.json({message:"invalid token"})
           }
       
            }
         
        } catch (error) {
            res.json({error:error.message});
        }
    }
};
export const adminMiddleware = ()=>{
    return(req,res,next)=>{
        if(req.user?.role === "admin"){
            next();
        }else{
            res.status(403).json({ status:"error" ,message: 'Access Denied: Admins Only' });
        }
    }
}