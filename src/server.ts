import * as auth from "./auth";
import * as events from "./events";

import type { Channel } from "./channel";
import type { RecievedPacket, SendPacket } from "./net/packet";
import type { ChannelListItem } from "./ui/channel_list";
import type { User } from "./user";
import { messages, type Message } from "./message";
import { selectedServer } from "./ui/state";
import { generateContent } from "./ui/components/message";
import type { Role } from "./role";
import type { NetMessage } from "./net/message";
import { replaceEmojiNames } from "./ui/components/emoji";

export class Server {
    name?: string;
    icon?: string;
    owner?: { name: string };

    ws?: WebSocket;

    user?: User;

    channels: Record<string, Channel> = {};
    channel_list: ChannelListItem[] = [];

    users: Record<string, User> = {};
    roles: Record<string, Role> = {};

    selected_channel?: string;
    // record for per channel
    replying_message?: Record<string, string>;
    first_channels_recieved: boolean = false;

    constructor (public url: string) {
        this.ws = new WebSocket(url);
        this.ws.onmessage = (e) => this.message(JSON.parse(e.data));
    }

    public selectChannel(name: string) {
        this.selected_channel = name;
        events.invoke(events.EventName.MessagesChange);
        events.invoke(events.EventName.MessageBarChange);
        events.invoke(events.EventName.UserListChange);

        const container = document.getElementById("messages")!;
        container.scrollTop = container.scrollHeight;

        if (!this.channels[name].messages) {
            this.send({
                cmd: "messages_get",
                channel: name,
                // TODO: start and limit
            });
        }
    }

