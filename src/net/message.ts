import type { Attachment } from "../attachment";

export type NetMessage = {
    user: string,
    content: string,
    timestamp: number,
    type: "message",
    pinned: boolean,
    id: string,
    reply_to?: {
        id: string,
        user: string
    },
    attachments?: Attachment[],
};
