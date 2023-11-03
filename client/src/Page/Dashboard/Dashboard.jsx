import React, { useEffect, useState } from 'react';

import styles from "./dashboard.module.scss"
import Avatar from '../../components/Avatar/Avatar';
import Temp from '../../components/Temp/Temp';
import Humidity from '../../components/Humidity/Humidity';
import Light from '../../components/Light/Light';


import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";
import { Chart, registerables } from 'chart.js';
import { controlDevices } from '../../api/actions';
import {io} from "socket.io-client"
import Gas from '../../components/Gas/Gas';
Chart.register(...registerables);

const Dashboard = () => {

    const [data, setData] = useState([])
    const [chart, setChart] = useState(1)
    const [fanOn, setFanOn] = useState(false)
    const [fanSwitchOn, setSwitchFanOn] = useState(false)
    const [lightOn, setLightOn] = useState(false)
    const [switchLightOn, setSwitchLightOn] = useState(false)

    const [temperature, setTemperature] = useState(0)
    const [humidity, setHumidity] = useState(0);
    const [light, setLight] = useState(0);
    const [gas, setGas] = useState(0);
    const [reload, setReload] = useState(1)

    const socket = io("localhost:3333")

    

	socket.on("data", data => {
        setReload(pre => pre + 1)
        setTemperature(data[1].split(":")[1])
        setHumidity(data[0].split(":")[1])
        setLight(data[2].split(":")[1])
        setGas(data[3].split(":")[1])
        setReload(pre => pre += 1)
	})

    socket.on("device_auto", data => {
        console.log(data);
        if(data.split(",")[0].split(":")[1] === "1"){
            setFanOn(true)
            setSwitchFanOn(true)
        }else{
            setFanOn(false)
            setSwitchFanOn(false)
        }
        
        if(data.split(",")[1].split(":")[1] === "1"){
            setLightOn(true)
            setSwitchLightOn(true)
        }else{
            setLightOn(false);
            setSwitchLightOn(false)
        }
	})
    console.log(switchLightOn);

    const handleDeviceControl = async (payload) => {
        const devicesStatus = await controlDevices(payload)
        
        console.log(devicesStatus);
        if(devicesStatus.data.device === "led"){

            if(devicesStatus.data.status === "on"){
                setLightOn(true)
                setSwitchLightOn(true)
            } else{
                setLightOn(false)
                setSwitchLightOn(false)
            }
        } 


        if(devicesStatus.data.device === "fan"){

            if(devicesStatus.data.status === "on"){
                setFanOn(true)
                setSwitchFanOn(true)
            } else{
                setFanOn(false)
                setSwitchFanOn(false)
            }
        } 
    }

   
    return (
        <div className={styles.container}>

            <div className={styles.body}>
                
                <div className={styles.header}>
                    <div className={styles.avatar}>
                    
                    </div>
                </div>


                <div className={styles.main}>
                    <div className={styles.data}>
                        <div className={styles.display}>
                            <Temp temperature={temperature}/>
                        </div>
                        <div className={styles.display}>
                            <Humidity humidity = {humidity}/>
                        </div>
                        <div className={styles.display}>
                            <Light light = {light}/>
                        </div>
                        <div className={styles.display}>
                            <Gas gas = {gas}/>
                        </div>

                        <div className={styles.actions}>
                     
                                <div className={styles.device}>
                                    <div className={styles.img}>
                                        {
                                            fanOn
                                            ?
                                            <img className = {styles.fanOn} src="/img/fan2.svg" alt="" />
                                            :
                                            <img className = {styles.fanOff} src="/img/fan2.svg" alt="" />        
                                        }
                                    </div>
                                    <div className={styles.switch}>
                                        {
                                            fanSwitchOn
                                            ?
                                            <img className={styles.switchBtn} src="/button/on.svg" alt="" onClick={() => handleDeviceControl({action:"offfan"})}/>
                                            :
                                            <img className = {styles.switchBtn} src="/button/off.svg" alt="" onClick={() => handleDeviceControl({action: "onfan"})}/>
                                        }
                                    </div>
                                   
                                </div>
                                <div className={styles.device}>
                                    <div className={styles.img}>
                                        {
                                            lightOn
                                            ?
                                            <img className = {styles.light} src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Light_bulb_%28yellow%29_icon.svg/1200px-Light_bulb_%28yellow%29_icon.svg.png" alt="" />
                                            :
                                            <img className = {styles.lightOff} src="https://static.thenounproject.com/png/1087991-200.png" alt="" />   
                                      
                                        }
                                    </div>
                                    <div className={styles.switch}>
                                        {
                                            switchLightOn
                                            ?
                                            <img className={styles.switchBtn} src="/button/on.svg" alt="" onClick={() => handleDeviceControl({action:"offled"})}/>
                                            :
                                            <img className = {styles.switchBtn} src="/button/off.svg" alt="" onClick={() => handleDeviceControl({action:"onled"})}/>
                                        }
                                    </div>
                                </div>
                      
                        </div>
                    </div>

                </div>


                <div className={styles.chartContainer}>
                    <DisplayChart temperature={temperature} humidity = {humidity} light = {light} reload = {reload}/>                      
                    <DisplayChart2  gas = {gas}/>                      
                </div>

            </div>
        </div>
    );
}

