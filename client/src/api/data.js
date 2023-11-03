import axios from "axios";

const url = "http://localhost:3333"

export const getData = (payload) => axios.post(url + "/data", payload)


export const searchData = (payload) => axios.post(url + "/search-data", payload)