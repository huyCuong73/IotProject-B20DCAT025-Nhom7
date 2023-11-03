import mongoose from "mongoose";

const schema = new mongoose.Schema({
    device: {type: String, required: true, },
    status: {type: String, required: true},
    
    createdAt : {type: String, required: true},
})

export const ActionsModel = mongoose.model('actions', schema)