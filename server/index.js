import express from 'express'
import http from 'http'
import bodyParser from 'body-parser';
import cors from 'cors'
import mongoose from 'mongoose';
import route from './routers/route.js';
import dotenv from "dotenv"
import multer from 'multer'
import mqtt from "mqtt"
import { DataModel } from './models/Data.js';
import { deviceAutoStatus, saveData } from './services/mqtt.js';
import {Server} from 'socket.io'
import client from './context/MqttConnection.js';
import { getTime } from './helper.js/GetTime.js';
import { ActionsModel } from './models/Actions.js';

dotenv.config();

const app = express();
const PORT = 3333
const URI = process.env.URI     


app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({extended: true, limit : '30mb'}));

app.use(cors());

route(app)
saveData()
deviceAutoStatus()

let onlineUsers = []


mongoose.set('strictQuery', true);

console.log(getTime('Asia/Ho_Chi_Minh'));


mongoose.connect(URI,{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {

	const server = app.listen(PORT, () => {console.log(`server is running on port ${PORT}`)})
	const io = new Server(server, {
		cors: {
		  origin: '*',
		}
	});

	io.on("connection", (socket) => {

		client.on("message", async (topic,m) => {
			
			if(topic == "sensor_data") {
			  
				const data = m.toString().split(",")
				socket.emit("data",data)
			}

			if(topic == "device_auto") {
				
				socket.emit("device_auto",m.toString())
			}
		})

	})
	

})
.catch((err) => {
	console.log('err',err);
})








