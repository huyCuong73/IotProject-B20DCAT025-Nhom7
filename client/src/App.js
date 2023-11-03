import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useParams,  } from 'react-router-dom';
import { Layout } from "./Layout";

import "./App.css";

import Dashboard from "./Page/Dashboard/Dashboard";
import Profile from "./Page/Profile/Profile";
import Data from "./Page/Data/Data";
import Action from "./Page/Action/Action";

import {io} from "socket.io-client"

function App() {

	return (

		<Routes>

			
			<Route path="/" element={<Layout><Dashboard /></Layout>} />
			<Route path="/profile" element={<Layout><Profile /></Layout>} />
			<Route path="/data" element={<Layout><Data /></Layout>} />
			<Route path="/action" element={<Layout><Action /></Layout>} />
		
		</Routes>

	)
}

export default App;
