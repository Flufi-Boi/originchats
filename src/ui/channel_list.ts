import * as events from "../events";
import * as state from "./state";
import * as rotur from "../net/rotur";
import { generateIcon } from "./icon";

export type ChannelListItem = {
    type: "text",
    name: string,
    display_name?: string
} | {
    type: "voice",
    name: string,
    display_name?: string
} | {
    type: "separator"
}

let last_selected_channel: HTMLElement | null = null;

export function generate() {
    const container = document.getElementById("channel-list")!;
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

    for (let i = 0; i < server.channel_list.length; i++) {
        const listItem = server.channel_list[i];
        
        switch (listItem.type) {
            case "text": case "voice": {
                const elem = document.createElement("button");
                elem.className = listItem.type;
                elem.addEventListener("click", () => {
                    if (last_selected_channel)
                        last_selected_channel.classList.remove("selected");
                    last_selected_channel = elem;
                    elem.classList.add("selected");
                    server.selectChannel(listItem.name);
                });
                if (server.selected_channel == listItem.name) {
                    elem.classList.add("selected");
                }
                
                elem.appendChild(generateIcon(
                    listItem.type == "text" ? "hash" : "volume-2"
                ));

                const name = document.createElement("span");
                name.textContent = listItem.display_name ?? listItem.name;
                elem.appendChild(name);

                container.appendChild(elem);
                break;
            }
            case "separator": {
                container.appendChild(document.createElement("hr"));
                break;
            }
        }
    }
}

events.listen(events.EventName.ChannelsChange, () => {
    generate();
});
events.listen(events.EventName.Login, () => {
    generate();
});

