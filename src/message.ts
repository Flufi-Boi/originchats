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
    },
    attachments?: {
        expires_at: number,
        id: number,
        mime_type: string,
        name: string,
        permanent: boolean,
        size: number,
        url: string
    }[]
};

// literally a giant object of every message
export const messages: Record<string, Message> = {};

// @ts-ignore
window.messages = messages;
