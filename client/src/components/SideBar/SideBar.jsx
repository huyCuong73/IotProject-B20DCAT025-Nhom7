import React from 'react';
import styles from "./sidebar.module.scss"
import Avatar from '../Avatar/Avatar';
import { Link, useLocation } from 'react-router-dom';


const SideBar = () => {

    
	const location = useLocation();
	const { pathname } = location;
	const splitLocation = pathname.split("/");

    return (
        <div className={styles.container}>
        
            <div className={styles.avatar}>
                <div className={styles.avatarWrapper}>

                <Avatar user = "Cuong"/>
                </div>
            </div>
            <Link to="/" className={styles.link}>
                <div className= {splitLocation[1] === "" ? styles.itemActive : styles.item}>
                    Dashboard
                </div>
            </Link>

            <Link to="/profile" className={styles.link}>
                <div className= {splitLocation[1] === "profile" ? styles.itemActive : styles.item}>
                    Profile
                </div>
            </Link>

            <Link to="/data" className={styles.link}>
                <div className= {splitLocation[1] === "data" ? styles.itemActive : styles.item}>
                    Data
                </div>
            </Link>

            <Link to="/action" className={styles.link}>
                <div className= {splitLocation[1] === "action" ? styles.itemActive : styles.item}>
                    Action
                </div>
            </Link>
        </div>
    );
}

export default SideBar;
