import mongoose from "mongoose";
import {ReqLog} from "../models/ReqLog.model.js"

export const getReq = async (req, res) => {
    try {
        const log = await ReqLog.find().sort({createdAt: -1})
        res.json(log)
    } catch (error) {
        res.status(500).json({success: false, message: 'GET ERROR'})
        console.log("GET ERROR: ", error.message);     
    }
}

export const createReq = async (req,res) => {
    try {
        const log = new ReqLog(req.body);
        await log.save();
        res.status(201).json({success: true, message: 'Saved successfully'})
    }catch(error){
        res.status(500).json({success: false, message: 'POST ERROR'})
        console.log("POST ERROR: ", error.message);
        
    }
}

