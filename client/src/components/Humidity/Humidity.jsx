import React, { useEffect, useState } from 'react';

import styles from "./humidity.module.scss"

import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const Humidity = ({humidity}) => {
    // const [humidity, setHumidity] = useState(0);

    // const generateHumidity = () => {
    //     return Math.floor(Math.random() * 51) ;
    // };

    const getColor = (humidity) => {
        if (humidity < 0) {
            return "blue";
        } else if (humidity >= 0 && humidity < 20) {
            return "lightblue";
        } else if (humidity >= 20 && humidity < 40) {
            return "green";
        } else if (humidity >= 40 && humidity < 60) {
            return "yellow";
        } else if (humidity >= 60 && humidity < 100) {
            return "orange";
        } else {
            return "red";
        }
    };


    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setHumidity(generateHumidity());
    //     }, 2000);
    //     return () => clearInterval(interval);
    // }, []);

    return (
        <div className={styles.container} style={{ backgroundColor: getColor(humidity), transition: "background-color 2s ease" }}>
            <div className={styles.title}>
                Humidity
            </div>
            <div className={styles.dataWrapper}>
                <img src="https://kuhner.com/wAssets/img/x-master/Technology-Humidity-sRgb_pikto-1080x1080.svg" alt="" />
                <div
                    className={styles.box}
                    
                >
                    <h1>{humidity}%</h1>
                </div>
            </div>
        </div>
    );
}

export default Humidity;
