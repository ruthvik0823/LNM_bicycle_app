import { Router } from "express";
import { login,signup,logout,userpendingorders, adminpendingorders,adminissuedorders,newToken } from "../controllers/user.controller.js";
import { AdminverifyJwt } from '../Middleware/AdminauthMiddleware.js';
import { verifyJwt } from '../Middleware/auth.middleware.js';


const userRouter=Router();
userRouter.post('/logout',logout);
userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.post('/newToken',newToken)
userRouter.post('/userBookings',userpendingorders)
userRouter.post('/adminDashboardpending',adminpendingorders)
userRouter.post('/adminDashboardissued',adminissuedorders)

export default userRouter;