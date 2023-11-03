import axios from "axios";

const url = "http://localhost:3333"

export const controlDevices = payload => axios.post(url + "/control-device", payload)

export const getActions = (payload) => axios.post(url + "/actions", payload)