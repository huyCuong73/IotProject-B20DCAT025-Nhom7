import React, { useEffect, useState } from 'react';

import styles from "./data.module.scss"
import { getData, searchData } from '../../api/data';
import Pagination from '../../components/Pagination/Pagination';
import SortIcon from '@mui/icons-material/Sort';
import Sort from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {io} from "socket.io-client"

const Data = () => {

    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageCount, setPageCount] = useState()
    const [sortItem, setSortItem] = useState("")
    const [sortOption, setSortOption] = useState(0)
    const [openOptions, setOpenOptions] = useState(0)
    const [liveData, setLiveData] = useState(false)
    const [loading, setLoading] = useState(false)

    const [tempSearchValue, setTempSearchValue] = useState("")
    const [humiSearchValue, setHumiSearchValue] = useState("")
    const [lightSearchValue, seLightSearchValue] = useState("")
    const [gasSearchValue, setGasSearchValue] = useState("")
    const [init, setInit] = useState(false)

    const socket = io("localhost:3333")

    let loadingData = []
    const initData = {
        temp:"...",
        humi:"...",
        light:"...",
        gas:"...",
        createdAt:"..."
    }

    for(let i=0; i< 6;i++){
        loadingData.push({...initData})
    }

    useEffect(() => {
        const socket = io("localhost:3333");
        if (liveData) {
            
            socket.on("data", () => {

                setLoading(true);
                const a = data.slice(0,-1)
                setData(a)
                getData({page: currentPage, sortItem, sortOption: 0})
                    .then(res => {
                        setTimeout(() => {
                            setLoading(false);
                            setData(res.data.dataResponded);
                            setPageCount(res.data.pageCount);
                        },1000)
                    });
            })
        } else{
            socket.close()
        }
        return () => {
          socket.close();
        };
      }, [liveData, socket]);


    useEffect(() => {
        if(data.length === 0){
            setData(loadingData)
        }
        getData({page:currentPage, sortItem, sortOption: !liveData ? sortOption : 0})
            .then(res => {
                setData(res.data.dataResponded)
                setPageCount(res.data.pageCount)
            })
        
    },[currentPage, sortItem, sortOption, liveData])


    const onPageChange = (page) => {
        setCurrentPage(page+1)
    }
    

    const onSortItemChange = (item) => {
        setSortItem(item)

    }
    const onSortOptionChange = (option) => {
        setSortOption(option)

    }
    const handleOpenOptions = (index) => {
   
        if(index === openOptions){
            setOpenOptions(0)
        }else{
            setOpenOptions(index)
        }
    }

    console.log(data);

    return (
        <div className={styles.container}>


            <div className={styles.search}>
                <div className={styles.searchItem}>
                    <div className={styles.searchLabel}>Temperature: </div>
                    <input type="text"  onChange={e =>  setTempSearchValue(e.target.value)}/>
                </div>
                <div className={styles.searchItem}>
                    <div className={styles.searchLabel}>Humidity: </div>
                    <input type="text" onChange = {e => setHumiSearchValue(e.target.value)}/>
                </div>
                <div className={styles.searchItem}>
                    <div className={styles.searchLabel}>Light: </div>
                    <input type="text" onChange = {e => seLightSearchValue(e.target.value)}/>
                </div>
                <div className={styles.searchItem}>
                    <div className={styles.searchLabel}>Gas: </div>
                    <input type="text" onChange = {e => setGasSearchValue(e.target.value)} />
                </div>

                <button onClick={() => {
                   

                    function removeEmpty(obj) {
                        return Object.keys(obj)
                            .filter(function (key) {
                                return obj[key] != null && obj[key] !== "";
                            })
                            .reduce(function (acc, key) {
                                acc[key] = obj[key];
                                return acc;
                            }, {})
                    }
                    
                    const query = removeEmpty({
                        temp: tempSearchValue,
                        humi : humiSearchValue,
                        light:lightSearchValue,
                        gas : gasSearchValue 
                    })
                   
                    searchData({
                        page: currentPage,
                        query
                    })
                        .then((res) => {
                            setData(res.data.dataResponded);
                            setPageCount(res.data.pageCount);
                        })
                }}>Search</button>
            </div>
            <div className={styles.tableContainer}>
                <div className={styles.tableWrapper}>

                    <div className={styles.tableHeaderWrapper}>

                        <div className={styles.tableHeader}>

                            <div className={styles.itemHeader}>
                                No.
                            </div>
                            <div className={styles.itemHeader}>Temperature
                                <div className={styles.sort} onClick = {() => {
                                    handleOpenOptions(1)
                                }}>
                                    {
                                        (sortItem === "temp" && sortOption === 1)
                                        &&
                                        <ArrowUpwardIcon />
                                    }
                                    {
                                        (sortItem === "temp" && sortOption === -1)
                                        &&
                                        <ArrowDownwardIcon />
                                    }
                                    {
                                        ((sortItem !== "temp") || (sortItem === "temp" && sortOption === 0))
                                        &&
                                        <Sort/>
                                    }

                                    {
                                        openOptions === 1
                                        &&
                                        <div className={styles.sortPointer}>
                                                <div className={styles.sortOptions}>
                                                    <div className={(sortItem === "temp" && sortOption === 1) ? styles.sortOptionSelected : styles.sortOption} onClick={() => {
                                                        onSortItemChange("temp")
                                                        onSortOptionChange(1)
                                                    }}>asending</div>

                                                    <div className={(sortItem === "temp" && sortOption === -1) ? styles.sortOptionSelected : styles.sortOption} onClick={() => {
                                                        onSortItemChange("temp")
                                                        onSortOptionChange(-1)
                                                    }}>desending</div>

                                                    <div className={styles.sortOption} onClick={() => {
                                                        if(sortItem === "temp"){
                                                            onSortOptionChange(0)
                                                        }
                                                    }}>none</div>
                                                </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className={styles.itemHeader}>Humidity
                                <div className={styles.sort} onClick = {() => {
                                    handleOpenOptions(2)
                                }}>
                                    {
                                        (sortItem === "humi" && sortOption === 1)
                                        &&
                                        <ArrowUpwardIcon />
                                    }
                                    {
                                        (sortItem === "humi" && sortOption === -1)
                                        &&
                                        <ArrowDownwardIcon />
                                    }
                                    {
                                        ((sortItem !== "humi") || (sortItem === "humi" && sortOption === 0))
                                        &&
                                        <Sort/>
                                    }

                                    {
                                        openOptions === 2
                                        &&
                                        <div className={styles.sortPointer}>
                                                <div className={styles.sortOptions}>
                                                    <div className={(sortItem === "humi" && sortOption === 1) ? styles.sortOptionSelected : styles.sortOption} onClick={() => {
                                                        onSortItemChange("humi")
                                                        onSortOptionChange(1)
                                                    }}>asending</div>

                                                    <div className={(sortItem === "humi" && sortOption === -1) ? styles.sortOptionSelected : styles.sortOption} onClick={() => {
                                                        onSortItemChange("humi")
                                                        onSortOptionChange(-1)
                                                    }}>desending</div>

                                                    <div className={styles.sortOption} onClick={() => {
                                                        if(sortItem === "humi"){
                                                            onSortOptionChange(0)
                                                        }
                                                    }}>none</div>
                                                </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className={styles.itemHeader}>Light Intensity
                                <div className={styles.sort} onClick = {() => {
                                    handleOpenOptions(3)
                                }}>
                                    {
                                        (sortItem === "light" && sortOption === 1)
                                        &&
                                        <ArrowUpwardIcon />
                                    }
                                    {
                                        (sortItem === "light" && sortOption === -1)
                                        &&
                                        <ArrowDownwardIcon />
                                    }
                                    {
                                        ((sortItem !== "light") || (sortItem === "light" && sortOption === 0))
                                        &&
                                        <Sort/>
                                    }

                                    {
                                        openOptions === 3
                                        &&
                                        <div className={styles.sortPointer}>
                                                <div className={styles.sortOptions}>
                                                    <div className={(sortItem === "light" && sortOption === 1) ? styles.sortOptionSelected : styles.sortOption} onClick={() => {
                                                        onSortItemChange("light")
                                                        onSortOptionChange(1)
                                                    }}>asending</div>

                                                    <div className={(sortItem === "light" && sortOption === -1) ? styles.sortOptionSelected : styles.sortOption} onClick={() => {
                                                        onSortItemChange("light")
                                                        onSortOptionChange(-1)
                                                    }}>desending</div>

                                                    <div className={styles.sortOption} onClick={() => {
                                                        if(sortItem === "light"){
                                                            onSortOptionChange(0)
                                                        }
                                                    }}>none</div>
                                                </div>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className={styles.itemHeader}>Gas
                                <div className={styles.sort} onClick = {() => {
                                    handleOpenOptions(4)
                                }}>
                                    {
                                        (sortItem === "gas" && sortOption === 1)
                                        &&
                                        <ArrowUpwardIcon />
                                    }
                                    {
                                        (sortItem === "gas" && sortOption === -1)
                                        &&
                                        <ArrowDownwardIcon />
                                    }
                                    {
                                        ((sortItem !== "gas") || (sortItem === "gas" && sortOption === 0))
                                        &&
                                        <Sort/>
                                    }

                                    {
                                        openOptions === 4
                                        &&
                                        <div className={styles.sortPointer}>
                                                <div className={styles.sortOptions}>
                                                    <div className={(sortItem === "gas" && sortOption === 1) ? styles.sortOptionSelected : styles.sortOption} onClick={() => {
                                                        onSortItemChange("gas")
                                                        onSortOptionChange(1)
                                                    }}>asending</div>

                                                    <div className={(sortItem === "gas" && sortOption === -1) ? styles.sortOptionSelected : styles.sortOption} onClick={() => {
                                                        onSortItemChange("gas")
                                                        onSortOptionChange(-1)
                                                    }}>desending</div>

                                                    <div className={styles.sortOption} onClick={() => {
                                                        if(sortItem === "gas"){
                                                            onSortOptionChange(0)
                                                        }
                                                    }}>none</div>
                                                </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className={styles.itemHeader}>CreatedAt</div>
                        </div>
                    </div>
                    <div className={styles.tableBodyWrapper}>
                        <div className={styles.tableBody}>
                            {
                                loading
                                &&
                                <div className={styles.bodyRow}>
                                    <div className={styles.item}>...</div>
                                    <div className={styles.item}>...</div>
                                    <div className={styles.item}>...</div>
                                    <div className={styles.item}>...</div>
                                    <div className={styles.item}>... </div>
                                    <div className={styles.item}>... </div>
                                </div>   
                            }
                            {
                                data.map( (data,i) => (
                                    <div className={styles.bodyRow}>
                                        <div className={styles.item}>{i+1}</div>
                                        <div className={styles.item}>{data.temp} °C</div>
                                        <div className={styles.item}>{data.humi} %</div>
                                        <div className={styles.item}>{data.light} lm</div>
                                        <div className={styles.item}>{data.gas} gal</div>
                                        <div className={styles.item}>{data.createdAt.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"})} </div>
                                    </div>                   
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.liveData}>
                    <span>Live data: </span>
                    {
                        liveData
                        ?
                        <img className={styles.switchBtn} src="/button/on.svg" alt="" onClick={() => setLiveData(false)}/>
                        :
                        <img className = {styles.switchBtn} src="/button/off.svg" alt="" onClick={() => setLiveData(true)}/>
                    }          
                </div>
                <div className={styles.pagination}>
                    <Pagination pageCount={pageCount} onPageChange={onPageChange}/>
                </div>
            </div>


            
        </div>
    );
}

export default Data;
