import React, { useEffect, useState } from "react";
import styles from "./temp.module.scss";

import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const Light = ({light}) => {
   
    // const [temperature, setTemperature] = useState(0);

    // const generateTemperature = () => {
    //     return Math.floor(Math.random() * 1000) - 1;
    // };

    const getColor = (light) => {
     
        if (light >= 0 && light < 200) {
            return "grey";
        } else if (light >= 200 && light < 800) {
            return "red";
        } else if (light >= 800 && light < 950) {
            return "orange";
        } else if (light >= 900 && light < 950) {
            return "lightblue";
        } else {
            return "white";
        }
    };


    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setTemperature(generateTemperature());
    //     }, 2000);
    //     return () => clearInterval(interval);
    // }, []);

    return (
        <div className={styles.container} style={{ backgroundColor: getColor(light), transition: "background-color 2s ease" }}>
            <div className={styles.title}>
                Light Intensity
            </div>
            <div className={styles.dataWrapper}>
                <img src="https://icons.veryicon.com/png/o/business/business-style-icon/light-bulb-11.png" alt="" />
                <div
                    className={styles.box}
                    
                >
                    <h1>{light} lm</h1>
                </div>
            </div>
        </div>
    );
};

const ChartBox = ({ temperature }) => {

	const [time, setTime] = useState(0)
    const [data, setData] = useState({
        datasets: [
            {
                label: "Temperature",
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                lineTension: 0,
                data: [],
            },
			
        ],
    });

    

	useEffect(() => {
            
		
			setTime(pre => pre += 1)
			setData((prevData) => ({
				...prevData,
				datasets: [
					{
						...prevData.datasets[0],
						data: [
							...prevData.datasets[0].data,
							
							{ x: `${time}s`, y: temperature },
						],
					},
				],
			}));

	}, [temperature]);

    const options = {
        scales: {
            xAxes: [
                {
                    type: "realtime",
                    realtime: {
                        onRefresh: function () {},
                   
						duration: 60000, 
                    },
                },
            ],
        },
		
		indexAxis: 'x'
    };


    return (
        <div className= {styles.chart}>
            <Line data={data} options={options} />
        </div>
    );
};

export default Light;
