import React from 'react';
import { useSelector } from 'react-redux';
import styles from "./avatar.module.scss"

const Avatar = ({user}) => {
    if(!user){
        return
        <></>
    }

    // const userName = user.email
    const defaultBackground = ["blue", "red", "purple", "orange", "green", "pink", "brown"]
    // const i = user.defaultBackground
    const i = 4

    return (
            <div style={{backgroundColor: defaultBackground[i]}} className={styles.avatar}>
                <span>
                    {user[0].toUpperCase()}
                </span>
            </div>
    );
}

export default Avatar;
