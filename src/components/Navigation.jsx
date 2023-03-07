import React from "react";
import "./Navigation.css";
import { FaArrowLeft, FaCog, FaExpand} from "react-icons/fa";
import {Link, useLocation} from "react-router-dom"; // <-- import Link

import { useNavigate } from 'react-router-dom';
import networkData from "../assets/networks.json";

function Navigation(props) {
    const {onBackClick, onSettingsClick } = props;
    const navigate = useNavigate();

    let title;
    switch (location.pathname) {
        case '/popup.html':
            title = 'Choose network';
            break;
        case '/network':
            title = 'Network';
            break;
        case '/settings':
            title = 'Settings';
            break;
        case '/exist-network':
            title = 'Exist Network';
            break;
        // add more cases for each route
        default:
            title = 'Unknown';
    }

    if (location.pathname === '/network') {
        const networkName = useLocation().state.network;
        title = `${networkName} Network`;
    }

    const openExtensionTab = () => {
        // window.open(chrome.extension.getURL("popup.html"));
        chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
    };


    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                {onBackClick && (
                    <button className="btn btn-ghost btn-circle" onClick={() => navigate(-1)}>
                        <FaArrowLeft />
                    </button>
                )}
            </div>
            <div className="navbar-center">
                <a className="btn btn-ghost normal-case text-xl">{title}</a>
            </div>
            <div className="navbar-end">
                {onSettingsClick && (
                    <Link to="/settings"> {/* <-- use Link instead of button */}
                        <button className="btn btn-ghost btn-circle">
                            <FaCog />
                        </button>
                    </Link>
                )}
                <button className="btn btn-ghost btn-circle">
                    <button className="btn btn-ghost btn-circle" onClick={()=>openExtensionTab()}>
                        <FaExpand />
                    </button>
                </button>
            </div>
        </div>
    );
}

export default Navigation;
