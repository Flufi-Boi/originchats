import { messages } from "../../message";
import { highlight, tokenTypeToCssClass } from "../highlighting/highlighter";
import { generateIcon, icon_names } from "../icon";
import { removeIndent } from '../highlighting/utils';
import { openPopup } from "./popup";
import { isNearBottom } from "../messages";
import * as right_click from "../right_click";
import * as right_click_menus from "../right_click_menus";
import * as rotur from "../../net/rotur";
import * as state from "../state";
import { getDisplayName, type User } from "../../user";
import { ImagePopup } from "./popups/image";
import { generateEmoji } from "./emoji";

export function is_connected(id: string, last_id: string): boolean {
    let cur = messages[id];
    let last = messages[last_id];
    return cur.user == last.user;
}

function getUser(name: string): User | undefined {
    if (!rotur.user)
        return;

    const server = state.selectedServer;

    if (!server)
        return;

    if (!server.users[name])
        return;
    
    return server.users[name];
}

function getUserColor(name: string): string | undefined {
    const usr = getUser(name);

    if (!usr)
        return;

    return usr.color;
}

export function generate(id: string, connected?: boolean | string | null, interactable: boolean = true): HTMLElement {
    const msg = messages[id];

    if (typeof(connected) == "string") {
        connected = is_connected(id, connected);
    }
    connected = connected && msg.reply_to == undefined;

    const elem = document.createElement("div");
    elem.className = "message";

    if (msg.reply_to) {
        const reply = document.createElement("div");
        reply.className = "reply";

        reply.appendChild(generateIcon("corner-up-right"));

        const pfp = document.createElement("img");
        pfp.draggable = false;
        pfp.src = `https://avatars.rotur.dev/${msg.reply_to.user.username}`;
        reply.appendChild(pfp);

        const name = document.createElement("span");
        const name_color = getUserColor(msg.reply_to.user.username);
        if (name_color)
            name.style.color = name_color;
        name.className = "user";
        name.textContent = getDisplayName(msg.reply_to.user);
        reply.appendChild(name);

        if (messages[msg.reply_to.id]) {
            // TODO: remove md shit :P
            let content = messages[msg.reply_to.id].content;
            content = content.split("\n").join(" ");

            const content_elem = document.createElement("div");
            content_elem.className = "content";
            content_elem.textContent = content;
            reply.appendChild(content_elem);
        } else {
            const content_elem = document.createElement("span");
            content_elem.className = "not-loaded";
            content_elem.textContent = "message not loaded";
            reply.appendChild(content_elem);
        }

        elem.appendChild(reply);
    }

    const container = document.createElement("div");
    container.className = "container";

    if (connected)
        elem.classList.add("connected");
    elem.id = `msg-${id}`;

    const pfp = document.createElement("div");
    pfp.className = "pfp";
    const pfpImg = document.createElement("img");
    pfpImg.draggable = false;
    pfpImg.src = `https://avatars.rotur.dev/${msg.user.username}`;
    pfp.appendChild(pfpImg);
    container.appendChild(pfp);

    const column = document.createElement("div");
    column.className = "column";

    const user = document.createElement("div");
    const user_color = getUserColor(msg.user.username);
    if (user_color)
        user.style.color = user_color;
    user.className = "user";
    user.textContent = getDisplayName(msg.user);
    column.appendChild(user);

    const content = document.createElement("div");
    content.className = "content";
    generateContent(msg.content, content);
    column.appendChild(content);

    container.appendChild(column);

    elem.appendChild(container);

    if (interactable) {
        elem.addEventListener("contextmenu", (e) => {
            right_click.openRightClickContextMenu(right_click_menus.Menus.message(id), e);

            e.preventDefault();
        });
    }

    return elem;
}

