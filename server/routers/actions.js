import verify from "../middleware/verify.js";
import express from "express";
import { ActionsModel } from "../models/Actions.js";
import { devicesAction } from "../services/mqtt.js";
import { getTime } from "../helper.js/GetTime.js";


const router = express.Router();

router.post("/control-device", async (req,res) => {
    try {
        const message = await devicesAction(req.body.action)

        const devicesState = message.split(",")
      
        const newDevicesState = new ActionsModel({
            device: devicesState[0].split(":")[1],
            status: devicesState[1].split(":")[1],
            createdAt: getTime('Asia/Ho_Chi_Minh'),
        })
        
        
        const actions = await newDevicesState.save()
 
        return res.status(200).json(actions)
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)

    }
})


router.post("/actions", async (req,res) => {
    try {
        const page = req.body.page
        const actions = ((await ActionsModel.find({})).reverse())
      
        const pageCount = Math.floor(actions.length/6) + 1
      
        const actionsResponded = actions.slice((page-1)*6,page*6)

        return res.status(200).json({pageCount, actionsResponded})
    } catch (error) {
        console.log(error);
    }
})

export default router;

