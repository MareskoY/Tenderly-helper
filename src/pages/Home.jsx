import React from "react";
import Networkbutton from "../components/networkbutton";
import networkData from "../assets/networks.json";

function Home() {
    const colors = ["", "btn-primary", "btn-secondary", "btn-accent"]

    return (
        <div class="grid">
            {Object.keys(networkData).map((key, index) => (
                <Networkbutton
                    key={key}
                    id={key}
                    text={networkData[key].title}
                    icon={require(`../../public/networks_icons/${networkData[key].logo}`)}
                    colorClass={colors[index % colors.length]}
                />
            ))}
            <Networkbutton
                key={"exist"}
                id={"exist"}
                text={"Exist network"}
                icon={require(`../../public/networks_icons/add.svg`)}
                colorClass={""}
            />
        </div>
    );
}

export default Home;