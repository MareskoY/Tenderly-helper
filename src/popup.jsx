import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router-dom"; // <-- import BrowserRouter
import Home from "./pages/home";
import Navigation from "./components/navigation";
import Settings from "./pages/settings"
import './popup.css';
import Network from "./pages/network";
import "daisyui/dist/full.css";
import ExistNetwork from "./pages/ExistNetwork";



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Navigation
                title="Choose network"
                onBackClick={() => console.log('Go back one page')}
                onSettingsClick={() => console.log('Go to settings page')}
            />
            <Routes>
                <Route exact path="/popup.html" element={<Home />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/network" element={<Network />} />
                <Route path="/exist-network" element={<ExistNetwork />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);