    public message(msg: RecievedPacket) {
        this.log("<-", msg);
        switch (msg.cmd) {
            // setup
            case "handshake": {
                this.name = msg.val.server.name;
                this.icon = msg.val.server.icon;
                this.owner = msg.val.server.owner;
                events.invoke(events.EventName.ServersChange);

                fetch("https://social.rotur.dev/generate_validator?key=" + msg.val.validator_key + "&auth=" + auth.token)
                    .then(r => r.json())
                    .then(data => {
                        this.send({
                            cmd: "auth",
                            validator: data.validator
                        })
                    });
                break;
            }
            case "ready": {
                this.user = {
                    username: msg.user.username,
                    roles: msg.user.roles
                }

                this.send({ cmd: "channels_get" });
                this.send({ cmd: "users_list" });
                this.send({ cmd: "users_online" });
                this.send({ cmd: "roles_list" });
                break;
            }
            case "auth_error": {
                this.log("retrying-connection");
                this.ws?.close();
                this.ws = new WebSocket(this.url);
                this.ws.onmessage = (e) => this.message(JSON.parse(e.data));
                break;
            }

            // users
            case "users_list": {
                for (let i = 0; i < msg.users.length; i++) {
                    const usr = msg.users[i];
                    this.users[usr.username] ??= usr;
                    this.users[usr.username].username = usr.username;
                    this.users[usr.username].roles = usr.roles;
                    this.users[usr.username].color = usr.color;
                }
                events.invoke(events.EventName.UserListChange);
                break;
            }
            case "users_online": {
                const usrs = Object.values(this.users);
                for (let i = 0; i < usrs.length; i++) {
                    usrs[i].instances = 0;
                }

                for (let i = 0; i < msg.users.length; i++) {
                    const usr = msg.users[i];
                    this.users[usr.username].online = true;
                    this.users[usr.username].instances! ++;
                }
                events.invoke(events.EventName.UserListChange);
                break;
            }
            case "user_connect": {
                this.users[msg.user.username] ??= msg.user;
                this.users[msg.user.username].instances ??= 0;
                this.users[msg.user.username].instances! ++;
                this.users[msg.user.username].online = this.users[msg.user.username].instances! > 0;
                events.invoke(events.EventName.UserListChange);
                break;
            }
            case "user_disconnect": {
                if (this.users[msg.username]) {
                    this.users[msg.username].instances ??= 1;
                    this.users[msg.username].instances! --;
                    this.users[msg.username].online = this.users[msg.username].instances! > 0;
                    events.invoke(events.EventName.UserListChange);
                }
                break;
            }

            // channels
            case "channels_get": {
                this.channel_list = [];
                for (let i = 0; i < msg.val.length; i++) {
                    const channel = msg.val[i];
                    
                    if (channel.type == "text")
                        this.channels[channel.name] = {
                            type: channel.type,
                            name: channel.name,
                            display_name: channel.display_name,
                            icon: channel.icon,
                            description: channel.description,
                        };
                    if (channel.type == "voice")
                        this.channels[channel.name] = {
                            type: channel.type,
                            name: channel.name,
                            display_name: channel.display_name,
                            icon: channel.icon,
                            description: channel.description,
                            voice_state: channel.voice_state,
                        };
                    
                    switch (channel.type) {
                        case "text": case "voice":
                            this.channel_list.push({
                                type: channel.type,
                                name: channel.name,
                                display_name: channel.display_name
                            });
                            break;
                        case "separator":
                            this.channel_list.push({ type: "separator" });
                            break;
                    }
                }
                break;
            }

            // roles
            case "roles_list": {
                const pairs = Object.entries(msg.roles);
                for (let i = 0; i < pairs.length; i++) {
                    const element = pairs[i];
                    this.roles[element[0]] = {
                        name: element[0],
                        ...element[1]
                    };
                }
                events.invoke(events.EventName.UserListChange);
                break;
            }

            // messages
            case "messages_get": {
                /*
                this.channels[msg.channel].messages ??= [];
                for (let i = 0; i < msg.messages.length; i++) {
                    this.channels[msg.channel].messages![msg.range.start + i] = msg.messages[i].id;
                    messages[msg.messages[i].id] = msg.messages[i];
                }
                */
                // TODO: make this better sob
                this.channels[msg.channel].messages = msg.messages.map(i => i.id);
                for (let i = 0; i < msg.messages.length; i++) {
                    messages[msg.messages[i].id] = this.convertMessage(msg.messages[i]);
                }
                events.invoke(events.EventName.MessagesChange);
                
                if (msg.channel == selectedServer?.selected_channel) {
                    const container = document.getElementById("messages")!;
                    container.scrollTop = container.scrollHeight;
                }
                break;
            }
            case "message_new": {
                this.channels[msg.channel].messages?.push(msg.message.id);
                messages[msg.message.id] = this.convertMessage(msg.message);
                if (selectedServer?.url == this.url)
                    events.invoke(events.EventName.NewMessage, msg.message.id, msg.channel);
                break;
            }
            // message_get?
            case "message_edit": {
                messages[msg.message.id] = this.convertMessage(msg.message);
                //events.invoke(events.EventName.MessagesChange);
                const msgElem = document.getElementById(`msg-${msg.message.id}`);
                if (msgElem) {
                    const content = msgElem.getElementsByClassName("content md")[0];
                    if (content) {
                        content.innerHTML = "";
                        generateContent(msg.content, content as HTMLElement);
                    }
                }
            }
        }
    }

    convertMessage(net: NetMessage): Message {
        return {
            ...net,
            user: this.users[net.user],
            reply_to: net.reply_to != null ? {
                id: net.reply_to.id,
                user: this.users[net.reply_to.user],
            } : undefined
        }
    }

    public sendMessage(content: string, reply_to?: string) {
        if (!this.selected_channel)
            throw `no selected channel`;
        
        this.send({
            cmd: "message_new",
            channel: this.selected_channel,
            content: replaceEmojiNames(content),
            reply_to
        })
    }

    send(packet: SendPacket) {
        this.log("->", packet);
        this.ws?.send(JSON.stringify(packet));
    }

    // debug
    log(...data: any[]) {
        let urlname = this.url.match(/https?:\/\/([^\/#?]+)/)![1];
        console.log(`[${urlname}]\n  `, ...data);
    }
    warn(...data: any[]) {
        let urlname = this.url.match(/https?:\/\/([^\/#?]+)/)![1];
        console.warn(`[${urlname}]\n  `, ...data);
    }
    err(...data: any[]) {
        let urlname = this.url.match(/https?:\/\/([^\/#?]+)/)![1];
        console.error(`[${urlname}]\n  `, ...data);
    }
}

export const servers: Array<Server> = [
    new Server("https://chats.mistium.com"),
    new Server("https://chats.flufi.uk"),
    //new Server("https://chats.katnip.org")
];

// @ts-ignore
window.servers = servers;
