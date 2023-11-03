import client from "../context/MqttConnection.js";
import { getTime } from "../helper.js/GetTime.js";
import { DataModel } from "../models/Data.js";

export const saveData = () => {
    client.subscribe("sensor_data");
    client.on("message", async (topic,m) => {
        if(topic == "sensor_data") {
          
            const data = m.toString().split(",")
            const newData = new DataModel({
                temp: data[1].split(":")[1],
                humi: data[0].split(":")[1],
                light: data[2].split(":")[1],
                gas: data[3].split(":")[1],
                createdAt: getTime('Asia/Ho_Chi_Minh'),
            })
    
            await newData.save()
        }
    })
}

export const deviceAutoStatus = () => {
    client.subscribe("device_auto");
}


export const devicesAction = async (action) => {
    client.subscribe("devices_status");
    client.publish("action_button", action)

    let message = new Promise((resolve, reject) => {
        client.on("message", (topic, msg) => {
            if(topic == "devices_status"){
                let message = msg.toString();
                resolve(message);
            }
        });
    });
    
    return await message;
   
}