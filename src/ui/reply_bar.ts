import * as events from "../events";
import { messages } from "../message";
import * as rotur from "../net/rotur";
import { generateIcon } from "./icon";
import * as state from "./state";
import { getDisplayName } from '../user';

export function generate() {
    const container = document.getElementById("reply-bar")!;
    container.innerHTML = "";

    if (!rotur.user)
        return;

    const server = state.selectedServer;
    if (!server)
        return;

    const channel = server.channels[server.selected_channel ?? ""];
    if (!channel)
        return;
    
    if (server.replying_message && server.replying_message[channel.name]) {
        const msg = server.replying_message[channel.name];

        container.appendChild(document.createTextNode("Replying to"));

        const user = document.createElement("span");
        user.textContent = getDisplayName(messages[msg].user);
        container.appendChild(user);

        const close = document.createElement("button");
        close.addEventListener("click", () => {
            delete server.replying_message![channel.name];
            events.invoke(events.EventName.ReplyBarChange);
        });
        close.appendChild(generateIcon("x"));
        container.appendChild(close);
    }
}

events.listen(events.EventName.ReplyBarChange, () => {
    generate();
});
