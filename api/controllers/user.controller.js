import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({
        message: 'api route is working',
    });
};

export const updateUser = async ( req, res, next ) => {
    const user = await User.findOne({_id:req.user.id});
    if(user.role !== "admin" && req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account!"))
    try {
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, {new:true})
        const {passowrd,  ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
};

export const deleteUser = async (req, res, next) => {
    const user = await User.findOne({_id:req.user.id});
    if(user.role !== "admin" && req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account!"))
    try {
        await User.findByIdAndDelete(req.params.id)
        if(req.user.id === req.params.id && user.role !== "admin" ){
            res.clearCookie('access_token');
        }
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error);
    }
};

export const readUser = async (req, res, next) => {
    const user = await User.findOne({_id:req.id});
    if(!user){
        try {
            const users = await User.find({});
            res.status(200).json({users: users})
        } catch (error) {
            next(error);
        }  
    } else {
        try {
            res.status(200).json({users: user})   
        } catch (error) {
            next(error);
        }
    }
}