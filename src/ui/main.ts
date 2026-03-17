import * as server_list from "./server_list";
import * as channel_list from "./channel_list";
import * as messages from "./messages";
import * as user_panel from "./user_panel";
import * as message_bar from "./message_bar";
import * as user_list from "./user_list";
import * as right_click from "./right_click";
import * as reply_bar from "./reply_bar";
import * as emoji_bar from "./emoji_bar";

export function generate() {
    server_list.generate();
    channel_list.generate();
    messages.generate();
    user_panel.generate();
    message_bar.generate();
    user_list.generate();
}
