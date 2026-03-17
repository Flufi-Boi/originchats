import * as events from "../events";
import * as rotur from "../net/rotur";
import * as state from "./state";
import { generateEmoji, searchEmoji } from './components/emoji';

let current_emoji: HTMLElement | null = null;
let current_emoji_i: number = 0;

export function generate(text: string, cursor: number) {
    const container = document.getElementById("emoji-bar")!;
    container.innerHTML = "";

    if (!rotur.user)
        return;

    const server = state.selectedServer;
    if (!server)
        return;

    const channel = server.channels[server.selected_channel ?? ""];
    if (!channel)
        return;
    
    const out = text.slice(0, cursor).match(/:([\w-]+)$/);

    if (!out)
        return;
    
    const message_bar = document.getElementById("message-bar-input")! as HTMLTextAreaElement;
    
    const emoji_container = document.createElement("div");
    emoji_container.id = "emoji-bar-container";
    
    if (out != null) {
        const emojis = searchEmoji(out[1], 5);

        current_emoji_i = 0;
        current_emoji = null;

        for (let i = 0; i < emojis.length; i++) {
            const emoji = emojis[i];
            
            const elem = document.createElement("button");
            function replaceEmoji() {
                message_bar.value = message_bar.value.slice(0, cursor - out![1].length - 1);
                message_bar.value += emoji.emoji;
                events.invoke(events.EventName.MessageBarContentChange, message_bar.value, message_bar.selectionStart)
            }
            elem.addEventListener("mouseenter", () => {
                if (current_emoji)
                    current_emoji.classList.remove("selected");
                current_emoji = elem;
                current_emoji_i = i;
                elem.classList.add("selected");
            });
            elem.addEventListener("click", replaceEmoji);

            if (i == current_emoji_i) {
                elem.classList.add("selected");
                current_emoji = elem;
            }

            elem.appendChild(generateEmoji(emoji.emoji));

            const name = document.createElement("span");
            name.textContent = emoji.primary;
            elem.appendChild(name);
            
            emoji_container.appendChild(elem);
        }
    }

    container.appendChild(emoji_container);
}

document.addEventListener("keydown", (ev) => {
    if (ev.key == "ArrowUp") {
        const container = document.getElementById("emoji-bar-container");
        if (container && container.children.length > 0) {
            current_emoji_i = Math.max(Math.min(current_emoji_i, container.children.length - 1), 0);
            if (current_emoji_i > 0)
                current_emoji_i --;
            if (current_emoji)
                current_emoji.classList.remove("selected");
            current_emoji = container.children[current_emoji_i] as HTMLElement;
            current_emoji.classList.add("selected");
            ev.preventDefault();
        }
    }
    if (ev.key == "ArrowDown") {
        const container = document.getElementById("emoji-bar-container");
        if (container && container.children.length > 0) {
            current_emoji_i = Math.max(Math.min(current_emoji_i, container.children.length - 1), 0);
            if (current_emoji_i < container.children.length - 1)
                current_emoji_i ++;
            if (current_emoji)
                current_emoji.classList.remove("selected");
            current_emoji = container.children[current_emoji_i] as HTMLElement;
            current_emoji.classList.add("selected");
            ev.preventDefault();
        }
    }
    if (ev.key == "Enter") {
        const container = document.getElementById("emoji-bar-container");
        if (container && container.children.length > 0) {
            (container.children[current_emoji_i] as HTMLButtonElement).click();
            ev.preventDefault();
        }
    }
})

events.listen(events.EventName.MessageBarContentChange, (txt, cursor) => {
    generate(txt, cursor);
});
