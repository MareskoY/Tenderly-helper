import React from 'react';
import { Link } from 'react-router-dom';
import './networkbutton.css';

function Networkbutton({ id, icon, text, colorClass ="btn-secondary" }) {
    const isExist = id ==="exist"? true : false
    return (
        <div alt={`network-button-${id}`} className={"networkButton"}>
            <Link
                to={isExist ? "/exist-network" : "/network"} state={{network: text, id}}
                class={`flex w-full btn btn-outline ${colorClass}`}
            >
                <div>
                    <img src={icon} alt={`network-icon-${id}`} />
                </div>
                <div>
                    &nbsp; &nbsp; {text}
                </div>
            </Link>
        </div>
    );
}

export default Networkbutton;