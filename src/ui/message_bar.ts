import { generateIcon } from "./icon";
import * as events from "../events";
import * as rotur from "../net/rotur";
import * as state from "./state";

function calcHeight(elem: HTMLElement) {
    elem.style.height = "auto";
    elem.style.height = (elem.scrollHeight - elem.offsetHeight + elem.clientHeight) + "px";
}

export function generate() {
    const container = document.getElementById("message-bar")!;
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

    const channel = server.channels[server.selected_channel ?? ""];
    if (!channel) {
        container.innerHTML = "<p class=\"not-selected-channel\">no channel selected</p>";
        return;
    }

    function sendMsg() {
        let replyTo = undefined;
        if (server!.replying_message && server!.replying_message[channel.name])
            replyTo = server!.replying_message[channel.name];
        server!.sendMessage(input.value, replyTo);
        input.value = "";
        calcHeight(input);
        if (replyTo) {
            delete server!.replying_message![channel.name];
            events.invoke(events.EventName.ReplyBarChange);
        }
    }

    const input = document.createElement("textarea");
    input.writingSuggestions = "off";
    input.rows = 1;
    input.id = "message-bar-input";

    input.addEventListener("input", () => {
        calcHeight(input);
        events.invoke(events.EventName.MessageBarContentChange, input.value, input.selectionStart);
    });

    input.addEventListener("keypress", (ev) => {
        if (ev.key == "Enter" && !ev.shiftKey) {
            sendMsg();
            ev.preventDefault();
        }
    });

    container.appendChild(input);

    const send = document.createElement("button");
    send.id = "message-bar-send";
    send.appendChild(generateIcon("send"));
    send.addEventListener("click", () => {
        sendMsg();
    })
    container.appendChild(send);
}

events.listen(events.EventName.MessageBarChange, () => {
    generate();
    events.invoke(events.EventName.MessageBarContentChange, "");
});
events.listen(events.EventName.Login, () => {
    generate();
    events.invoke(events.EventName.MessageBarContentChange, "");
});