export function generateContent(text: string, main_container: HTMLElement) {
    let tokens: string[] = text.match(/https?:\/\/[^\s)]+|#[\w-]+|[a-zA-Z0-9]+| +|\p{Extended_Pictographic}|:|\*\*|__|~~|```\w+|>\s*\[!\w+\]|```|\n|./gmu)!;

    if (!main_container.classList.contains("md"))
        main_container.classList.add("md");

    let links: string[] = [];

    function generateStatement(container: HTMLElement) {
        if (/```(\w+)/.test(tokens[0])) {
            const lang = tokens.shift()!.match(/```(\w+)/)![1];

            let content = "";
            if (tokens[0] as string == "\n")
                tokens.shift();
            while (tokens.length > 0 && tokens[0] != "```")
                content += tokens.shift();
            content = content.trimEnd();
            if (tokens[0] == "```")
                tokens.shift();

            const elem = document.createElement("div");
            elem.className = "code-block";

            const lines = highlight(removeIndent(content), lang);

            const topbar = document.createElement("div");
            topbar.className = "topbar";

            const lang_elem = document.createElement("span");
            lang_elem.textContent = lang;
            topbar.appendChild(lang_elem);

            const copy_button = document.createElement("button");
            copy_button.className = "copy";
            copy_button.appendChild(generateIcon("copy"));
            copy_button.addEventListener("click", (e) => {
                navigator.clipboard.writeText(content);
                e.preventDefault();
            })
            topbar.appendChild(copy_button);

            elem.appendChild(topbar);

            const content_elem = document.createElement("div");
            content_elem.className = "code-content";

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                const line_elem = document.createElement("div");
                for (let i = 0; i < line.length; i++) {
                    const token = line[i];

                    const token_elem = document.createElement("span");
                    token_elem.className = `code_token ${tokenTypeToCssClass(token.type)}`;
                    token_elem.textContent = token.content;
                    line_elem.appendChild(token_elem);
                }
                if (line.length == 0) {
                    const token_elem = document.createElement("span");
                    token_elem.textContent = "\n";
                    line_elem.appendChild(token_elem);
                }
                content_elem.appendChild(line_elem);
            }

            elem.appendChild(content_elem);
            container.appendChild(elem);
            return;
        }

        if (/^>\s*\[!(\w+)\]$/.test(tokens[0])) {
            const type = tokens.shift()!.match(/^>\s*\[!(\w+)\]$/)![1].toLowerCase();
            if (tokens[0] == "\n")
                tokens.shift();

            let content = "";
            while (tokens[0] == ">" && tokens.length > 0) {
                tokens.shift();
                while (tokens[0] as string != "\n" && tokens.length > 0)
                    content += tokens.shift();
            }

            content = removeIndent(content);

            const elem = document.createElement("div");
            elem.className = `alert alert-${type}`;

            const header = document.createElement("div");
            header.className = "header";

            const icon_name = icon_names[`alert-${type}`] ?? icon_names[`alert-fallback`];
            header.appendChild(generateIcon(icon_name));

            const title = document.createElement("p");
            title.textContent = type[0].toUpperCase() + type.slice(1);
            header.appendChild(title);

            elem.appendChild(header);

            const body = document.createElement("div");
            body.className = "body";
            generateContent(content, body);
            elem.appendChild(body);

            container.appendChild(elem);
        }

        if (tokens[0] == ">") {
            tokens.shift();
            const elem = document.createElement("blockquote");

            generateTextUntil(elem);
            while (tokens[0] as string == "\n" && tokens[1] == ">") {
                tokens.shift();
                tokens.shift();
                generateStatement(elem);
            }

            container.appendChild(elem);
            return;
        }

        const elem = document.createElement("p");
        generateTextUntil(elem);
        if (tokens[0] == "\n")
            tokens.shift();
        container.appendChild(elem);
    }
    function generateTextUntil(container: HTMLElement, until: string = "\n") {
        while (tokens.length > 0 && tokens[0] != until) {
            generateText(container);
        }
    }
    function generateText(container: HTMLElement) {
        if (tokens.length <= 0)
            return;

        if (tokens[0] == "**" || tokens[0] == "__") {
            const save_tokens = [...tokens];
            let type = tokens.shift();
            const elem = document.createElement("bold");
            
            generateTextUntil(elem, type);
            if (tokens[0] == type) {
                tokens.shift();

                container.appendChild(elem);
                return;
            } else {
                tokens = save_tokens;
            }
        }
        if (tokens[0] == "*" || tokens[0] == "_") {
            const save_tokens = [...tokens];
            let type = tokens.shift();
            const elem = document.createElement("italic");
            
            generateTextUntil(elem, type);
            if (tokens[0] == type) {
                tokens.shift();

                container.appendChild(elem);
                return;
            } else {
                tokens = save_tokens;
            }
        }
        if (tokens[0] == "~~") {
            const save_tokens = [...tokens];
            tokens.shift();
            const elem = document.createElement("strikethrough");
            
            generateTextUntil(elem, "~~");
            if (tokens[0] == "~~") {
                tokens.shift();

                container.appendChild(elem);
                return;
            } else {
                tokens = save_tokens;
            }
        }
        if (tokens[0] == "`") {
            const save_tokens = [...tokens];
            tokens.shift();

            let code = "";
            while (tokens[0] != "`" && tokens.length > 0)
                code += tokens.shift();

            if (tokens[0] == "`") {
                tokens.shift();
            
                const elem = document.createElement("span");
                elem.className = "code-block-inline";
                elem.textContent = code;
                container.appendChild(elem);
                return;
            } else {
                tokens = save_tokens;
            }
        }
        if (tokens[0] == "^") {
            const save_tokens = [...tokens];
            tokens.shift();
            const elem = document.createElement("sup");
            
            generateTextUntil(elem, "^");
            
            if (tokens[0] == "^") {
                tokens.shift();

                container.appendChild(elem);
                return;
            } else {
                tokens = save_tokens;
            }
        }
        if (tokens[0] == "~") {
            const save_tokens = [...tokens];
            tokens.shift();
            const elem = document.createElement("sub");
            
            generateTextUntil(elem, "~");
            
            if (tokens[0] == "~") {
                tokens.shift();

                container.appendChild(elem);
                return;
            } else {
                tokens = save_tokens;
            }
        }

        if (/^https?:\/\/[^\s)]+$/.test(tokens[0])) {
            const url = tokens.shift()!;
            links.push(url);

            const elem = document.createElement("div");
            elem.className = "link";

            const link = document.createElement("a");
            link.href = url;
            link.textContent = url;
            elem.appendChild(link);

            container.appendChild(elem);

            fetch(url, { method: "HEAD" })
                .then(r => {
                    const type = r.headers.get("content-type") || "";
                    const ext = url.split(".").pop()?.toLowerCase();
                    
                    const messages_container = document.getElementById("messages")!;
                    const at_bottom = isNearBottom(messages_container);

                    const isImage = type.startsWith("image/");
                    const isVideo = type.startsWith("video/");
                    const isAudio =
                        type.startsWith("audio/") ||
                        type === "application/ogg" ||
                        ["mp3", "wav", "ogg", "oga", "flac", "m4a", "aac"].includes(ext ?? "");
                    
                    if (isImage) {
                        elem.innerHTML = "";
                        
                        const img = document.createElement("img");
                        img.addEventListener("click", () => {
                            openPopup(ImagePopup(url));
                        })
                        img.src = url;
                        elem.appendChild(img);
                    }
                    if (isVideo) {
                        elem.innerHTML = "";
                        
                        const vid = document.createElement("video");
                        vid.controls = true;
                        vid.src = url;
                        elem.appendChild(vid);
                    }
                    if (isAudio) {
                        elem.innerHTML = "";
                        
                        const audio = document.createElement("audio");
                        audio.controls = true;
                        audio.src = url;
                        elem.appendChild(audio);
                    }

                    if (at_bottom) {
                        messages_container.scrollTop = 1e9;
                        messages_container.scrollBy(0, 100);
                        setTimeout(() => {
                            messages_container.scrollBy(0, 100);
                        }, 500);
                    }
                })
                .catch(r => {
                    console.warn(r);
                });
            
            return;
        }

        if (/^\p{Extended_Pictographic}$/u.test(tokens[0])) {
            let char = tokens.shift()!;

            container.appendChild(generateEmoji(char));
        
            return;
        }

        if (tokens[0][0] == "#") {
            if (/^[\w-]+$/.test(tokens[0].slice(1))) {
                let name = tokens.shift()!.slice(1);

                const elem = document.createElement("div");
                elem.className = "channel-link";
                elem.textContent = `#${name}`;
                container.appendChild(elem);
                return;
            }
        }

        if (tokens[0] == "@") {
            if (/^\w+$/.test(tokens[1])) {
                tokens.shift();
                let name = tokens.shift()!;

                const elem = document.createElement("div");
                elem.className = "ping";
                elem.textContent = `@${name}`;
                container.appendChild(elem);
                return;
            }
        }

        if (container.lastChild != null && container.lastChild instanceof HTMLSpanElement && !container.lastChild.classList.contains("emoji-container")) {
            container.lastChild.textContent += tokens.shift()!;
        } else {
            const elem = document.createElement("span");
            elem.textContent = tokens.shift()!;
            container.appendChild(elem);
        }
    }

    while (tokens.length > 0) {
        generateStatement(main_container);
    }

    if (/^([\p{Extended_Pictographic} ]|https?:\/\/[^\s)]+)$/u.test(text)) {
        main_container.classList.add("emoji-only");
    }

    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        
        if (link.startsWith("https://open.spotify.com") && !link.startsWith("https://open.spotify.com/embed")) {
            const embed_container = document.createElement("div");
            embed_container.className = "spotify-embed";
            
            const embed_iframe = document.createElement("iframe");
            embed_iframe.frameBorder = "0";
            embed_iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
            embed_iframe.width = "100%";
            embed_iframe.height = "352";
            embed_iframe.src = link.replace("open.spotify.com/", "open.spotify.com/embed/");
            embed_container.appendChild(embed_iframe);

            main_container.appendChild(embed_container);
        }
    }
}

