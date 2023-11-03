import React from 'react';

import styles from "./profile.module.scss"
import Avatar from '../../components/Avatar/Avatar';

const Profile = () => {
    return (
        <div className={styles.container}>
            <div className={styles.avatarContainer}>
                <div className={styles.avatarWrapper}>
                    <Avatar user = "Cuong"/>
                </div>
            </div>

            <div className={styles.infoContainer}>
                <h2>
                    Họ và tên: Trịnh Huy Cường
                </h2>
                <h2>
                    Ngành học: An toàn thông tin
                </h2>
                <h2>
                    MSV: B20DCAT025
                </h2>
                <h2>
                    Lớp: D20CQAT01-B
                </h2>

            </div>
        </div>
    );
}

export default Profile;
