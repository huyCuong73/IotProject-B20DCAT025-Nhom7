import React, { useEffect, useState } from "react";
import styles from "./Pagination.module.scss";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const Pagination = ({pageCount, onPageChange}) => {


	const [page, setPage] = useState(0)
    const [openPageList, setOpenPageList] = useState(false)
	const [pageLeftExceeded, setPageLeftExceeded] = useState(false)
    const [pageRightExceeded, setPageRightExceeded] = useState(false)

	useEffect(() => {
		onPageChange(page)
	}, [page])

	useEffect(() => {
        if(page === 0){
            setPageLeftExceeded(true)
        }else{
            setPageLeftExceeded(false)
        }
        if(page === pageCount - 1){
            setPageRightExceeded(true)
        }else{
            setPageRightExceeded(false)
        }
    }, [page, pageCount])

    return (
        <div className={styles.pageControl}>
            {!pageLeftExceeded ? (
                <div
                    className={styles.pageAction}
                    onClick={() => {
                        setPage((pre) => pre - 1);
                        setOpenPageList(false);
                    }}
                >
                    Previous
                </div>
            ) : (
                <div className={styles.pageActionDisabled}>Previous</div>
            )}
            <div className={styles.currentPage}>
                <div>{page + 1}</div>

                {openPageList && (
                    <div className={styles.pageList}>
                        {pageCount &&
                            [...Array(pageCount)].map((pageNumber, i) => (
                                <div
                                    className={
                                        i === page
                                            ? styles.pageNumberSelected
                                            : styles.pageNumber
                                    }
                                    onClick={() => {
                                        setPage(i);
                                        setOpenPageList(false);
                                    }}
                                >
                                    {i + 1}
                                </div>
                            ))}
                    </div>
                )}
            </div>
            {!openPageList && (
                <ArrowDropUpIcon
                    className={styles.arrow}
                    onClick={() => setOpenPageList(!openPageList)}
                />
            )}

            {openPageList && (
                <ArrowDropDownIcon
                    className={styles.arrow}
                    onClick={() => setOpenPageList(!openPageList)}
                />
            )}

            {!pageRightExceeded ? (
                <div
                    className={styles.pageAction}
                    onClick={() => {
                        setPage((pre) => pre + 1);
                        setOpenPageList(false);
                    }}
                >
                    Next
                </div>
            ) : (
                <div className={styles.pageActionDisabled}>Next</div>
            )}
        </div>
    );
};

export default Pagination;
