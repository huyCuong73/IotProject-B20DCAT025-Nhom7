import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Web3ReactProvider } from "@web3-react/core";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';


const { ethers } = require("ethers");


const root = ReactDOM.createRoot(document.getElementById("root"));
if (window.ethereum){

    function getLibrary(provider) {
      return new ethers.providers.Web3Provider(provider);
    }
    
    root.render(

            <Web3ReactProvider getLibrary={getLibrary}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </Web3ReactProvider>

    );
}else{
    root.render(
        <h2 style={{marginLeft:"30px"}}>
            Hãy cài đặt extension Metamask để sử dụng ứng dụng
        </h2>
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