const DisplayChart = ({ temperature, humidity, light ,reload}) => {

	const [time, setTime] = useState(0)
    const [data, setData] = useState({
        datasets: [{
            label: 'Nhiệt độ',
            data: [],
            yAxisID: 'y',
            cubicInterpolationMode: 'monotone',
            borderColor: "rgb(255, 102, 0)"
        },
        {
            label: 'Độ ẩm',
            data: [],
            yAxisID: 'y',
            cubicInterpolationMode: 'monotone',
            borderColor: "rgb(0, 143, 179)"
        },
        {
            label: 'Ánh sáng',
            data: [],
            yAxisID: 'y1',
            cubicInterpolationMode: 'monotone',
            borderColor: "rgb(230, 230, 0)"
        }],
        labels: []
    });

  
    

	useEffect(() => {
            

        const limit = 10
        const temperatureData = data.datasets[0].data.length > limit ?  data.datasets[0].data.slice(1) : data.datasets[0].data
        const humidityData = data.datasets[1].data.length > limit ?  data.datasets[1].data.slice(1) : data.datasets[1].data
        const lightData = data.datasets[2].data.length > limit ?  data.datasets[2].data.slice(1) : data.datasets[2].data
        setTime(pre => pre += 5)
        setData((prevData) => ({
            ...prevData,
            datasets: [
                {
                    ...prevData.datasets[0],
                    data: [
                        ...temperatureData,
                        
                        { x: `${time}s`, y: temperature },
                    ],
                },
                {
                    ...prevData.datasets[1],
                    data: [
                        ...humidityData,
                        
                        { x: `${time}s`, y: humidity },
                    ],
                },
                {
                    ...prevData.datasets[2],
                    data: [
                        ...lightData,
                        
                        { x: `${time}s`, y: light },
                    ],
                }
            ],
        }));

	}, [temperature, humidity, light, reload]);

    const options = {
        responsive: true,
        scales: {
            x: {
                display: true
            },
            y: {
                display: true,
                position: 'left'
            },
            y1: {
                display: true,
                position: 'right'
            }
        }
    }



    return (
        <div className= {styles.chart}>
            <Line data={data} options={options} />
        </div>
    );
};


const DisplayChart2 = ({ gas ,reload}) => {

	const [time, setTime] = useState(0)
    const [data, setData] = useState({
        datasets: [{
            label: 'Gas',
            data: [],
            yAxisID: 'y',
            cubicInterpolationMode: 'monotone',
            borderColor: "rgb(255, 102, 0)"
        }]
    });

  
    

	useEffect(() => {
            

        const limit = 10
        const gasData = data.datasets[0].data.length > limit ?  data.datasets[0].data.slice(1) : data.datasets[0].data

        setTime(pre => pre += 5)
        setData((prevData) => ({
            ...prevData,
            datasets: [
                {
                    ...prevData.datasets[0],
                    data: [
                        ...gasData,
                        
                        { x: `${time}s`, y: gas },
                    ],
                },
            ],
        }));

	}, [gas, reload]);

    const options = {
        responsive: true,
        scales: {
            x: {
                display: true
            },
            y: {
                display: true,
                position: 'right'
            }
        }
    }



    return (
        <div className= {styles.chart}>
            <Line data={data} options={options} />
        </div>
    );
};


export default Dashboard;
