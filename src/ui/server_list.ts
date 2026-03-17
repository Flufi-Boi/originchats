import * as events from "../events";

import { servers } from "../server";
import { selectServer } from './state';

let last_selected_server: HTMLElement | null = null;

export function generate() {
    const container = document.getElementById("server-list")!;
    container.innerHTML = "";

    for (let i = 0; i < servers.length; i++) {
        const server = servers[i];
        
        const server_elem = document.createElement("div");
        function click() {
            if (last_selected_server)
                last_selected_server.classList.remove("selected");
            last_selected_server = server_elem;
            server_elem.classList.add("selected");
            selectServer(server);
        }
        server_elem.addEventListener("click", click);
        
        if (server.icon) {
            const icon = document.createElement("img");
            icon.src = server.icon;
            server_elem.appendChild(icon);
        } else {
            server_elem.textContent = (server.name ?? "?")[0];
        }

        container.appendChild(server_elem);
    }
}

events.listen(events.EventName.ServersChange, () => {
    generate();
});
