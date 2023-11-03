import React from "react";
import Sidebar from "./components/SideBar/SideBar";
export const Layout = ({ children }) => {
  return (
    <>
        <div className="container">
        <Sidebar />
        {children}
        </div>
    </>
  );
};