import { userModel } from '../models/user.model.js';

import { bookingModel } from '../models/booking.model.js';
import { decode } from 'jsonwebtoken';
import jwt from 'jsonwebtoken'


const signup = async (req, res, next) => {
    try {
        const user = req.body;
        if (!user.name || !user.email || !user.password || !user.rollno || !user.phoneno) {
            return res.status(400).send('Insufficient details');
        }
        const final_user = {
            name: user.name,
            email: user.email,
            rollno: user.rollno,
            password: user.password,
            phoneno: user.phoneno,
            isAdmin: user.isAdmin
        }
        const email = user.email;
        const user_exist = await userModel.findOne({
            $or: [{ email }]
        })
        if (user_exist) {
            res.status(401).send({ message: 'User with this email already exist', alert: false });
        }
        const save_status = await userModel.create(final_user);
        res.status(200).send({ message: 'User Registered Succesfully', alert: true });
    } catch (error) {
        res.status(401).send({ data: `${error.message}`, alert: false });
    }
};

const newToken = async (req, res, next) => {
    try {
        const refreshToken = req.body;
        if (!refreshToken) {
            return res.status(400).send({ message: "Invalid Token", alert: false });
        }
        const decodedtoken = await jwt.verify(refreshToken, processe.env.REFRESH_TOKEN_EXPIRY);
        if (!decodedtoken) {
            return res.status(400).send({ message: "Unauthorised Request", alert: false });
        }
        const user = await userModel.findById(decodedtoken._id);
        if (!user) {
            return res.status(400).send({ message: "user doesn't exist", alert: false });
        }
        const newaccessToken = user.generateAccessToken();
        return res.status(200)
            .clearCookie("accessToken", options)
            .cookie("accessToken", newaccessToken, options)
            .json(
                {
                    data: { newaccessToken, refreshToken },
                    message: "Log in Successful",
                    alert: true
                }
            )
    } catch (error) {
        return res.status(400).send({ message:`${error.message}`, alert: false });
    }

}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!password && !email) {
            return res.status(400).send({ message: 'email or password is required', alert: false });
        }
        const user = await userModel.findOne({
            $or: [{ email }]
        })
        if (!user) {
            return res.status(404).send({ message: 'user doesnot exist', alert: false });
        }
        if (user.refreshToken != "") {
            return res.status(404).send({ message: 'user already logged in', alert: false });
        }
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid user Credentials', alert: false });
        }
        const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);
        const loggedInUser = await userModel.findById(user._id).select("-password");
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 600000 // 10 minutes
        };
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                {
                    data: { user: loggedInUser, accessToken, refreshToken,expiry : 600000 },
                    message: "Log in Successful",
                    alert: true
                }
            )
    } catch (error) {
        res.status(401).send({ message: `${error.message}`, alert: false });
    }
};


const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(401).send({ data: `user not found`, alert: false });
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        const response = await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        res.status(401).send({ data: `Something went wrong while generating tokens`, alert: false });
    }
}
const logout = async (req, res, next) => {
    try {
        const user = req.body;
        await userModel.findByIdAndUpdate(user._id,
            {
                $set: {
                    refreshToken: ""
                }
            },
            {
                new: true
            }
        );
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .send({ message: `Logged out Successfully`, alert: true });
    } catch (error) {
        res.status(401).send({ message: `${error.message}`, alert: false });
    }
}


const userpendingorders = async (req, res, next) => {
    try {
        /**  pending - false , inuse - true */
        const user = req.body;
        const data = await bookingModel.find({
            rollno: user.rollno,
            status: "false"
        });
        res.status(200).send({ data: data, alert: true });
    } catch (error) {
        res.status(401).send({ data: `${error.message}`, alert: false });
    }
}
const adminpendingorders = async (req, res, next) => {
    try {
        
        /**  pending - false , inuse - true */
        const details= req.body;
        const data = await bookingModel.find({
            status: "false",
            Date: details.date
        });
        res.status(200).send({ data: data, alert: true });
    } catch (error) {
        res.status(401).send({ data: `${error.message}`, alert: false });
    }
}
const adminissuedorders = async (req, res, next) => {
    try {
        /**  pending - false , inuse - true */
        const details=req.body

        const data = await bookingModel.find({
            status: "true",
            Date: details.date
        });
        res.status(200).send({ data: data, alert: true });
    } catch (error) {
        res.status(401).send({ data: `${error.message}`, alert: false });
    }
}

export { signup, login, logout, userpendingorders, adminpendingorders, adminissuedorders, newToken };