import React, { useEffect, useState } from "react";
import { getActions } from "../../api/actions";
import styles from "./action.module.scss";
import Pagination from "../../components/Pagination/Pagination";

const Action = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState();
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        getActions({ page: currentPage }).then((res) => {
            setData(res.data.actionsResponded);
            setPageCount(res.data.pageCount);
        });
    }, [currentPage]);

    const onPageChange = (page) => {
        setCurrentPage(page + 1);
    };

    console.log(currentPage);
    return (
        <div className={styles.container}>
            <div className={styles.tableContainer}>
                <div className={styles.tableWrapper}>
                    <div className={styles.tableHeaderWrapper}>
                        <div className={styles.tableHeader}>
                            <div className={styles.itemHeader}>No.</div>
                            <div className={styles.itemHeader}>DEVICE</div>
                            <div className={styles.itemHeader}>STATUS</div>
                            <div className={styles.itemHeader}>CreatedAt</div>
                        </div>
                    </div>

                    <div className={styles.tableBodyWrapper}>
                        <div className={styles.tableBody}>                            
                            {data.map((data, i) => (                                
                                <div className={styles.bodyRow}>
                                    <div className={styles.item}>{i}</div>
                                    <div className={styles.item}>{data.device} </div>
                                    <div className={styles.item}>{data.status} </div>
                                    <div className={styles.item}>
                                        {data.createdAt.toLocaleString("en-US", {
                                            timeZone: "Asia/Ho_Chi_Minh",
                                        })}{" "}
                                    </div>
                                </div>                               
                            ))}
                        </div>
                    </div>


                </div>
            </div>

            <div className={styles.pagination}>
                <Pagination pageCount={pageCount} onPageChange={onPageChange} />
            </div>
        </div>
    );
};

export default Action;
