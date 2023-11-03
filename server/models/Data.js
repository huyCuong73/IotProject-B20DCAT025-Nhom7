import mongoose from "mongoose";

const schema = new mongoose.Schema({
    temp: {type: String, required: true, },
    humi: {type: String, required: true},
    light: {type: String, require: true},
    gas: {type: String, required: true},
    createdAt : {type: String, required: true},
})

export const DataModel = mongoose.model('data', schema)