import verify from "../middleware/verify.js";
import express from "express";
import { DataModel } from "../models/Data.js";


const router = express.Router();



router.post("/data", async (req,res) => {
    try {
        const page = req.body.page
        

        const data = req.body.sortOption !== 0
        ?
        await DataModel.aggregate(
            [
                {$sort : {[req.body.sortItem] : req.body.sortOption}}
            ]
        )
        :
        ((await DataModel.find({})).reverse())
      
        const pageCount = Math.floor(data.length/6) + 1
      
        const dataResponded = data.slice((page-1)*6,page*6)
        
        return res.status(200).json({pageCount, dataResponded})
    } catch (error) {
        console.log(error);
    }
})



router.post("/search-data", async (req,res) => {
    try {
        const page = req.body.page
        const query = req.body.query
        let queryArray = Object.entries (query);

        let filter = {};
        queryArray.forEach (([key, value]) => {
            filter[key] = { $all: [value] };
        });

        console.log(filter);
        let data = await DataModel.aggregate ( [
            { $match: filter }
        ]);

        const pageCount = Math.floor(data.length/6) + 1
      
        const dataResponded = data.slice((page-1)*6,page*6)
        
        return res.status(200).json({pageCount, dataResponded})
    } catch (error) {
        console.log(error);
    }
})

router.post("/filter-data", async (req,res) => {
    try {
        const data = await DataModel.aggregate([
            { $match: {} }, 
            { $group: { _id: "$gas", createdAt: { $max: "$createdAt" } } }, 
            { $sort: { _id: -1 } }, 
            { $limit: 5 }, 
          ])
        
        return res.status(200).json(data)
    } catch (error) {
        console.log(error);
    }
})


export default router;

