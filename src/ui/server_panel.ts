import * as events from "../events";
import * as state from "./state";
import * as rotur from "../net/rotur";

export function generate() {
    const container = document.getElementById("server-panel")!;
    container.innerHTML = "";

    if (!rotur.user) {
        container.innerHTML = "<p class=\"not-logged-in\">not logged in :P</p>";
        return;
    }

    const server = state.selectedServer;
    if (!server) {
        container.innerHTML = "<p class=\"not-selected-server\">no server selected</p>";
        return;
    }

    const name = document.createElement("span");
    name.className = "name";
    name.textContent = server.name ?? server.url;
    container.appendChild(name);
}

events.listen(events.EventName.ServerPanelChange, () => {
    generate();
});
events.listen(events.EventName.Login, () => {
    generate();
});
