import React, { useEffect, useState } from "react";
import styles from "./gas.module.scss";
import classnames from "classnames"

import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming";

const Gas = ({gas}) => {

    const [flicker, setFlicker] = useState(false)
    const getColor = (gas) => {
     
        if (gas >= 60 && gas < 64) {
            return "grey";
        } else if (gas >= 64 && gas < 68) {
            return "red";
        } else if (gas >= 68 && gas < 72) {
            return "lightblue";
        } else if (gas >= 72 && gas < 78) {
            return "orange";
        } else {
            return "lightpurple";
        }
    };
    console.log(flicker);
    useEffect(() => {
        if(gas >= 70){
            setFlicker(true)
        }else{
            setFlicker(false)
        }
    },[gas])

    return (
        <div className={!flicker ? styles.container : classnames({[styles.container]:true, [styles.flickering]:flicker})} style={{ backgroundColor: getColor(gas), transition: "background-color 2s ease", "--color": getColor(gas) }}>

            <div className={styles.title}>
                Gas
            </div>
            <div className={styles.dataWrapper}>
                
                <div
                    className={styles.box}
                    
                >
                    <h1>{gas} gal</h1>
                </div>
            </div>
        </div>
    );
};



export default Gas;
