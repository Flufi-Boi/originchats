import * as events from "../events";
import * as state from "./state";
import * as rotur from "../net/rotur";
import * as messageComp from "./components/message";

export function isNearBottom(container: HTMLElement) {
    return container.scrollHeight - container.scrollTop - container.clientHeight < 50;
}

export function generate() {
    const container = document.getElementById("messages")!;
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

    if (!channel.messages) {
        return;
    }

    for (let i = 0; i < channel.messages!.length; i++) {
        appendMessage(channel.messages[i]);
    }
}

export function appendMessage(msg: string) {
    const container = document.getElementById("messages")!;
    const at_bottom = isNearBottom(container);
    let last: null | HTMLElement = container.lastChild as null | HTMLElement;
    let last_id: null | string = null;
    if (last && last.id.startsWith("msg-"))
        last_id = last.id.slice(4);
    const elem = messageComp.generate(msg, last_id);
    container.appendChild(elem);
    if (at_bottom) {
        container.scrollTop = 1e9;
        container.scrollBy(0, 100);
        setTimeout(() => {
            container.scrollBy(0, 100);
        }, 100);
    }
}

document.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    const input = document.getElementById("message-bar-input");
    if (!input)
        return;

    // @ts-expect-error
    const isInputFocused = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT' || active.isContentEditable);
    if (active !== input && !isInputFocused && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        input.focus();
    }
});

events.listen(events.EventName.MessagesChange, () => {
    generate();
});
events.listen(events.EventName.Login, () => {
    generate();
});

events.listen(events.EventName.NewMessage, (msg: string, channel: string) => {
    if (channel == state.selectedServer?.selected_channel) {
        appendMessage(msg);
    }
});
