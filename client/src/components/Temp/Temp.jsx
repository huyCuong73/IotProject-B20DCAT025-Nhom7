import React, { useEffect, useState } from "react";
import styles from "./temp.module.scss";

import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const Temp = ({temperature}) => {
   

    const getColor = (temp) => {
        if (temp < 0) {
            return "#FFFFFF";
        } else if (temp >= 0 && temp < 10) {
            return "#A9D0F5";
        } else if (temp >= 10 && temp < 20) {
            return "#8DB600";
        } else if (temp >= 20 && temp < 30) {
            return "#FFEC64";
        } else if (temp >= 30 && temp < 40) {
            return "#FF8C00";
        } else {
            return "#FF0000";
        }
    };



    return (
        <div className={styles.container} style={{ backgroundColor: getColor(temperature), transition: "background-color 2s ease" }}>
            <div className={styles.title}>
                Temperature
            </div>
            <div className={styles.dataWrapper}>
                <img src="thermo.png" alt="" />
                <div
                    className={styles.box}
                    
                >
                    <h1>{temperature}°C</h1>
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

    useState(() => {
        console.log(data);
        // if(data.length > 60){
        //     setData(data.shift())
            
        // }
    },[temperature])
  
    

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

export default Temp;
