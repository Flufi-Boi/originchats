import { messages } from "../message";
import type { RightClickItem } from "./right_click";

import * as rotur from "../net/rotur";
import * as state from "./state";
import * as events from "../events";
import type { User } from "../user";
import { openPopup } from "./components/popup";
import { UserPopup } from "./components/popups/user";

export const Menus = {
    message: (msg_id: string) => {
        const msg = messages[msg_id];

        return {
            data: msg_id,
            content: [
                { text: "Reply", icon: "corner-up-left", click() {
                    if (!rotur.user)
                        return;
                
                    const server = state.selectedServer;
                    if (!server)
                        return;
                    if (!server.selected_channel)
                        return;
                    
                    server.replying_message ??= {};
                    server.replying_message[server.selected_channel] = msg_id;
                    events.invoke(events.EventName.ReplyBarChange);
                }, },
                "---",
                { text: "Copy Text", icon: "clipboard-copy", click() {
                    navigator.clipboard.writeText(msg.content);
                }, },
                { text: "Copy Link", icon: "link-2", click() {
                    
                }, },
            ]
        }
    },
    user: (user: User) => {
        return {
            content: [
                { text: "View Profile", icon: "user", click() {
                    openPopup(UserPopup(user));
                } },
                "---",
                { text: "Set Nickname", icon: "pencil", click() {

                } }
            ]
        }
    }
} satisfies Record<string, (...args: any[]) => { data?: any, content: RightClickItem[] }>;
