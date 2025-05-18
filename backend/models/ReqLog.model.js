import mongoose from "mongoose";

const ReqLogSchema = new mongoose.Schema({
    method: String,
    url: String,
    headers: Object,
    body: mongoose.Schema.Types.Mixed,
    response: {
        status: Number,
        time: Number,
        headers: Object,
        body: mongoose.Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const ReqLog = mongoose.model('ReqLog', ReqLogSchema);
