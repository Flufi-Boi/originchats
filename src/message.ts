import type { User } from "./user";

export type Message = {
    user: User,
    content: string,
    timestamp: number,
    type: "message",
    pinned: boolean,
    id: string,
    reply_to?: {
        id: string,
        user: User
    }
};

// literally a giant object of every message
export const messages: Record<string, Message> = {};

// @ts-ignore
window.messages = messages;
